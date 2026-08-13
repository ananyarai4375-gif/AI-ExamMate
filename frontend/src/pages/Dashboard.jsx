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

  const analysis = data.result.result;

  return (
    <main className="page dashboard">
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
            <strong>{data.dailyHours} hours</strong>
          </div>
        </div>

        <div className="info-card">
          <FileQuestion size={20} />
          <div>
            <span>Material</span>
            <strong>{data.file.name}</strong>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="section-heading">
          <div>
            <span className="section-label">01</span>
            <h2>Important Topics</h2>
          </div>
        </div>

        <div className="topic-grid">
          {analysis.important_topics.map((topic, index) => (
            <TopicCard
              key={index}
              topic={topic}
              index={index}
            />
          ))}
        </div>
      </section>

      <section className="content-grid">
        <div className="content-panel">
          <span className="section-label">02</span>
          <h2>Revision Notes</h2>

          <div className="notes-list">
            {analysis.revision_notes.map((note, index) => (
              <div className="note-item" key={index}>
                <span>{index + 1}</span>
                <p>{note}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="content-panel">
          <span className="section-label">03</span>
          <h2>Study Plan</h2>

          <div className="plan-list">
            {analysis.study_plan.map((day) => (
              <div className="plan-item" key={day.day}>
                <div className="day-number">
                  {day.day}
                </div>

                <div>
                  <strong>Day {day.day}</strong>
                  <p>{day.topic}</p>
                </div>

                <span>{day.hours}h</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-panel mcq-panel">
        <span className="section-label">04</span>
        <h2>Quick MCQ Quiz</h2>

        {analysis.mcq_quiz.map((mcq, index) => (
          <div className="mcq" key={index}>
            <strong>
              {index + 1}. {mcq.question}
            </strong>

            <div className="options">
              {mcq.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  {String.fromCharCode(65 + optionIndex)}. {option}
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

export default Dashboard;