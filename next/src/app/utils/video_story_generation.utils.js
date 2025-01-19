import { getScenes, getSceneImagePrompts } from "./gemini/gemini.utils.js";
import { generateImage } from "./image_generation.utils";
import axios from "axios";
import { transcribeAudio } from "./transcript.utils.js";
import { uploadAssetScene,uploadFile } from "./uploadToDB.utils.js";

const aspectRatioToWidth = {
  'PORTRAIT': 720,
  'LANDSCAPE': 1280,
  'SQUARE': 1024,
};
const aspectRatioToHeight = {
  'PORTRAIT': 1280,
  'LANDSCAPE': 720,
  'SQUARE': 1024,
};

export async function generateVideoStoryAssets(storyOptions,userId) {
  let storyId = null;
  try {
    console.log("Generating video story assets...");
    const { description, tone, narrator,duration, animationTheme, aspectRatio} = storyOptions;

    // start with making an entry for the story in the database
    const story = await axios.post(`/api/videoStory?userId=${userId}`, {storyOptions:storyOptions});
    storyId = story.data?.id;

    // then, we generate the scenes
    const scenes = await getScenes(description, tone,duration);
    const completeScript = scenes.map(scene => scene.narration).join(" ");
    let currTime = 0;

    // then, we process each scene
    for(let i=0; i<scenes.length; i++) {
      const scene = scenes[i];

      const audioResponse = await axios.get(`/api/audio?text=${scene.narration}&narrator=${narrator}`, {
        responseType: "arraybuffer"
      });
      const audioFile = new File(
        [audioResponse.data],
        `scene-${i}-narration.mp3`,
        { type: 'audio/mp3' }
      );
      const audioTempRecord = await uploadFile({
        file: audioFile,
        userId: userId,
        path: `/ai/stories/${storyId}/temp/audio/`,
        prompt: `${scene.narration}`,
      }); 
      const currentSubtitles = await transcribeAudio(audioTempRecord.url);
      const audioDuration = currentSubtitles.words[currentSubtitles.words.length - 1].end;
      
      const sceneData = {
        videoStoryProjectId: storyId,
        sceneOrder: i,
        description: scene.sceneDescription,
        narration: scene.narration,
        duration: audioDuration,
        startTime: currTime,
      };
      const sceneRecord = (await axios.post("/api/scene", sceneData))?.data;

      
      console.log("Generated scene record: ", i);
      // upload the audio to the database permanently
      const audioRecord = await uploadAssetScene({sceneId: sceneRecord.id,order: i,duration: audioDuration,startTime: currTime},{
        file: audioFile,
        userId: userId,
        path: `/ai/stories/${storyId}/scene/${sceneRecord.id}/audio/`,
        prompt: `${scene.narration}`,
      });

      const subtitlesBlob = new Blob(
        [JSON.stringify(currentSubtitles, null, 2)],
        { type: 'application/json' }
      );
      const subtitlesFile = new File(
        [subtitlesBlob],
        `scene-${i}-transcript.json`,
        { type: 'application/json' }
      );
      const subtitlesRecord = await uploadAssetScene({sceneId: sceneRecord.id,order: i,duration: audioDuration,startTime: currTime},{
        file: subtitlesFile,
        userId: userId,
        path: `/ai/stories/${storyId}/scene/${sceneRecord.id}/transcript/`,
        prompt: `${scene.narration}`,
      });
      
      // delete the temporary audio file
      await axios.delete(`/api/file?userId=${userId}&fileKey=${audioTempRecord.Key || audioTempRecord.key}`);
      
      let imageTime = currTime;
      // generate the images for the scene
      const imagePromptsResponse = await getSceneImagePrompts(scene,completeScript,audioDuration,animationTheme);
      for(let j=0; j<imagePromptsResponse.length; j++){
        const imagePromptResponse = imagePromptsResponse[j];
        const imagePrompt = imagePromptResponse.prompt;
        const imageDuration = imagePromptResponse.duration;
        const imageWidth = aspectRatioToWidth[aspectRatio];
        const imageHeight = aspectRatioToHeight[aspectRatio];
        const imageFile = (await generateImage(imagePrompt,imageWidth,imageHeight))[0];
        const imageFileRecord = await uploadAssetScene({sceneId: sceneRecord.id,order: j,duration: imageDuration,startTime: imageTime},{
          file: imageFile,
          userId: userId,
          path: `/ai/stories/${storyId}/scene/${sceneRecord.id}/images/`,
          prompt: `${scene.narration}`,
        });
        imageTime += imageDuration;
      }

      currTime += audioDuration;
    }

    // set the exact duration of the story
    const updatedStory = await axios.put(`/api/videoStory/`, {
      storyId,
      updates:{
        duration: currTime
      }
    })

     console.log("Video story assets generated successfully!");
     return {
      storyId
     }
  } catch (error) {
    console.error("Error generating video story assets:", error);
    if(storyId) {
          try {
            await axios.delete(`/api/videoStory?storyId=${storyId}`);
          } catch (error) {
            console.error("Error deleting video story:", error);
            throw new Error(`Error while deleting failed story: ${error.message}`);
          }    
      }
    throw new Error(`Failed to generate video story assets: ${error.message}`);
  }
}