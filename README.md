# Authentra

Authentra is a full-stack, open-source web application for detecting plagiarism signals and AI-generated writing in research papers, essays, and articles. It uses a React frontend, a Node.js/Express backend, and a Python/Flask AI detection microservice powered by Hugging Face Transformers.

## Project Structure

```text
Authentra/
  frontend/
    src/
      components/
      pages/
      services/
  backend/
    controllers/
    data/
    routes/
    services/
    utils/
  ai-service/
    detector.py
```

## Features

- Paste text directly into the app
- Upload `PDF`, `DOCX`, and `TXT` files
- Extract document text automatically
- Detect plagiarism with:
  - N-gram similarity
  - Jaccard similarity
  - Cosine similarity with TF-IDF
- Compare against:
  - Internal sentence overlap
  - A stored local reference database
  - Web search snippets from DuckDuckGo
- Detect AI-generated content using `roberta-base-openai-detector`
- Highlight suspicious sentences
- Responsive modern UI with loading and error states

## Requirements

- Node.js 18+
- Python 3.10+
- npm 9+

## Local Installation

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Install backend dependencies

```bash
cd ../backend
npm install
```

### 3. Install Python AI service dependencies

```bash
cd ../ai-service
python -m venv venv
```

On Windows:

```bash
venv\Scripts\activate
pip install -r requirements.txt
```

On macOS/Linux:

```bash
source venv/bin/activate
pip install -r requirements.txt
```

## Environment Setup

Create a `.env` file inside `backend/` using `backend/.env.example`.

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
AI_SERVICE_URL=http://127.0.0.1:5001
```

## Run the App

Start three terminals.

### Terminal 1

```bash
cd ai-service
venv\Scripts\activate
python detector.py
```

### Terminal 2

```bash
cd backend
npm run dev
```

### Terminal 3

```bash
cd frontend
npm run dev
```

## Deployment

### Frontend on Vercel

1. Import the `frontend` directory into Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add `VITE_API_URL=https://your-render-backend.onrender.com/api`

### Backend on Render

1. Create a Web Service with root directory `backend`
2. Build command: `npm install`
3. Start command: `npm start`
4. Add:
   - `PORT=10000`
   - `FRONTEND_URL=https://your-vercel-app.vercel.app`
   - `AI_SERVICE_URL=https://your-hf-space-url.hf.space`

### AI Service on Hugging Face Spaces

1. Create a Space and upload `ai-service/`
2. Start command: `python detector.py`

For production, you can use:

```bash
gunicorn -b 0.0.0.0:7860 detector:app
```

## Notes

- Web matching depends on public DuckDuckGo HTML results and network availability.
- The AI detector model is open-source, but the first run may take time while the model downloads.
- This project is intended as a practical screening tool, not a legal or academic misconduct verdict engine.
