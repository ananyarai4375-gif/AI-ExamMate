const API_BASE_URL = "http://127.0.0.1:8000";


export async function analyzeMaterial({
  subject,
  examDate,
  dailyHours,
  file,
}) {

  const formData =
    new FormData();

  formData.append(
    "subject",
    subject
  );

  formData.append(
    "exam_date",
    examDate
  );

  formData.append(
    "daily_hours",
    dailyHours
  );

  formData.append(
    "file",
    file
  );

  const response =
    await fetch(
      `${API_BASE_URL}/analyze`,
      {
        method: "POST",
        body: formData,
      }
    );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.detail ||
      "Analysis failed."
    );

  }

  return data;
}


export async function generateQuestions({
  subject,
  difficulty,
  marks,
  numberOfQuestions,
  file,
}) {

  const formData =
    new FormData();

  formData.append(
    "subject",
    subject
  );

  formData.append(
    "difficulty",
    difficulty
  );

  formData.append(
    "marks",
    marks
  );

  formData.append(
    "number_of_questions",
    numberOfQuestions
  );

  formData.append(
    "file",
    file
  );

  const response =
    await fetch(
      `${API_BASE_URL}/generate-questions`,
      {
        method: "POST",
        body: formData,
      }
    );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.detail ||
      "Question generation failed."
    );

  }

  return data;
}


export async function simplifyQuestion(
  question,
  material
) {

  const formData =
    new URLSearchParams();

  formData.append(
    "question",
    question
  );

  formData.append(
    "material",
    material
  );

  const response =
    await fetch(
      `${API_BASE_URL}/simplify-question`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          formData.toString(),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.detail ||
      "Could not simplify question."
    );

  }

  return data;
}


export async function explainQuestion(
  question,
  material
) {

  const formData =
    new URLSearchParams();

  formData.append(
    "question",
    question
  );

  formData.append(
    "material",
    material
  );

  const response =
    await fetch(
      `${API_BASE_URL}/explain-question`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          formData.toString(),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.detail ||
      "Could not explain question."
    );

  }

  return data;
}


export async function generateExamAnswer(
  question,
  marks,
  material
) {

  const formData =
    new URLSearchParams();

  formData.append(
    "question",
    question
  );

  formData.append(
    "marks",
    marks
  );

  formData.append(
    "material",
    material
  );

  const response =
    await fetch(
      `${API_BASE_URL}/exam-answer`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          formData.toString(),
      }
    );

  const data =
    await response.json();

  if (!response.ok) {

    throw new Error(
      data.detail ||
      "Could not generate exam answer."
    );

  }

  return data;
}