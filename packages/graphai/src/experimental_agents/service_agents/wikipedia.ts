import { AgentFunction } from "@/index";
import wiki from "wikipedia";

export const wikipediaAgent: AgentFunction<{ lang?: string; summary?: boolean }, Record<string, any> | undefined, string> = async ({ inputs, params }) => {
  const { lang, summary } = params;
  const query = inputs[0];
  try {
    if (lang) {
      wiki.setLang(lang);
    }
    const search = await wiki.search(query);
    const search_res = search.results[0];

    const page = await wiki.page(search_res["title"]);
    const content = await (summary ? page.summary() : page.content());
    return { content, ...search.results[0] };
  } catch (error) {
    console.log(error);
    //=> Typeof wikiError
  }
  return;
};

const wikipediaAgentInfo = {
  name: "wikipediaAgent",
  agent: wikipediaAgent,
  mock: wikipediaAgent,
  description: "Retrieves data from wikipedia",
  category: ["service"],
  samples: [],
  author: "Receptron",
  repository: "https://github.com/receptron/graphai",
  license: "MIT",
};
export default wikipediaAgentInfo;
