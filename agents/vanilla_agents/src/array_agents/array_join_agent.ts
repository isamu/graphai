import { AgentFunction, AgentFunctionInfo } from "graphai";
import { arrayValidate } from "@graphai/agent_utils";
import type { GraphAIArray, GraphAIText } from "@graphai/agent_utils";

export const arrayJoinAgent: AgentFunction<{ separator?: string; flat?: number }, GraphAIText, GraphAIArray> = async ({ namedInputs, params }) => {
  arrayValidate("arrayJoinAgent", namedInputs);
  const separator = params.separator ?? "";
  const { flat } = params;

  const text = flat ? namedInputs.array.flat(flat).join(separator) : namedInputs.array.join(separator);
  return { text };
};

const arrayJoinAgentInfo: AgentFunctionInfo = {
  name: "arrayJoinAgent",
  agent: arrayJoinAgent,
  mock: arrayJoinAgent,
  inputs: {
    type: "object",
    properties: {
      array: {
        type: "array",
        description: "array join",
      },
    },
    required: ["array"],
  },
  params: {
    type: "object",
    properties: {
      separator: {
        type: "string",
        description: "array join separator",
      },
      flat: {
        type: "number",
        description: "array flat depth",
      },
    },
  },
  output: {
    type: "object",
    properties: {
      text: {
        type: "string",
        description: "joined text",
      },
    },
  },
  samples: [
    {
      inputs: { array: [[1], [2], [3]] },
      params: {},
      result: {
        text: "123",
      },
    },
    {
      inputs: { array: [[1], [2], [[3]]] },
      params: {},
      result: {
        text: "123",
      },
    },
    {
      inputs: { array: [["a"], ["b"], ["c"]] },
      params: {},
      result: {
        text: "abc",
      },
    },
    //
    {
      inputs: { array: [[1], [2], [3]] },
      params: { separator: "|" },
      result: {
        text: "1|2|3",
      },
    },
    {
      inputs: { array: [[[1]], [[2], [3]]] },
      params: { separator: "|" },
      result: {
        text: "1|2,3",
      },
    },
    {
      inputs: { array: [[[1]], [[2], [3]]] },
      params: { separator: "|", flat: 1 },
      result: {
        text: "1|2|3",
      },
    },
    {
      inputs: { array: [[[[1]], [[2], [3]]]] },
      params: { separator: "|", flat: 1 },
      result: {
        text: "1|2,3",
      },
    },
    {
      inputs: { array: [[[[1]], [[2], [3]]]] },
      params: { separator: "|", flat: 2 },
      result: {
        text: "1|2|3",
      },
    },
  ],
  description: "Array Join Agent",
  category: ["array"],
  cacheType: "pureAgent",
  author: "Receptron team",
  repository: "https://github.com/receptron/graphai",
  source: "https://github.com/receptron/graphai/blob/main/agents/vanilla_agents/src/array_agents/array_join_agent.ts",
  package: "@graphai/vanilla",
  license: "MIT",
};
export default arrayJoinAgentInfo;
