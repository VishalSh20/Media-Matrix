import { Router } from "express";
import { makeVideoStory } from "../controllers/video.controller.js";

const router = Router();
router.post("/story", makeVideoStory);
export default router;