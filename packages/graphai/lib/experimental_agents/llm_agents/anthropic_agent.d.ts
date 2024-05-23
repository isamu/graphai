import { AgentFunction } from "../../index";
export declare const anthropicAgent: AgentFunction<{
    model?: string;
    query?: string;
    system?: string;
    temperature?: number;
    max_tokens?: number;
}, Record<string, any> | string, string | Array<any>>;
declare const anthropicAgentInfo: {
    name: string;
    agent: AgentFunction<{
        model?: string | undefined;
        query?: string | undefined;
        system?: string | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
    }, string | Record<string, any>, string | any[]>;
    mock: AgentFunction<{
        model?: string | undefined;
        query?: string | undefined;
        system?: string | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
    }, string | Record<string, any>, string | any[]>;
    samples: never[];
    skipTest: boolean;
    description: string;
    category: string[];
    author: string;
    repository: string;
    license: string;
    npms: string[];
};
export default anthropicAgentInfo;
