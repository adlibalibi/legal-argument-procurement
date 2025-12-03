import mongoose from "mongoose";
import Proposition from "../models/Proposition.js";
import { cosineSimilarity } from "../utils/similarity.js";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to DB"))
  .catch(err => console.error(err));

async function inferRelationships() {
  const propositions = await Proposition.find();

  const edges = [];
  const THRESH_SUPPORT = 0.82; // can be modified based on desired sensitivity
  const THRESH_CONTRADICT = 0.75; // opposite polarity

  for (let i = 0; i < propositions.length; i++) {
    const p1 = propositions[i];

    for (let j = i + 1; j < propositions.length; j++) {
      const p2 = propositions[j];
      const sim = cosineSimilarity(p1.embedding, p2.embedding);

      if (sim > THRESH_SUPPORT) {
        edges.push({
          source: p1._id,
          target: p2._id,
          type: "supports",
          similarity: sim,
        });
      } else if (sim > THRESH_CONTRADICT && sim <= THRESH_SUPPORT) {
        const oppWords = ["not", "no", "deny", "refuse", "overruled"];
        const contradict =
          oppWords.some(w => p1.proposition.toLowerCase().includes(w)) !==
          oppWords.some(w => p2.proposition.toLowerCase().includes(w));

        if (contradict) {
          edges.push({
            source: p1._id,
            target: p2._id,
            type: "contradicts",
            similarity: sim,
          });
        }
      }
    }
  }

  console.log(`Generated ${edges.length} edges`);

  const db = mongoose.connection.db;
  const relCol = db.collection("relationships");
  await relCol.deleteMany({});
  await relCol.insertMany(edges);

  console.log("Relationships seeded successfully!");
  process.exit();
}

inferRelationships();
