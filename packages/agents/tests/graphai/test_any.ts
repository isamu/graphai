import { GraphAI } from "graphai";
import { graphDataTestRunner } from "@receptron/test_utils";
import * as agents from "@/index";

import test from "node:test";
import assert from "node:assert";

const graphdata_any = {
  version: 0.5,
  nodes: {
    source: {
      value: {},
    },
    positive: {
      agent: "sleeperAgent",
      anyInput: true,
      isResult: true,
      inputs: [":source.yes"],
    },
    negative: {
      agent: "sleeperAgent",
      anyInput: true,
      isResult: true,
      inputs: [":source.no"],
    },
  },
};

test("test any 1", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphdata_any, agents, () => {}, false);
  assert.deepStrictEqual(result, {});
});

test("test any yes", async () => {
  const result = await graphDataTestRunner(
    __dirname,
    __filename,
    graphdata_any,
    agents,
    (graph: GraphAI) => {
      graph.injectValue("source", { yes: { apple: "red" } });
    },
    false,
  );
  assert.deepStrictEqual(result, {
    positive: { apple: "red" },
  });
});

test("test any no", async () => {
  const result = await graphDataTestRunner(
    __dirname,
    __filename,
    graphdata_any,
    agents,
    (graph: GraphAI) => {
      graph.injectValue("source", { no: { lemon: "yellow" } });
    },
    false,
  );
  assert.deepStrictEqual(result, {
    negative: { lemon: "yellow" },
  });
});

const graphdata_any2 = {
  version: 0.5,
  nodes: {
    source1: {
      value: { apple: "red" },
    },
    source2: {
      value: { lemon: "yellow" },
    },
    router1: {
      agent: "sleeperAgent",
      params: {
        duration: 10,
      },
      isResult: true,
      inputs: [":source1"],
    },
    router2: {
      agent: "sleeperAgent",
      params: {
        duration: 100,
      },
      isResult: true,
      inputs: [":source2"],
    },
    receiver: {
      agent: "sleeperAgent",
      anyInput: true,
      isResult: true,
      inputs: [":router1", ":router2"],
    },
  },
};

test("test loop & push", async () => {
  const result = await graphDataTestRunner(__dirname, __filename, graphdata_any2, agents, () => {}, false);
  assert.deepStrictEqual(result, {
    router1: { apple: "red" },
    router2: { lemon: "yellow" },
    receiver: { apple: "red" },
  });
});
