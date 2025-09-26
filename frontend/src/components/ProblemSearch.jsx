import { useState, useEffect } from "react";
import mockData from "../mockData";
import "./search.css";

export default function ProblemSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(mockData);
  const [showTags, setShowTags] = useState({});

  const fetchDataFromAPI = async () => {
    try {
      const response = await fetch("https://your-api-url.com/problems");
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setResults(data);
    } catch (err) {
      console.error("API fetch error:", err);
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const handleSearch = () => {
    if (!query.trim()) {
      setResults(mockData);
      return;
    }
    const filtered = mockData.filter((p) =>
      (p.title + " " + (p.description || "") + " " + ((p.tags && p.tags.join(" ")) || ""))
        .toLowerCase()
        .includes(query.toLowerCase())
    );
    setResults(filtered);
  };

  const toggleTags = (id) => {
    setShowTags((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="ps-container">
      <h1 className="ps-title">🔎 Hi, I'm a Robot</h1>

      <div className="ps-search-bar">
        <input
          type="text"
          placeholder="Type problem description..."
          className="ps-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="ps-button" onClick={handleSearch}>
          Search
        </button>
      </div>

      <div className="ps-results-box">
        <table className="ps-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Title</th>
              <th>Difficulty</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan="4" style={{ textAlign: "center", padding: "1rem" }}>
                  No results found.
                </td>
              </tr>
            ) : (
              results.map((r, index) => (
                <tr key={r.id}>
                  <td>{index + 1}</td>
                  <td>{r.title}</td>
                  <td className={`ps-diff-${r.difficulty.toLowerCase()}`}>
                    {r.difficulty}
                  </td>
                  <td>
                    <button className="tag-btn" onClick={() => toggleTags(r.id)}>
                      {showTags[r.id] ? "Hide Tags" : "Show Tags"}
                    </button>
                    {showTags[r.id] && (
                      <div className="tag-popup">
                        {Array.isArray(r.tags) ? r.tags.join(", ") : r.tags || "No tags"}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
