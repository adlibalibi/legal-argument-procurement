import express from "express";
import Proposition from "../models/Proposition.js";
import { cosineSimilarity } from "../utils/similarity.js"; // we'll define this next

const router = express.Router();

// Fallback simple search for testing
router.post("/", async (req, res) => {
  try {
    const propositions = await Proposition.find().limit(5); // just get some for testing

    const { embedding } = req.body || {};

    if (!embedding) {
      return res.status(200).json({
        message: "No embedding provided, returning sample propositions",
        propositions
      });
    }

    // If embedding provided, compute similarities
    const all = await Proposition.find();
    const scored = all.map(p => ({
      caseId: p.caseId,
      proposition: p.proposition,
      similarity: cosineSimilarity(embedding, p.embedding)
    }));

    scored.sort((a, b) => b.similarity - a.similarity);
    res.json(scored.slice(0, 10));

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
