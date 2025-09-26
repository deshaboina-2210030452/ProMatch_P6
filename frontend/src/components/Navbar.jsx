import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">Problem App</h2>
      <ul className="nav-links">
        <li><Link to="/">Search</Link></li>
        <li><Link to="/create">Create</Link></li>
      </ul>
    </nav>
  );
}
