import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  caseId: { type: String, unique: true },
  summary: {
    Facts: String,
    Issues: String,
    Reasoning: String,
    Decision: String,
  }
});

export default mongoose.model("Case", caseSchema);
