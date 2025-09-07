// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// === MongoDB Atlas Connection ===
const mongoURI = process.env.MONGO_URI || "your_atlas_uri_here";

mongoose
  .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// === Judgment Schema ===
const paragraphSchema = new mongoose.Schema({
  text: String,
  role: { type: String, default: null }, // for NLP 
});

const judgmentSchema = new mongoose.Schema({
  caseId: String,
  title: String,
  court: String,
  date: String,
  citations: [String],
  rawText: String,
  paragraphs: [paragraphSchema],
});

const Judgment = mongoose.model("Judgment", judgmentSchema);

// === Routes ===

// Get all cases (ID + title)
app.get("/api/judgments", async (req, res) => {
  try {
    const cases = await Judgment.find({}, { caseId: 1, title: 1 }).limit(50);
    res.json(cases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single case by ID
app.get("/api/judgments/:id", async (req, res) => {
  try {
    const caseDoc = await Judgment.findOne({ caseId: req.params.id });
    if (!caseDoc) {
      return res.status(404).json({ error: "Case not found" });
    }
    res.json(caseDoc);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats endpoint (number of cases in DB)
app.get("/api/stats", async (req, res) => {
  try {
    const count = await Judgment.countDocuments();
    res.json({ totalCases: count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === Start Server ===
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));
