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
  */

  const analysis =
    data?.result?.result ||
    data?.result ||
    data;

  // -----------------------------------------
  // SAFE API DATA
  // -----------------------------------------

  const importantTopics = Array.isArray(
    analysis?.important_topics
  )
    ? analysis.important_topics
    : [];

  const revisionNotes = Array.isArray(
    analysis?.revision_notes
  )
    ? analysis.revision_notes
    : [];

  const mcqQuiz = Array.isArray(
    analysis?.mcq_quiz
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
            {data?.subject || "Study Material"}
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
              {data?.examDate || "Not specified"}
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
              {data?.dailyHours || "0"} hours
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
              {data?.file?.name || "Uploaded material"}
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

                let topicText = "Important Topic";

                if (typeof topic === "string") {

                  topicText = topic;

                } else if (topic?.topic) {

                  topicText = topic.topic;

                } else if (topic?.title) {

                  topicText = topic.title;

                } else if (topic?.name) {

                  topicText = topic.name;

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
          REVISION NOTES
      ===================================================== */}

      <section className="section">

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

                  let noteText = "Revision point";

                  if (typeof note === "string") {

                    noteText = note;

                  } else if (note?.note) {

                    noteText = note.note;

                  } else if (note?.text) {

                    noteText = note.text;

                  } else if (note?.content) {

                    noteText = note.content;

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

      </section>


      {/* =====================================================
          MCQ QUIZ
      ===================================================== */}

      <section className="content-panel mcq-panel">

        <span className="section-label">
          03
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