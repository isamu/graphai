"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gloqAgent = void 0;
const groq_sdk_1 = require("groq-sdk");
const utils_1 = require("../utils/utils");
const groq = process.env.GROQ_API_KEY
    ? new groq_sdk_1.Groq({
        apiKey: process.env.GROQ_API_KEY,
    })
    : undefined;
const gloqAgent = async ({ params }) => {
    (0, utils_1.assert)(groq !== undefined, "The GROQ_API_KEY environment variable is missing.");
    const result = await groq.chat.completions.create({
        messages: [
            {
                role: "user",
                content: params.prompt,
            },
        ],
        model: params.model,
    });
    return result;
};
exports.gloqAgent = gloqAgent;
