import { GoogleGenAI } from "@google/genai";
import { ChatMode } from '../types';

let ai;
let chat = null;
let currentMode = null;

const LEARN_INSTRUCTION = `You are a friendly and expert Japanese language tutor. Your goal is to help users learn Japanese. When a user sends a text message, engage in a helpful conversation, providing translations, grammar explanations, or cultural insights. If the user uploads an image with text, identify the Japanese text, provide a romanization (romaji), and translate it into English. If a message is a transcription of a user's speech, assume it's their attempt at speaking Japanese, gently correct their pronunciation if needed, and provide the English translation. Keep your responses concise and encouraging.`;
const TRANSLATE_INSTRUCTION = `You are a direct translation engine. Translate the user's input (text, transcribed audio, or text from an image) into Japanese. If the input is already in Japanese, translate it to English. Provide only the translation and pronunciation, with no extra conversation, explanations, or pleasantries. Be direct and accurate.`;


const getAI = () => {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error("Set GEMINI_API_KEY (or API_KEY) in environment variables.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

const getChat = (mode) => {
    if(!chat || currentMode !== mode) {
        currentMode = mode;
        const aiInstance = getAI();
        const systemInstruction = mode === ChatMode.LEARN ? LEARN_INSTRUCTION : TRANSLATE_INSTRUCTION;
        
        chat = aiInstance.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: systemInstruction,
            },
        });
    }
    return chat;
};

export const generateChatResponse = async (
  newMessage,
  mode,
  image
) => {
  try {
    const chatInstance = getChat(mode);
    const parts = [{ text: newMessage }];

    if (image) {
      parts.unshift(image);
    }
    
    // FIX: The sendMessage method expects an object with a 'message' property containing the parts.
    const result = await chatInstance.sendMessage({ message: parts });
    return result.text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    return "Sorry, I encountered an error. Please try again.";
  }
};
