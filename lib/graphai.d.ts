export { AgentFunction, AgentFunctionDictonary, GraphData } from "./type";
import { AgentFunctionDictonary, GraphData, DataSource, ResultDataDictonary, ResultData, DefaultResultData } from "./type";
import { TransactionLog } from "./log";
import { ComputedNode, StaticNode } from "./node";
type GraphNodes = Record<string, ComputedNode | StaticNode>;
export declare class GraphAI {
    private data;
    nodes: GraphNodes;
    callbackDictonary: AgentFunctionDictonary;
    isRunning: boolean;
    onLogCallback: (__log: TransactionLog, __isUpdate: boolean) => void;
    private runningNodes;
    private nodeQueue;
    private onComplete;
    private concurrency;
    private loop?;
    private repeatCount;
    verbose: boolean;
    private logs;
    private createNodes;
    private getValueFromResults;
    private initializeNodes;
    constructor(data: GraphData, callbackDictonary: AgentFunctionDictonary);
    getCallback(agentId?: string): import("./type").AgentFunction<any, any, any>;
    asString(): string;
    results<T = DefaultResultData>(): ResultDataDictonary<T>;
    errors(): Record<string, Error>;
    private pushReadyNodesIntoQueue;
    run<T = DefaultResultData>(): Promise<ResultDataDictonary<T>>;
    private runNode;
    executed(node: ComputedNode): void;
    pushQueue(node: ComputedNode): void;
    removeRunning(node: ComputedNode): void;
    private loopProcess;
    appendLog(log: TransactionLog): void;
    updateLog(log: TransactionLog): void;
    transactionLogs(): TransactionLog[];
    injectValue(nodeId: string, value: ResultData): void;
    resultsOf(sources: Array<DataSource>): any[];
}
