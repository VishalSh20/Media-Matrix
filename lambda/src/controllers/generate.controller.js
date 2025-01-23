import nextApi from "../axios.config.js";
import { generateImage } from "../utils/image_generation.utils.js";
import {getImagePrompts} from "../utils/gemini/gemini.utils.js" 
import { generateVideoStoryAssets } from "../utils/video_story_generation.utils.js";

export const generateImageController = async (req, res) => {
  try {
    const { prompt,userId, animationTheme, width=1024, height=1024, n=1} = req.body;
    if(!prompt) {
      return res.status(400).json({
        message: "Prompt is required",
      });
    }
    if(!userId) {
      return res.status(401).json({
        message: "Unauthorised: User ID is required",
      });
    }
    if(!animationTheme) {
      return res.status(400).json({
        message: "Animation Theme is required",
      });
    }

    if(!width || !height || width%8!==0 || height%8!==0) {
      return res.status(400).json({
        message: "Width or Height cannot be zero, and need to be multiples of 8",
      });
    }

    const refinedPrompts = await getImagePrompts(prompt, n, animationTheme);
    console.log("Refined prompts:", refinedPrompts);
    let uploadedImages = [];

    for (let refinedPrompt of refinedPrompts) {
            try {
                // Generate the image file
                const imageFile = (await generateImage(refinedPrompt))[0];

                // Prepare FormData for the upload
                const formData = new FormData();
                formData.append("userId", userId);
                formData.append("file", imageFile);
                formData.append("prompt", refinedPrompt);
                formData.append("path", "/ai/images/");

                // Upload the image
                const { data } = await nextApi.post(`/api/file`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });

                uploadedImages.push(data.fileRecord);
            }
            catch (error) {
                throw new Error(`Error generating image: ${error.message}`);
            }
        }
        
    if(uploadedImages.length === 0) {
        return res.status(400).json({
            message: "No images generated",
        });
    }

    return res.status(200).json({
      message: "Images generated successfully",
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return res.status(500).json({
      message: "Error generating image",
      error: error.message,
    });
  }
};

export const generateVideoController = async (req, res) => {
  try {
    const {storyOptions, userId} = req.body;
    if(!storyOptions) {
      return res.status(400).json({
        message: "Story options are required",
      });
    }
    if(!userId) {
      return res.status(401).json({
        message: "Unauthorised: User ID is required",
      });
    }

    const storyId = await generateVideoStoryAssets(storyOptions, userId);
    return res.status(200).json({
      message: "Video story generated successfully",
      storyId,
    });
  } catch(error) {
    console.error("Error generating video story:", error);
    return res.status(500).json({
      message: "Error generating video story",
      error: error.message,
    });
  }}
