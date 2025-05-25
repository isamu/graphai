import { GraphAI } from "graphai";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@graphai/agents";

import { nestedGraphData, nestedGraphData2, nestedGraphDataError, graphString } from "./graphData";

import test from "node:test";
import assert from "node:assert";

test("test nested agent", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, nestedGraphData, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    nestedNode: {
      resultInner: {
        text: "Hello World",
      },
    },
  });
});

test("test nested agent 2", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, nestedGraphData2, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    nestedNode: {
      result: {
        text: "Hello World",
      },
    },
  });
});

test("test nested agent 3", async () => {
  const logIds: string[] = [];
  const graph = new GraphAI(nestedGraphData, agents);
  graph.onLogCallback = (log, __flag) => {
    logIds.push(log.nodeId);
  };
  await graph.run();
  // console.log(logIds);

  assert.deepStrictEqual(logIds, [
    "source",
    "__loopIndex",
    "nestedNode",
    "nestedNode",
    "inner0",
    "__loopIndex",
    "resultInner",
    "resultInner",
    "resultInner",
    "nestedNode",
  ]);
});

test("test nested agent 4", async () => {
  const graph = new GraphAI(nestedGraphDataError, agents);
  await assert.rejects(
    async () => {
      await graph.run();
    },
    { name: "Error", message: "\x1B[41mInputs not match: NodeId result, Inputs: soi_source\x1B[0m" },
  );
});

test("test nested agent 5", async () => {
  const graph = new GraphAI(graphString, agents);
  const result = await graph.run();
  // console.log(logIds);

  assert.deepStrictEqual(result, { updateText: { text: "hello" } });
});
