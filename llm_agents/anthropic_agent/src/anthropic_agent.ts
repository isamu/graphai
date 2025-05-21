import Anthropic from "@anthropic-ai/sdk";
import { AgentFunction, AgentFunctionInfo } from "graphai";

import { GraphAILLMInputBase, getMergeValue } from "@graphai/llm_utils";
import type { GraphAIText, GraphAITool, GraphAIToolCalls, GraphAIMessage, GraphAIMessages } from "@graphai/agent_utils";

type AnthropicInputs = {
  verbose?: boolean;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  tools?: any[];
  tool_choice?: any;
  messages?: Array<Anthropic.MessageParam>;
} & GraphAILLMInputBase;

type AnthropicConfig = {
  apiKey?: string;
  stream?: boolean;
  forWeb?: boolean;
};

type AnthropicParams = AnthropicInputs & AnthropicConfig;

type AnthropicResult = Partial<
  GraphAIText &
    GraphAITool &
    GraphAIToolCalls &
    GraphAIMessage<string | Anthropic.ContentBlockParam[]> &
    GraphAIMessages<string | Anthropic.ContentBlockParam[]>
>;

const convToolCall = (tool_call: Anthropic.ToolUseBlock) => {
  const { id, name, input } = tool_call;
  return { id, name, arguments: input };
};

type Response = Anthropic.Message & { _request_id?: string | null | undefined };
// https://docs.anthropic.com/ja/api/messages
const convertOpenAIChatCompletion = (response: Response, messages: Anthropic.MessageParam[]) => {
  // SDK bug https://github.com/anthropics/anthropic-sdk-typescript/issues/432

  const text = (response.content[0] as Anthropic.TextBlock).text;
  const functionResponses = response.content.filter((content) => content.type === "tool_use") ?? [];
  const tool_calls = functionResponses.map(convToolCall);
  const tool = tool_calls[0] ? tool_calls[0] : undefined;

  const message = { role: response.role, content: text };
  messages.push(message);
  return { ...response, choices: [{ message }], text, tool, tool_calls, message, messages };
};

export const anthropicAgent: AgentFunction<AnthropicParams, AnthropicResult, AnthropicInputs, AnthropicConfig> = async ({
  params,
  namedInputs,
  filterParams,
  config,
}) => {
  const { verbose, system, temperature, tools, tool_choice, max_tokens, prompt, messages } = { ...params, ...namedInputs };

  const { apiKey, stream, forWeb, model } = {
    ...params,
    ...(config || {}),
  };

  const userPrompt = getMergeValue(namedInputs, params, "mergeablePrompts", prompt);
  const systemPrompt = getMergeValue(namedInputs, params, "mergeableSystem", system);

  const messagesCopy: Array<Anthropic.MessageParam> = messages ? messages.map((m) => m) : [];
  const messageSystemPrompt = messagesCopy[0] && (messagesCopy[0] as any).role === "system" ? (messagesCopy[0].content as string) : "";

  if (userPrompt) {
    messagesCopy.push({
      role: "user",
      content: userPrompt,
    });
  }

  if (verbose) {
    console.log(messagesCopy);
  }
  const anthropic_tools =
    tools && tools.length > 0
      ? tools.map((tool) => {
          const { function: func } = tool;
          const { name, description, parameters } = func;
          return {
            name,
            description,
            input_schema: parameters,
          };
        })
      : undefined;

  const anthropic = new Anthropic({ apiKey, dangerouslyAllowBrowser: !!forWeb });
  const chatParams = {
    model: model ?? "claude-3-5-sonnet-latest",
    messages: messagesCopy.filter((m) => (m.role as any) !== "system"),
    tools: anthropic_tools,
    tool_choice,
    system: systemPrompt || messageSystemPrompt,
    temperature: temperature ?? 0.7,
    max_tokens: max_tokens ?? 1024,
  };

  if (!stream) {
    const messageResponse = await anthropic.messages.create(chatParams);
    return convertOpenAIChatCompletion(messageResponse, messagesCopy);
  }
  const chatStream = await anthropic.messages.create({
    ...chatParams,
    stream: true,
  });
  const contents = [];
  const partials = [];
  let streamResponse: Response | null = null;

  for await (const messageStreamEvent of chatStream) {
    if (messageStreamEvent.type === "message_start") {
      streamResponse = messageStreamEvent.message;
    }
    if (messageStreamEvent.type === "content_block_start") {
      if (streamResponse) {
        streamResponse.content.push(messageStreamEvent.content_block);
      }
      partials.push("");
    }
    if (messageStreamEvent.type === "content_block_delta") {
      const { index, delta } = messageStreamEvent;
      if (delta.type === "input_json_delta") {
        partials[index] = partials[index] + delta.partial_json;
      }
      if (delta.type === "text_delta") {
        partials[index] = partials[index] + delta.text;
      }
    }
    if (messageStreamEvent.type === "content_block_delta" && messageStreamEvent.delta.type === "text_delta") {
      const token = messageStreamEvent.delta.text;
      contents.push(token);
      if (filterParams && filterParams.streamTokenCallback && token) {
        filterParams.streamTokenCallback(token);
      }
    }
  }
  if (streamResponse === null) {
    throw new Error("Anthoropic no response");
  }
  partials.forEach((partial, index) => {
    if (streamResponse.content[index].type === "text") {
      streamResponse.content[index].text = partial;
    }
    if (streamResponse.content[index].type === "tool_use") {
      streamResponse.content[index].input = JSON.parse(partial);
    }
  });

  return convertOpenAIChatCompletion(streamResponse, messagesCopy);
};

const anthropicAgentInfo: AgentFunctionInfo = {
  name: "anthropicAgent",
  agent: anthropicAgent,
  mock: anthropicAgent,
  inputs: {
    type: "object",
    properties: {
      model: { type: "string" },
      system: { type: "string" },
      max_tokens: { type: "number" },
      temperature: { type: "number" },
      prompt: {
        type: "string",
        description: "query string",
      },
      messages: {
        anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
        description: "chat messages",
      },
    },
  },
  output: {
    type: "object",
  },
  samples: [],
  description: "Anthropic Agent",
  category: ["llm"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/llm_agents/anthropic_agent/src/anthropic_agent.ts",
  package: "@graphai/anthropic_agent",
  license: "MIT",
  stream: true,
  environmentVariables: ["ANTHROPIC_API_KEY"],
  npms: ["@anthropic-ai/sdk"],
};

export default anthropicAgentInfo;
