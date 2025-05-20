import { GraphAI, AgentFunction, AgentFunctionInfo, assert, graphDataLatestVersion } from "graphai";
import type { GraphAISupressError } from "@graphai/agent_utils";

export const mapAgent: AgentFunction<
  Partial<
    GraphAISupressError & {
      limit: number;
      resultAll: boolean;
      compositeResult: boolean;
      rowKey: string;
      expandKeys: string[];
    }
  >,
  Record<string, any>
> = async ({ params, namedInputs, log, debugInfo, forNestedGraph }) => {
  assert(!!forNestedGraph, "Please update graphai to 0.5.19 or higher");

  const { limit, resultAll, compositeResult, supressError, rowKey, expandKeys } = params;
  const { agents, graphData, graphOptions, onLogCallback, callbacks } = forNestedGraph;
  const { taskManager } = graphOptions;

  if (taskManager) {
    const status = taskManager.getStatus();
    assert(status.concurrency > status.running, `mapAgent: Concurrency is too low: ${status.concurrency}`);
  }

  assert(!!namedInputs.rows, "mapAgent: rows property is required in namedInput");
  assert(!!graphData, "mapAgent: graph is required");

  const rows = namedInputs.rows.map((item: any) => item);
  if (limit && limit < rows.length) {
    rows.length = limit; // trim
  }
  const rowInputKey = rowKey ?? "row";
  const { nodes } = graphData;
  const nestedGraphData = { ...graphData, nodes: { ...nodes }, version: graphDataLatestVersion }; // deep enough copy

  const nodeIds = Object.keys(namedInputs);
  nestedGraphData.nodes["__mapIndex"] = {};
  nodeIds.forEach((nodeId) => {
    const mappedNodeId = nodeId === "rows" ? rowInputKey : nodeId;
    if (nestedGraphData.nodes[mappedNodeId] === undefined) {
      // If the input node does not exist, automatically create a static node
      nestedGraphData.nodes[mappedNodeId] = { value: namedInputs[nodeId] };
    } else if (!("agent" in nestedGraphData.nodes[mappedNodeId])) {
      // Otherwise, inject the proper data here (instead of calling injectTo method later)
      nestedGraphData.nodes[mappedNodeId]["value"] = namedInputs[nodeId];
    }
  });

  try {
    if (nestedGraphData.version === undefined && debugInfo.version) {
      nestedGraphData.version = debugInfo.version;
    }
    const graphs: Array<GraphAI> = rows.map((row: any, index: number) => {
      const graphAI = new GraphAI(nestedGraphData, agents || {}, graphOptions);
      debugInfo.subGraphs.set(graphAI.graphId, graphAI);
      graphAI.injectValue(rowInputKey, row, "__mapAgent_inputs__");
      graphAI.injectValue("__mapIndex", index, "__mapAgent_inputs__");
      if (expandKeys && expandKeys.length > 0) {
        expandKeys.map((expandKey) => {
          graphAI.injectValue(expandKey, namedInputs[expandKey]?.[index]);
        });
      }
      // for backward compatibility. Remove 'if' later
      if (onLogCallback) {
        graphAI.onLogCallback = onLogCallback;
      }
      if (callbacks) {
        graphAI.callbacks = callbacks;
      }
      return graphAI;
    });

    const runs = graphs.map((graph) => {
      return graph.run(resultAll);
    });
    const results = await Promise.all(runs);
    const nodeIds = Object.keys(results[0]);
    // assert(nodeIds.length > 0, "mapAgent: no return values (missing isResult)");
    graphs.map((graph) => {
      debugInfo.subGraphs.delete(graph.graphId);
    });

    if (log) {
      const logs = graphs.map((graph, index) => {
        return graph.transactionLogs().map((log) => {
          log.mapIndex = index;
          return log;
        });
      });
      log.push(...logs.flat());
    }

    if (compositeResult) {
      const compositeResult = nodeIds.reduce((tmp: Record<string, Array<any>>, nodeId) => {
        tmp[nodeId] = results.map((result) => {
          return result[nodeId];
        });
        return tmp;
      }, {});
      return compositeResult;
    }
    return results;
  } catch (error) {
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

const mapAgentInfo: AgentFunctionInfo = {
  name: "mapAgent",
  agent: mapAgent,
  mock: mapAgent,
  samples: [
    {
      inputs: {
        rows: ["apple", "orange", "banana", "lemon"],
        color: ["red", "orange", "yellow", "yellow"],
      },
      params: {
        compositeResult: true,
        expandKeys: ["color"],
      },
      graph: {
        version: 0.5,
        nodes: {
          node2: {
            agent: "copyAgent",
            inputs: { a: ":row", b: ":color" },
            isResult: true,
          },
        },
      },
      result: {
        node2: [
          {
            a: "apple",
            b: "red",
          },
          {
            a: "orange",
            b: "orange",
          },
          {
            a: "banana",
            b: "yellow",
          },
          {
            a: "lemon",
            b: "yellow",
          },
        ],
      },
    },
    {
      inputs: {
        rows: [1, 2],
      },
      params: {},
      result: [{ test: [1] }, { test: [2] }],
      graph: {
        nodes: {
          test: {
            agent: "copyAgent",
            params: { namedKey: "rows" },
            inputs: { rows: [":row"] },
            isResult: true,
          },
        },
      },
    },
    {
      inputs: {
        rows: [1, 2],
      },
      params: { rowKey: "myKey" },
      result: [{ test: [1] }, { test: [2] }],
      graph: {
        nodes: {
          test: {
            agent: "copyAgent",
            params: { namedKey: "rows" },
            inputs: { rows: [":myKey"] },
            isResult: true,
          },
        },
      },
    },
    {
      inputs: {
        rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
      },
      params: {},
      graph: {
        nodes: {
          node2: {
            agent: "stringTemplateAgent",
            params: {
              template: "I love ${word}.",
            },
            inputs: { word: ":row" },
            isResult: true,
          },
        },
      },
      result: [
        { node2: "I love apple." },
        { node2: "I love orange." },
        { node2: "I love banana." },
        { node2: "I love lemon." },
        { node2: "I love melon." },
        { node2: "I love pineapple." },
        { node2: "I love tomato." },
      ],
    },
    {
      inputs: {
        rows: [{ fruit: "apple" }, { fruit: "orange" }],
      },
      params: {},
      graph: {
        nodes: {
          node2: {
            agent: "stringTemplateAgent",
            params: {
              template: "I love ${item}.",
            },
            inputs: { item: ":row.fruit" },
            isResult: true,
          },
        },
      },
      result: [{ node2: "I love apple." }, { node2: "I love orange." }],
    },
    {
      inputs: {
        rows: [{ fruit: "apple" }, { fruit: "orange" }],
        name: "You",
        verb: "like",
      },
      params: {},
      graph: {
        nodes: {
          node2: {
            agent: "stringTemplateAgent",
            params: {
              template: "${name} ${verb} ${fruit}.",
            },
            inputs: { fruit: ":row.fruit", name: ":name", verb: ":verb" },
            isResult: true,
          },
        },
      },
      result: [{ node2: "You like apple." }, { node2: "You like orange." }],
    },
    {
      inputs: {
        rows: [1, 2],
      },
      params: {
        resultAll: true,
      },
      result: [
        {
          __mapIndex: 0,
          test: [1],
          row: 1,
        },
        {
          __mapIndex: 1,
          test: [2],
          row: 2,
        },
      ],
      graph: {
        nodes: {
          test: {
            agent: "copyAgent",
            params: { namedKey: "rows" },
            inputs: { rows: [":row"] },
          },
        },
      },
    },
    {
      inputs: {
        rows: [1, 2],
      },
      params: {
        resultAll: true,
      },
      result: [
        {
          __mapIndex: 0,
          map: [
            {
              test: 1,
            },
            {
              test: 1,
            },
          ],
          row: 1,
          test: 1,
        },
        {
          __mapIndex: 1,
          map: [
            {
              test: 2,
            },
            {
              test: 2,
            },
          ],
          test: 2,
          row: 2,
        },
      ],
      graph: {
        nodes: {
          test: {
            agent: "copyAgent",
            params: { namedKey: "row" },
            inputs: { row: ":row" },
          },
          map: {
            agent: "mapAgent",
            inputs: { rows: [":test", ":test"] },
            graph: {
              nodes: {
                test: {
                  isResult: true,
                  agent: "copyAgent",
                  params: { namedKey: "row" },
                  inputs: { row: ":row" },
                },
              },
            },
          },
        },
      },
    },

    // old response
    {
      inputs: {
        rows: [1, 2],
      },
      params: {
        compositeResult: true,
      },
      result: {
        test: [[1], [2]],
      },
      graph: {
        nodes: {
          test: {
            agent: "copyAgent",
            params: { namedKey: "rows" },
            inputs: { rows: [":row"] },
            isResult: true,
          },
        },
      },
    },
    {
      inputs: {
        rows: ["apple", "orange", "banana", "lemon", "melon", "pineapple", "tomato"],
      },
      params: {
        compositeResult: true,
      },
      graph: {
        nodes: {
          node2: {
            agent: "stringTemplateAgent",
            params: {
              template: "I love ${row}.",
            },
            inputs: { row: ":row" },
            isResult: true,
          },
        },
      },
      result: {
        node2: ["I love apple.", "I love orange.", "I love banana.", "I love lemon.", "I love melon.", "I love pineapple.", "I love tomato."],
      },
    },
    {
      inputs: {
        rows: [1, 2],
      },
      params: {
        resultAll: true,
        compositeResult: true,
      },
      result: {
        test: [[1], [2]],
        __mapIndex: [0, 1],
        row: [1, 2],
      },
      graph: {
        nodes: {
          test: {
            agent: "copyAgent",
            params: { namedKey: "rows" },
            inputs: { rows: [":row"] },
          },
        },
      },
    },
    {
      inputs: {
        rows: [1, 2],
      },
      params: {
        resultAll: true,
        compositeResult: true,
      },
      result: {
        __mapIndex: [0, 1],
        test: [[1], [2]],
        map: [
          {
            test: [[[1]], [[1]]],
          },
          {
            test: [[[2]], [[2]]],
          },
        ],
        row: [1, 2],
      },
      graph: {
        nodes: {
          test: {
            agent: "copyAgent",
            params: { namedKey: "rows" },
            inputs: { rows: [":row"] },
          },
          map: {
            agent: "mapAgent",
            inputs: { rows: [":test", ":test"] },
            params: {
              compositeResult: true,
            },
            graph: {
              nodes: {
                test: {
                  isResult: true,
                  agent: "copyAgent",
                  params: { namedKey: "rows" },
                  inputs: { rows: [":row"] },
                },
              },
            },
          },
        },
      },
    },
  ],
  description: "Map Agent",
  category: ["graph"],
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/graph_agents/map_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default mapAgentInfo;
