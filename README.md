# 🤖 Ace Chatbot — Full-Stack AI Project

> Built for the **Cognizant Ace Team** campus hiring program 2026  
> Stack: Python · FastAPI · OpenAI API · React · Streamlit

---

## 📁 Project Structure

```
ace-chatbot/
├── backend/
│   ├── main.py              # FastAPI backend — the brain of the app
│   └── requirements.txt     # Python packages to install
├── frontend/
│   └── src/
│       └── App.jsx          # React frontend — the face of the app
├── streamlit_app.py         # Easier alternative to React (Python only)
└── README.md                # This file
```

---

## 🚀 How to Run (Step by Step)

### Step 1 — Get your OpenAI API Key
1. Go to https://platform.openai.com
2. Sign up (free) → Click "API Keys" → Create new key
3. Copy the key — looks like: `sk-proj-abc123...`

---

### Step 2 — Create your .env file (API Key goes here)

Create a file called `.env` inside the `backend/` folder:

```
backend/
└── .env        ← create this file
```

Paste this inside `.env`:

```
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

> ⚠️ No quotes, no spaces around the `=` sign  
> ⚠️ Never share this file or push it to GitHub

Also create a `.gitignore` file in the root folder to protect your key:

```
# .gitignore
.env
__pycache__/
node_modules/
```

---

### Step 3 — Update main.py to load the .env file

Open `backend/main.py` and make sure these lines are at the top:

```python
from dotenv import load_dotenv
load_dotenv()   # This reads your .env file automatically
```

The line below will now automatically pick up your key from `.env`:

```python
openai.api_key = os.getenv("OPENAI_API_KEY")
```

---

### Step 4 — Run the Backend (FastAPI)

```bash
# Go to backend folder
cd backend

# Install packages (includes python-dotenv)
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload

# You should see:
# INFO: Uvicorn running on http://127.0.0.1:8000
```

Test it by opening: http://127.0.0.1:8000 in your browser ✅

---

### Step 5A — Run the Frontend (React)

```bash
# Go to frontend folder
cd frontend

# Install packages
npm install

# Start React app
npm start

# Opens at http://localhost:3000
```

---

### Step 5B — Run Streamlit (Easier Alternative)

```bash
# From the root folder
pip install streamlit openai

streamlit run streamlit_app.py

# Opens at http://localhost:8501
# Enter your API key in the sidebar
```

---

## 🧠 How It Works (Explain in Interview)

```
User types message
       ↓
React/Streamlit Frontend
       ↓  (HTTP POST /chat)
FastAPI Backend (main.py)
       ↓  (API call)
OpenAI GPT-4o-mini
       ↓  (response)
FastAPI returns JSON
       ↓
Frontend displays reply
```

---

## 🎯 Key Concepts to Know for Interview

### 1. REST API
- FastAPI creates endpoints like `/chat`, `/`
- Frontend sends **POST** request with JSON body
- Backend returns JSON response

### 2. LLM Integration
- We use `openai.chat.completions.create()`
- We send: system prompt + history + new message
- Model returns a text completion

### 3. Conversation History
- We pass all previous messages to the API
- This gives the AI "memory" of the conversation
- Without history, each message would be treated fresh

### 4. Environment Variables
- Never hardcode API keys in code
- Use `os.getenv("OPENAI_API_KEY")` 
- Store in `.env` file locally, set in Render for deployment

---

## 🌐 Deploy for Free (Render.com)

### Backend
1. Push code to GitHub
2. Go to render.com → New → Web Service
3. Connect your GitHub repo
4. Build command: `pip install -r requirements.txt`
5. Start command: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Add environment variable: `OPENAI_API_KEY = your-key`

### Frontend
1. Go to render.com → New → Static Site
2. Connect frontend folder
3. Build: `npm install && npm run build`
4. Publish: `build`

---

## 📝 Resume Line (Copy This)

> "Built an AI-powered full-stack chatbot using FastAPI (Python) and React, integrating OpenAI's GPT-4o-mini API with multi-turn conversation history. Deployed on Render.com with CORS-enabled REST API architecture."

---

## 🔧 Next Steps to Upgrade the Project

| Feature | What to add | Difficulty |
|---------|------------|------------|
| PDF Q&A | LangChain + FAISS vector DB | Medium |
| Chat history DB | SQLite + SQLAlchemy | Easy |
| Auth | JWT tokens | Medium |
| Better UI | Tailwind CSS | Easy |
| Streaming responses | SSE / WebSockets | Hard |

---

*Built with ❤️ for Cognizant Ace Team 2026 interview preparation*
