import dotenv from 'dotenv'
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function main() {

const GEMINI_API_KEY = process.env.GEMINI_API_KEY

if(!GEMINI_API_KEY) {
    throw Error("No api key found");
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: "Generate clean, production-ready code with accessibility features and proper comments.",
    tools: [{codeExecution:{}}], 
});

const prompt = "build a small todolist website using typescript and vite react js";

try {
const result = await model.generateContentStream(prompt);

// Print text as it comes in.
for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    process.stdout.write(chunkText);
  }
} catch(error:any){
    console.error("Error generating content:", error.message);
}
}

main();