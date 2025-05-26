"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openAIMockAgent = exports.openAIAgent = void 0;
const openai_1 = __importDefault(require("openai"));
const graphai_1 = require("graphai");
const llm_utils_1 = require("@graphai/llm_utils");
const convToolCall = (tool_call) => {
    return {
        id: tool_call.id,
        name: tool_call.function.name,
        arguments: (() => {
            try {
                return JSON.parse(tool_call.function.arguments);
            }
            catch (__e) {
                console.log(__e);
                return undefined;
            }
        })(),
    };
};
const convertOpenAIChatCompletion = (response, messages, llmMetaData) => {
    const newMessage = response?.choices[0] && response?.choices[0].message ? response?.choices[0].message : null;
    const text = newMessage && newMessage.content ? newMessage.content : null;
    const functionResponses = newMessage?.tool_calls && Array.isArray(newMessage?.tool_calls) ? newMessage?.tool_calls : [];
    // const functionId = message?.tool_calls && message?.tool_calls[0] ? message?.tool_calls[0]?.id : null;
    const tool_calls = functionResponses.map(convToolCall);
    const tool = tool_calls && tool_calls.length > 0 ? tool_calls[0] : undefined;
    const message = (() => {
        if (newMessage) {
            const { content, role, tool_calls } = newMessage;
            if (tool_calls && tool_calls.length > 0) {
                return {
                    content,
                    role,
                    tool_calls,
                };
            }
            return {
                content,
                role,
            };
        }
        return null;
    })();
    if (message) {
        messages.push(message);
    }
    return {
        ...response,
        text,
        tool,
        tool_calls,
        message,
        messages,
        usage: response.usage,
        metadata: (0, llm_utils_1.convertMeta)(llmMetaData),
    };
};
const openAIAgent = async ({ filterParams, params, namedInputs, config }) => {
    const { verbose, system, images, temperature, tools, tool_choice, max_tokens, prompt, messages, message, response_format } = {
        ...params,
        ...namedInputs,
    };
    const { apiKey, stream, dataStream, forWeb, model, baseURL } = {
        ...(config || {}),
        ...params,
    };
    const llmMetaData = (0, llm_utils_1.initLLMMetaData)();
    const userPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeablePrompts", prompt);
    const systemPrompt = (0, llm_utils_1.getMergeValue)(namedInputs, params, "mergeableSystem", system);
    const messagesCopy = (0, llm_utils_1.getMessages)(systemPrompt, messages);
    if (message) {
        messagesCopy.push(message);
    }
    else if (userPrompt) {
        messagesCopy.push({
            role: "user",
            content: userPrompt,
        });
    }
    if (images) {
        const image_url = {
            url: images[0],
            detail: "high",
        };
        messagesCopy.push({
            role: "user",
            content: [
                {
                    type: "image_url",
                    image_url,
                },
            ],
        });
    }
    if (verbose) {
        console.log(messagesCopy);
    }
    const openai = new openai_1.default({ apiKey, baseURL, dangerouslyAllowBrowser: !!forWeb });
    const modelName = model || "gpt-4o";
    const chatParams = {
        model: modelName,
        messages: messagesCopy,
        tools,
        tool_choice,
        max_tokens,
        response_format,
    };
    // Reasoning models do not support temperature parameter
    if (!modelName.startsWith("o1") && !modelName.startsWith("o3")) {
        chatParams.temperature = temperature ?? 0.7;
    }
    if (!stream) {
        const result = await openai.chat.completions.create(chatParams);
        (0, llm_utils_1.llmMetaDataEndTime)(llmMetaData);
        return convertOpenAIChatCompletion(result, messagesCopy, llmMetaData);
    }
    const chatStream = openai.beta.chat.completions.stream({
        ...chatParams,
        stream: true,
        stream_options: { include_usage: true },
    });
    // streaming
    if (dataStream) {
        if (filterParams && filterParams.streamTokenCallback) {
            filterParams.streamTokenCallback({
                type: "response.created",
                response: {},
            });
        }
        for await (const chunk of chatStream) {
            // usage chunk have empty choices
            if (chunk.choices[0]) {
                (0, llm_utils_1.llmMetaDataFirstTokenTime)(llmMetaData);
                const token = chunk.choices[0].delta.content;
                if (filterParams && filterParams.streamTokenCallback && token) {
                    filterParams.streamTokenCallback({
                        type: "response.in_progress",
                        response: {
                            output: [
                                {
                                    type: "text",
                                    text: token,
                                },
                            ],
                        },
                    });
                }
            }
        }
        if (filterParams && filterParams.streamTokenCallback) {
            filterParams.streamTokenCallback({
                type: "response.completed",
                response: {},
            });
        }
    }
    else {
        for await (const chunk of chatStream) {
            (0, llm_utils_1.llmMetaDataFirstTokenTime)(llmMetaData);
            // usage chunk have empty choices
            if (chunk.choices[0]) {
                const token = chunk.choices[0].delta.content;
                if (filterParams && filterParams.streamTokenCallback && token) {
                    filterParams.streamTokenCallback(token);
                }
            }
        }
    }
    const chatCompletion = await chatStream.finalChatCompletion();
    (0, llm_utils_1.llmMetaDataEndTime)(llmMetaData);
    return convertOpenAIChatCompletion(chatCompletion, messagesCopy, llmMetaData);
};
exports.openAIAgent = openAIAgent;
const input_sample = "this is response result";
const result_sample = {
    object: "chat.completion",
    id: "chatcmpl-9N7HxXYbwjmdbdiQE94MHoVluQhyt",
    choices: [
        {
            message: {
                role: "assistant",
                content: input_sample,
            },
            finish_reason: "stop",
            index: 0,
            logprobs: null,
        },
    ],
    created: 1715296589,
    model: "gpt-4o",
};
const openAIMockAgent = async ({ filterParams }) => {
    for await (const token of input_sample.split("")) {
        if (filterParams && filterParams.streamTokenCallback && token) {
            await (0, graphai_1.sleep)(100);
            filterParams.streamTokenCallback(token);
        }
    }
    const message = {
        role: "user",
        content: input_sample,
    };
    return {
        text: input_sample,
        message,
        messages: [message],
    };
};
exports.openAIMockAgent = openAIMockAgent;
const openaiAgentInfo = {
    name: "openAIAgent",
    agent: exports.openAIAgent,
    mock: exports.openAIMockAgent,
    inputs: {
        type: "object",
        properties: {
            model: { type: "string" },
            system: { type: "string" },
            tools: { type: "object" },
            tool_choice: {
                anyOf: [{ type: "array" }, { type: "object" }],
            },
            max_tokens: { type: "number" },
            verbose: { type: "boolean" },
            temperature: { type: "number" },
            baseURL: { type: "string" },
            apiKey: {
                anyOf: [{ type: "string" }, { type: "object" }],
            },
            stream: { type: "boolean" },
            prompt: {
                type: "string",
                description: "query string",
            },
            messages: {
                anyOf: [{ type: "string" }, { type: "object" }, { type: "array" }],
                description: "chat messages",
            },
        },
    },
    output: {
        type: "object",
        properties: {
            id: {
                type: "string",
            },
            object: {
                type: "string",
            },
            created: {
                type: "integer",
            },
            model: {
                type: "string",
            },
            choices: {
                type: "array",
                items: [
                    {
                        type: "object",
                        properties: {
                            index: {
                                type: "integer",
                            },
                            message: {
                                type: "array",
                                items: [
                                    {
                                        type: "object",
                                        properties: {
                                            content: {
                                                type: "string",
                                            },
                                            role: {
                                                type: "string",
                                            },
                                        },
                                        required: ["content", "role"],
                                    },
                                ],
                            },
                        },
                        required: ["index", "message", "logprobs", "finish_reason"],
                    },
                ],
            },
            usage: {
                type: "object",
                properties: {
                    prompt_tokens: {
                        type: "integer",
                    },
                    completion_tokens: {
                        type: "integer",
                    },
                    total_tokens: {
                        type: "integer",
                    },
                },
                required: ["prompt_tokens", "completion_tokens", "total_tokens"],
            },
            text: {
                type: "string",
            },
            tool: {
                arguments: {
                    type: "object",
                },
                name: {
                    type: "string",
                },
            },
            message: {
                type: "object",
                properties: {
                    content: {
                        type: "string",
                    },
                    role: {
                        type: "string",
                    },
                },
                required: ["content", "role"],
            },
        },
        required: ["id", "object", "created", "model", "choices", "usage"],
    },
    params: {
        type: "object",
        properties: {
            model: { type: "string" },
            system: { type: "string" },
            tools: { type: "object" },
            tool_choice: { anyOf: [{ type: "array" }, { type: "object" }] },
            max_tokens: { type: "number" },
            verbose: { type: "boolean" },
            temperature: { type: "number" },
            baseURL: { type: "string" },
            apiKey: { anyOf: [{ type: "string" }, { type: "object" }] },
            stream: { type: "boolean" },
            prompt: { type: "string", description: "query string" },
            messages: { anyOf: [{ type: "string" }, { type: "object" }, { type: "array" }], description: "chat messages" },
        },
    },
    outputFormat: {
        llmResponse: {
            key: "choices.$0.message.content",
            type: "string",
        },
    },
    samples: [
        {
            inputs: { prompt: input_sample },
            params: {},
            result: result_sample,
        },
    ],
    description: "OpenAI Agent",
    category: ["llm"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/llm_agents/openai_agent/src/openai_agent.ts",
    package: "@graphai/openai_agent",
    license: "MIT",
    stream: true,
    npms: ["openai"],
    environmentVariables: ["OPENAI_API_KEY"],
};
exports.default = openaiAgentInfo;
