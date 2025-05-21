import type { AgentFunction, AgentFunctionInfo, DefaultResultData } from "graphai";
import { assert } from "graphai";
import { isNamedInputs } from "@graphai/agent_utils";
import type { GraphAISupressError } from "@graphai/agent_utils";

export const lookupDictionaryAgent: AgentFunction<
  Record<string, DefaultResultData> & GraphAISupressError,
  DefaultResultData,
  {
    namedKey: string;
  }
> = async ({ namedInputs, params }) => {
  const { namedKey } = namedInputs;
  assert(isNamedInputs(namedInputs), "lookupDictionaryAgent: namedInputs is UNDEFINED!");
  const result = params[namedKey];
  if (!params.supressError && result === undefined) {
    throw new Error(`lookupDictionaryAgent error: ${namedKey} is missing`);
  }
  return result;
};

const exampleParams = {
  openai: {
    model: "gpt4-o",
    temperature: 0.7,
  },
  groq: {
    model: "llama3-8b-8192",
    temperature: 0.6,
  },
  gemini: {
    model: "gemini-2.0-pro-exp-02-05",
    temperature: 0.7,
  },
};

const lookupDictionaryAgentInfo: AgentFunctionInfo = {
  name: "lookupDictionaryAgent",
  agent: lookupDictionaryAgent,
  mock: lookupDictionaryAgent,
  inputs: {
    type: "object",
    properties: {
      namedKey: {
        type: "string",
        description: "key of params",
      },
    },
    required: ["namedKey"],
  },
  output: {
    anyOf: [{ type: "string" }, { type: "integer" }, { type: "object" }, { type: "array" }],
  },
  samples: [
    {
      inputs: { namedKey: "openai" },
      params: exampleParams,
      result: {
        model: "gpt4-o",
        temperature: 0.7,
      },
    },
    {
      inputs: { namedKey: "gemini" },
      params: exampleParams,
      result: {
        model: "gemini-2.0-pro-exp-02-05",
        temperature: 0.7,
      },
    },
  ],
  description: "Select elements with params",
  category: ["data"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/lookup_dictionary_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default lookupDictionaryAgentInfo;
