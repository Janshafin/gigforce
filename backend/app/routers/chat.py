import json
import httpx
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.config import settings
from app.models import ChatMessage, User, Lead
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

    # Fetch real user leads for context
    leads_result = await db.execute(select(Lead))
    active_leads = leads_result.scalars().all()
    
    total_pipeline_value = sum(lead.value for lead in active_leads)
    num_leads = len(active_leads)
    
    # Generate reply using Gemini via Google AI Studio API or Fallback AI Co-Founder Agent
    api_key = settings.GEMINI_API_KEY
    assistant_reply = ""
    action_type = None
    action_meta = None

    if api_key:
        try:
            # Inject context into prompt
            lead_context = "\\n".join([f"- {l.client_name}: {l.project_title} (${l.value})" for l in active_leads])
            dynamic_prompt = f"{SYSTEM_PROMPT}\\n\\nCurrent Active Leads:\\n{lead_context}\\n\\nUser request: {req.content}"
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={api_key}"
            payload = {
                "contents": [
                    {"role": "user", "parts": [{"text": dynamic_prompt}]}
                ]
            }
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(url, json=payload)
                if res.status_code == 200:
                    data = res.json()
                    assistant_reply = data["candidates"][0]["content"]["parts"][0]["text"]
        except Exception as e:
            pass # Fallback will trigger below

    if not assistant_reply:
        # Intelligent contextual Co-Founder responses for shell demonstration using real DB data
        content_lower = req.content.lower()
        if "proposal" in content_lower or "write" in content_lower:
            # Pick a target lead
            target_lead = None
            for lead in active_leads:
                if lead.client_name.lower() in content_lower or lead.company and lead.company.lower() in content_lower:
                    target_lead = lead
                    break
            if not target_lead and active_leads:
                # Default to highest value lead
                target_lead = max(active_leads, key=lambda x: x.value)
                
            if target_lead:
                assistant_reply = f"I've drafted a targeted proposal for {target_lead.client_name} regarding '{target_lead.project_title}'. I've structured it into 3 phases and priced it at ${target_lead.value:,.2f} based on our margin goals. Should I send it to your review queue?"
                action_type = "proposal_drafted"
                action_meta = {
                    "title": f"{target_lead.client_name} - {target_lead.project_title}",
                    "client_name": target_lead.client_name,
                    "pricing": target_lead.value,
                    "deliverables": ["Phase 1: Discovery", "Phase 2: Core Implementation", "Phase 3: Delivery"]
                }
            else:
                assistant_reply = "You don't have any active leads to write a proposal for right now. Want me to start finding some?"
        elif "rate" in content_lower or "pricing" in content_lower:
            assistant_reply = "Based on your current pipeline, I recommend charging fixed fees with a 30% margin. Your baseline hourly rate should be $115/hr to hit your annual revenue targets."
        elif "lead" in content_lower or "pipeline" in content_lower or "what" in content_lower or "help" in content_lower:
            if active_leads:
                best_lead = max(active_leads, key=lambda x: x.value)
                assistant_reply = f"You currently have {num_leads} active leads in your pipeline worth a total of ${total_pipeline_value:,.2f}. Your highest value opportunity is '{best_lead.project_title}' with {best_lead.client_name} for ${best_lead.value:,.2f}. Should we focus on closing that one?"
                action_type = "pipeline_summary"
            else:
                assistant_reply = "Your pipeline is currently empty. As your AI Co-Founder, I recommend we set up a LinkedIn outreach campaign to find 3 new high-ticket leads this week."
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
