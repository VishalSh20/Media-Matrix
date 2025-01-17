import { replicate,IMAGE_GENERATION_MODEL } from "./replicate.utils.js";

export const imageGenerate = async (prompt, numImages = 1) => {
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

        // Process and upload each generated image
        const uploadPromises = output.map(async (stream, index) => {
            // Convert stream to buffer
            const response = new Response(stream);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            // Upload to S3 and get signed URL
            return buffer;
        });

        // Wait for all uploads to complete
        const images = await Promise.all(uploadPromises);
        return images;

    } catch (error) {
        console.error('Error in image generation:', error);
        throw new Error(error.message);
    }
};
