import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CreateProblem from "./components/CreateProblem";
import ProblemSearch from "./components/ProblemSearch";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<ProblemSearch />} />
        <Route path="/create" element={<CreateProblem />} />
      </Routes>
    </Router>
  );
}

export default App;
