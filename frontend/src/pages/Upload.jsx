import { useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  FileSearch,
  UploadCloud,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import UploadCard from "../components/UploadCard";
import Loading from "../components/Loading";
import { analyzeMaterial } from "../services/api";

function Upload() {
  const navigate = useNavigate();

  const [subject, setSubject] = useState("");
  const [examDate, setExamDate] = useState("");
  const [dailyHours, setDailyHours] = useState(3);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    if (!subject.trim()) {
      setError("Please enter your subject.");
      return;
    }

    if (!examDate) {
      setError("Please select your exam date.");
      return;
    }

    if (!file) {
      setError("Please upload a PDF.");
      return;
    }

    try {
      setError("");
      setLoading(true);

      const result = await analyzeMaterial({
        subject,
        examDate,
        dailyHours,
        file,
      });

      navigate("/dashboard", {
        state: {
          result,
          file,
          subject,
          examDate,
          dailyHours,
        },
      });
    } catch (err) {
      setError(
        err.message || "Unable to analyze your material."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="upload-page">

      {/* Background */}
      <div className="upload-glow upload-glow-one"></div>
      <div className="upload-glow upload-glow-two"></div>


      {/* PAGE HEADER */}
      <section className="upload-header">

        <div className="hero-badge">
          <FileSearch size={16} />
          STUDY SETUP
        </div>

        <h1>
          Let's prepare for
          <br />
          <span>your exam.</span>
        </h1>

        <p>
          Tell us about your exam and upload your study material.
          AI will organize everything you need for preparation.
        </p>

      </section>


      {/* MAIN FORM CARD */}
      <form
        className="study-form-card"
        onSubmit={handleSubmit}
      >

        {/* FORM HEADER */}
        <div className="form-card-header">

          <div>
            <div className="form-label">
              STEP 01
            </div>

            <h2>Tell us about your exam</h2>

            <p>
              Provide a few details so we can personalize
              your preparation.
            </p>
          </div>

          <div className="form-header-icon">
            <FileSearch size={26} />
          </div>

        </div>


        {/* INPUTS */}
        <div className="study-input-grid">

          {/* Subject */}
          <div className="study-input-group">

            <label>
              Subject
            </label>

            <div className="input-wrapper">

              <FileSearch size={18} />

              <input
                type="text"
                placeholder="e.g. Machine Learning"
                value={subject}
                onChange={(e) =>
                  setSubject(e.target.value)
                }
              />

            </div>

          </div>


          {/* Exam Date */}
          <div className="study-input-group">

            <label>
              Exam Date
            </label>

            <div className="input-wrapper">

              <CalendarDays size={18} />

              <input
                type="date"
                value={examDate}
                onChange={(e) =>
                  setExamDate(e.target.value)
                }
              />

            </div>

          </div>


          {/* Daily Hours */}
          <div className="study-input-group">

            <label>
              Daily Study Hours
            </label>

            <div className="input-wrapper">

              <Clock3 size={18} />

              <input
                type="number"
                min="1"
                max="16"
                step="0.5"
                value={dailyHours}
                onChange={(e) =>
                  setDailyHours(e.target.value)
                }
              />

              <span className="input-suffix">
                hrs/day
              </span>

            </div>

          </div>

        </div>


        {/* UPLOAD SECTION */}
        <div className="upload-section">

          <div className="upload-section-header">

            <div>
              <div className="form-label">
                STEP 02
              </div>

              <h2>Upload your study material</h2>

              <p>
                Add the PDF containing your notes,
                syllabus or study material.
              </p>
            </div>

            <div className="upload-icon">
              <UploadCloud size={25} />
            </div>

          </div>


          <UploadCard
            file={file}
            setFile={setFile}
          />

        </div>


        {/* ERROR */}
        {error && (
          <div className="form-error">
            {error}
          </div>
        )}


        {/* BOTTOM */}
        <div className="form-bottom">

          <div className="form-security">

            <CheckCircle2 size={17} />

            <span>
              PDF only • Maximum 10 MB
            </span>

          </div>


          {loading ? (
            <Loading
              text="AI is analyzing your material..."
            />
          ) : (
            <button
              className="gold-btn analyze-btn"
              type="submit"
            >
              Analyze Material
              <ArrowRight size={19} />
            </button>
          )}

        </div>

      </form>


      {/* HELPER CARDS */}
      <section className="upload-tips">

        <div className="tip-card">
          <span>01</span>
          <div>
            <strong>Upload your notes</strong>
            <p>
              Use your class notes, textbook material
              or syllabus PDF.
            </p>
          </div>
        </div>

        <div className="tip-card">
          <span>02</span>
          <div>
            <strong>Let AI analyze</strong>
            <p>
              Important topics and preparation content
              will be generated automatically.
            </p>
          </div>
        </div>

        <div className="tip-card">
          <span>03</span>
          <div>
            <strong>Start practicing</strong>
            <p>
              Generate questions and prepare
              exam-ready answers.
            </p>
          </div>
        </div>

      </section>

    </main>
  );
}

export default Upload;