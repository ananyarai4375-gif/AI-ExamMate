import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  FileText,
  GraduationCap,
  Sparkles,
  Target,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <main className="home-page">

      {/* Background decorations */}
      <div className="home-glow glow-one"></div>
      <div className="home-glow glow-two"></div>

      {/* HERO SECTION */}
      <section className="hero-section">

        <div className="hero-content">

          <div className="hero-badge">
            <Sparkles size={16} />
            AI-powered exam preparation
          </div>

          <h1>
            Study smarter.
            <br />
            <span>Prepare better.</span>
          </h1>

          <p className="hero-description">
            Turn your study material into organized notes, practice
            questions, simple explanations and exam-ready answers.
          </p>

          <div className="hero-buttons">
            <button
              className="gold-btn"
              onClick={() => navigate("/upload")}
            >
              Start Preparing
              <ArrowRight size={20} />
            </button>

            <button
              className="outline-btn"
              onClick={() => {
                document
                  .getElementById("how-it-works")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <BookOpen size={19} />
              Explore
            </button>
          </div>

          {/* Small stats */}
          <div className="hero-stats">

            <div className="stat-item">
              <div className="stat-icon">
                <Brain size={20} />
              </div>

              <div>
                <strong>AI Powered</strong>
                <span>Smart study assistance</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <BookOpen size={20} />
              </div>

              <div>
                <strong>4+ Study Tools</strong>
                <span>Everything in one place</span>
              </div>
            </div>

            <div className="stat-item">
              <div className="stat-icon">
                <GraduationCap size={20} />
              </div>

              <div>
                <strong>Exam Focused</strong>
                <span>Prepare with confidence</span>
              </div>
            </div>

          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="hero-visual">

          <div className="book-stack">

            <div className="floating-card card-top">
              <Sparkles size={18} />
              <span>AI Study Assistant</span>
            </div>

            <div className="book book-back"></div>

            <div className="book book-middle"></div>

            <div className="book book-front">
              <div className="book-symbol">
                <GraduationCap size={44} />
              </div>

              <div className="book-title">
                AI
                <br />
                EXAM
                <br />
                MATE
              </div>

              <div className="book-line"></div>

              <span>STUDY • PRACTICE • UNDERSTAND</span>
            </div>

            <div className="floating-card card-bottom">
              <CheckCircle2 size={18} />
              <span>Ready for revision</span>
            </div>

          </div>

        </div>
      </section>


      {/* HOW IT WORKS */}
      <section
        className="how-section"
        id="how-it-works"
      >

        <div className="section-heading-home">

          <div className="section-label-home">
            HOW IT WORKS
          </div>

          <h2>
            Everything you need
            <br />
            <span>before your exam.</span>
          </h2>

          <p>
            AI ExamMate turns your study material into a simple,
            organized preparation workflow.
          </p>

        </div>


        <div className="steps-grid">

          {/* Step 1 */}
          <div className="step-card">

            <div className="step-number">
              01
            </div>

            <div className="step-icon">
              <FileText size={25} />
            </div>

            <h3>Upload</h3>

            <p>
              Upload your PDF study material and tell us about
              your subject and exam.
            </p>

          </div>


          {/* Step 2 */}
          <div className="step-card">

            <div className="step-number">
              02
            </div>

            <div className="step-icon">
              <Brain size={25} />
            </div>

            <h3>Analyze</h3>

            <p>
              AI analyzes your material and identifies the most
              important topics for your preparation.
            </p>

          </div>


          {/* Step 3 */}
          <div className="step-card">

            <div className="step-number">
              03
            </div>

            <div className="step-icon">
              <Target size={25} />
            </div>

            <h3>Practice</h3>

            <p>
              Generate exam-oriented questions based on
              difficulty and marks.
            </p>

          </div>


          {/* Step 4 */}
          <div className="step-card">

            <div className="step-number">
              04
            </div>

            <div className="step-icon">
              <GraduationCap size={25} />
            </div>

            <h3>Understand</h3>

            <p>
              Make questions easier, get explanations and
              generate answers for your exam.
            </p>

          </div>

        </div>

      </section>


      {/* CTA */}
      <section className="home-cta">

        <div>
          <div className="section-label-home">
            READY TO START?
          </div>

          <h2>
            Your exam preparation,
            <br />
            <span>made simpler.</span>
          </h2>
        </div>

        <button
          className="gold-btn"
          onClick={() => navigate("/upload")}
        >
          Start Preparing
          <ArrowRight size={20} />
        </button>

      </section>

    </main>
  );
}

export default Home;