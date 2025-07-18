"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.totalAgent = void 0;
const graphai_1 = require("graphai");
const agent_utils_1 = require("@graphai/agent_utils");
const totalAgent = async ({ namedInputs, params, }) => {
    const { flatResponse } = params;
    (0, graphai_1.assert)((0, agent_utils_1.isNamedInputs)(namedInputs), "totalAgent: namedInputs is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    (0, graphai_1.assert)(!!namedInputs?.array, "totalAgent: namedInputs.array is UNDEFINED! Set inputs: { array: :arrayNodeId }");
    const response = namedInputs.array.reduce((result, input) => {
        const inputArray = Array.isArray(input) ? input : [input];
        inputArray.forEach((innerInput) => {
            Object.keys(innerInput).forEach((key) => {
                const value = innerInput[key];
                if (result[key]) {
                    result[key] += value;
                }
                else {
                    result[key] = value;
                }
            });
        });
        return result;
    }, {});
    if (flatResponse) {
        return response;
    }
    return { data: response };
};
exports.totalAgent = totalAgent;
//
const totalAgentInfo = {
    name: "totalAgent",
    agent: exports.totalAgent,
    mock: exports.totalAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "An array of objects or arrays of objects. Each inner object must have numeric values which will be aggregated by key.",
                items: {
                    anyOf: [
                        {
                            type: "object",
                            description: "A flat object containing numeric values to be summed.",
                        },
                        {
                            type: "array",
                            items: {
                                type: "object",
                                description: "Nested array of objects, each containing numeric values to be summed.",
                            },
                        },
                    ],
                },
            },
        },
        required: ["array"],
        additionalProperties: false,
    },
    params: {
        type: "object",
        properties: {
            flatResponse: {
                type: "boolean",
                description: "If true, the result will be returned as a plain object (e.g., { a: 6 }); otherwise, wrapped in { data: {...} }.",
            },
        },
        additionalProperties: false,
    },
    output: {
        type: "object",
    },
    samples: [
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: {},
            result: { data: { a: 6 } },
        },
        {
            inputs: { array: [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]] },
            params: {},
            result: { data: { a: 6, b: -4, c: 10, d: -10 } },
        },
        {
            inputs: { array: [{ a: 1 }] },
            params: {},
            result: { data: { a: 1 } },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }] },
            params: {},
            result: { data: { a: 3 } },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: {},
            result: { data: { a: 6 } },
        },
        {
            inputs: {
                array: [
                    { a: 1, b: 1 },
                    { a: 2, b: 2 },
                    { a: 3, b: 0 },
                ],
            },
            params: {},
            result: { data: { a: 6, b: 3 } },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2, b: 2 }, { a: 3, b: 0 }] },
            params: {},
            result: { data: { a: 6, b: 2 } },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: { flatResponse: true },
            result: { a: 6 },
        },
        {
            inputs: { array: [[{ a: 1, b: -1 }, { c: 10 }], [{ a: 2, b: -1 }], [{ a: 3, b: -2 }, { d: -10 }]] },
            params: { flatResponse: true },
            result: { a: 6, b: -4, c: 10, d: -10 },
        },
        {
            inputs: { array: [{ a: 1 }] },
            params: { flatResponse: true },
            result: { a: 1 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }] },
            params: { flatResponse: true },
            result: { a: 3 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2 }, { a: 3 }] },
            params: { flatResponse: true },
            result: { a: 6 },
        },
        {
            inputs: {
                array: [
                    { a: 1, b: 1 },
                    { a: 2, b: 2 },
                    { a: 3, b: 0 },
                ],
            },
            params: { flatResponse: true },
            result: { a: 6, b: 3 },
        },
        {
            inputs: { array: [{ a: 1 }, { a: 2, b: 2 }, { a: 3, b: 0 }] },
            params: { flatResponse: true },
            result: { a: 6, b: 2 },
        },
    ],
    description: "Returns the sum of input values",
    category: ["data"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/snakajima/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/data_agents/total_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = totalAgentInfo;
