import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./createProblem.css";

export default function CreateProblem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficulty, setDifficulty] = useState("Easy");
  const [tags, setTags] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();

  const newProblem = {
    title,
    description,
    difficulty,
    tags: tags.split(",").map(tag => tag.trim())
  };

  try {
    const response = await fetch("http://localhost:5000/api/problems", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newProblem)
    });

    if (!response.ok) {
      throw new Error("Failed to save problem");
    }

    const savedProblem = await response.json();
    console.log("Problem saved:", savedProblem);

    // Redirect to search page
    navigate("/search");
  } catch (err) {
    console.error("Error saving problem:", err);
  }
};


  return (
    <div className="cp-container">
      <h1 className="cp-title">➕ Create New Problem</h1>
      <form className="cp-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          placeholder="Enter problem title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Enter problem description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          required
        />

        <label>Difficulty</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>

        <label>Tags (comma separated)</label>
        <input
          type="text"
          placeholder="e.g. arrays, dp, string"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <button type="submit" className="cp-submit">Create Problem</button>
      </form>
    </div>
  );
}
