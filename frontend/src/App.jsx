import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Upload from "./pages/Upload";
import Dashboard from "./pages/Dashboard";
import Questions from "./pages/Questions";
import QuestionTools from "./pages/QuestionTools";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/question-tools" element={<QuestionTools />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;