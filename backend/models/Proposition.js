import mongoose from "mongoose";

const propositionSchema = new mongoose.Schema({
  caseId: String,
  section: String,
  proposition: String,
  embedding: [Number],  // Store as vector for semantic search
});

export default mongoose.model("Proposition", propositionSchema);
