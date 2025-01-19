import axios from "axios";

export const uploadAssetScene = async (assetDetails,fileDetails) => {
  try {
    const {sceneId,order,duration,startTime} = assetDetails;
    const {file,userId,path,prompt} = fileDetails;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("userId", userId);
    formData.append("path", path);
    formData.append("prompt", prompt);
    const fileUploadResponse = await axios.post("/api/file", formData);
    const fileRecord = fileUploadResponse.data?.fileRecord;
    const fileId = fileRecord.id;

    const response = await axios.post("/api/assetScene", {
      sceneId,
      fileId,
      order,
      duration,
      startTime
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading asset-scene association:", error);
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
    const response = await axios.post("/api/file", formData);
    return response.data?.fileRecord;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
};