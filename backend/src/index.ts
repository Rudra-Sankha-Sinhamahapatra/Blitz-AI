import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "./prompts";
import express from "express";
import { message2, message5 } from "./messages";
import { nodeBasePrompt } from "./defaults/node";
import { reactBasePrompt } from "./defaults/react";

// import { main } from "./main";

dotenv.config();

const app = express();
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post("/template", async (req: any, res: any) => {
  const prompt = req.body.prompt;

  if (!GEMINI_API_KEY) {
    throw Error("No api key found");
  }
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: message5,
    tools: [{ codeExecution: {} }],
  });

  const response = await model.generateContent({
    contents: [
      {
        role: "user",
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });

  const answer = response.response.text().trim();
  if (answer == "react") {
    res.json({
        prompts: [message2, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
        uiPrompts: [reactBasePrompt]

    });

    return;
  }

  if (answer == "node") {
    res.json({
        prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
        uiPrompts: [nodeBasePrompt]
    });
    return;
  }

  res.status(403).json({ 
    message: "You can't access this",
    answer:answer
});
  return;
});

// main();

app.listen(3000, () => {
  console.log("Server is firing");
});
