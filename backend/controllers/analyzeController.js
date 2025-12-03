// backend/controllers/analyzeController.js
import { analyzeArgument } from "../services/analyzeArgument.js";

export const analyzeArgumentController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: "Text input is required." });
    }

    const result = await analyzeArgument(text);
    res.json(result);
  } catch (error) {
    console.error("Error in analyzeArgumentController:", error.message);
    res.status(500).json({ error: "Failed to analyze argument." });
  }
};
