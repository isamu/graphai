"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.arrayFlatAgent = void 0;
const graphai_1 = require("graphai");
const arrayFlatAgent = async ({ namedInputs, }) => {
    (0, graphai_1.assert)(!!namedInputs, "arrayFlatAgent: namedInputs is UNDEFINED!");
    const depth = namedInputs.depth ?? 1;
    const array = namedInputs.array.map((item) => item); // shallow copy
    return { array: array.flat(depth) };
};
exports.arrayFlatAgent = arrayFlatAgent;
const arrayFlatAgentInfo = {
    name: "arrayFlatAgent",
    agent: exports.arrayFlatAgent,
    mock: exports.arrayFlatAgent,
    inputs: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "flat array",
            },
        },
        required: ["array"],
    },
    output: {
        type: "object",
        properties: {
            array: {
                type: "array",
                description: "the remaining array",
            },
        },
    },
    samples: [
        {
            inputs: { array: [[1], [2], [3]] },
            params: {},
            result: {
                array: [1, 2, 3],
            },
        },
        {
            inputs: { array: [[1], [2], [[3]]] },
            params: {},
            result: {
                array: [1, 2, [3]],
            },
        },
        {
            inputs: { array: [[1], [2], [[3]]], depth: 2 },
            params: {},
            result: {
                array: [1, 2, 3],
            },
        },
        {
            inputs: { array: [["a"], ["b"], ["c"]] },
            params: {},
            result: {
                array: ["a", "b", "c"],
            },
        },
    ],
    description: "Array Flat Agent",
    category: ["array"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = arrayFlatAgentInfo;
