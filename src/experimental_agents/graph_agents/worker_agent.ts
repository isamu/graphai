import { GraphAI, AgentFunction } from "@/index";
import { Worker, isMainThread, parentPort } from "worker_threads";
import {
  totalAgent,
  dataSumTemplateAgent,
  propertyFilterAgent,
  copyAgent,
  pushAgent,
  popAgent,
  shiftAgent,
  nestedAgent,
  mapAgent,
  dotProductAgent,
  sortByValuesAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  jsonParserAgent,
} from "@/experimental_agents/vanilla";
import { assert } from "@/utils/utils";
import { StaticNodeData } from "@/type";

const vanillaAgents = {
  totalAgent,
  dataSumTemplateAgent,
  propertyFilterAgent,
  copyAgent,
  pushAgent,
  popAgent,
  shiftAgent,
  nestedAgent,
  mapAgent,
  dotProductAgent,
  sortByValuesAgent,
  stringSplitterAgent,
  stringTemplateAgent,
  jsonParserAgent,
};

if (!isMainThread && parentPort) {
  const port = parentPort;
  port.on("message", async (data) => {
    const { graphData } = data;
    const graphAI = new GraphAI(graphData, vanillaAgents);
    const result = await graphAI.run();
    port.postMessage(result);
  });
}

export const workerAgent: AgentFunction<{ namedInputs?: Array<string> }, any, any> = async ({ inputs, params, /* agents, log, */ graphData }) => {
  const namedInputs = params.namedInputs ?? inputs.map((__input, index) => `$${index}`);
  assert(!!graphData, "required");
  assert(typeof graphData === "object", "required");
  namedInputs.forEach((nodeId, index) => {
    if (graphData.nodes[nodeId] === undefined) {
      // If the input node does not exist, automatically create a static node
      graphData.nodes[nodeId] = { value: inputs[index] };
    } else {
      // Otherwise, inject the proper data here (instead of calling injectTo method later)
      (graphData.nodes[nodeId] as StaticNodeData)["value"] = inputs[index];
    }
  });

  return new Promise((resolve, reject) => {
    const worker = new Worker("./lib/experimental_agents/graph_agents/worker_agent.js");
    worker.on("message", (result) => {
      worker.terminate();
      resolve(result);
    });
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
    });
    // copyAgent is required for test case
    worker.postMessage({ graphData });
  });
};

const workerAgentInfo = {
  name: "workerAgent",
  agent: workerAgent,
  mock: workerAgent,
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
export default workerAgentInfo;
