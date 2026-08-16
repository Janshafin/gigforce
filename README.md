<div align="center">
  <img src="https://via.placeholder.com/150x150/1F1F1F/FF6B35?text=GigForge" alt="GigForge Logo" width="120" height="120" style="border-radius: 20px;" />
  
  # GigForge
  
  **The AI Co-Founder for Freelancers & Solopreneurs**
  
  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

  <p align="center">
    Freelancers and solopreneurs waste 15–25 hours a week on admin, client acquisition, and proposal writing. Most fail to scale beyond $3–5k/month due to a lack of structured support. <br/> <b>GigForge changes that.</b>
  </p>
</div>

---

## ⚡ Overview

GigForge is an intelligent platform featuring an **AI Co-Founder** that works alongside you to scale your freelance business. You chat naturally; the agent executes across your entire toolstack. 

Instead of dealing with scattered CRMs and manual proposal drafting, GigForge provides a unified, highly aesthetic dashboard to manage your entire revenue pipeline.

## ✨ Key Features

- **🤖 AI Co-Founder Chatbot:** Chat naturally with your AI Co-Founder. Ask it to "write a proposal for TechCorp" or "review my hourly rates", and it will dynamically analyze your active leads and generate actionable strategies.
- **📈 AI Lead Engine:** Stop cold emailing in the dark. GigForge qualifies leads, estimates project budgets, and tracks your pipeline from discovery to contract.
- **📝 Proposal Automation:** Generate high-converting, multi-tiered proposals based on project constraints and your historical win rates in a single click.
- **💰 Revenue Management:** Track your monthly recurring revenue (MRR), manage one-click contracts, and automate invoicing directly from the dashboard.
- **🎨 Premium Aesthetic:** Designed with a stunning charcoal and burnt-orange color palette, ensuring your workspace looks as professional as the work you deliver.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4 & CSS Modules (Strict Custom Variables)
- **Icons:** Lucide React

### Backend
- **Framework:** FastAPI (Python)
- **Database:** SQLite with SQLAlchemy (Async)
- **AI Engine:** Google Gemini 1.5 Pro/Flash Integration

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.10+)

### 1. Start the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

### 3. Open the App
Navigate to [http://localhost:3000](http://localhost:3000) in your browser. The frontend will communicate with the FastAPI backend running on port 8000.

---

<div align="center">
  <i>Built for the modern solopreneur. Take your time back and scale your income.</i>
</div>
