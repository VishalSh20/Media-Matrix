import { GoogleGenerativeAI } from '@google/generative-ai';
import { IMAGE_GENERATION_SCHEMA,SCENE_GENERATION_SCHEMA,SCENE_IMAGE_PROMPT_SCHEMA } from './schemas.js';
import {IMAGE_GENERATION_INSTRUCTIONS,SCENE_GENERATION_INSTRUCTIONS,SCENE_IMAGE_PROMPT_INSTRUCTIONS} from "./instructions.js";

/**
 * Generates a text response using Google's Gemini AI model
 * @param {string} prompt - The input prompt for the model
 * @returns {Promise<object>} - The generated response
 */

export const generateGeminiResponse = async (prompt, schema) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          maxOutputTokens: 1000,
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: schema,
      }
  });

  return result;
    
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
};

export async function getImagePrompt(prompt, count=3, theme) {
    const promptData = {
        instructions: IMAGE_GENERATION_INSTRUCTIONS,
        input: {
            basic_prompt: prompt,
            count: count,
            theme: theme
        }
    };
    
    const response = await generateGeminiResponse(JSON.stringify(promptData),IMAGE_GENERATION_SCHEMA);
    const promptsArray = response.response.candidates[0].content.parts[0].text;
    const parsedPrompts = JSON.parse(promptsArray);
    console.log("Parsed prompts:", parsedPrompts);
    return parsedPrompts;
}

export async function getScenes(description,tone,duration) {
  const promptData = {
      instructions: SCENE_GENERATION_INSTRUCTIONS,
      input: {
          description: description,
          tone: tone,
          duration: duration,
      }
  };
  
  const response = await generateGeminiResponse(JSON.stringify(promptData),SCENE_GENERATION_SCHEMA);
  const scenesArray = JSON.parse(response.response.candidates[0].content.parts[0].text);
  return scenesArray;
}

export async function getSceneImagePrompts(scene) {
  const promptData = {
      instructions: SCENE_IMAGE_PROMPT_INSTRUCTIONS,
      input: {
          scene: scene.description,
          narration: scene.narration,
      }
  };

  const response = await generateGeminiResponse(JSON.stringify(promptData),SCENE_IMAGE_PROMPT_SCHEMA);
  const promptsArray = JSON.parse(response.response.candidates[0].content.parts[0].text);
  return promptsArray;
}
