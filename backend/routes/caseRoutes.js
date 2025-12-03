import express from "express";
import Case from "../models/Case.js";

const router = express.Router();

// Get all cases
router.get("/", async (req, res) => {
  const cases = await Case.find();
  res.json(cases);
});

// Get one case by ID
router.get("/:caseId", async (req, res) => {
  const { caseId } = req.params;
  const found = await Case.findOne({ caseId });
  if (!found) return res.status(404).json({ message: "Case not found" });
  res.json(found);
});

export default router;
