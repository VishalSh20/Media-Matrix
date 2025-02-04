import { GoogleGenerativeAI } from '@google/generative-ai';
import { IMAGE_GENERATION_SCHEMA, SCENE_GENERATION_SCHEMA, SCENE_IMAGE_GENERATION_SCHEMA } from './schemas.js';
import { IMAGE_GENERATION_INSTRUCTIONS, SCENE_GENERATION_INSTRUCTIONS, SCENE_IMAGE_PROMPT_INSTRUCTIONS } from "./instructions.js";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Retry wrapper for async functions
 * @param {Function} fn - Function to retry
 * @param {number} retries - Number of retry attempts
 * @param {number} delayMs - Delay between retries in milliseconds
 */
async function withRetry(fn, retries = 3, delayMs = 5000) {
    let lastError;
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            if (attempt < retries) {
                console.log(`Attempt ${attempt} failed. Retrying in ${delayMs/1000} seconds...`);
                await delay(delayMs);
            }
        }
    }
    
    throw new Error(`All ${retries} attempts failed. Last error: ${lastError.message}`);
}

/**
 * Generates a text response using Google's Gemini AI model
 * @param {string} prompt - The input prompt for the model
 * @param {object} schema - The response schema
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
        throw new Error(`Gemini API error: ${error.message}`);
    }
};

export async function getImagePrompts(prompt, count = 3, theme) {
    if (!prompt) throw new Error('Prompt is required');
    if (count < 1) throw new Error('Count must be at least 1');

    try {
        const promptData = {
            instructions: IMAGE_GENERATION_INSTRUCTIONS,
            input: {
                basic_prompt: prompt,
                count: count,
                theme: theme
            }
        };

        const response = await withRetry(async () => {
            const result = await generateGeminiResponse(JSON.stringify(promptData), IMAGE_GENERATION_SCHEMA);
            const promptsArray = result.response.candidates[0].content.parts[0].text;
            return JSON.parse(promptsArray);
        });

        console.log("Parsed prompts:", response);
        return response;
    } catch (error) {
        throw new Error(`Failed to generate image prompts: ${error.message}`);
    }
}

export async function getScenes(description, tone, duration) {
    if (!description) throw new Error('Description is required');
    if (!duration) throw new Error('Duration is required');

    try {
        const promptData = {
            instructions: SCENE_GENERATION_INSTRUCTIONS,
            input: {
                description: description,
                tone: tone,
                duration: duration,
            }
        };

        const response = await withRetry(async () => {
            const result = await generateGeminiResponse(JSON.stringify(promptData), SCENE_GENERATION_SCHEMA);
            return JSON.parse(result.response.candidates[0].content.parts[0].text);
        });

        return response;
    } catch (error) {
        throw new Error(`Failed to generate scenes: ${error.message}`);
    }
}

export async function getSceneImagePrompts(scene, completeScript, duration, animationTheme) {
    if (!scene) throw new Error('Scene is required');
    if (!scene.sceneDescription) throw new Error('Scene description is required');
    if (!scene.narration) throw new Error('Scene narration is required');
    if (!completeScript) throw new Error('Complete script is required');
    if (!duration) throw new Error('Duration is required');

    try {
        const promptData = {
            instructions: SCENE_IMAGE_PROMPT_INSTRUCTIONS,
            input: {
                sceneDescription: scene.sceneDescription,
                narration: scene.narration,
                completeScript: completeScript,
                duration: duration,
                animationTheme: animationTheme
            }
        };

        const response = await withRetry(async () => {
            const result = await generateGeminiResponse(JSON.stringify(promptData), SCENE_IMAGE_GENERATION_SCHEMA);
            return JSON.parse(result.response.candidates[0].content.parts[0].text);
        });

        return response;
    } catch (error) {
        throw new Error(`Failed to generate scene image prompts: ${error.message}`);
    }
}