import { nestedAgent } from "@/index";
import { sleepAndMergeAgent } from "@graphai/sleeper_agents";
import { defaultTestContext } from "graphai";

import test from "node:test";
import assert from "node:assert";

test("test nest agent", async () => {
  const result = await nestedAgent.agent({
    ...defaultTestContext,
    agents: { sleepAndMergeAgent },
    graphData: {
      version: 0.5,
      nodes: {
        node1: {
          agent: "sleepAndMergeAgent",
          inputs: { array: [":prop1", ":prop2", ":prop3"] },
          isResult: true,
        },
      },
    },
    namedInputs: { prop1: { apple: "red" }, prop2: { lemon: "yellow" }, prop3: { orange: "orange" } },
    inputs: [],
  });
  assert.deepStrictEqual(result, {
    node1: { apple: "red", lemon: "yellow", orange: "orange" },
  });
});
