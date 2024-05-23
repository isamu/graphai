import { AgentFunction } from "../../index";
export declare const shiftAgent: AgentFunction<Record<string, any>, Record<string, any>, Array<any>>;
declare const shiftAgentInfo: {
    name: string;
    agent: AgentFunction<Record<string, any>, Record<string, any>, any[]>;
    mock: AgentFunction<Record<string, any>, Record<string, any>, any[]>;
    samples: ({
        inputs: number[][];
        params: {};
        result: {
            array: number[];
            item: number;
        };
    } | {
        inputs: string[][];
        params: {};
        result: {
            array: string[];
            item: string;
        };
    })[];
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
};
export default shiftAgentInfo;
