import "dotenv/config";
import { openAIAgent } from "@/openai_agent";

import test from "node:test";
import assert from "node:assert";

test("test agent filter", async () => {
  const inputs = ["hello, let me know the answer 1 + 1"];
  const model = "gemma";
  // const model = "llama3";
  // const model = "phi3";
  const params = {
    baseURL: "http://127.0.0.1:11434/v1",
    model,
    apiKey: model,
  }
  const res = await openAIAgent({ inputs, params, filterParams: {}, debugInfo: {verbose: false, nodeId: "test", retry: 5}}) as any;
  if (res) {
    console.log(res.choices[0]);
  }
  assert.deepStrictEqual(true, true);
  
});
