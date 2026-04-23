# Ace Chatbot

A full-stack AI chatbot application built with FastAPI and React. Users can have multi-turn conversations with an AI assistant powered by OpenAI's GPT-4o-mini model.

## Live Demo

| | URL |
|--|--|
| App | https://ace-chatbot-frontend.onrender.com |
| API | https://ace-chatbot-backend.onrender.com |
| API Docs | https://ace-chatbot-backend.onrender.com/docs |

> Note: May take ~30 seconds to load on first visit (free hosting tier).

## Screenshot

![Ace Chatbot](screenshot.png)

## Tech Stack

- **Backend:** Python, FastAPI, Uvicorn
- **Frontend:** React.js
- **AI:** OpenAI GPT-4o-mini API
- **Deployment:** Render.com

## Features

- Multi-turn conversation with memory of previous messages
- REST API backend with automatic Swagger documentation
- Secure API key management using environment variables
- CORS-enabled for frontend-backend communication
- Clean responsive UI

## Project Structure

```
ace-chatbot/
├── backend/
│   ├── main.py            # FastAPI server
│   └── requirements.txt   # Python dependencies
├── frontend/
│   └── my-app/            # React application
└── streamlit_app.py       # Streamlit alternative UI
```

## Getting Started

### Prerequisites
- Python 3.10+
- Node.js 18+
- OpenAI API key

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` folder:
```
OPENAI_API_KEY=your-key-here
```

Run the server:
```bash
uvicorn main:app --reload
```

API will be available at `http://localhost:8000`

### Frontend Setup

```bash
cd frontend/my-app
npm install
npm start
```

App will open at `http://localhost:3000`

## How It Works

The frontend sends a POST request to `/chat` with the user message and conversation history. The FastAPI backend appends a system prompt and forwards the full message list to OpenAI's API. The response is returned as JSON and displayed in the UI.

```
User → React Frontend → POST /chat → FastAPI → OpenAI API → Response → UI
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| POST | `/chat` | Send a message and get AI response |
| GET | `/docs` | Interactive API documentation |

## Environment Variables

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Your OpenAI API key |