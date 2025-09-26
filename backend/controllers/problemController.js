// controllers/problemController.js
import Problem from "../models/Problem.js";
import { GoogleGenAI } from "@google/genai";

// Fetch all problems
export const getProblems = async (req, res) => {
  try {
    console.log("data:",req,res);
    
    const problems = await Problem.find();
    console.log(problems);
    res.json(problems);
  } catch (err) {
    console.error("Error fetching problems:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new problem with Gemini embedding
export const createProblem = async (req, res) => {
  try {
    const { title, description, difficulty, tags } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ error: "Title, description, and difficulty are required" });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Generate embedding
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: title,
    });

    const embedding = response.embeddings[0]?.values || [];

    if (!embedding.length) {
      return res.status(500).json({ error: "Failed to generate embedding" });
    }

    // Save problem to MongoDB
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

// Vector search using Gemini embedding and MongoDB Atlas
export const vectorSearch = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    // Generate embedding for query
    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
    });

    const queryEmbedding = response.embeddings[0]?.values || [];
    console.log("Generated query embedding:", queryEmbedding.length, queryEmbedding);


    if (!queryEmbedding.length) {
      return res.status(500).json({ error: "Failed to generate embedding" });
    }

    // MongoDB Atlas vector search
    const results = await Problem.aggregate([
      {
        $vectorSearch: {
            index: "Vector_search",
            queryVector: queryEmbedding,  
            path: "embedding",
            limit: 10 ,
            numCandidates: 100                      
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          difficulty: 1,
          tags: 1,
          embedding: 1,
          score: 1
        }
      }
    ]);

    res.json({ results });
  } catch (err) {
    console.error("Vector search error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
