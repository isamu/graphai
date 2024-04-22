import "dotenv/config";

import { AgentFunction } from "@/graphai";

import { graphDataTestRunner } from "~/utils/runner";
import { wikipediaAgent } from "./agents/wikipedia";
import { sortByValuesAgent, dotProductAgent, stringEmbeddingsAgent, stringSplitterAgent, stringTemplateAgent, slashGPTAgent } from "@/experimental_agents";
import { get_encoding } from "tiktoken";

export const tokenBoundStringsAgent: AgentFunction<
  {
    inputKey?: string;
    limit?: number;
  },
  {
    content: string;
  }
> = async ({ params, inputs }) => {
  const enc = get_encoding("cl100k_base");
  const contents: Array<string> = inputs[0][params?.inputKey ?? "contents"];
  const limit = params?.limit ?? 5000;
  const addNext = (total: number, index: number): number => {
    const length = enc.encode(contents[index]).length;
    if (total + length < limit && index + 1 < contents.length) {
      return addNext(total + length, index + 1);
    }
    return index + 1;
  };
  const endIndex = addNext(0, 0);
  const content = contents
    .filter((value, index) => {
      return index < endIndex;
    })
    .join("\n");
  return { content, endIndex };
};

const graph_data = {
  nodes: {
    source: {
      value: {
        name: "Sam Bankman-Fried",
        topic: "sentence by the court",
        content: "describe the final sentence by the court for Sam Bank-Fried",
      },
    },
    wikipedia: {
      // Fetch an article from Wikipedia
      agentId: "wikipediaAgent",
      inputs: ["source"],
      params: {
        inputKey: "name",
        lang: "en",
      },
    },
    chunks: {
      // Break that article into chunks
      agentId: "stringSplitterAgent",
      inputs: ["wikipedia"],
    },
    embeddings: {
      // Get embedding vectors of those chunks
      agentId: "stringEmbeddingsAgent",
      inputs: ["chunks"],
    },
    topicEmbedding: {
      // Get embedding vector of the topic
      agentId: "stringEmbeddingsAgent",
      inputs: ["source"],
      params: {
        inputKey: "topic",
      },
    },
    similarityCheck: {
      // Get the cosine similarities of those vectors
      agentId: "dotProductAgent",
      inputs: ["embeddings", "topicEmbedding"],
    },
    sortedChunks: {
      // Sort chunks based on those similarities
      agentId: "sortByValuesAgent",
      inputs: ["chunks", "similarityCheck"],
    },
    referenceText: {
      // Generate reference text from those chunks (token limited)
      agentId: "tokenBoundStringsAgent",
      inputs: ["sortedChunks"],
      params: {
        limit: 5000,
      },
    },
    prompt: {
      // Generate a prompt with that reference text
      agentId: "stringTemplateAgent",
      inputs: ["source", "referenceText"],
      params: {
        template: "Using the following document, ${0}\n\n${1}",
      },
    },
    RagQuery: {
      // Get the answer from LLM with that prompt
      agentId: "slashGPTAgent",
      inputs: ["prompt"],
    },
    OneShotQuery: {
      // Get the answer from LLM without the reference text
      agentId: "slashGPTAgent",
      inputs: ["source"],
    },
  },
};

const simplify = (result: any) => {
  const { content, usage } = result;
  return { content, usage };
};

const main = async () => {
  const result = await graphDataTestRunner("sample_wiki.log", graph_data, {
    tokenBoundStringsAgent,
    sortByValuesAgent,
    dotProductAgent,
    stringEmbeddingsAgent,
    stringSplitterAgent,
    stringTemplateAgent,
    slashGPTAgent,
    wikipediaAgent,
  });
  console.log(simplify(result.OneShotQuery));
  console.log(simplify(result.RagQuery));
};
if (process.argv[1] === __filename) {
  main();
}
