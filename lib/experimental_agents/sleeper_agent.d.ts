import { AgentFunction } from "../graphai";
export declare const sleeperAgent: AgentFunction<{
    duration?: number;
    value?: Record<string, any>;
}, Record<string, any>, Record<string, any>>;
export declare const sleeperAgentDebug: AgentFunction<{
    duration: number;
    value?: Record<string, any>;
    fail?: boolean;
}, Record<string, any>, Record<string, any>>;
