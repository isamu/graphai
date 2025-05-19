import "dotenv/config";
import { defaultTestContext } from "graphai";
import { openAIAgent } from "@/openai_agent";

import test from "node:test";
import assert from "node:assert";

test("test openai", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const res = (await openAIAgent({ ...defaultTestContext, namedInputs })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});

// o1 and o3-mini
test("test openai o1", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const params = { model: "o1" };
  const res = (await openAIAgent({ ...defaultTestContext, namedInputs, params })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});

test("test openai o3-mini", async () => {
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1"] };
  const params = { model: "o3-mini" };
  const res = (await openAIAgent({ ...defaultTestContext, namedInputs, params })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});

test("test openai o3-mini stream", async () => {
  // It works with a small prompt. A complicated prompt will result in an internal error (2025-02-19)
  // const namedInputs = { prompt: ["hello, Tell me about quantum mechanics."] };
  const namedInputs = { prompt: ["hello, let me know the answer 1 + 1."] };
  const params = { model: "o3-mini", stream: true, dataStream: true };
  const res = (await openAIAgent({
    ...defaultTestContext,
    namedInputs,
    params,
    filterParams: {
      streamTokenCallback: (data: any) => {
        console.log(JSON.stringify(data, null, 2));
      },
    },
  })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});

test("test openai images", async () => {
  const namedInputs = {
    prompt: ["hello, let me know the answer 1 + 1"],
    images: ["https://raw.githubusercontent.com/receptron/graphai/refs/heads/main/packages/samples/src/llm/fish001.jpg"],
  };
  const params = { model: "gpt-4o" };
  const res = (await openAIAgent({ ...defaultTestContext, namedInputs, params })) as any;

  if (res) {
    console.log(res.choices[0].message["content"]);
  }
  assert.deepStrictEqual(true, true);
});

test("test openai tools", async () => {
  const namedInputs = { prompt: ["I would like to return the item, what should I do?"] };

  const params = {
    system: "You are a telephone operator~. Listen well to what the other person is saying and decide which one to connect with.",
    tool_choice: "auto" as const,
    tools: [
      {
        type: "function" as const,
        function: {
          name: "dispatchNextEvent",
          description: "Determine which department to respond to next",
          parameters: {
            type: "object",
            properties: {
              eventType: {
                type: "string",
                enum: ["Returns", "Payment", "How to order", "Others", "Defective products"],
                description: "The user name",
              },
            },
          },
          required: ["eventType"],
        },
      },
    ],
  };

  const res = (await openAIAgent({ ...defaultTestContext, namedInputs, params })) as any;

  if (res) {
    console.log(res.tool);
  }
  assert.deepStrictEqual(true, true);
});
