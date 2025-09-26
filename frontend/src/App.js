import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateProblem from "./components/CreateProblem";
import ProblemSearch from "./components/ProblemSearch";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CreateProblem />} />
        <Route path="/search" element={<ProblemSearch />} />
      </Routes>
    </Router>
  );
}

export default App;
