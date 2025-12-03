// backend/routes/analyzeRoutes.js
import express from "express";
import { analyzeArgumentController } from "../controllers/analyzeController.js";

const router = express.Router();

// POST /api/analyze
router.post("/analyze", analyzeArgumentController);

export default router;
