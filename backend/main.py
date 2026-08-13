import os
import io
import json
import re
import time

from dotenv import load_dotenv
from fastapi import FastAPI, File, Form, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader

from google import genai
from google.genai import types


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()


# ============================================================
# GEMINI API KEY
# ============================================================

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    print("WARNING: GEMINI_API_KEY is not set.")
else:
    print("GEMINI_API_KEY loaded successfully.")


# ============================================================
# GEMINI MODEL
# ============================================================
#
# IMPORTANT:
# Do NOT use gemini-2.5-flash.
#
# We use a newer Flash model.
#

MODEL_NAME = "gemini-3-flash-preview"


# ============================================================
# CREATE GEMINI CLIENT
# ============================================================

def get_client():

    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail=(
                "GEMINI_API_KEY is not configured. "
                "Check your backend .env file."
            )
        )

    return genai.Client(
        api_key=GEMINI_API_KEY
    )


# ============================================================
# FASTAPI APP
# ============================================================

app = FastAPI(
    title="AI ExamMate API",
    version="2.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# PDF TEXT EXTRACTION
# ============================================================

async def extract_pdf_text(file: UploadFile) -> str:

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected."
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF file."
        )

    try:

        contents = await file.read()

        if not contents:
            raise HTTPException(
                status_code=400,
                detail="Uploaded PDF is empty."
            )

        pdf_file = io.BytesIO(contents)

        reader = PdfReader(pdf_file)

        text_parts = []

        for page in reader.pages:

            try:

                page_text = page.extract_text()

                if page_text:
                    text_parts.append(page_text)

            except Exception:
                continue

        text = "\n".join(text_parts).strip()

        if not text:

            raise HTTPException(
                status_code=400,
                detail=(
                    "Could not extract text from this PDF. "
                    "Please upload a text-based PDF."
                )
            )

        return text

    except HTTPException:
        raise

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"PDF processing failed: {str(e)}"
        )


# ============================================================
# GEMINI GENERATION
# ============================================================

def generate_ai_response(prompt: str) -> str:

    client = get_client()

    last_error = None

    # Retry a few times for temporary 503/429 errors
    for attempt in range(3):

        try:

            response = client.models.generate_content(
                model=MODEL_NAME,
                contents=prompt,
                config=types.GenerateContentConfig(
                    temperature=0.4
                )
            )

            if not response:
                raise Exception(
                    "Gemini returned no response."
                )

            text = response.text

            if not text:
                raise Exception(
                    "Gemini returned an empty response."
                )

            return text.strip()

        except Exception as e:

            last_error = e

            error_text = str(e)

            print(
                f"Gemini attempt {attempt + 1} failed:"
            )
            print(error_text)

            # Retry temporary errors
            if (
                "503" in error_text
                or "UNAVAILABLE" in error_text
                or "429" in error_text
                or "RESOURCE_EXHAUSTED" in error_text
            ):

                if attempt < 2:
                    time.sleep(2)
                    continue

            break

    raise HTTPException(
        status_code=500,
        detail=f"Gemini analysis failed: {str(last_error)}"
    )


# ============================================================
# JSON EXTRACTION
# ============================================================

def extract_json(text: str):

    if not text:

        raise HTTPException(
            status_code=500,
            detail="AI returned an empty response."
        )

    text = text.strip()

    # Remove markdown fences
    text = re.sub(
        r"```json\s*",
        "",
        text,
        flags=re.IGNORECASE
    )

    text = re.sub(
        r"```\s*",
        "",
        text
    )

    text = text.strip()

    # --------------------------------------------------------
    # Direct JSON
    # --------------------------------------------------------

    try:

        return json.loads(text)

    except json.JSONDecodeError:
        pass

    # --------------------------------------------------------
    # JSON object
    # --------------------------------------------------------

    start = text.find("{")
    end = text.rfind("}")

    if start != -1 and end != -1:

        try:

            return json.loads(
                text[start:end + 1]
            )

        except json.JSONDecodeError:
            pass

    # --------------------------------------------------------
    # JSON array
    # --------------------------------------------------------

    start = text.find("[")
    end = text.rfind("]")

    if start != -1 and end != -1:

        try:

            return json.loads(
                text[start:end + 1]
            )

        except json.JSONDecodeError:
            pass

    raise HTTPException(
        status_code=500,
        detail="AI returned invalid JSON."
    )


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "status": "running",
        "message": "AI ExamMate API is running"
    }


