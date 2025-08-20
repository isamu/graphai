import "dotenv/config";
import { defaultTestContext } from "graphai";
import { openAIAgent } from "@graphai/openai_agent";
import { tools } from "./functions";

import test from "node:test";
import assert from "node:assert";

test("test openai tools", async () => {
  const namedInputs = {
    prompt: [
      `
以下の内容をまとめて、そしてPPTの資料を１０枚にしてまとめたい。

The Kremlin has played down talk of an imminent summit between Russian President Vladimir Putin and Ukraine's Volodymyr Zelensky, as Donald Trump renewed his call for the two leaders to meet to discuss ending the war in Ukraine.

The push for a bilateral meeting comes after the US president met Putin in Alaska last week, and welcomed seven European leaders and Zelensky to the White House on Monday.

Trump admitted the conflict was "a tough one" to solve and conceded it was possible the Russian president was not interested in ending hostilities.

"We're going to find out about President Putin in the next couple of weeks," he said on Tuesday. "It's possible that he doesn't want to make a deal."


while the UK's military chief, Admiral Tony Radakin, is travelling to Washington for discussions on the deployment of a reassurance force in Ukraine.

It was reported on Tuesday that Putin had suggested to Trump that Zelensky could travel to Moscow for talks, something Ukraine was never likely to accept.

The proposal may have been Russia's way of putting forward an option so far-fetched Kyiv could not possibly have agreed to it.

Talks over the last few days appear to have given Trump a renewed understanding of the complexities of the war and the gulf between Moscow's demands and Kyiv's position.

The much-vaunted ceasefire he said he could get Putin to agree to has not materialised, and now the US president has said Ukraine and Russia should move directly to a permanent peace deal instead - but some headway was made in terms of security guarantees for Ukraine.

Zelensky and European leaders seem to have convinced Trump that such commitments would be paramount to Kyiv's sovereignty in the event of a peace deal.`,
    ],
  };

  const params = {
    // dataStream: true,
    tool_choice: "auto" as const,
    tools,
  };

  const res = (await openAIAgent.agent({
    ...defaultTestContext,
    namedInputs,
    params,
    filterParams: {
      streamTokenCallback: (data: any) => {
        console.log(JSON.stringify(data, null, 2));
      },
    },
  })) as any;

  if (res) {
    console.log(JSON.stringify(res.tool_calls, null, 2));
  }
  assert.deepStrictEqual(true, true);
});
