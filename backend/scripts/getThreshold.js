import Proposition from "../models/Proposition.js";
import { cosineSimilarity } from "../utils/similarity.js";

/**
 * Compute empirical similarity threshold for supporting arguments
 * @param {number} sampleSize - number of random proposition pairs to sample
 * @returns {Promise<number>} suggested support threshold
 */
export async function suggestSupportThreshold(sampleSize = 1000) {
  try {
    // 1️⃣ Fetch all propositions with embeddings
    const propositions = await Proposition.find({}, { embedding: 1 }).lean();
    if (!propositions.length) throw new Error("No propositions found in DB");

    // 2️⃣ Sample random pairs
    const sims = [];
    for (let i = 0; i < sampleSize; i++) {
      const idxA = Math.floor(Math.random() * propositions.length);
      let idxB = Math.floor(Math.random() * propositions.length);
      while (idxB === idxA) idxB = Math.floor(Math.random() * propositions.length);

      const embA = propositions[idxA].embedding;
      const embB = propositions[idxB].embedding;

      const sim = cosineSimilarity(embA, embB);
      sims.push(sim);
    }

    // 3️⃣ Compute statistics
    const meanSim = sims.reduce((a, b) => a + b, 0) / sims.length;
    const sorted = sims.sort((a, b) => a - b);
    const percentile90 = sorted[Math.floor(0.9 * sorted.length)]; // top 10% as “signal”

    console.log(`Mean similarity (noise floor): ${meanSim.toFixed(4)}`);
    console.log(`90th percentile similarity: ${percentile90.toFixed(4)}`);

    // 4️⃣ Suggest threshold slightly above noise floor
    const suggestedThreshold = Math.max(meanSim + 0.01, percentile90 * 0.6);
    console.log(`Suggested support threshold: ${suggestedThreshold.toFixed(4)}`);

    return suggestedThreshold;
  } catch (err) {
    console.error("Error suggesting support threshold:", err);
    throw err;
  }
}

