import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

// Route imports
import caseRoutes from "./routes/caseRoutes.js";
import propositionRoutes from "./routes/propositionRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import graphRoutes from "./routes/graphRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import analyzeRoutes from "./routes/analyzeRoutes.js";

// Import the analyze function
import { analyzeArgument } from "./services/analyzeArgument.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json({ limit: "50mb" }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Routes
app.use("/api/cases", caseRoutes);
app.use("/api/propositions", propositionRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/graph", graphRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api", analyzeRoutes);

app.get("/", (req, res) => {
  res.send("Legal Debate and Precedent Graph Backend is running.");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
