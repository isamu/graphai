import "dotenv/config";
import { graphDataTestRunner } from "~/utils/runner";
import { groqAgent, mapAgent, copyAgent } from "@/experimental_agents";

const tools = [
  {
    type: "function",
    function: {
      name: "categorize",
      description: "categorize the food",
      parameters: {
        type: "object",
        properties: {
          category: {
            type: "string",
            description: "The category of the food item.",
            values: ["fruit", "vegetable", "meat", "other"],
          },
        },
        required: ["category"],
      },
    },
  },
];

const graph_data = {
  version: 0.3,
  concurrency: 1,
  nodes: {
    foods: {
      value: ["apple", "eggplant", "pork"],
    },
    categorizer: {
      agent: "mapAgent",
      inputs: [":foods"],
      isResult: true,
      graph: {
        nodes: {
          debug: {
            agent: (food: string) => console.log(food),
            inputs: [":$0"],
            isResult: true,
          },
          groq: {
            // This node sends those messages to Llama3 on groq to get the answer.
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192", // "llama3-70b-8192", // "Llama3-8b-8192",
              system: "You are a function calling LLM that categorize the specified food by calling categorize function.",
              tools,
              tool_choice: { type: "function", function: { name: "categorize" } },
            },
            retry: 1,
            inputs: [":$0"],
          },
          parser: {
            agent: (food: string, args: string) => {
              const json = JSON.parse(args);
              return { [food]: json.category };
            },
            inputs: [":$0", ":groq.choices.$0.message.tool_calls.$0.function.arguments"],
            isResult: true,
          },
        },
      },
    },
  },
};

export const main = async () => {
  const result: any = await graphDataTestRunner(
    __filename,
    graph_data,
    {
      groqAgent,
      copyAgent,
      mapAgent,
    },
    () => {},
    false,
  );
  console.log(result.categorizer.parser);
};

if (process.argv[1] === __filename) {
  main();
}
