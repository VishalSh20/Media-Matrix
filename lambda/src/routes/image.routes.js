import express from "express";
import { generateImages } from "../controllers/image.controller.js";

const router = express.Router();
router.post("/generate",generateImages);

export default router;


