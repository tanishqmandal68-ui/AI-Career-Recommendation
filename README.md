# 🚀 CareerAI Ecosystem — The Ultimate AI Career & Job Advisor Suite

A modern, production-ready, full-stack ecosystem designed to revolutionize how students and professionals build resumes, receive AI-powered career recommendations, and navigate their professional journeys. 

This platform combines a **Deep Learning Career Recommendation Engine** (Django/scikit-learn), a **Lightning-Fast Interactive Resume Builder**, an **ATS-focused AI Resume Analyzer**, and a **RAG-Powered AI Job Advisor Chatbot**.

---

## 🔗 Live Applications

Try out the live applications in the CareerAI Ecosystem:
*   📄 **AI Resume Analyzer:** [Launch App](https://ai-resume-analyzer-two-pi.vercel.app)
*   🛠️ **Resume Builder:** [Launch App](https://resumebuilder2-six.vercel.app)
*   🤖 **AI Job Advisor Chatbot:** [Launch App](https://chatbot-delta-five-48.vercel.app)

---

## 🌟 Ecosystem Overview

This platform is divided into core pillars:

1. **CareerAI Engine (ML Backend):** A Django-powered REST API that runs proprietary Machine Learning classification models to recommend the perfect career paths based on a user's skills, education, and experience.
2. **Career Navigator (Resume Builder):** A React/TypeScript application utilizing React Router and Vite, allowing users to build live ATS-friendly resumes and view their career analytics in an interactive UI.
3. **AI Resume Analyzer:** A dedicated tool to scan, parse, and score resumes against Applicant Tracking System (ATS) standards, providing actionable insights.
4. **Job Advisor AI (Chatbot & RAG):** An intelligent career assistance chatbot (FastAPI Backend + React/Zustand Frontend) that combines local dataset grounding with Large Language Models (LLMs) to provide personalized job recommendations, resume analysis, and interview preparation.

---

## 🏗️ Architecture

```text
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND SUITE                           │
│                   React + Vite + Zustand                        │
│  ┌──────────┐  ┌──────────────┐  ┌───────────────┐              │
│  │   Chat    │  │   Resume     │  │    Resume     │             │
│  │Interface  │  │  Analyzer    │  │    Builder    │             │
│  └─────┬─────┘  └──────┬───────┘  └───────┬───────┘             │
│        │               │                   │                    │
│        └───────────────┼───────────────────┘                    │
│                        │                                        │
│                   Zustand Store                                 │
│              (Session Persistence)                              │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTP/REST APIs
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       BACKEND SUITE                             │
│                                                                 │
│  ┌──────────────────────┐       ┌────────────────────────────┐  │
│  │  FastAPI (Chatbot)   │       │ Django (CareerAI Engine)   │  │
│  │  • /api/chat         │       │ • /api/recommendations/    │  │
│  │  • /api/analyze      │       │ • /api/history/            │  │
│  └──────────┬───────────┘       └─────────────┬──────────────┘  │
│             │                                 │                 │
│  ┌──────────┴───────────┐       ┌─────────────┴──────────────┐  │
│  │ RAG Engine (TF-IDF)  │       │ Scikit-Learn ML Pipeline   │  │
│  │ Local CSV Context    │       │ Semantic Skill Mapping     │  │
│  └──────────┬───────────┘       └────────────────────────────┘  │
│             │                                                   │
│  ┌──────────┴───────────┐                                       │
│  │ API Manager (LLMs)   │                                       │
│  │ Groq, Moonshot, etc. │                                       │
│  └──────────────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 🧠 Deep AI & Machine Learning (CareerAI)
*   **Semantic Skill Mapping:** Employs a trained scikit-learn classification model to understand contextual relationships rather than relying on exact keyword matching.
*   **Neural Network Scoring:** Cross-references user profiles (education, CGPA, certifications) against thousands of distinct career taxonomies.

### 🔍 AI Resume Analyzer
*   **ATS Resume Scoring:** Analyze resumes against Applicant Tracking System standards.
*   **Keyword Gap Detection:** Identifies missing skills and keywords required for your target job description.
*   **Actionable Insights:** Provides line-by-line feedback on formatting, bullet points, and impact metrics to improve your chances of getting hired.

### 📄 Live AI Resume Builder (Career Navigator)
*   **Live Interactive Preview:** Real-time resume rendering as you type using React's state management.
*   **Multiple Resume Modes:** Tailored templates for both **Students** (education, projects) and **Professionals** (work experience, technical skills).
*   **PDF Export:** Generate professional resumes from structured form input and download as PDF files using `reportlab` or frontend utilities.

### 🤖 Intelligent Career Chat (Job Advisor AI)
*   **RAG-Grounded Responses:** Chatbot uses TF-IDF retrieval over 1,166 career profiles to ensure highly accurate, dataset-backed answers.
*   **Resume Upload & Context:** Upload PDF, DOC, DOCX, or image files for context-aware career advice.
*   **Multi-Session Management:** Create, switch, and delete conversation sessions with persistent history via Zustand.
*   **6-Provider LLM Failover:** Automatic rotation across Groq, Moonshot, OpenRouter, Fireworks, NVIDIA, and Cloudflare.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | React 18, TypeScript, Vite | Core user interface, type-safety, and fast building |
| **Frontend** | React Router, Zustand | Navigation and global state management |
| **Frontend** | TailwindCSS, Bootstrap, Three.js | Styling, responsive UI, and interactive 3D graphics |
| **Frontend** | react-markdown, DOMPurify | Safe Markdown rendering and XSS sanitization |
| **Backend** | Python 3.10+, Django 4.2+, DRF | Core Machine Learning API and data persistence |
| **Backend** | FastAPI, Uvicorn | High-performance asynchronous API for the Chatbot |
| **AI/ML** | scikit-learn, pandas, numpy | Classification models, TF-IDF vectorization, data manipulation |
| **Data/LLMs**| Groq (Llama 3.3 70B), SQLite | Primary LLM provider and relational database |
| **Tools** | pdfplumber, python-docx, reportlab | PDF/Word document extraction and PDF generation |

---

## 🚀 Installation & Local Development

### Prerequisites
*   Python 3.13+
*   Node.js 18+ and npm
*   Git

### 1. Job Advisor Chatbot & Analyzer Backend (FastAPI)

```bash
cd Ai_Job_Recommendation_Chatbot
python -m venv career_env
# Windows: career_env\Scripts\activate | Mac/Linux: source career_env/bin/activate

pip install -r requirements.txt
cp backend/.env.example backend/.env

# Start the FastAPI server
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000
```
*FastAPI runs at `http://localhost:8000`*

### 2. CareerAI Recommendation Engine (Django)

```bash
cd career_recommendation
python -m venv myvenv
# Windows: myvenv\Scripts\activate | Mac/Linux: source myvenv/bin/activate

pip install -r requirements.txt
python manage.py migrate

# Train the ML model (optional if pre-trained)
python manage.py train_model

# Start the Django API
python manage.py runserver 8001
```
*Django API runs at `http://localhost:8001`*

### 3. Frontend Suite (React / Vite)

```bash
cd frontend  # (or ai-resume-builder depending on your folder name)
npm install

# Start development server
npm run dev
```
*Frontend runs at `http://localhost:5173`*

---

## 🔑 Environment Configuration (.env)

For the Job Advisor AI, you must configure at least one LLM provider in your `backend/.env` file:

```env
# Required: At least one LLM provider
GROQ_API_KEYS=["your_groq_api_key_here"]

# Optional: Additional providers for failover redundancy
MOONSHOT_API_KEYS=["your_moonshot_api_key_here"]
OPENROUTER_API_KEYS=["your_openrouter_api_key_here"]
FIREWORKS_API_KEYS=["your_fireworks_api_key_here"]
NVIDIA_NIM_API_KEYS=["your_nvidia_nim_api_key_here"]
CLOUDFLARE_WORKERS_API_KEYS=["your_cloudflare_workers_api_key_here"]
```

---

## 🌐 API Endpoints Reference

### FastAPI Chatbot Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/chat` | Send message to chatbot |
| `POST` | `/api/upload-resume` | Upload resume file for parsing |
| `POST` | `/api/analyze-resume` | ATS scoring and keyword analysis |
| `POST` | `/api/build-resume` | Generate PDF resume |

### Django CareerAI Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/recommendations/predict/` | Submit user profile and return ranked career predictions |
| `GET`  | `/api/recommendations/history/` | Retrieve past prediction logs |
| `GET`  | `/api/recommendations/metrics/` | Fetch scikit-learn model performance metrics |

---

## 🐋 Deployment

### Serverless Deployment (Vercel)
The applications are pre-configured for Vercel. 
*   `vercel.json`: Routes traffic to the WSGI application and serves static files.
*   `build_files.sh`: Installs requirements, collects static files, and applies migrations.

---

## ⚠️ System Limitations & Security
*   **Dataset Size**: RAG retrieval is grounded in 1,166 career profiles.
*   **LLM Context Limits**: Context window is limited to 1,200 tokens. Extracted resume text is capped at 4,000 characters.
*   **Rate Limits**: Subject to provider-specific limits. The built-in 6-provider API manager provides failover handling.
*   **Security**: All AI Markdown responses pass through DOMPurify for XSS protection. PII data is stripped before saving to local storage.

---

## 📜 License & Credits

**MIT License**

Built with ❤️ using React Router, Django, FastAPI, and modern AI models.

<div align="center">
<b>CareerAI Ecosystem</b><br>
<i>Build professional resumes, analyze ATS scores, and accelerate your career journey with AI.</i><br>
</div>
