import { GoogleGenerativeAI } from "@google/generative-ai";
import { getSystemPrompt } from "./prompts";

export async function main() {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

  if (!GEMINI_API_KEY) {
    throw Error("No api key found");
  }

  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: getSystemPrompt(),
    tools: [{ codeExecution: {} }],
  });

  const prompt = "build a basic weather app";

  try {
    const result = await model.generateContentStream(prompt);

    // Print text as it comes in.
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      process.stdout.write(chunkText);
    }
  } catch (error: any) {
    console.error("Error generating content:", error.message);
  }
}
