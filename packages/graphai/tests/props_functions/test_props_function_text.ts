import { parseNodeName } from "../../src/utils/utils";
import { propFunctions } from "../../src/utils/prop_function";
import { getDataFromSource } from "../../src/utils/data_source";

import test from "node:test";
import assert from "node:assert";

// text function
test("test getDataFromSource string json", async () => {
  const inputId = ":node1.data.jsonParse()";
  const result = { data: '{ "sample": [0, 1, 2, 3] }' };
  const data = { sample: [0, 1, 2, 3] };

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "jsonParse()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string number", async () => {
  const inputId = ":node1.data.toNumber()";
  const result = { data: "12" };
  const data = 12;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "toNumber()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string number", async () => {
  const inputId = ":node1.data.toNumber()";
  const result = { data: "aa" };
  const data = undefined;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "toNumber()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string number", async () => {
  const inputId = ":node1.data.jsonParse()";
  const result = { data: '{ "sample": [0, 1, 2, 3] }' };
  const data = { sample: [0, 1, 2, 3] };

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "jsonParse()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string codeBlack", async () => {
  const inputId = ":node1.text.codeBlock()";
  const result = { text: 'aaa\n```\nimport * as a from "aa";\n\nconsole.log("hello");\n```\n\naaa' };
  const data = '\nimport * as a from "aa";\n\nconsole.log("hello");';

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["text", "codeBlock()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string codeBlack not match", async () => {
  const inputId = ":node1.text.codeBlock()";
  const result = { text: 'aaa\n\nimport * as a from "aa";\n\nconsole.log("hello");\n\n\naaa' };

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["text", "codeBlock()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, undefined);
});

test("test getDataFromSource string codeBlackOrRaw", async () => {
  const inputId = ":node1.text.codeBlockOrRaw()";
  const result = { text: '```\nimport * as a from "aa";\n\nconsole.log("hello");\n```\n\n' };
  const data = '\nimport * as a from "aa";\n\nconsole.log("hello");';

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["text", "codeBlockOrRaw()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string codeBlackOrRaw", async () => {
  const inputId = ":node1.text.codeBlockOrRaw()";
  const result = { text: "hello world" };
  const data = "hello world";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["text", "codeBlockOrRaw()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

// no default yaml parser on Node.js
/*
test("test getDataFromSource array flat", async () => {
  const inputId = ":node1.data.yamlParse()";
  const result = { data: "sample\n - 0\n  - 1\n  - 2\n  - 3" };
  const data = 4;

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "yamlParse()"],});

  const res = getDataFromSource(result, source);
  assert.deepStrictEqual(res, data);
});
*/

test("test getDataFromSource nested object values", async () => {
  const inputId = ":node1.data.sample.values().join(-)";
  const result = { data: { sample: { a: "123", b: "abc" } } };
  const data = "123-abc";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "sample", "values()", "join(-)"] });
  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string trim", async () => {
  const inputId = ":node1.data.trim()";
  const result = { data: " aa " };
  const data = "aa";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "trim()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string toLowerCase", async () => {
  const inputId = ":node1.data.toLowerCase()";
  const result = { data: "AbCd" };
  const data = "abcd";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "toLowerCase()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string toUpperCase", async () => {
  const inputId = ":node1.data.toUpperCase()";
  const result = { data: "AbCd" };
  const data = "ABCD";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "toUpperCase()"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string split", async () => {
  const inputId = ":node1.data.split(--)";
  const result = { data: "Ab--Cd" };
  const data = ["Ab", "Cd"];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "split(--)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string split(.)", async () => {
  const inputId = ":node1.data.split(.)";
  const result = { data: "Ab.Cd" };
  const data = ["Ab", "Cd"];

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "split(.)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string slice", async () => {
  const inputId = ":node1.data.slice(1, 3)";
  const result = { data: "abcdefg" };
  const data = "bc";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "slice(1, 3)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string slice 2", async () => {
  const inputId = ":node1.data.slice(1)";
  const result = { data: "abcdefg" };
  const data = "bcdefg";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "slice(1)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string slice 3", async () => {
  const inputId = ":node1.data.slice(-4)";
  const result = { data: "abcdefg" };
  const data = "defg";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "slice(-4)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});

test("test getDataFromSource string slice 4", async () => {
  const inputId = ":node1.data.slice(-6,  -4)";
  const result = { data: "abcdefg" };
  const data = "bc";

  const source = parseNodeName(inputId);
  assert.deepStrictEqual(source, { nodeId: "node1", propIds: ["data", "slice(-6,  -4)"] });

  const res = getDataFromSource(result, source, propFunctions);
  assert.deepStrictEqual(res, data);
});
