import { useState, useEffect } from "react";
import "./search.css";
import { FaArrowUp } from "react-icons/fa";

export default function ProblemSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [allData, setAllData] = useState([]);
  const [showTags, setShowTags] = useState({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/problems");
        const data = await response.json();
        setResults(data);
        setAllData(data);
      } catch (err) {
        console.error("Error fetching problems:", err);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      const response = await fetch("http://localhost:5000/api/problems/search/vector", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: query || "default" }),
      });
      const data = await response.json();
      setResults(data.results || []);
      return;
    }

    const filtered = allData.filter((p) =>
      (p.title + " " + (p.description || "") + " " + ((p.tags && p.tags.join(" ")) || ""))
        .toLowerCase()
        .includes(query.toLowerCase())
    );

    setResults(filtered);
  };

  const toggleTags = (index) => {
    setShowTags((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  // Show/hide arrow when scrolling
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="ps-container">
      <h1 className="ps-title">🔎 Problem Search Robot</h1>

      <div className="ps-search-bar">
        <input
          type="text"
          placeholder="Search by title, description, or tags..."
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
              <th>Description</th>
              <th>Difficulty</th>
              <th>Tags</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "1rem" }}>
                  No results found.
                </td>
              </tr>
            ) : (
              results.map((r, index) => (
                <tr key={index} className="ps-row">
                  <td>{index + 1}</td>
                  <td>{r.title}</td>
                  <td>{r.description}</td>
                  <td className={`ps-diff-${r.difficulty.toLowerCase()}`}>
                    {r.difficulty}
                  </td>
                  <td>
                    {Array.isArray(r.tags) && r.tags.length > 0 ? (
                      <>
                        <button className="tag-btn" onClick={() => toggleTags(index)}>
                          {showTags[index] ? "Hide Tags" : "Show Tags"}
                        </button>
                        {showTags[index] && (
                          <div className="tag-popup">{r.tags.join(", ")}</div>
                        )}
                      </>
                    ) : (
                      <span className="no-tags">—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Scroll-to-top arrow */}
      {isVisible && (
        <div className="scroll-to-top" onClick={scrollToTop}>
          <FaArrowUp />
        </div>
      )}
    </div>
  );
}
