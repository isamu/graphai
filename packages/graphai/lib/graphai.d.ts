import { AgentFunctionInfoDictionary, AgentFilterInfo, GraphData, DataSource, ResultDataDictionary, ResultData, DefaultResultData, GraphOptions } from "./type";
import { TransactionLog } from "./transaction_log";
import { ComputedNode, StaticNode } from "./node";
import { TaskManager } from "./task_manager";
type GraphNodes = Record<string, ComputedNode | StaticNode>;
export declare class GraphAI {
    readonly version: number;
    private readonly graphId;
    private readonly data;
    private readonly loop?;
    private readonly logs;
    private readonly bypassAgentIds;
    readonly agentFunctionInfoDictionary: AgentFunctionInfoDictionary;
    readonly taskManager: TaskManager;
    readonly agentFilters: AgentFilterInfo[];
    readonly retryLimit?: number;
    nodes: GraphNodes;
    onLogCallback: (__log: TransactionLog, __isUpdate: boolean) => void;
    verbose: boolean;
    private onComplete;
    private repeatCount;
    private createNodes;
    private getValueFromResults;
    private initializeNodes;
    constructor(data: GraphData, agentFunctionInfoDictionary: AgentFunctionInfoDictionary, options?: GraphOptions);
    getAgentFunctionInfo(agentId?: string): import("./type").AgentFunctionInfo | {
        agent: () => Promise<null>;
        inputs: null;
    };
    asString(): string;
    results<T = DefaultResultData>(all: boolean): ResultDataDictionary<T>;
    errors(): Record<string, Error>;
    private pushReadyNodesIntoQueue;
    private pushQueueIfReady;
    pushQueueIfReadyAndRunning(node: ComputedNode): void;
    pushQueue(node: ComputedNode): void;
    run<T = DefaultResultData>(all?: boolean): Promise<ResultDataDictionary<T>>;
    isRunning(): boolean;
    onExecutionComplete(node: ComputedNode): void;
    private processLoopIfNecessary;
    setLoopLog(log: TransactionLog): void;
    appendLog(log: TransactionLog): void;
    updateLog(log: TransactionLog): void;
    transactionLogs(): TransactionLog[];
    injectValue(nodeId: string, value: ResultData, injectFrom?: string): void;
    resultsOf(sources: Array<DataSource>): ResultData[];
}
export {};
