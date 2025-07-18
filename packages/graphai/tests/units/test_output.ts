import { GraphAI } from "../../src/index";
import { graphDataLatestVersion } from "../common";
import * as agents from "../test_agents";

import test from "node:test";
import assert from "node:assert";

test("test output format", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      message: {
        value: {
          text: "Hello World",
        },
      },
      result: {
        agent: "copyAgent",
        inputs: {
          text: ":message.text",
        },
        isResult: true,
        output: {
          message: ".text",
          extra: "ok",
        },
      },
    },
  };

  const graph = new GraphAI(graph_data, agents);
  const result = await graph.run();
  assert.deepStrictEqual(result, {
    result: {
      message: "Hello World",
      extra: "ok",
    },
  });
});

test("test output format prop func", async () => {
  const graph_data = {
    version: graphDataLatestVersion,
    nodes: {
      message: {
        value: {
          data: "Hello World",
        },
      },
      result: {
        agent: "copyAgent",
        inputs: {
          data: ":message",
        },
        isResult: true,
        output: {
          json: ".data.toJSON()",
        },
      },
    },
  };

  const graph = new GraphAI(graph_data, agents);
  const result = await graph.run();
  assert.deepStrictEqual(result, {
    result: {
      json: '{\n  "data": "Hello World"\n}',
    },
  });
});
