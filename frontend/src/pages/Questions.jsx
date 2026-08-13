import { useState } from "react";
import {
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";
import { useLocation } from "react-router-dom";

import QuestionCard from "../components/QuestionCard";
import Loading from "../components/Loading";

import {
  generateQuestions,
} from "../services/api";

function Questions() {
  const location = useLocation();
  const data = location.state;

  const [difficulty, setDifficulty] = useState("All");
  const [marks, setMarks] = useState("All");
  const [number, setNumber] = useState(10);

  const [questions, setQuestions] = useState([]);
  const [material, setMaterial] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!data) {
    return (
      <main className="page">
        <h1>Please upload your material first.</h1>
      </main>
    );
  }

  async function handleGenerate() {
    try {
      setError("");
      setQuestions([]);
      setLoading(true);

      const result = await generateQuestions({
        subject: data.subject,
        difficulty,
        marks,
        numberOfQuestions: number,
        file: data.file,
      });

      setQuestions(result.questions || []);

      setMaterial(result.material || "");
    } catch (err) {
      console.error("Question Generation Error:", err);

      setError(
        err.message ||
        "Unable to generate questions."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page">

      {/* PAGE HEADING */}
      <div className="page-heading">

        <span className="eyebrow">
          <Sparkles size={16} />
          AI Question Generator
        </span>

        <h1>
          Practice exactly what you need.
        </h1>

        <p>
          Choose the difficulty, marks and number
          of questions for your exam preparation.
        </p>

      </div>

      {/* QUESTION SETTINGS */}
      <div className="question-controls">

        <div className="controls-title">
          <SlidersHorizontal size={20} />
          <strong>
            Question Settings
          </strong>
        </div>

        <div className="control-grid">

          {/* DIFFICULTY */}
          <div className="input-group">

            <label>
              Difficulty
            </label>

            <select
              value={difficulty}
              onChange={(e) =>
                setDifficulty(e.target.value)
              }
              disabled={loading}
            >
              <option value="All">
                All
              </option>

              <option value="Easy">
                Easy
              </option>

              <option value="Medium">
                Medium
              </option>

              <option value="Hard">
                Hard
              </option>
            </select>

          </div>

          {/* MARKS */}
          <div className="input-group">

            <label>
              Marks
            </label>

            <select
              value={marks}
              onChange={(e) =>
                setMarks(e.target.value)
              }
              disabled={loading}
            >
              <option value="All">
                All
              </option>

              <option value="5">
                5 Marks
              </option>

              <option value="7">
                7 Marks
              </option>

              <option value="10">
                10 Marks
              </option>
            </select>

          </div>

          {/* NUMBER */}
          <div className="input-group">

            <label>
              Number of Questions
            </label>

            <select
              value={number}
              onChange={(e) =>
                setNumber(
                  Number(e.target.value)
                )
              }
              disabled={loading}
            >
              <option value={5}>
                5
              </option>

              <option value={10}>
                10
              </option>

              <option value={15}>
                15
              </option>

              <option value={20}>
                20
              </option>
            </select>

          </div>

        </div>

        {/* GENERATE */}
        <button
          className="primary-btn generate-btn"
          onClick={handleGenerate}
          disabled={loading}
        >
          <Sparkles size={18} />

          {loading
            ? "Generating..."
            : "Generate Questions"}
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <Loading
          text="Generating questions from your material..."
        />
      )}

      {/* QUESTIONS */}
      {!loading &&
        questions.length > 0 && (
          <section className="questions-section">

            <div className="section-heading">

              <div>

                <span className="section-label">
                  Generated
                </span>

                <h2>
                  Practice Questions
                </h2>

              </div>

              <span className="question-count">
                {questions.length} Questions
              </span>

            </div>

            <div className="questions-list">

              {questions.map(
                (question, index) => (
                  <QuestionCard
                    key={`${index}-${question.question}`}
                    question={question}
                    material={material}
                  />
                )
              )}

            </div>

          </section>
        )}

    </main>
  );
}

export default Questions;