# ============================================================
# HEALTH
# ============================================================

@app.get("/health")
def health():

    return {
        "status": "healthy",
        "gemini_configured": bool(GEMINI_API_KEY),
        "model": MODEL_NAME
    }


# ============================================================
# ANALYZE MATERIAL
# ============================================================

@app.post("/analyze")
async def analyze_material(
    subject: str = Form(...),
    exam_date: str = Form(...),
    daily_hours: float = Form(...),
    file: UploadFile = File(...)
):

    material = await extract_pdf_text(file)

    prompt = f"""
You are AI ExamMate, an AI exam preparation assistant.

Analyze the following university study material.

SUBJECT:
{subject}

EXAM DATE:
{exam_date}

DAILY STUDY HOURS:
{daily_hours}

STUDY MATERIAL:
{material}

Create useful exam preparation information.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "important_topics": [],
    "practice_questions": [],
    "revision_notes": [],
    "mcq_quiz": [],
    "study_plan": []
}}

Rules:

important_topics:
List the most important topics from the material.

practice_questions:
Create useful questions based ONLY on the provided material.

revision_notes:
Give concise revision points.

mcq_quiz:
Create multiple choice questions.

Each MCQ must contain:

{{
    "question": "",
    "options": [],
    "answer": ""
}}

study_plan:
Create a practical study plan based on the exam date and daily study hours.

Do not add information unrelated to the provided material.
"""

    ai_text = generate_ai_response(prompt)

    result = extract_json(ai_text)

    return {
        "status": "success",
        "result": result
    }


# ============================================================
# GENERATE QUESTIONS
# ============================================================

@app.post("/generate-questions")
async def generate_questions(
    subject: str = Form(...),
    difficulty: str = Form("All"),
    marks: str = Form("All"),
    number_of_questions: int = Form(10),
    file: UploadFile = File(...)
):

    material = await extract_pdf_text(file)

    difficulty_instruction = (
        "Generate questions of mixed difficulty."
        if difficulty == "All"
        else f"Generate ONLY {difficulty} difficulty questions."
    )

    marks_instruction = (
        "Use a mixture of 5, 7 and 10 mark questions."
        if marks == "All"
        else f"Generate ONLY {marks}-mark questions."
    )

    prompt = f"""
You are AI ExamMate.

Generate university examination practice questions.

SUBJECT:
{subject}

DIFFICULTY:
{difficulty_instruction}

MARKS:
{marks_instruction}

NUMBER OF QUESTIONS:
{number_of_questions}

STUDY MATERIAL:
{material}

Return ONLY valid JSON.

Use exactly:

{{
    "questions": [
        {{
            "question": "",
            "topic": "",
            "difficulty": "",
            "marks": 5
        }}
    ]
}}

Important:

1. Questions must be based ONLY on the study material.
2. Do not invent unrelated topics.
3. Follow the requested number of questions.
4. If marks is All, use ONLY 5, 7 or 10 marks.
5. Never generate 2-mark questions.
6. Never generate 15-mark questions.
7. For 10-mark questions, make them sufficiently detailed and analytical.
8. For 7-mark questions, make them moderately detailed.
9. For 5-mark questions, make them suitable for a normal short-answer exam question.

Return exactly {number_of_questions} questions.
"""

    ai_text = generate_ai_response(prompt)

    result = extract_json(ai_text)

    questions = result.get("questions", [])

    # Safety filtering
    valid_marks = {5, 7, 10}

    cleaned_questions = []

    for q in questions:

        try:
            q_marks = int(q.get("marks", 5))
        except:
            q_marks = 5

        if q_marks not in valid_marks:
            q_marks = 5

        q["marks"] = q_marks

        cleaned_questions.append(q)

    return {
        "status": "success",
        "subject": subject,
        "material": material,
        "questions": cleaned_questions
    }


# ============================================================
# SIMPLIFY QUESTION
# ============================================================

