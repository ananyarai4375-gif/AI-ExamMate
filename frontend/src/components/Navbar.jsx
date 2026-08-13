import { BookOpen, Brain } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <span className="logo-icon">
          <Brain size={21} />
        </span>

        <span>
          AI <strong>ExamMate</strong>
        </span>
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/upload">Study</Link>
      </div>
    </nav>
  );
}

export default Navbar;