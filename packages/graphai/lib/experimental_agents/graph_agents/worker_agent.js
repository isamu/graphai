"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.workerAgent = void 0;
const index_1 = require("../../index");
const worker_threads_1 = require("worker_threads");
const vanilla_1 = require("../../experimental_agents/vanilla");
const utils_1 = require("../../utils/utils");
const vanillaAgents = {
    totalAgent: vanilla_1.totalAgent,
    dataSumTemplateAgent: vanilla_1.dataSumTemplateAgent,
    propertyFilterAgent: vanilla_1.propertyFilterAgent,
    copyAgent: vanilla_1.copyAgent,
    pushAgent: vanilla_1.pushAgent,
    popAgent: vanilla_1.popAgent,
    shiftAgent: vanilla_1.shiftAgent,
    nestedAgent: vanilla_1.nestedAgent,
    mapAgent: vanilla_1.mapAgent,
    dotProductAgent: vanilla_1.dotProductAgent,
    sortByValuesAgent: vanilla_1.sortByValuesAgent,
    stringSplitterAgent: vanilla_1.stringSplitterAgent,
    stringTemplateAgent: vanilla_1.stringTemplateAgent,
    jsonParserAgent: vanilla_1.jsonParserAgent,
};
if (!worker_threads_1.isMainThread && worker_threads_1.parentPort) {
    const port = worker_threads_1.parentPort;
    port.on("message", async (data) => {
        const { graphData } = data;
        const graphAI = new index_1.GraphAI(graphData, vanillaAgents);
        const result = await graphAI.run();
        port.postMessage(result);
    });
}
const workerAgent = async ({ inputs, params, /* agents, log, */ graphData }) => {
    const namedInputs = params.namedInputs ?? inputs.map((__input, index) => `$${index}`);
    (0, utils_1.assert)(!!graphData, "required");
    (0, utils_1.assert)(typeof graphData === "object", "required");
    namedInputs.forEach((nodeId, index) => {
        if (graphData.nodes[nodeId] === undefined) {
            // If the input node does not exist, automatically create a static node
            graphData.nodes[nodeId] = { value: inputs[index] };
        }
        else {
            // Otherwise, inject the proper data here (instead of calling injectTo method later)
            graphData.nodes[nodeId]["value"] = inputs[index];
        }
    });
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker("./lib/experimental_agents/graph_agents/worker_agent.js");
        worker.on("message", (result) => {
            worker.terminate();
            resolve(result);
        });
        worker.on("error", reject);
        worker.on("exit", (code) => {
            if (code !== 0)
                reject(new Error(`Worker stopped with exit code ${code}`));
        });
        // copyAgent is required for test case
        worker.postMessage({ graphData });
    });
};
exports.workerAgent = workerAgent;
const workerAgentInfo = {
    name: "workerAgent",
    agent: exports.workerAgent,
    mock: exports.workerAgent,
    samples: [
        {
            inputs: [],
            params: {},
            result: { message: "May the force be with you" },
            graph: {
                version: 0.3,
                nodes: {
                    source: {
                        value: "May the force be with you",
                    },
                    message: {
                        agent: "copyAgent",
                        inputs: [":source"],
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: ["May the force be with you"],
            params: {},
            result: { message: "May the force be with you" },
            graph: {
                version: 0.3,
                nodes: {
                    source: {
                        value: "TypeScript compiler fails without this node for some reason.",
                    },
                    message: {
                        agent: "copyAgent",
                        inputs: [":$0"],
                        isResult: true,
                    },
                },
            },
        },
    ],
    description: "Map Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    license: "MIT",
};
exports.default = workerAgentInfo;
