import { SchemaType } from "@google/generative-ai";
export const IMAGE_GENERATION_SCHEMA = {
    type: SchemaType.ARRAY,
    description: "Array of generated image prompts",
    items: {
            type: SchemaType.STRING,
            description: "A detailed image generation prompt",
     }
 };

 export const SCENE_GENERATION_SCHEMA = {
    type: SchemaType.ARRAY,
    description: "Array of generated scenes for video creation",
    items: {
        type: SchemaType.OBJECT,
        description: "An object representing a single scene in the video",
        properties: {
            sceneDescription: {
                type: SchemaType.STRING,
                description: "Description of the scene, outlining its visual and thematic content"
            },
            narration: {
                type: SchemaType.STRING,
                description: "Narration text for the scene, guiding the voice-over or subtitle"
            }
        },
        required: ["sceneDescription", "narration"]
    }
};

export const SCENE_IMAGE_PROMPT_SCHEMA = {
    type: SchemaType.ARRAY,
    description: "Array of 1 to 4 progressive image prompts based on a scene",
    items: {
        type: SchemaType.STRING,
        description: "A detailed image generation prompt based on the scene and narration"
    } 
};