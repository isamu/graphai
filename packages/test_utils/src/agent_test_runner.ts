import { defaultTestContext } from "graphai";
import type { AgentFunctionInfo, ConfigData } from "graphai/lib/type";

import * as agents from "@graphai/vanilla";

import test from "node:test";
import assert from "node:assert";

// for agent
export const agentTestRunner = async (agentInfo: AgentFunctionInfo, config: ConfigData = {}) => {
  const { agent, samples, inputs: inputSchema, hasGraphData } = agentInfo;
  if (samples.length === 0) {
    console.log(`test ${agentInfo.name}: No test`);
  } else {
    for await (const sampleKey of samples.keys()) {
      test(`test ${agentInfo.name} ${sampleKey}`, async () => {
        const { params, inputs, result, graph } = samples[sampleKey];
        // const flatInputs = Array.isArray(inputs) ? inputs : [];
        // const namedInputs = Array.isArray(inputs) ? {} : inputs;

        const actual = await agent({
          ...defaultTestContext,
          params,
          // inputs: flatInputs,
          inputSchema,
          namedInputs: inputs,
          forNestedGraph:
            (graph ?? hasGraphData)
              ? {
                  graphData: graph,
                  agents,
                  graphOptions: {},
                }
              : undefined,
          config,
        });
        assert.deepStrictEqual(actual, result);
      });
    }
  }
};
