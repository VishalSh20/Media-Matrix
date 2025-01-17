import { getImagePrompt } from "../utils/gemini/gemini.utils.js";
import { imageGenerate } from "../utils/image_generation.utils.js";
import { uploadImage } from "../utils/storage.utils.js";

export const generateImages = async (req, res) => {
    try {
        const {userId} = req.query;
        const { prompt, count = 1, theme = "Abstract" } = req.body;
        console.log(prompt,count,theme,userId);
        console.log("Gemini api is:",process.env.GEMINI_API_KEY);

        if (!userId) {
            return res.status(400).json({ error: "User Id is required" });
        }

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const imagePrompts = await getImagePrompt(prompt, count, theme);
        // console.log("Generated the prompts: ",imagePrompts);

        if (!Array.isArray(imagePrompts)) {
            throw new Error("Invalid response format from prompt generator");
        }

        const mediaResults = [];
        
        for (let index = 0; index < imagePrompts.length; index++) {
            const imagePrompt = imagePrompts[index];
            console.log("Processing prompt:", imagePrompt);
            try {
                const generatedImages = await imageGenerate(imagePrompt);
                for(let image of generatedImages){
                    const mediaObject = await uploadImage(image, prompt, index, userId);
                    mediaResults.push(mediaObject);
                }
            } catch (error) {
                console.error(`Failed to process prompt "${imagePrompt}":`, error);
                continue;
            }
        }

        if (mediaResults.length === 0) {
            return res.status(500).json({ 
                error: "Failed to generate any images" 
            });
        }

        return res.status(200).json({ 
            success: true, 
            data: mediaResults 
        });

    } catch (error) {
        console.error('Error in generateImages:', error);
        return res.status(500).json({ 
            error: error.message || "Internal server error" 
        });
    }
};