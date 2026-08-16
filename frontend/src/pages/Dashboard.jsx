import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  FileQuestion,
  ArrowRight,
} from "lucide-react";

import TopicCard from "../components/TopicCard";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    navigate("/upload");
    return null;
  }

  // API response structure:
  // data.result = {
  //   status: "success",
  //   result: {
  //     important_topics: [],
  //     practice_questions: [],
  //     revision_notes: [],
  //     mcq_quiz: [],
  //     study_plan: []
  //   }
  // }

  const analysis = data.result?.result;

  // Safety check
  if (!analysis) {
    return (
      <main className="page dashboard">
        <div className="content-panel">
          <h2>Analysis data unavailable</h2>

          <p>
            The material was analyzed, but the analysis result
            could not be loaded.
          </p>

          <button
            className="primary-btn"
            onClick={() => navigate("/upload")}
          >
            Try Again
            <ArrowRight size={18} />
          </button>
        </div>
      </main>
    );
  }

  const importantTopics = Array.isArray(
    analysis.important_topics
  )
    ? analysis.important_topics
    : [];

  const revisionNotes = Array.isArray(
    analysis.revision_notes
  )
    ? analysis.revision_notes
    : [];

  const studyPlan = Array.isArray(
    analysis.study_plan
  )
    ? analysis.study_plan
    : [];

  const mcqQuiz = Array.isArray(
    analysis.mcq_quiz
  )
    ? analysis.mcq_quiz
    : [];

  return (
    <main className="page dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <div>
          <span className="eyebrow">
            <BookOpen size={16} />
            AI Analysis Complete
          </span>

          <h1>{data.subject}</h1>

          <p>
            Here's what AI found in your uploaded study material.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() =>
            navigate("/questions", {
              state: data,
            })
          }
        >
          Generate Questions
          <ArrowRight size={18} />
        </button>
      </div>


      {/* INFO CARDS */}
      <div className="info-row">

        <div className="info-card">
          <CalendarDays size={20} />

          <div>
            <span>Exam Date</span>
            <strong>{data.examDate}</strong>
          </div>
        </div>


        <div className="info-card">
          <Clock3 size={20} />

          <div>
            <span>Daily Study</span>
            <strong>
              {data.dailyHours} hours
            </strong>
          </div>
        </div>


        <div className="info-card">
          <FileQuestion size={20} />

          <div>
            <span>Material</span>

            <strong>
              {data.file?.name || "Uploaded material"}
            </strong>
          </div>
        </div>

      </div>


      {/* IMPORTANT TOPICS */}
      <section className="section">

        <div className="section-heading">

          <div>
            <span className="section-label">
              01
            </span>

            <h2>
              Important Topics
            </h2>
          </div>

        </div>


        <div className="topic-grid">
  {importantTopics.map((topic, index) => (
    <div key={index} className="content-panel">
      <strong>{topic}</strong>
    </div>
  ))}
</div>

      </section>


      {/* REVISION NOTES + STUDY PLAN */}
      <section className="content-grid">


        {/* REVISION NOTES */}
        <div className="content-panel">

          <span className="section-label">
            02
          </span>

          <h2>
            Revision Notes
          </h2>


          <div className="notes-list">

            {revisionNotes.map(
              (note, index) => (

                <div
                  className="note-item"
                  key={index}
                >

                  <span>
                    {index + 1}
                  </span>

                  <p>
                    {note}
                  </p>

                </div>

              )
            )}

          </div>

        </div>


        {/* STUDY PLAN */}
        <div className="content-panel">

          <span className="section-label">
            03
          </span>

          <h2>
            Study Plan
          </h2>


          <div className="plan-list">

            {studyPlan.map(
              (day, index) => (

                <div
                  className="plan-item"
                  key={index}
                >

                  <div className="day-number">
                    {index + 1}
                  </div>


                  <div>

                    <strong>
                      {day.day}
                    </strong>


                    {Array.isArray(day.topics) && (
                      <p>
                        {day.topics.join(" • ")}
                      </p>
                    )}

                  </div>


                  <span>
                    {day.hours}h
                  </span>

                </div>

              )
            )}

          </div>

        </div>

      </section>


      {/* MCQ QUIZ */}
      <section className="content-panel mcq-panel">

        <span className="section-label">
          04
        </span>

        <h2>
          Quick MCQ Quiz
        </h2>


        {mcqQuiz.map(
          (mcq, index) => (

            <div
              className="mcq"
              key={index}
            >

              <strong>
                {index + 1}. {mcq.question}
              </strong>


              <div className="options">

                {Array.isArray(mcq.options) &&
                  mcq.options.map(
                    (option, optionIndex) => (

                      <div
                        key={optionIndex}
                      >
                        {String.fromCharCode(
                          65 + optionIndex
                        )}
                        .{" "}
                        {option}
                      </div>

                    )
                  )}

              </div>

            </div>

          )
        )}

      </section>

    </main>
  );
}

export default Dashboard;