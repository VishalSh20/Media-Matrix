import { SchemaType } from "@google/generative-ai";

export const IMAGE_PROMPT_GENERATOR_SCHEMA = {
    type: SchemaType.ARRAY,
    description: "Array of generated image prompts",
    items: {
        type: SchemaType.STRING,
        description: "A detailed image generation prompt"
    }
};