# CareerAI — AI-Powered Job Recommendation System

CareerAI analyzes a candidate's education, skills, certifications, experience, and academic score, then uses a trained machine learning model to recommend the career path they're best suited for. It's a full-stack Django project: a Random Forest classifier trained on real resume/career datasets, served through a REST API, with a multi-page frontend (landing page, profile form, and results dashboard) built on top of it.

> Live result, not a mockup — the dashboard's predicted career, confidence score, and ranked list all come from a real API call to the trained model. Nothing on the results page is hardcoded.

---

## How it works

```
User profile (education, skills, certifications, experience, CGPA)
        ↓
Data preprocessing + feature engineering (TF-IDF on skills/certifications,
ordinal education encoding, scaled numeric features)
        ↓
Random Forest classifier (300 trees, trained on 1,166 merged & cleaned
resume/career records)
        ↓
Ranked prediction across 4 career classes:
AI Researcher · Cybersecurity Analyst · Data Scientist · Software Engineer
```

**Model performance** (on a held-out 234-row test set):

| Metric | Score |
|---|---|
| Accuracy | 92.31% |
| Precision (macro) | 92.95% |
| Recall (macro) | 92.45% |
| F1 (macro) | 92.65% |

---

## Features

- **Real-time prediction API** — submit a profile, get back a predicted career, a confidence score, and a full ranked breakdown across all 4 classes.
- **Persisted history** — every prediction is logged to the database (`RecommendationLog`), every training run is recorded with its full metrics (`TrainingRun`), so nothing is lost between server restarts.
- **Model loaded once, not per-request** — the trained model, encoders, and label classes are loaded into memory a single time on server startup (via `RecommendationsConfig.ready()`), so predictions don't touch disk.
- **Retrainable on demand** — `python manage.py train_model` re-runs the full pipeline (merge datasets → preprocess → engineer features → train → evaluate → save) and logs the result, without ever needing to restart the server by hand.
- **Three-page frontend** — a landing page, a guided multi-step profile form with a live loading sequence, and a results dashboard with charts (Chart.js), a skill-gap roadmap, and per-career detail modals — all driven by the real API response above.
- **Production-ready settings** — environment-based `DATABASE_URL` config (`dj-database-url`, defaults to SQLite locally), Whitenoise for static files, and a Vercel deployment config out of the box.

---

## Tech stack

| Layer | Stack |
|---|---|
| Backend | Python, Django 4.2, Django REST Framework |
| Machine learning | scikit-learn (Random Forest), pandas, numpy, scipy, joblib |
| Database | SQLite locally, swappable for PostgreSQL in production via `dj-database-url` |
| Frontend | HTML5, CSS3 (custom design system), Bootstrap 5, vanilla JavaScript |
| Frontend extras | Chart.js (dashboard charts), Three.js + GSAP/ScrollTrigger + Lenis (animated hero/scroll effects) |
| Deployment | Vercel (`vercel.json`, `build_files.sh`), Whitenoise, Gunicorn |

---

## Project structure

```text
career_recommendation/
│
├── career_recommendation/        # Django project settings & root URLs
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py / asgi.py
│
├── recommendations/               # Main Django app
│   ├── ml/                        # Training pipeline
│   │   ├── data_preprocessing.py  # Cleans & merges the two source datasets
│   │   ├── feature_engineering.py # TF-IDF + scaling + train/test split
│   │   └── model_training.py      # Trains, evaluates, saves the model
│   ├── management/commands/
│   │   └── train_model.py         # `python manage.py train_model`
│   ├── models.py                  # UserProfile, RecommendationLog, TrainingRun
│   ├── serializers.py             # Input validation + response shaping
│   ├── views.py                   # predict / history / metrics API views
│   ├── urls.py                    # /api/recommendations/ routes
│   ├── static/                    # CSS, JS (incl. Three.js scene)
│   └── templates/                 # home, recommendation, dashboard, base
│
├── data/                          # Source CSV datasets
├── ml_models/                     # Trained model artifacts (.joblib, metrics, confusion matrix)
├── manage.py
├── requirements.txt
├── vercel.json                    # Vercel serverless config
└── build_files.sh                 # Vercel build script
```

---

## Getting started locally

### Prerequisites
- Python 3.10+
- pip

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/career_recommendation.git
cd career_recommendation
```

### 2. Create and activate a virtual environment
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS / Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run database migrations
```bash
python manage.py migrate
```

### 5. Train the model
A pre-trained model is already included in `ml_models/`, so this step is optional — but to train from scratch (or after changing the datasets):
```bash
python manage.py train_model
```
This merges and cleans both datasets in `data/`, engineers features, trains the Random Forest, evaluates it on a held-out split, and saves the model, encoders, and metrics to `ml_models/`.

### 6. Start the server
```bash
python manage.py runserver
```

| Page | URL |
|---|---|
| Landing page | `http://127.0.0.1:8000/` |
| Recommendation form | `http://127.0.0.1:8000/recommendation/` |
| Dashboard | `http://127.0.0.1:8000/dashboard/` |

---

## API reference

All endpoints are prefixed with `/api/recommendations/`.

### `POST /predict/` (also supports `GET` with query params)
Runs a profile through the trained model and returns a ranked prediction.

**Request body**
```json
{
  "education_level": "Master",
  "skills": "Python, Machine Learning, TensorFlow",
  "certifications": "AWS Certified",
  "experience_score": 7.5,
  "cgpa": 85.0
}
```
All fields are optional — defaults are `Bachelor`, `"None"`, `"None"`, `5.0`, and `70.0` respectively.

**Response**
```json
{
  "profile_id": 12,
  "predicted_career": "AI Researcher",
  "confidence": "51.68%",
  "ranked_careers": [
    { "career": "AI Researcher", "probability": "51.68%" },
    { "career": "Data Scientist", "probability": "47.24%" },
    { "career": "Software Engineer", "probability": "0.91%" },
    { "career": "Cybersecurity Analyst", "probability": "0.17%" }
  ],
  "log_id": 12
}
```

### `GET /history/?limit=50`
Returns past predictions (most recent first). `limit` defaults to 50, capped at 200.

### `GET /metrics/`
Returns accuracy, precision, recall, and F1 from the most recent training run.

---

## Deployment

This project is pre-configured for Vercel:
- `vercel.json` routes static files and traffic to the Django WSGI app.
- `build_files.sh` installs dependencies, runs `collectstatic`, and applies migrations during the build step.

To deploy: import the repository into Vercel and set the following environment variables if you're not using the default SQLite database:
- `SECRET_KEY` — a real Django secret key (don't use the development default)
- `DATABASE_URL` — a PostgreSQL connection string (optional; falls back to SQLite if unset)

---

## Datasets

Two source datasets are merged and cleaned during training:

| Dataset | Rows | Notes |
|---|---|---|
| `AI_Resume_Screening.csv` | 1,000 | Resume-level data with 4 job-role labels |
| `AI-based_Career_Recommendation_System.csv` | 200 | Candidate profiles with 32 specific career labels, mapped down to the same 4 classes |

After cleaning, deduplication, and merging: **1,166 rows** across the 4 final career classes (AI Researcher, Cybersecurity Analyst, Data Scientist, Software Engineer).

