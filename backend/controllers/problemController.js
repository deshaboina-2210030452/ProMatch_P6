import Problem from "../models/Problem.js";
import { GoogleGenAI } from "@google/genai";

export const getProblems = async (req, res) => {
  try {
    const problems = await Problem.find();
    res.json(problems);
  } catch (err) {
    console.error("Error fetching problems:", err);
    res.status(500).json({ error: "Server error" });
  }
};


export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, tags } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ error: "Title, description, and difficulty are required" });
    }

    const ai = new GoogleGenAI({});

    const response = await ai.models.embedContent({
        model: 'gemini-embedding-001',
        contents: title,
    });

    const embedding=response.embeddings[0]?.values||[];

    if (!embedding) {
      return res.status(500).json({ error: "Failed to generate embedding" });
    }

    // 🔹 Step 2: Save problem to DB
    const problem = new Problem({
      title,
      description,
      difficulty,
      tags,
      embedding,
    });

    await problem.save();
    res.status(201).json(problem);

  } catch (err) {
    console.error("Error creating problem:", err);
    res.status(500).json({ error: "Server error" });
  }
};
