import "dotenv/config";

import { graphDataTestRunner } from "~/utils/runner";
import { fetchAgent, propertyFilterAgent, groqAgent, stringTemplateAgent, copyAgent } from "@/experimental_agents";

export const graph_data = {
  version: 0.3,
  nodes: {
    url: {
      // Holds the RSS feed URL
      value: "https://www.theverge.com/microsoft/rss/index.xml",
    },
    rssFeed: {
      // Fetchs the RSS feed from the specified feed
      agent: "fetchAgent",
      params: {
        type: "xml",
      },
      inputs: [":url"],
    },
    entries: {
      // Extracts necessary information from the feed
      agent: "propertyFilterAgent",
      params: {
        include: ["title", "link", "content"],
      },
      inputs: [":rssFeed.feed.entry"],
    },
    map: {
      // Processes each entry concurrently.
      agent: "mapAgent",
      inputs: [":entries"],
      isResult: true,
      params: {
        limit: 4, // to avoid rate limit
      },
      graph: {
        nodes: {
          template: {
            // Extracts title and content, then generate a single text
            agent: "stringTemplateAgent",
            params: {
              template: "Title:${0}\n${1}",
            },
            inputs: [":$0.title", ":$0.content._"],
          },
          query: {
            // Asks the LLM to summarize it
            agent: "groqAgent",
            params: {
              model: "Llama3-8b-8192", // "mixtral-8x7b-32768",
              query: "次のHTMLからテキストだけを抜き出し、省略せずに、全文を日本語に翻訳して。余計なことは言わずに、翻訳した文章だけ答えて。",
            },
            inputs: [":template"],
          },
          extractor: {
            // Extract the content from the generated message
            agent: "copyAgent",
            isResult: true,
            inputs: [":query.choices.$0.message.content"],
          },
        },
      },
    },
  },
};

export const main = async () => {
  const result = (await graphDataTestRunner("sample_net.log", graph_data, {
    fetchAgent,
    propertyFilterAgent,
    groqAgent,
    stringTemplateAgent,
    copyAgent,
  })) as any;
  console.log(result.map.extractor.join("\n\n"));
};
if (process.argv[1] === __filename) {
  main();
}
