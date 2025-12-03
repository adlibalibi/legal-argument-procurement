import Proposition from "../models/Proposition.js";
import { getQueryEmbedding } from "./embeddingService.js";
import { cosineSimilarity } from "../utils/similarity.js";

const oppWords = ["not", "no", "deny", "refuse", "overruled"];
const intensityWords = ["strongly", "clearly", "evident", "definitely"];

export const analyzeArgument = async (argumentText, topN = 15) => {
  const propositions = await Proposition.find({}, { proposition: 1, embedding: 1, caseId: 1, section: 1 }).lean();
  if (!propositions?.length) throw new Error("No propositions in DB");

  const queryEmbedding = await getQueryEmbedding(argumentText);

  // Step 1: Semantic search
  const scored = propositions.map(p => ({
    ...p,
    similarity: cosineSimilarity(queryEmbedding, p.embedding)
  }));
  scored.sort((a, b) => b.similarity - a.similarity);
  const relevantProps = scored.slice(0, topN);

  const supporting = [];
  const contradicting = [];

  // Step 2: Keyword + polarity + intensity scoring
  for (const p of relevantProps) {
    let polarityScore = 0;
    const propPolarity = oppWords.some(w => p.proposition.toLowerCase().includes(w));
    const queryPolarity = oppWords.some(w => argumentText.toLowerCase().includes(w));

    // Detect support vs contradict
    const isContradict = propPolarity !== queryPolarity;
    const intensityMultiplier = intensityWords.some(w => p.proposition.toLowerCase().includes(w)) ? 1.2 : 1.0;

    const score = p.similarity * intensityMultiplier;

    if (isContradict) {
      contradicting.push({ ...p, score });
    } else {
      supporting.push({ ...p, score });
    }
  }

  // Step 3: Aggregate strength
  const totalSupport = supporting.reduce((sum, p) => sum + p.score, 0);
  const totalContradict = contradicting.reduce((sum, p) => sum + p.score, 0);
  const strengthScore = Math.max(0, Math.min(100, Math.round(100 * (totalSupport / (totalSupport + totalContradict + 1e-6)))));

  const formatProp = p => ({
    id: p._id,
    caseId: p.caseId || "Unknown",
    section: p.section || "Unknown",
    proposition: p.proposition || "No text available",
    similarity: Number(p.similarity.toFixed(4)),
    score: Number(p.score.toFixed(4))
  });

  return {
    query: argumentText,
    strengthScore,
    supportingPropositions: supporting.map(formatProp),
    contradictingPropositions: contradicting.map(formatProp),
    message:
      strengthScore < 30
        ? "Weak alignment with precedents."
        : strengthScore < 70
        ? "Moderate alignment with precedents."
        : "Strong alignment with legal precedents.",
    recommendations:
      strengthScore < 50
        ? ["Add more legal context, keywords, or citations to strengthen your argument."]
        : ["Argument shows good support from existing precedents."]
  };
};
