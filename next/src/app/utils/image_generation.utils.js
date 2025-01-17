import { replicate, IMAGE_GENERATION_MODEL } from "./replicate.utils.js";

const sanitizeFileName = (prompt) => {
    // Remove special characters, keep alphanumeric, spaces, and common punctuation
    let sanitized = prompt
        .toLowerCase()
        // Replace any character that's not alphanumeric, space, or dash with a dash
        .replace(/[^a-z0-9\s-]/g, '-')
        // Replace multiple consecutive spaces or dashes with a single dash
        .replace(/[\s-]+/g, '-')
        // Trim dashes from start and end
        .replace(/^-+|-+$/g, '')
        // Limit length to 50 characters
        .slice(0, 50);

    return sanitized || 'generated-image'; // Fallback if sanitized string is empty
};

export const generateImage = async (prompt, numImages = 1) => {
    try {
        const input = {
            width: 1024,
            height: 1024,
            prompt: prompt,
            scheduler: "K_EULER",
            num_outputs: numImages,
            guidance_scale: 0,
            negative_prompt: "worst quality, low quality",
            num_inference_steps: 4
        };

        console.log("input:", input);
        const output = await replicate.run(
            IMAGE_GENERATION_MODEL,
            {
                input: input,
            }
        );
        console.log("output:", output);

        const sanitizedPrompt = sanitizeFileName(prompt);

        // Process each generated image
        const files = await Promise.all(output.map(async (stream, index) => {
            // Convert stream to buffer
            const response = new Response(stream);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            
            // Convert buffer to blob
            const blob = new Blob([buffer], { type: 'image/png' });
            
            // Convert blob to file with sanitized name
            const file = new File([blob], `${sanitizedPrompt}-${index + 1}.png`, {
                type: 'image/png',
                lastModified: Date.now()
            });
            
            return file;
        }));

        return files;

    } catch (error) {
        console.error('Error in image generation:', error);
        throw new Error(error.message);
    }
};