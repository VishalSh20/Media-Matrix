import { getScenes, getSceneImagePrompts } from "./gemini/gemini.utils.js";
import { generateImage } from "./image_generation.utils.js";
import nextApi from "../axios.config.js";
import { transcribeAudio } from "./transcript.utils.js";
import { uploadAssetScene,uploadAssetStory,uploadFile } from "./uploadToDB.utils.js";
import { aspectRatioToHeight,aspectRatioToWidth } from "../constants.js";

export async function generateVideoStoryAssets(storyOptions,userId) {
  let storyId = null;
  try {
    console.log("Generating video story assets...");
    const { description, tone, narrator,duration, animationTheme, aspectRatio} = storyOptions;

    // start with making an entry for the story in the database
    const story = await nextApi.post(`/api/videoStory?userId=${userId}`, {storyOptions:storyOptions},{
      retry: 3,
      retryDelay: 1000
    });
    storyId = story.data?.id;
    console.log("Generated story record: ", storyId);

    // then, we generate the scenes
    const scenes = await getScenes(description, tone,duration);
    const completeScript = scenes.map(scene => scene.narration).join(" ");
    const audioResponse = await nextApi.get(`/api/audio?text=${completeScript}&narrator=${narrator}`, {
      responseType: "arraybuffer"
    });
    const audioFile = new File(
      [audioResponse.data],
      `story-narration.mp3`,
      { type: 'audio/mp3' }
    );
    const audioFileRecord = await uploadFile({
      file: audioFile,
      userId: userId,
      path: `/ai/stories/${storyId}/audio/`,
      prompt: `${completeScript}`,
    }); 
    const transcript = await transcribeAudio(audioFileRecord.url);
    const audioDuration = transcript.words[transcript.words.length - 1].end;
    // set the exact duration of the story
    await nextApi.put(`/api/videoStory/`, {
      storyId,
      updates:{
        duration: audioDuration
      }
    });
    await nextApi.post("/api/assetStory", {
      storyId,
      fileId:audioFileRecord.id,
      duration:audioDuration,
      startTime:0
    });
    
    const transcriptBlob = new Blob(
      [JSON.stringify(transcript.words, null, 2)],
      { type: 'application/json' }
    );
    const transcriptFile = new File(
      [transcriptBlob],
      `story-transcript.json`,
      { type: 'application/json' }
    );
    const transcriptRecord = await uploadAssetStory({storyId: storyId,duration: audioDuration,startTime: 0},{
      file: transcriptFile,
      userId: userId,
      path: `/ai/stories/${storyId}/transcript/`,
      prompt: `${"transcript for the audio of story:"+storyId}`,
    });

    const sceneDuration = Number((audioDuration/scenes.length).toFixed(0));
    // then, we process each scene
    for(let i=0; i<scenes.length; i++) {
      const scene = scenes[i];  
      const sceneData = {
        videoStoryProjectId: storyId,
        sceneOrder: i,
        description: scene.sceneDescription,
        narration: scene.narration,
        duration: sceneDuration,
        startTime: sceneDuration*i,
      };
      const sceneRecord = (await nextApi.post("/api/scene", sceneData))?.data;
    
      console.log("Generated scene record: ", i);
      
      let imageTime = i*sceneDuration;
      // generate the images for the scene
      const imagePromptsResponse = await getSceneImagePrompts(scene,completeScript,sceneDuration,animationTheme);
      for(let j=0; j<imagePromptsResponse.length; j++){
        const imagePromptResponse = imagePromptsResponse[j];
        const imagePrompt = imagePromptResponse.prompt;
        const imageDuration = imagePromptResponse.duration;
        const imageWidth = aspectRatioToWidth[aspectRatio];
        const imageHeight = aspectRatioToHeight[aspectRatio];
        const imageFile = (await generateImage(imagePrompt,imageWidth,imageHeight))[0];
        await uploadAssetScene({sceneId: sceneRecord.id,order: j,duration: imageDuration,startTime: imageTime},{
          file: imageFile,
          userId: userId,
          path: `/ai/stories/${storyId}/scene/${sceneRecord.id}/images/`,
          prompt: `${scene.narration}`,
        });
        imageTime += imageDuration;
      }
    }
     console.log("Video story assets generated successfully!");
     return storyId;
  } catch (error) {
    console.error("Error generating video story assets:", error);
    if(storyId) {
          try {
            await nextApi.delete(`/api/videoStory?storyId=${storyId}`);
          } catch (error) {
            console.error("Error deleting video story:", error);
            throw new Error(`Error while deleting failed story: ${error.message}`);
          }    
      }
    throw new Error(`Failed to generate video story assets: ${error.message}`);
  }
}