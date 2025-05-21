"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataObjectMergeTemplateAgent = void 0;
const deepmerge_1 = __importDefault(require("deepmerge"));
const dataObjectMergeTemplateAgent = async ({ namedInputs, params }) => {
    const { flatResponse } = params;
    const data = namedInputs.array.reduce((tmp, input) => {
        return (0, deepmerge_1.default)(tmp, input);
    }, {});
    if (flatResponse) {
        return data;
    }
    return { data };
};
exports.dataObjectMergeTemplateAgent = dataObjectMergeTemplateAgent;
// for test and document
const sampleInputs = {
    array: [
        { a: 1, b: 1 },
        { a: 2, b: 2 },
        { a: 3, b: 0, c: 5 },
    ],
};
const sampleParams = {};
const sampleResult = { a: 3, b: 0, c: 5 };
const dataObjectMergeTemplateAgentInfo = {
    name: "dataObjectMergeTemplateAgent",
    agent: exports.dataObjectMergeTemplateAgent,
    mock: exports.dataObjectMergeTemplateAgent,
    samples: [
        {
            inputs: { array: [{ content1: "hello" }, { content2: "test" }] },
            params: { flatResponse: true },
            result: {
                content1: "hello",
                content2: "test",
            },
        },
        {
            inputs: { array: [{ content1: "hello" }] },
            params: { flatResponse: true },
            result: {
                content1: "hello",
            },
        },
        {
            inputs: { array: [{ content: "hello1" }, { content: "hello2" }] },
            params: { flatResponse: true },
            result: {
                content: "hello2",
            },
        },
        {
            inputs: sampleInputs,
            params: { flatResponse: true },
            result: sampleResult,
        },
        {
            inputs: { array: [{ a: { b: { c: { d: "e" } } } }, { b: { c: { d: { e: "f" } } } }, { b: { d: { e: { f: "g" } } } }] },
            params: { flatResponse: true },
            result: {
                a: { b: { c: { d: "e" } } },
                b: {
                    c: { d: { e: "f" } },
                    d: { e: { f: "g" } },
                },
            },
        },
        {
            inputs: { array: [{ content1: "hello" }, { content2: "test" }] },
            params: {},
            result: {
                data: {
                    content1: "hello",
                    content2: "test",
                },
            },
        },
        {
            inputs: { array: [{ content1: "hello" }] },
            params: {},
            result: {
                data: {
                    content1: "hello",
                },
            },
        },
        {
            inputs: { array: [{ content: "hello1" }, { content: "hello2" }] },
            params: {},
            result: {
                data: {
                    content: "hello2",
                },
            },
        },
        {
            inputs: sampleInputs,
            params: sampleParams,
            result: {
                data: sampleResult,
            },
        },
        {
            inputs: { array: [{ a: { b: { c: { d: "e" } } } }, { b: { c: { d: { e: "f" } } } }, { b: { d: { e: { f: "g" } } } }] },
            params: {},
            result: {
                data: {
                    a: { b: { c: { d: "e" } } },
                    b: {
                        c: { d: { e: "f" } },
                        d: { e: { f: "g" } },
                    },
                },
            },
        },
    ],
    description: "Merge object",
    category: ["data"],
    author: "Satoshi Nakajima",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/data_agents/src/data_object_merge_template_agent.ts",
    package: "@graphai/data_agents",
    license: "MIT",
};
exports.default = dataObjectMergeTemplateAgentInfo;
