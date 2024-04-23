import { AgentFunction } from "@/graphai";
import { sleep } from "@/utils/utils";
import deepmerge from "deepmerge";

export const sleeperAgent: AgentFunction<{ duration?: number; value?: Record<string, any> }, Record<string, any>, Record<string, any>> = async (context) => {
  const { params, inputs } = context;
  await sleep(params?.duration ?? 10);
  return inputs.reduce((result: Record<string, any>, input: Record<string, any>) => {
    return deepmerge(result, input);
  }, params.value ?? {});
};

export const sleeperAgentDebug: AgentFunction<
  { duration: number; value?: Record<string, any>; fail?: boolean },
  Record<string, any>,
  Record<string, any>
> = async ({ params, inputs, debugInfo: { retry } }) => {
  await sleep(params.duration / (retry + 1));
  if (params.fail && retry < 2) {
    throw new Error("Intentional Failure");
  }
  return inputs.reduce((result: Record<string, any>, input: Record<string, any>) => {
    return deepmerge(result, input);
  }, params.value ?? {});
};
