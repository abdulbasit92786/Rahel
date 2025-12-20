
import { GoogleGenAI, Type } from "@google/genai";
import { GameCommentary } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getGameCommentary(score: number, lastSnack: string): Promise<GameCommentary> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The player is playing 'SnackQuest: Warm Harvest', a cozy snake game. 
      They just ate a ${lastSnack} and reached a score of ${score}. 
      Provide a very short (max 10 words), warm, and encouraging comment as the 'Snack Guardian'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            mood: { type: Type.STRING, enum: ['encouraging', 'funny', 'dramatic', 'warm'] }
          },
          required: ["text", "mood"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"text": "Mmm, tasty!", "mood": "warm"}');
    return data as GameCommentary;
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Keep going, hungry one!", mood: "encouraging" };
  }
}

export async function getGameOverMessage(score: number): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The game is over in 'SnackQuest'. The player scored ${score}. 
      Write a cozy but slightly sad farewell message (max 12 words) inviting them to come back to the warm fire soon.`,
    });
    return response.text || "The harvest ends, but the fire stays warm. Come back soon!";
  } catch {
    return "Game over! You did great.";
  }
}
