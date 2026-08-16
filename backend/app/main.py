from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.database import engine, Base
from app.routers import auth, dashboard, chat, proposals, payments

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print(f"Warning: Database initialization error: {e}")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS setup for local frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(dashboard.router)
app.include_router(chat.router)
app.include_router(proposals.router)
app.include_router(payments.router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "app": "GigForge Backend",
        "environment": settings.ENVIRONMENT,
        "model": "Gemini 3.5 Flash (Google AI Studio API)"
    }
