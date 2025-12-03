import express from "express";
import Proposition from "../models/Proposition.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

const router = express.Router();

// Get all propositions
router.get("/", async (req, res) => {
  const props = await Proposition.find();
  res.json(props);
});

// GET a single proposition by ID
router.get('/:id', async (req, res) => {
  try {
    const proposition = await Proposition.findById(req.params.id);
    if (!proposition) {
      return res.status(404).json({ message: 'Proposition not found' });
    }
    res.status(200).json(proposition);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Semantic search
router.post('/search', async (req, res) => {
  try {
    if (!req.body || !req.body.queryEmbedding) {
      return res.status(400).json({ 
        error: 'Missing required queryEmbedding in request body' 
      });
    }

    const { queryEmbedding, topK = 5 } = req.body;

    // Verify queryEmbedding is an array
    if (!Array.isArray(queryEmbedding)) {
      return res.status(400).json({
        error: 'queryEmbedding must be an array'
      });
    }    
    const similarPropositions = await Proposition.aggregate([
      {
        $vectorSearch: {
          queryVector: queryEmbedding,
          path: "embedding",
          numCandidates: 100,
          limit: topK,
          index: "vector_index",
        },
      },
   ]);

    res.json(similarPropositions);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;