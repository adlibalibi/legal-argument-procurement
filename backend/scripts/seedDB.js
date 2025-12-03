import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import Case from "../models/Case.js";
import Proposition from "../models/Proposition.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const casesData = JSON.parse(fs.readFileSync("./data/processed_cases.json", "utf-8"));
const propositionsData = JSON.parse(fs.readFileSync("./data/propositions_with_embeddings.json", "utf-8"));

const seedDatabase = async () => {
  try {
    await Case.deleteMany({});
    await Proposition.deleteMany({});
    await Case.insertMany(casesData);
    await Proposition.insertMany(propositionsData);
    console.log("Database seeded successfully");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
};

seedDatabase();
