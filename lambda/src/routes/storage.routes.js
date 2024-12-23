import express from "express";
import { getMediaUploadURL,
        getAllMedia,
        renameMedia,
        deleteMedia,
        getContentList,
        createFolder,
        deleteFolder, 
        renameFolder } from "../controllers/storage.controller.js";

const router = express.Router();
router.get("/media", getAllMedia);
router.put("/media", renameMedia);
router.delete("/media", deleteMedia);
router.post("/media", getMediaUploadURL);
router.get("/contents", getContentList);
router.post("/folder", createFolder);
router.put("/folder", renameFolder);
router.delete("/folder", deleteFolder);

export default router;