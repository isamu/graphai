import { namedInputs2dataSources, flatDataSourceNodeIds } from "@/utils/nodeUtils";

import test from "node:test";
import assert from "node:assert";

test("test namedInput", async () => {
  const dataSources = namedInputs2dataSources({ text: [":message"] }, 0.5);
  const pendings = flatDataSourceNodeIds(Object.values(dataSources));
  assert.deepStrictEqual(pendings, ["message"]);
});

test("test namedInput array", async () => {
  const dataSources = namedInputs2dataSources({ array: [":abc", ":xyz"] }, 0.5);
  const pendings = flatDataSourceNodeIds(Object.values(dataSources));
  assert.deepStrictEqual(pendings, ["abc", "xyz"]);
});

test("test namedInput no colon", async () => {
  const dataSources = namedInputs2dataSources({ text: ["message"] }, 0.5);
  const pendings = flatDataSourceNodeIds(Object.values(dataSources));
  assert.deepStrictEqual(pendings, []);
});

test("test namedInput array no colon", async () => {
  const dataSources = namedInputs2dataSources({ array: ["abc", ":xyz"] }, 0.5);
  const pendings = flatDataSourceNodeIds(Object.values(dataSources));
  assert.deepStrictEqual(pendings, ["xyz"]);
});

test("test namedInput nested object failed", async () => {
  const dataSources = namedInputs2dataSources({ array: { array: [":abc", ":xyz"] } }, 0.5);
  const pendings = flatDataSourceNodeIds(Object.values(dataSources));
  assert.deepStrictEqual(pendings, []);
});
