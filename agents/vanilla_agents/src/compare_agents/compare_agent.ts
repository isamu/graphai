import { AgentFunction, AgentFunctionInfo } from "graphai";

type CompareDataItem = string | number | boolean | CompareData;
type CompareData = CompareDataItem[];

const compare = (_array: CompareData): boolean => {
  if (_array.length !== 3) {
    throw new Error(`compare inputs length must must be 3`);
  }
  const array = _array.map((value) => {
    if (Array.isArray(value)) {
      return compare(value);
    }
    return value;
  });
  const [a, operator, b] = array;
  if (operator === "==") {
    return a === b;
  }
  if (operator === "!=") {
    return a !== b;
  }
  if (operator === ">") {
    return Number(a) > Number(b);
  }
  if (operator === ">=") {
    return Number(a) >= Number(b);
  }
  if (operator === "<") {
    return Number(a) < Number(b);
  }
  if (operator === "<=") {
    return Number(a) <= Number(b);
  }
  if (operator === "||") {
    return !!a || !!b;
  }
  if (operator === "&&") {
    return !!a && !!b;
  }
  if (operator === "XOR") {
    return !!a === !b;
  }
  throw new Error(`unknown compare operator`);
};

export const compareAgent: AgentFunction = async ({ namedInputs, params }) => {
  const ret = compare(namedInputs.array);
  if (params?.value) {
    return {
      result: params?.value[ret ? "true" : "false"] ?? ret,
    };
  }
  return {
    result: ret,
  };
};

const compareAgentInfo: AgentFunctionInfo = {
  name: "compareAgent",
  agent: compareAgent,
  mock: compareAgent,
  inputs: {},
  output: {},
  samples: [
    {
      inputs: { array: ["abc", "==", "abc"] },
      params: { value: { true: "a", false: "b" } },
      result: {
        result: "a",
      },
    },
    {
      inputs: { array: ["abc", "==", "abca"] },
      params: { value: { true: "a", false: "b" } },
      result: {
        result: "b",
      },
    },
    {
      inputs: { array: ["abc", "==", "abc"] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: ["abc", "==", "abcd"] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: ["abc", "!=", "abc"] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: ["abc", "!=", "abcd"] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: ["10", ">", "5"] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: ["10", ">", "15"] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: [10, ">", 5] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: [10, ">", 15] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: ["10", ">=", "5"] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: ["10", ">=", "10"] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      // 10
      inputs: { array: ["10", ">=", "19"] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: [10, ">=", 5] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: [10, ">=", 10] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: [10, ">=", 19] },
      params: {},
      result: {
        result: false,
      },
    },
    //

    {
      inputs: { array: ["10", "<", "5"] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: ["10", "<", "15"] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: [10, "<", 5] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: [10, "<", 15] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: ["10", "<=", "5"] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: ["10", "<=", "10"] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      // 20
      inputs: { array: ["10", "<=", "19"] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: [10, "<=", 5] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: [10, "<=", 10] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: [10, "<=", 19] },
      params: {},
      result: {
        result: true,
      },
    },

    {
      inputs: { array: [true, "||", false] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: [false, "||", false] },
      params: {},
      result: {
        result: false,
      },
    },

    {
      inputs: { array: [true, "&&", false] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: [true, "&&", true] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: [true, "XOR", false] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: [false, "XOR", true] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: [false, "XOR", false] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: [true, "XOR", true] },
      params: {},
      result: {
        result: false,
      },
    },
    //
    {
      inputs: { array: [["aaa", "==", "aaa"], "||", ["aaa", "==", "bbb"]] },
      params: {},
      result: {
        result: true,
      },
    },
    {
      inputs: { array: [["aaa", "==", "aaa"], "&&", ["aaa", "==", "bbb"]] },
      params: {},
      result: {
        result: false,
      },
    },
    {
      inputs: { array: [[["aaa", "==", "aaa"], "&&", ["bbb", "==", "bbb"]], "||", ["aaa", "&&", "bbb"]] },
      params: {},
      result: {
        result: true,
      },
    },
  ],
  description: "compare",
  category: ["compare"],
  author: "Receptron",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default compareAgentInfo;
