"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.popAgent = void 0;
const ajv_1 = __importDefault(require("ajv"));
const node_assert_1 = __importDefault(require("node:assert"));
const inputSchema = {
    type: "object",
    properties: {
        array: {
            type: "array",
            description: "the array to pop an item from",
        },
    },
    required: ["array"],
};
const popAgent = async ({ namedInputs }) => {
    (0, node_assert_1.default)(namedInputs, "popAgent: namedInputs is UNDEFINED!");
    const ajv = new ajv_1.default();
    const validateSchema = ajv.compile(inputSchema);
    if (!validateSchema(namedInputs)) {
        throw new Error("schema not matched");
    }
    const array = namedInputs.array.map((item) => item); // shallow copy
    const item = array.pop();
    return { array, item };
};
exports.popAgent = popAgent;
const popAgentInfo = {
    name: "popAgent",
    agent: exports.popAgent,
    mock: exports.popAgent,
    inputs: inputSchema,
    output: {
        type: "object",
        properties: {
            item: {
                type: "any",
                description: "the item popped from the array",
            },
            array: {
                type: "array",
                description: "the remaining array",
            },
        },
    },
    samples: [
        {
            inputs: { array: [1, 2, 3] },
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
        {
            inputs: { array: ["a", "b", "c"] },
            params: {},
            result: {
                array: ["a", "b"],
                item: "c",
            },
        },
        {
            inputs: {
                array: [1, 2, 3],
                array2: ["a", "b", "c"],
            },
            params: {},
            result: {
                array: [1, 2],
                item: 3,
            },
        },
    ],
    description: "Pop Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = popAgentInfo;
