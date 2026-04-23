# ============================================================
# Ace Chatbot - Backend (FastAPI + OpenAI)
# File: backend/main.py
# Run: uvicorn main:app --reload
# ============================================================

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import openai
import os
from dotenv import load_dotenv
load_dotenv()   # This reads your .env file automatically
# ── App Setup ────────────────────────────────────────────────
app = FastAPI(title="Ace Chatbot API", version="1.0.0")

# Allow frontend (React on port 3000) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set your OpenAI API key (get it from platform.openai.com)
# NEVER hardcode keys — always use environment variables
openai.api_key = os.getenv("OPENAI_API_KEY")

# ── Data Models (Pydantic validates incoming JSON) ───────────
class ChatMessage(BaseModel):
    role: str        # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    reply: str
    tokens_used: int

# ── System Prompt (gives the AI its personality) ─────────────
SYSTEM_PROMPT = """You are a helpful AI assistant built for the 
Cognizant Ace Team project demo. You help users with questions 
about full-stack development, AI, Python, and software engineering.
Keep answers concise, clear, and beginner-friendly."""

# ── Routes ───────────────────────────────────────────────────
@app.get("/")
def root():
    """Health check endpoint"""
    return {"status": "running", "message": "Ace Chatbot API is live!"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Main chat endpoint.
    Receives user message + conversation history,
    returns AI response.
    """
    try:
        # Build message list: system prompt + history + new message
        messages = [{"role": "system", "content": SYSTEM_PROMPT}]

        # Add conversation history (so AI remembers context)
        for msg in request.history:
            messages.append({"role": msg.role, "content": msg.content})

        # Add the new user message
        messages.append({"role": "user", "content": request.message})

        # Call OpenAI API
        response = openai.chat.completions.create(
            model="gpt-4o-mini",       # Cheap + fast — perfect for demos
            messages=messages,
            max_tokens=500,
            temperature=0.7,           # 0=robotic, 1=creative — 0.7 is balanced
        )

        reply = response.choices[0].message.content
        tokens = response.usage.total_tokens

        return ChatResponse(reply=reply, tokens_used=tokens)

    except openai.AuthenticationError:
        raise HTTPException(status_code=401, detail="Invalid OpenAI API key")
    except openai.RateLimitError:
        raise HTTPException(status_code=429, detail="Rate limit hit — try again")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history")
def get_info():
    """Returns info about the API — useful for frontend"""
    return {
        "model": "gpt-4o-mini",
        "endpoints": ["/chat", "/"],
        "project": "Cognizant Ace Team Demo"
    }