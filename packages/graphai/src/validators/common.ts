export const graphDataAttributeKeys = ["nodes", "concurrency", "agentId", "loop", "verbose", "version"];

export const computedNodeAttributeKeys = [
  "inputs",
  "anyInput",
  "params",
  "retry",
  "timeout",
  "agent",
  "graph",
  "isResult",
  "priority",
  "if",
  "unless",
  "filterParams",
  "console",
];
export const staticNodeAttributeKeys = ["value", "update", "isResult"];

export class ValidationError extends Error {
  constructor(message: string) {
    super(`\x1b[41m${message}\x1b[0m`); // Pass the message to the base Error class

    // Set the prototype explicitly to ensure correct prototype chain
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}
