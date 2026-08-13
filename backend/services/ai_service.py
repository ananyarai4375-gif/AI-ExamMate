import os
import json

from dotenv import load_dotenv
from google import genai


load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")

client = genai.Client(api_key=API_KEY) if API_KEY else None

MODEL = "gemini-3.1-flash-lite"


# ==================================================
# HELPER
# ==================================================

def call_gemini(prompt: str):

    if not client:
        raise ValueError(
            "GEMINI_API_KEY is not configured in the .env file."
        )

    try:

        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )

        return response.text.strip()

    except Exception as e:

        raise ValueError(
            f"Gemini analysis failed: {str(e)}"
        )


def clean_json(result: str):

    if result.startswith("```json"):
        result = result[7:]

    elif result.startswith("```"):
        result = result[3:]

    if result.endswith("```"):
        result = result[:-3]

    return result.strip()


# ==================================================
# COMPLETE MATERIAL ANALYSIS
# ==================================================

def analyze_material(
    subject: str,
    syllabus_text: str,
    exam_date: str,
    daily_hours: float
):

    syllabus_text = syllabus_text[:30000]

    prompt = f"""
You are an AI exam preparation assistant.

Subject: {subject}
Exam Date: {exam_date}
Daily Study Hours: {daily_hours}

Study material:

--- START ---
{syllabus_text}
--- END ---

Analyze ONLY the provided material.

Return valid JSON with exactly these fields:

{{
    "important_topics": [],
    "practice_questions": [],
    "revision_notes": [],
    "mcq_quiz": [],
    "study_plan": []
}}

Important topics:
Identify the major topics from the material.

Practice questions:
Generate useful exam-oriented questions.

Revision notes:
Give concise revision points.

MCQ quiz:
Generate 5 MCQs with:
question,
options,
correct_answer,
explanation.

Study plan:
Create a practical study plan using the exam date and
available daily study hours.

Do not claim that any generated question is guaranteed
to appear in the actual examination.

Return JSON only.
"""

    result = call_gemini(prompt)

    try:
        return json.loads(clean_json(result))

    except json.JSONDecodeError:
        raise ValueError(
            "Gemini returned invalid JSON."
        )


# ==================================================
# QUESTION GENERATOR
# ==================================================

def generate_questions(
    subject: str,
    material: str,
    difficulty: str,
    marks: str,
    number_of_questions: int
):

    material = material[:30000]

    prompt = f"""
You are an engineering examination question generator.

Subject: {subject}

Study material:
--- START ---
{material}
--- END ---

Student requirements:

Difficulty: {difficulty}
Marks: {marks}
Number of Questions: {number_of_questions}

Generate exactly {number_of_questions} questions.

Rules:

1. Questions must be based ONLY on the provided material.

2. Difficulty:
   - Easy = basic definitions, concepts, direct questions
   - Medium = explanations, comparisons, applications
   - Hard = detailed, analytical, multi-concept questions

3. Marks:
   If the student selected a specific mark value,
   every question must match that mark value.

4. If Difficulty is "All", distribute questions
   reasonably across Easy, Medium and Hard.

5. If Marks is "All", distribute questions across
   2, 5 and 10 marks.

Return ONLY valid JSON.

Format:

[
    {{
        "question": "...",
        "difficulty": "Easy/Medium/Hard",
        "marks": 2,
        "topic": "..."
    }}
]
"""

    result = call_gemini(prompt)

    try:
        return json.loads(clean_json(result))

    except json.JSONDecodeError:
        raise ValueError(
            "Gemini returned invalid question JSON."
        )


# ==================================================
# MAKE QUESTION EASIER
# ==================================================

def simplify_question(
    question: str,
    material: str
):

    material = material[:15000]

    prompt = f"""
You are a patient engineering teacher.

Study material:
{material}

Original question:
{question}

Rewrite and explain this question in very simple
student-friendly English.

Do NOT remove the important technical meaning.

Return JSON:

{{
    "original_question": "...",
    "simple_question": "...",
    "simple_explanation": "...",
    "key_points": []
}}
"""

    result = call_gemini(prompt)

    try:
        return json.loads(clean_json(result))

    except json.JSONDecodeError:
        raise ValueError(
            "Gemini returned invalid JSON."
        )


# ==================================================
# EXPLAIN QUESTION
# ==================================================

def explain_question(
    question: str,
    material: str
):

    material = material[:15000]

    prompt = f"""
You are an engineering teacher explaining a difficult
question to a student who is struggling to understand it.

Study material:
{material}

Question:
{question}

Explain the concept step-by-step.

Use:
- simple English
- short sections
- examples where useful
- important technical terms

Return JSON:

{{
    "question": "...",
    "explanation": "...",
    "key_concepts": [],
    "example": "..."
}}
"""

    result = call_gemini(prompt)

    try:
        return json.loads(clean_json(result))

    except json.JSONDecodeError:
        raise ValueError(
            "Gemini returned invalid JSON."
        )


# ==================================================
# EXAM-FRIENDLY ANSWER
# ==================================================

def generate_exam_answer(
    question: str,
    marks: int,
    material: str
):

    material = material[:20000]

    prompt = f"""
You are an engineering exam answer writer.

Study material:
{material}

Question:
{question}

Required marks: {marks}

Write an answer suitable for a university engineering
examination.

The answer should match the expected depth for {marks} marks.

For 2 marks:
Give a concise definition or short explanation.

For 5 marks:
Give a structured explanation with important points
and an example if appropriate.

For 10 marks:
Give a detailed structured answer with:
- introduction
- explanation
- important points
- examples
- conclusion where appropriate

Do not invent facts outside the provided material.

Return JSON:

{{
    "question": "...",
    "marks": {marks},
    "answer": "...",
    "key_points_to_remember": []
}}
"""

    result = call_gemini(prompt)

    try:
        return json.loads(clean_json(result))

    except json.JSONDecodeError:
        raise ValueError(
            "Gemini returned invalid JSON."
        )