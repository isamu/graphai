"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.computed = void 0;
const computed = async (nodes, func) => {
    const inputs = await Promise.all(nodes);
    return func(...inputs);
};
exports.computed = computed;
class Logger {
    constructor(options) {
        this.logs = [];
        this.result = {};
        this.options = options;
        this.startTime = Date.now();
    }
    async computed(nodes, func, options = { name: "no name" }) {
        const inputs = await Promise.all(nodes);
        const startTime = Date.now();
        const logStart = {
            name: options.name,
            time: Date.now(),
            state: "started",
        };
        const { verbose, recordInputs, recordOutput } = { ...this.options, ...options };
        if (recordInputs) {
            logStart.inputs = inputs;
        }
        this.logs.push(logStart);
        if (verbose) {
            console.log(`starting: ${logStart.name} at ${logStart.time - this.startTime}`);
        }
        const output = await func(...inputs);
        const logEnd = {
            name: options.name,
            time: Date.now(),
            state: "completed",
        };
        logEnd.duration = logEnd.time - startTime;
        if (recordOutput) {
            logStart.output = output;
        }
        this.logs.push(logEnd);
        if (verbose) {
            console.log(`complted: ${logEnd.name} at ${logEnd.time - this.startTime}, duration:${logEnd.duration}ms`);
        }
        return output;
    }
}
exports.Logger = Logger;
