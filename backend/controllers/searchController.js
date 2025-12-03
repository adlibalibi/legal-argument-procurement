import Proposition from "../models/Proposition.js";
import cosineSimilarity from "cosine-similarity";

/**
 * /search?query=...
 * Returns top matching propositions based on cosine similarity
 */
export const searchPropositions = async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.status(400).json({ error: "Missing query parameter" });

    // Fetch all propositions (with embeddings)
    const propositions = await Proposition.find(
      { embedding: { $exists: true } },
      { proposition: 1, caseId: 1, section: 1, embedding: 1 }
    );

    // Load embeddings into memory
    const allEmbeddings = propositions.map((p) => p.embedding);
    const allTexts = propositions.map((p) => ({
      proposition: p.proposition,
      caseId: p.caseId,
      section: p.section,
    }));

    // For now — quick baseline:
    // We'll get the query embedding from Colab manually
    // (Later we can connect Colab/embedding API here)
    const queryEmbedding = req.body.embedding;
    if (!queryEmbedding)
      return res.status(400).json({ error: "Missing query embedding in request body" });

    // Compute cosine similarity
    const scored = allTexts.map((t, i) => ({
      ...t,
      score: cosineSimilarity(queryEmbedding, allEmbeddings[i]),
    }));

    // Sort by descending similarity
    scored.sort((a, b) => b.score - a.score);

    res.json(scored.slice(0, 10)); // top 10 results
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};
