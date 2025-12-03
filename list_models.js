import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';

const GEMINI_API_KEY = "AIzaSyAFFTQZ9t7ZVVDadvKnxqPiDwH452rLQBc";

async function listModels() {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        const data = await response.json();

        if (data.models) {
            const generativeModels = data.models.filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"));
            const modelNames = generativeModels.map(m => m.name).join('\n');
            fs.writeFileSync('models.txt', modelNames);
            console.log("Models written to models.txt");
        } else {
            console.log("No models found:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
