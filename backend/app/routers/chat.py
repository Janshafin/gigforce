import json
import httpx
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.config import settings
from app.models import ChatMessage, User
from app.schemas import ChatMessageCreate, ChatMessageResponse

router = APIRouter(prefix="/api/chat", tags=["chat"])

SYSTEM_PROMPT = """You are GigForge AI Co-Founder — an expert freelance strategist, lead converter, and proposal writer.
Your job is to help the freelancer close high-ticket clients, write winning proposals, analyze project scopes, and automate client communication.
Be concise, proactive, encouraging, and highly tactical. Always offer structured next steps."""

@router.get("/history", response_model=List[ChatMessageResponse])
async def get_chat_history(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ChatMessage).order_by(ChatMessage.created_at.asc()))
    messages = result.scalars().all()
    if not messages:
        # Seed initial greeting from AI Co-Founder
        initial_msg = ChatMessage(
            user_id="system",
            role="assistant",
            content="Hey! I'm your GigForge AI Co-Founder. I just analyzed your pipeline: you have 3 active leads worth $39,400. Would you like me to draft a high-converting proposal for TechCorp AI or review your hourly rates?",
            action_type="pipeline_summary",
            action_meta={"suggested_actions": ["Draft TechCorp Proposal", "Analyze Leads Pipeline", "Review Rate Calculator"]}
        )
        db.add(initial_msg)
        await db.commit()
        await db.refresh(initial_msg)
        messages = [initial_msg]

    return [ChatMessageResponse.model_validate(m) for m in messages]

@router.post("/send", response_model=ChatMessageResponse)
async def send_chat_message(req: ChatMessageCreate, db: AsyncSession = Depends(get_db)):
    # Save user message
    user_msg = ChatMessage(
        user_id="user-default",
        role="user",
        content=req.content
    )
    db.add(user_msg)
    await db.commit()

    # Generate reply using Gemini via Google AI Studio API or Fallback AI Co-Founder Agent
    api_key = settings.GEMINI_API_KEY
    assistant_reply = ""
    action_type = None
    action_meta = None

    if api_key:
        print("GEMINI KEY EXISTS:", bool(api_key))
        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": f"{SYSTEM_PROMPT}\n\nUser request: {req.content}"}]}
                ]
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, json=payload)
                print("GEMINI STATUS:", res.status_code)
                print("GEMINI BODY:", res.text)
                if res.status_code == 200:
                    data = res.json()
                    assistant_reply = data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            assistant_reply = f"I processed your request for: '{req.content}'. (Gemini API fallback activated: {str(e)})"

    if not assistant_reply:
        # Intelligent contextual Co-Founder responses for shell demonstration
        content_lower = req.content.lower()
        if "proposal" in content_lower or "techcorp" in content_lower:
            assistant_reply = "I've drafted a targeted 3-tier proposal for TechCorp AI. It covers Phase 1: Next.js Frontend Architecture, Phase 2: FastAPI & Gemini Integration, and Phase 3: Cloud Run Deployment. Total estimated budget: $12,500."
            action_type = "proposal_drafted"
            action_meta = {
                "title": "TechCorp AI Next.js & Gemini Architecture",
                "client_name": "TechCorp AI",
                "pricing": 12500.0,
                "deliverables": ["Next.js App Router UI", "FastAPI Backend", "Gemini 1.5 Integration"]
            }
        elif "rate" in content_lower or "pricing" in content_lower:
            assistant_reply = "Based on your target of $120,000 annual revenue and 25 billable hours/week, your baseline hourly rate should be $115/hr. For project-based proposals, I recommend charging fixed fees with a 30% margin."
        else:
            assistant_reply = f"Got it! As your AI Co-Founder, I've logged this strategy note: '{req.content}'. I can immediately write a proposal draft, calculate project margins, or prepare outreach responses for your active leads."

    bot_msg = ChatMessage(
        user_id="user-default",
        role="assistant",
        content=assistant_reply,
        action_type=action_type,
        action_meta=action_meta
    )
    db.add(bot_msg)
    await db.commit()
    await db.refresh(bot_msg)

    return ChatMessageResponse.model_validate(bot_msg)
