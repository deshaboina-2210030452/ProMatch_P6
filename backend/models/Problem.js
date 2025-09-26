import mongoose from "mongoose";

const ProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Easy" },
    tags: { type: [String], default: [] },
    embedding: { type: [Number], default: null }
  },
  { timestamps: true }
);

const Problem = mongoose.model("Problem", ProblemSchema);
export default Problem;
