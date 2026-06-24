from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from groq import Groq
import os

# ----------------------------
# Load Environment Variables
# ----------------------------

load_dotenv()

# ----------------------------
# Groq Configuration
# ----------------------------

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)

# ----------------------------
# FastAPI App
# ----------------------------

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Models
# ----------------------------

class SkillInput(BaseModel):
    skills: str


class EvaluationInput(BaseModel):
    answer: str


# ----------------------------
# Health Check
# ----------------------------

@app.get("/")
def home():
    return {
        "message": "InterviewPilot Backend Running"
    }


# ----------------------------
# Generate Questions
# ----------------------------

@app.post("/generate")
async def generate_questions(data: SkillInput):

    try:

        prompt = f"""
        You are a senior technical interviewer.

        Generate exactly 5 interview questions for a candidate with these skills:

        {data.skills}

        Requirements:

        1 Easy technical question
        1 Medium technical question
        1 Hard technical question
        1 Project-related question
        1 HR/Behavioral question

        Return ONLY the questions.

        Format:

        Easy:
        Question

        Medium:
        Question

        Hard:
        Question

        Project:
        Question

        HR:
        Question

        Do not provide answers.
        Do not explain.
        """

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return {
            "questions": completion.choices[0].message.content
        }

    except Exception as e:

        return {
            "questions": f"ERROR: {str(e)}"
        }


# ----------------------------
# Evaluate Answer
# ----------------------------

@app.post("/evaluate")
async def evaluate_answer(data: EvaluationInput):

    try:

        prompt = f"""
        You are a senior technical interviewer.

        Evaluate the following answer:

        {data.answer}

        Give:

        Score: X/10

        Strengths:
        - point 1
        - point 2

        Weaknesses:
        - point 1
        - point 2

        Improvements:
        - point 1
        - point 2

        Keep the response concise.
        """

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return {
            "evaluation": completion.choices[0].message.content
        }

    except Exception as e:

        return {
            "evaluation": f"ERROR: {str(e)}"
        }