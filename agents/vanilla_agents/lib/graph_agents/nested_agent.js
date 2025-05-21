"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nestedAgent = exports.nestedAgentGenerator = void 0;
const graphai_1 = require("graphai");
const nestedAgentGenerator = (graphData, options) => {
    return async (context) => {
        const { namedInputs, log, debugInfo, params, forNestedGraph } = context;
        (0, graphai_1.assert)(!!forNestedGraph, "Please update graphai to 0.5.19 or higher");
        const { agents, graphOptions, onLogCallback, callbacks } = forNestedGraph;
        const { taskManager } = graphOptions;
        const supressError = params.supressError ?? false;
        if (taskManager) {
            const status = taskManager.getStatus(false);
            (0, graphai_1.assert)(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
        }
        (0, graphai_1.assert)(!!graphData, "nestedAgent: graph is required");
        const { nodes } = graphData;
        const newNodes = Object.keys(nodes).reduce((tmp, key) => {
            const node = nodes[key];
            if ("agent" in node) {
                tmp[key] = node;
            }
            else {
                const { value, update, isResult, console } = node;
                tmp[key] = { value, update, isResult, console };
            }
            return tmp;
        }, {});
        const nestedGraphData = { ...graphData, nodes: newNodes, version: graphai_1.graphDataLatestVersion }; // deep enough copy
        const nodeIds = Object.keys(namedInputs);
        if (nodeIds.length > 0) {
            nodeIds.forEach((nodeId) => {
                if (nestedGraphData.nodes[nodeId] === undefined) {
                    // If the input node does not exist, automatically create a static node
                    nestedGraphData.nodes[nodeId] = { value: namedInputs[nodeId] };
                }
                else {
                    // Otherwise, inject the proper data here (instead of calling injectTo method later)
                    if (namedInputs[nodeId] !== undefined) {
                        nestedGraphData.nodes[nodeId]["value"] = namedInputs[nodeId];
                    }
                }
            });
        }
        try {
            if (nestedGraphData.version === undefined && debugInfo.version) {
                nestedGraphData.version = debugInfo.version;
            }
            const graphAI = new graphai_1.GraphAI(nestedGraphData, agents || {}, graphOptions);
            // for backward compatibility. Remove 'if' later
            if (onLogCallback) {
                graphAI.onLogCallback = onLogCallback;
            }
            if (callbacks) {
                graphAI.callbacks = callbacks;
            }
            debugInfo.subGraphs.set(graphAI.graphId, graphAI);
            const results = await graphAI.run(false);
            debugInfo.subGraphs.delete(graphAI.graphId);
            log?.push(...graphAI.transactionLogs());
            if (options && options.resultNodeId) {
                return results[options.resultNodeId];
            }
            return results;
        }
        catch (error) {
            if (error instanceof Error && supressError) {
                return {
                    onError: {
                        message: error.message,
                        error,
                    },
                };
            }
            throw error;
        }
    };
};
exports.nestedAgentGenerator = nestedAgentGenerator;
const nestedAgent = async (context) => {
    const { forNestedGraph, params } = context;
    const { graphData } = forNestedGraph ?? { graphData: { nodes: {} } };
    (0, graphai_1.assert)(!!graphData, "No GraphData");
    return await (0, exports.nestedAgentGenerator)(graphData, params)(context);
};
exports.nestedAgent = nestedAgent;
const nestedAgentInfo = {
    name: "nestedAgent",
    agent: exports.nestedAgent,
    mock: exports.nestedAgent,
    samples: [
        {
            inputs: {
                message: "hello",
            },
            params: {},
            result: {
                test: ["hello"],
            },
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "messages" },
                        inputs: { messages: [":message"] },
                        isResult: true,
                    },
                },
            },
        },
        {
            inputs: {
                message: "hello",
            },
            params: {
                resultNodeId: "test",
            },
            result: ["hello"],
            graph: {
                nodes: {
                    test: {
                        agent: "copyAgent",
                        params: { namedKey: "messages" },
                        inputs: { messages: [":message"] },
                        isResult: true,
                    },
                },
            },
        },
    ],
    description: "nested Agent",
    category: ["graph"],
    author: "Receptron team",
    repository: "https://github.com/receptron/graphai",
    source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/graph_agents/nested_agent.ts",
    package: "@graphai/vanilla",
    license: "MIT",
};
exports.default = nestedAgentInfo;
