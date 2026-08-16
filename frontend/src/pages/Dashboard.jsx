import { useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  Clock3,
  FileQuestion,
  ArrowRight,
} from "lucide-react";

function Dashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  // If dashboard is opened directly without analysis data
  if (!data) {
    navigate("/upload");
    return null;
  }

  /*
    API response structure:

    {
      status: "success",
      result: {
        important_topics: [],
        practice_questions: [],
        revision_notes: [],
        mcq_quiz: [],
        study_plan: []
      }
    }

    Depending on the frontend response,
    the actual analysis may be inside:
    data.result.result
    or
    data.result
  */

  const analysis = data.result?.result || data.result;

  // -----------------------------------------
  // SAFETY CHECK
  // -----------------------------------------

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

  // -----------------------------------------
  // SAFE API DATA
  // -----------------------------------------

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
  console.log("STUDY PLAN FROM API:", studyPlan);

  const mcqQuiz = Array.isArray(
    analysis.mcq_quiz
  )
    ? analysis.mcq_quiz
    : [];

  // -----------------------------------------
  // DEBUG
  // -----------------------------------------

  console.log(
    "FULL ANALYSIS FROM API:",
    analysis
  );

  console.log(
    "STUDY PLAN FROM API:",
    studyPlan
  );

  // -----------------------------------------
  // PAGE
  // -----------------------------------------

  return (
    <main className="page dashboard">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="dashboard-header">

        <div>

          <span className="eyebrow">
            <BookOpen size={16} />
            AI Analysis Complete
          </span>

          <h1>
            {data.subject || "Study Material"}
          </h1>

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


      {/* =====================================================
          INFO CARDS
      ===================================================== */}

      <div className="info-row">

        {/* EXAM DATE */}

        <div className="info-card">

          <CalendarDays size={20} />

          <div>

            <span>
              Exam Date
            </span>

            <strong>
              {data.examDate || "Not specified"}
            </strong>

          </div>

        </div>


        {/* DAILY STUDY */}

        <div className="info-card">

          <Clock3 size={20} />

          <div>

            <span>
              Daily Study
            </span>

            <strong>
              {data.dailyHours || "0"} hours
            </strong>

          </div>

        </div>


        {/* MATERIAL */}

        <div className="info-card">

          <FileQuestion size={20} />

          <div>

            <span>
              Material
            </span>

            <strong>
              {data.file?.name || "Uploaded material"}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================================
          IMPORTANT TOPICS
      ===================================================== */}

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

          {importantTopics.length > 0 ? (

            importantTopics.map(
              (topic, index) => {

                let topicText;

                if (typeof topic === "string") {
                  topicText = topic;
                } else if (topic?.topic) {
                  topicText = topic.topic;
                } else if (topic?.title) {
                  topicText = topic.title;
                } else if (topic?.name) {
                  topicText = topic.name;
                } else {
                  topicText = "Important Topic";
                }

                return (
                  <div
                    key={index}
                    className="topic-card"
                  >

                    <div className="topic-number">
                      {String(index + 1).padStart(2, "0")}
                    </div>

                    <h3>
                      {topicText}
                    </h3>

                  </div>
                );
              }
            )

          ) : (

            <div className="content-panel">

              <p>
                No important topics found.
              </p>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          REVISION NOTES + STUDY PLAN
      ===================================================== */}

      <section className="content-grid">


        {/* =================================================
            REVISION NOTES
        ================================================= */}

        <div className="content-panel">

          <span className="section-label">
            02
          </span>

          <h2>
            Revision Notes
          </h2>


          <div className="notes-list">

            {revisionNotes.length > 0 ? (

              revisionNotes.map(
                (note, index) => {

                  let noteText;

                  if (typeof note === "string") {
                    noteText = note;
                  } else if (note?.note) {
                    noteText = note.note;
                  } else if (note?.text) {
                    noteText = note.text;
                  } else if (note?.content) {
                    noteText = note.content;
                  } else {
                    noteText = "Revision point";
                  }

                  return (
                    <div
                      className="note-item"
                      key={index}
                    >

                      <span>
                        {index + 1}
                      </span>

                      <p>
                        {noteText}
                      </p>

                    </div>
                  );
                }
              )

            ) : (

              <p>
                No revision notes available.
              </p>

            )}

          </div>

        </div>


        {/* =================================================
            STUDY PLAN
        ================================================= */}

        <div className="content-panel">

          <span className="section-label">
            03
          </span>

          <h2>
            Study Plan
          </h2>


          <div className="plan-list">

            {studyPlan.length > 0 ? (

              studyPlan.map(
                (day, index) => {

                  /*
                    The backend may return:

                    {
                      day: 1,
                      topics: ["Topic A", "Topic B"],
                      hours: 2
                    }

                    OR:

                    {
                      day: "Day 1",
                      topics: [...],
                      hours: 2
                    }

                    OR slightly different key names.

                    We handle all of them here.
                  */


                  // -------------------------------
                  // DAY
                  // -------------------------------

                  const dayValue =
                    day?.day ??
                    day?.day_number ??
                    day?.dayNumber ??
                    index + 1;


                  // -------------------------------
                  // TOPICS
                  // -------------------------------

                  let topics = [];

                  if (
                    Array.isArray(day?.topics)
                  ) {
                    topics = day.topics;
                  } else if (
                    Array.isArray(day?.subjects)
                  ) {
                    topics = day.subjects;
                  } else if (
                    Array.isArray(day?.content)
                  ) {
                    topics = day.content;
                  }


                  // -------------------------------
                  // HOURS
                  // -------------------------------

                  const hours =
                    day?.hours ??
                    day?.study_hours ??
                    day?.studyHours ??
                    day?.duration ??
                    "";


                  // -------------------------------
                  // TOPIC TEXT
                  // -------------------------------

                  const topicText =
                    topics
                      .map((topic) => {

                        if (
                          typeof topic === "string"
                        ) {
                          return topic;
                        }

                        if (topic?.topic) {
                          return topic.topic;
                        }

                        if (topic?.title) {
                          return topic.title;
                        }

                        if (topic?.name) {
                          return topic.name;
                        }

                        return "";

                      })
                      .filter(Boolean)
                      .join(" • ");


                  return (

                    <div
                      className="plan-item"
                      key={index}
                    >

                      {/* DAY NUMBER */}

                      <div className="day-number">

                        {index + 1}

                      </div>


                      {/* DAY CONTENT */}

                      <div className="plan-content">

                        <strong>

                          {typeof dayValue === "string"
                            ? dayValue
                            : `Day ${dayValue}`}

                        </strong>


                        {topicText && (

                          <p>
                            {topicText}
                          </p>

                        )}

                      </div>


                      {/* HOURS */}

                      {hours !== "" && (

                        <span>
                          {hours}h
                        </span>

                      )}

                    </div>

                  );

                }
              )

            ) : (

              <p>
                No study plan available.
              </p>

            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          MCQ QUIZ
      ===================================================== */}

      <section className="content-panel mcq-panel">

        <span className="section-label">
          04
        </span>

        <h2>
          Quick MCQ Quiz
        </h2>


        {mcqQuiz.length > 0 ? (

          mcqQuiz.map(
            (mcq, index) => (

              <div
                className="mcq"
                key={index}
              >

                <strong>

                  {index + 1}.{" "}

                  {mcq?.question ||
                    mcq?.text ||
                    "Question"}

                </strong>


                <div className="options">

                  {Array.isArray(
                    mcq?.options
                  ) &&

                    mcq.options.map(
                      (
                        option,
                        optionIndex
                      ) => (

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

          )

        ) : (

          <p>
            No MCQ questions available.
          </p>

        )}

      </section>

    </main>
  );
}

export default Dashboard;