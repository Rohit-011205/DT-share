import { GoogleGenAI, Chat, GenerateContentResponse, Content } from "@google/genai";

// Initialize the client
// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
// const ai = new GoogleGenAI(import.meta.env.API_KEY);
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

let chatSession: Chat | null = null;

export const initializeChat = (systemInstruction: string, history?: Content[]) => {
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: systemInstruction,
      temperature: 0.7,
      maxOutputTokens: 2000, // Increased for detailed career plans
    },
    history: history
  });
};

/**
 * Sends a message to Gemini and yields chunks of text as they arrive.
 * This enables the "typing" effect in the UI.
 */
export async function* sendMessageStream(text: string) {
  if (!chatSession) {
    throw new Error("Chat session not initialized.");
  }

  try {
    const result = await chatSession.sendMessageStream({
      message: text
    });

    for await (const chunk of result) {
      const c = chunk as GenerateContentResponse;
      // Safety check for empty text chunks
      if (c.text) {
        yield c.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Stream Error:", error);
    yield "I encountered a connection error. Please check your internet connection or API key.";
  }
}

// Fallback non-streaming method if needed
export const sendMessageToGemini = async (text: string): Promise<string> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized.");
  }

  try {
    const result = await chatSession.sendMessage({
      message: text
    });
    return result.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Connection error.";
  }
};