import { useState } from "react";

const API_URL = "http://127.0.0.1:8000";

function QuestionCard({ question, material }) {
  const [loading, setLoading] = useState("");
  const [result, setResult] = useState(null);

  // ============================================================
  // CLEAN AI TEXT
  // Removes unnecessary markdown characters such as **
  // without changing the actual content.
  // ============================================================

  const cleanText = (text) => {
    if (!text) return "";

    return String(text)
      .replace(/\*\*/g, "")
      .replace(/__/g, "")
      .replace(/^#+\s*/gm, "")
      .replace(/^[-*]\s+/gm, "• ")
      .trim();
  };

  // ============================================================
  // COMMON API ERROR HANDLER
  // ============================================================

  const handleApiError = async (response) => {
    let message = "Something went wrong.";

    try {
      const data = await response.json();

      if (data.detail) {
        message =
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail);
      }
    } catch {
      message = `Server error: ${response.status}`;
    }

    throw new Error(message);
  };

  // ============================================================
  // MAKE EASIER
  // ============================================================

  const makeEasier = async () => {
    setLoading("easier");
    setResult(null);

    try {
      const formData = new URLSearchParams();

      formData.append("question", question.question);
      formData.append(
        "material",
        material || question.question
      );

      const response = await fetch(
        `${API_URL}/simplify-question`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();

      setResult({
        type: "easier",
        title: "Easier Version",
        content: cleanText(data.result.simple_question),
        explanation: cleanText(data.result.simple_explanation),
        keyPoints: (data.result.key_points || []).map(cleanText),
      });
    } catch (error) {
      console.error("Make Easier Error:", error);

      setResult({
        type: "error",
        title: "Unable to generate",
        content:
          error.message ||
          "Unable to make the question easier. Please try again.",
      });
    } finally {
      setLoading("");
    }
  };

  // ============================================================
  // EXPLAIN QUESTION
  // ============================================================

  const explainQuestion = async () => {
    setLoading("explain");
    setResult(null);

    try {
      const formData = new URLSearchParams();

      formData.append("question", question.question);
      formData.append(
        "material",
        material || question.question
      );

      const response = await fetch(
        `${API_URL}/explain-question`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();

      setResult({
        type: "explain",
        title: "Explanation",
        content: cleanText(data.result.explanation),
        concepts: (data.result.key_concepts || []).map(cleanText),
        example: cleanText(data.result.example || ""),
      });
    } catch (error) {
      console.error("Explain Question Error:", error);

      setResult({
        type: "error",
        title: "Unable to generate",
        content:
          error.message ||
          "Unable to explain the question. Please try again.",
      });
    } finally {
      setLoading("");
    }
  };

  // ============================================================
  // EXAM ANSWER
  // ============================================================

  const generateExamAnswer = async () => {
    setLoading("answer");
    setResult(null);

    try {
      const selectedMarks = Number(question.marks);

      if (!selectedMarks) {
        throw new Error(
          "Marks are missing for this question. Please generate the questions again."
        );
      }

      const formData = new URLSearchParams();

      formData.append("question", question.question);

      formData.append(
        "marks",
        String(selectedMarks)
      );

      formData.append(
        "material",
        material || question.question
      );

      console.log("Generating Exam Answer:", {
        question: question.question,
        marks: selectedMarks,
      });

      const response = await fetch(
        `${API_URL}/exam-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: formData.toString(),
        }
      );

      if (!response.ok) {
        await handleApiError(response);
      }

      const data = await response.json();

      console.log("Exam Answer Response:", data);

      setResult({
        type: "answer",
        title: `${data.result.marks}-Mark Exam Answer`,
        content: cleanText(data.result.answer),
        keyPoints: (
          data.result.key_points_to_remember || []
        ).map(cleanText),
      });
    } catch (error) {
      console.error("Exam Answer Error:", error);

      setResult({
        type: "error",
        title: "Unable to generate",
        content:
          error.message ||
          "Unable to generate the exam answer. Please try again.",
      });
    } finally {
      setLoading("");
    }
  };

  // ============================================================
  // LOADING TEXT
  // ============================================================

  const getLoadingText = (type) => {
    if (type === "easier") {
      return "Making Easier...";
    }

    if (type === "explain") {
      return "Explaining...";
    }

    if (type === "answer") {
      return `Generating ${question.marks}-Mark Answer...`;
    }

    return "Loading...";
  };

  // ============================================================
  // COMPONENT
  // ============================================================

  return (
    <div className="question-card">

      {/* QUESTION */}
      <div className="question-header">
        <h3>{question.question}</h3>
      </div>

      {/* TOPIC */}
      {question.topic && (
        <p className="question-topic">
          <strong>Topic:</strong>{" "}
          {question.topic}
        </p>
      )}

      {/* DIFFICULTY + MARKS */}
      <div className="question-meta">

        {question.difficulty && (
          <span className="difficulty-badge">
            {question.difficulty}
          </span>
        )}

        {question.marks && (
          <span className="original-marks">
            {question.marks} Marks
          </span>
        )}

      </div>

      {/* ACTIONS */}
      <div className="question-actions">

        <button
          type="button"
          onClick={makeEasier}
          disabled={loading !== ""}
        >
          {loading === "easier"
            ? getLoadingText("easier")
            : "Make Easier"}
        </button>

        <button
          type="button"
          onClick={explainQuestion}
          disabled={loading !== ""}
        >
          {loading === "explain"
            ? getLoadingText("explain")
            : "Explain"}
        </button>

        <button
          type="button"
          onClick={generateExamAnswer}
          disabled={loading !== ""}
        >
          {loading === "answer"
            ? getLoadingText("answer")
            : "Exam Answer"}
        </button>

      </div>

      {/* RESULT */}
      {result && (
        <div className="question-result">

          <div className="result-header">
            <h3>{result.title}</h3>
          </div>

          {/* ERROR */}
          {result.type === "error" && (
            <div className="error-message">
              {result.content}
            </div>
          )}

          {/* EASIER */}
          {result.type === "easier" && (
            <div>

              <h4>Simplified Question</h4>

              <p className="result-main">
                {result.content}
              </p>

              {result.explanation && (
                <>
                  <h4>Simple Explanation</h4>

                  <p>
                    {result.explanation}
                  </p>
                </>
              )}

              {result.keyPoints &&
                result.keyPoints.length > 0 && (
                  <>
                    <h4>Key Points</h4>

                    <ul>
                      {result.keyPoints.map(
                        (point, index) => (
                          <li key={index}>
                            {point}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}

            </div>
          )}

          {/* EXPLANATION */}
          {result.type === "explain" && (
            <div>

              <h4>Explanation</h4>

              <div className="explanation-text">
                {result.content
                  .split("\n")
                  .map((line, index) => (
                    <p key={index}>
                      {line || "\u00A0"}
                    </p>
                  ))}
              </div>

              {result.concepts &&
                result.concepts.length > 0 && (
                  <>
                    <h4>Key Concepts</h4>

                    <ul>
                      {result.concepts.map(
                        (concept, index) => (
                          <li key={index}>
                            {concept}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}

              {result.example && (
                <>
                  <h4>Example</h4>

                  <p>
                    {result.example}
                  </p>
                </>
              )}

            </div>
          )}

          {/* EXAM ANSWER */}
          {result.type === "answer" && (
            <div>

              <div className="exam-answer">
                {result.content
                  .split("\n")
                  .map((line, index) => (
                    <p key={index}>
                      {line || "\u00A0"}
                    </p>
                  ))}
              </div>

              {result.keyPoints &&
                result.keyPoints.length > 0 && (
                  <>
                    <h4>
                      Key Points to Remember
                    </h4>

                    <ul>
                      {result.keyPoints.map(
                        (point, index) => (
                          <li key={index}>
                            {point}
                          </li>
                        )
                      )}
                    </ul>
                  </>
                )}

            </div>
          )}

        </div>
      )}

    </div>
  );
}

export default QuestionCard;