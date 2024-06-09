import { GraphAI, AgentFunction, GraphData, StaticNodeData, assert } from "graphai";

// This function allows us to use one of inputs as the graph data for this nested agent,
// which is equivalent to "eval" of JavaScript.
export const getNestedGraphData = (graphData: GraphData | string | undefined, __inputs: Array<any>): GraphData => {
  assert(graphData !== undefined, "nestedAgent: graphData is required");
  if (typeof graphData === "string") {
    // We no longer need this feature bacause graph can have a data source
    /*
    const regex = /^\$(\d+)$/;
    const match = graphData.match(regex);
    if (match) {

      const index = parseInt(match[1], 10);
      if (index < inputs.length) {
        return inputs[index] as GraphData;
      }
    }
    */
    assert(false, `getNestedGraphData: Invalid graphData string: ${graphData}`);
  }
  return graphData;
};

export const nestedAgent: AgentFunction<{
  namedInputs?: Array<string>;
}> = async ({ params, inputs, namedInputs, agents, log, taskManager, graphData, agentFilters, debugInfo }) => {
  if (taskManager) {
    const status = taskManager.getStatus(false);
    assert(status.concurrency > status.running, `nestedAgent: Concurrency is too low: ${status.concurrency}`);
  }

  const nestedGraphData = getNestedGraphData(graphData, inputs);

  if (inputs.length > 0) {
    // LATER: Remove this old way
    console.log("-------------------- inputs for nestedGraph");
    const namedInputs = params.namedInputs ?? inputs.map((__input, index) => `$${index}`);
    namedInputs.forEach((nodeId, index) => {
      if (nestedGraphData.nodes[nodeId] === undefined) {
        // If the input node does not exist, automatically create a static node
        nestedGraphData.nodes[nodeId] = { value: inputs[index] };
      } else {
        // Otherwise, inject the proper data here (instead of calling injectTo method later)
        (nestedGraphData.nodes[nodeId] as StaticNodeData)["value"] = inputs[index];
      }
    });
  } else {
    const nodeIds = Object.keys(namedInputs);
    if (nodeIds.length > 0) {
      nodeIds.forEach((nodeId) => {
        if (nestedGraphData.nodes[nodeId] === undefined) {
          // If the input node does not exist, automatically create a static node
          nestedGraphData.nodes[nodeId] = { value: namedInputs[nodeId] };
        } else {
          // Otherwise, inject the proper data here (instead of calling injectTo method later)
          (nestedGraphData.nodes[nodeId] as StaticNodeData)["value"] = namedInputs[nodeId];
        }
      });
    }
  }

  try {
    if (nestedGraphData.version === undefined && debugInfo.version) {
      nestedGraphData.version = debugInfo.version;
    }
    const graphAI = new GraphAI(nestedGraphData, agents || {}, {
      taskManager,
      agentFilters,
    });

    const results = await graphAI.run(false);
    log?.push(...graphAI.transactionLogs());
    return results;
  } catch (error) {
    if (error instanceof Error) {
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

const nestedAgentInfo = {
  name: "nestedAgent",
  agent: nestedAgent,
  mock: nestedAgent,
  samples: [],
  description: "nested Agent",
  category: ["graph"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default nestedAgentInfo;
