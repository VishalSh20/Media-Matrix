import nextApi from "../axios.config.js";

export const uploadAssetScene = async (assetDetails,fileDetails) => {
  try {
    const {sceneId,order,duration,startTime} = assetDetails;
    const {file,userId,path,prompt} = fileDetails;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("path", path);
    formData.append("prompt", prompt);
    const fileUploadResponse = await nextApi.post("/api/file", formData,{
      headers:{
        "Content-Type": "multipart/form-data",
      }
    });
    const fileRecord = fileUploadResponse.data?.fileRecord;
    const fileId = fileRecord.id;

    const response = await nextApi.post("/api/assetScene", {
      sceneId,
      fileId,
      order,
      duration,
      startTime
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading asset-scene association:", error.message);
    throw error;
  }
};

export const uploadAssetStory = async (assetDetails,fileDetails) => {
  try {
    const {storyId,duration,startTime} = assetDetails;
    const {file,userId,path,prompt} = fileDetails;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("path", path);
    formData.append("prompt", prompt);
    const fileUploadResponse = await nextApi.post("/api/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    const fileRecord = fileUploadResponse.data?.fileRecord;
    const fileId = fileRecord.id;

    const response = await nextApi.post("/api/assetStory", {
      storyId,
      fileId,
      duration,
      startTime
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading asset-scene association:", error.message);
    throw error;
  }
};



export const uploadFile = async (fileDetails) => {
  try {
    const {file,userId,path,prompt} = fileDetails;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("path", path);
    formData.append("prompt", prompt);
    const response = await nextApi.post("/api/file", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      }
    });
    return response.data?.fileRecord;
  } catch (error) {
    console.error("Error uploading file:", error.message);
    throw error;
  }
};