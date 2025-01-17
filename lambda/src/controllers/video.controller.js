import {getScenes,getSceneImagePrompts} from "../utils/gemini/gemini.utils.js";


export async function makeVideoStory(req,res){
    try {
        const {description,tone,duration,narrator,animationTheme} = req.body;
        if([description,tone,duration,narrator,animationTheme].includes(undefined)){
            return res.status(400).json({message:"Missing required fields"});
        }
        const scenes = await getScenes(description,tone,duration);
        console.log(scenes);
        return res.status(200).json({scenes});
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({message:"Internal Server Error:"+error.message});
    }
}