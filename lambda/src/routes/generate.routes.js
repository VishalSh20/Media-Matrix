import { Router } from "express";
import { generateImageController, generateVideoController} from "../controllers/generate.controller.js";

const router = Router();
router.post("/image", generateImageController);
router.post("/video", generateVideoController);
export default router;