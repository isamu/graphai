import type { TransactionLog } from "@/log";

export enum NodeState {
  Waiting = "waiting",
  Queued = "queued",
  Executing = "executing",
  Failed = "failed",
  TimedOut = "timed-out",
  Completed = "completed",
  Injected = "injected",
  Dispatched = "dispatched",
}
export type DefaultResultData = Record<string, any> | string | number;
export type DefaultInputData = Record<string, any> | string | number;
export type ResultData<ResultType = DefaultResultData> = ResultType | undefined;
export type ResultDataDictonary<ResultType = DefaultResultData> = Record<string, ResultData<ResultType>>;

export type NodeDataParams<ParamsType = Record<string, any>> = ParamsType; // Agent-specific parameters

export type DataSource = {
  nodeId: string;
  propId?: string;
};

export type StaticNodeData = {
  value: ResultData; // initial value for static node.
  update?: string; // nodeId (+.propId) to get value after a loop
};
export type ComputedNodeData = {
  agentId: string;
  inputs?: Array<string>;
  anyInput?: boolean; // any input makes this node ready
  params?: NodeDataParams;
  retry?: number;
  timeout?: number; // msec
  fork?: number;
};

export type NodeData = StaticNodeData | ComputedNodeData;

export type LoopData = {
  count?: number;
  while?: string;
};

export type GraphData = {
  nodes: Record<string, NodeData>;
  concurrency?: number;
  loop?: LoopData;
  verbose?: boolean;
};

export type AgentFunctionContext<ParamsType, InputDataType> = {
  params: NodeDataParams<ParamsType>;
  inputs: Array<InputDataType>;
  debugInfo: {
    verbose: boolean;
    nodeId: string;
    forkIndex?: number;
    retry: number;
  };
  agents?: AgentFunctionDictonary;
  log?: TransactionLog[];
};

export type AgentFunction<ParamsType = Record<string, any>, ResultType = DefaultResultData, InputDataType = DefaultInputData> = (
  context: AgentFunctionContext<ParamsType, InputDataType>,
) => Promise<ResultData<ResultType>>;

export type AgentFunctionDictonary = Record<string, AgentFunction<any, any, any>>;
