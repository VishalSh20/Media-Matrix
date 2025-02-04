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

export const SCENE_IMAGE_GENERATION_SCHEMA = {
    type: SchemaType.ARRAY,
    description: "Array of generated image prompts with duration and description",
    items: {
        type: SchemaType.OBJECT,
        properties: {
            prompt: {
                type: SchemaType.STRING,
                description: "A detailed image generation prompt aligned with the scene description and animation theme",
            },
            duration: {
                type: SchemaType.NUMBER,
                description: "Duration in milliseconds for which this prompt corresponds in the video",
            },
        },
        required: ["prompt", "duration"],
    },
};
