import express from "express";
import fetch from "node-fetch";
import Proposition from "../models/Proposition.js";
import Case from "../models/Case.js";

const router = express.Router();

// Cosine similarity
function cosineSim(v1, v2) {
  const dot = v1.reduce((sum, val, i) => sum + val * v2[i], 0);
  const mag1 = Math.sqrt(v1.reduce((sum, val) => sum + val * val, 0));
  const mag2 = Math.sqrt(v2.reduce((sum, val) => sum + val * val, 0));
  return dot / (mag1 * mag2);
}

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { query } = req.body;
    if (!query) return res.status(400).json({ error: "Query text missing" });

    // Step 1: Embed user query
    const embedRes = await fetch("http://localhost:6000/embed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: query }),
    });
    const embedData = await embedRes.json();
    if (!embedData.embedding) throw new Error("Embedding service failed");
    const queryEmbedding = embedData.embedding;

    // Step 2: Fetch propositions (only those with embeddings)
    const propositions = await Proposition.find({
      embedding: { $exists: true, $ne: [] },
    });

    // Step 3: Compute similarities
    const scored = propositions.map((p) => ({
      id: p._id,
      caseId: p.caseId,
      proposition: p.proposition,
      similarity: cosineSim(queryEmbedding, p.embedding),
    }));

    // Step 4: Sort and get top 5
    const top = scored.sort((a, b) => b.similarity - a.similarity).slice(0, 5);

    // Step 5: Fetch related cases
    const caseIds = top.map((t) => t.caseId);
    const cases = await Case.find({ caseId: { $in: caseIds } });

    // Step 6: Create friendly chatbot response
    const responseText = [
      `Here are ${top.length} propositions most relevant to your query:`,
      ...top.map((t, i) => {
        const linked = cases.find((c) => c.caseId === t.caseId);
        const title = linked ? linked.title || linked.caseId : "Unknown Case";
        return `${i + 1}. “${t.proposition}” — from *${title}* (${t.similarity.toFixed(2)})`;
      }),
    ].join("\n");

    res.json({
      query,
      response: responseText,
      topMatches: top,
      relatedCases: cases,
    });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

export default router;