@app.post("/simplify-question")
async def simplify_question(
    question: str = Form(...),
    material: str = Form(...)
):

    prompt = f"""
You are helping a university student understand an exam question.

QUESTION:
{question}

STUDY MATERIAL:
{material}

Make the question easier to understand WITHOUT changing its meaning.

Then explain what the question is asking in very simple language.

Return ONLY valid JSON.

Use exactly:

{{
    "original_question": "",
    "simple_question": "",
    "simple_explanation": "",
    "key_points": []
}}

Rules:

- Keep the academic meaning.
- Do not answer the question.
- Use simple student-friendly English.
- Key points should explain what the student needs to cover.
"""

    ai_text = generate_ai_response(prompt)

    result = extract_json(ai_text)

    return {
        "status": "success",
        "result": result
    }


# ============================================================
# EXPLAIN QUESTION
# ============================================================

@app.post("/explain-question")
async def explain_question(
    question: str = Form(...),
    material: str = Form(...)
):

    prompt = f"""
You are an expert university teacher helping a student understand
an examination question.

QUESTION:
{question}

STUDY MATERIAL:
{material}

Explain the question clearly using simple but academically correct
language.

Return ONLY valid JSON.

Use exactly:

{{
    "question": "",
    "explanation": "",
    "key_concepts": [],
    "example": ""
}}

Rules:

- Explain what the question means.
- Explain the important concepts.
- Use examples when useful.
- Do NOT write a full exam answer.
- Stay based on the provided material.
"""

    ai_text = generate_ai_response(prompt)

    result = extract_json(ai_text)

    return {
        "status": "success",
        "result": result
    }


# ============================================================
# EXAM ANSWER
# ============================================================

@app.post("/exam-answer")
async def exam_answer(
    question: str = Form(...),
    marks: int = Form(...),
    material: str = Form(...)
):

    # --------------------------------------------------------
    # ONLY ALLOW 5, 7, 10
    # --------------------------------------------------------

    if marks not in [5, 7, 10]:

        raise HTTPException(
            status_code=400,
            detail="Marks must be 5, 7, or 10."
        )

    # --------------------------------------------------------
    # MARK-SPECIFIC INSTRUCTIONS
    # --------------------------------------------------------

    if marks == 5:

        length_instruction = """
Write an answer suitable for 5 marks.

Include:
- Short introduction/definition
- 3 to 4 important points
- One suitable example if required
- Short conclusion

The answer should be concise but complete.
"""

    elif marks == 7:

        length_instruction = """
Write an answer suitable for 7 marks.

Include:
- Introduction or definition
- 4 to 6 well-explained points
- Relevant example
- Explanation of important concepts
- Short conclusion

The answer should have moderate detail.
"""

    else:

        length_instruction = """
Write a FULL university examination answer suitable for 10 marks.

This is VERY IMPORTANT.

The answer must NOT look like a 2-mark or 5-mark answer.

Include:

1. Introduction / definition
2. Detailed explanation
3. Important concepts or components
4. Proper headings and subheadings
5. Detailed points with explanations
6. Suitable example
7. Diagram/flow description if useful
8. Advantages / importance / applications if relevant
9. Conclusion

The answer should be detailed enough to fill approximately
2 to 3 handwritten exam pages depending on handwriting.

Do NOT give an unnecessarily short answer.
Do NOT summarize the topic in only a few paragraphs.
"""

    prompt = f"""
You are an expert university professor creating an exam answer.

QUESTION:
{question}

MARKS:
{marks}

STUDY MATERIAL:
{material}

{length_instruction}

IMPORTANT:

- Answer the exact question.
- Use the provided study material as the primary source.
- Keep terminology academically correct.
- Use clear headings.
- Use numbered points where appropriate.
- Make the answer easy for a student to study and reproduce in an exam.
- Do not mention that AI generated the answer.
- Do not mention these instructions.

Return ONLY valid JSON.

Use exactly:

{{
    "question": "",
    "marks": {marks},
    "answer": "",
    "key_points_to_remember": []
}}
"""

    ai_text = generate_ai_response(prompt)

    result = extract_json(ai_text)

    # Ensure marks returned correctly
    result["marks"] = marks

    return {
        "status": "success",
        "result": result
    }