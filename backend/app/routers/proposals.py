from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import get_db
from app.models import Proposal, Lead
from app.schemas import ProposalResponse, ProposalCreate, LeadResponse, LeadCreate

router = APIRouter(prefix="/api", tags=["proposals_leads"])

@router.get("/proposals", response_model=List[ProposalResponse])
async def list_proposals(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Proposal).order_by(Proposal.updated_at.desc()))
    proposals = result.scalars().all()
    return [ProposalResponse.model_validate(p) for p in proposals]

@router.post("/proposals", response_model=ProposalResponse)
async def create_proposal(req: ProposalCreate, db: AsyncSession = Depends(get_db)):
    proposal = Proposal(
        user_id="user-default",
        title=req.title,
        client_name=req.client_name,
        status=req.status or "Draft",
        executive_summary=req.executive_summary or "AI co-founder generated proposal draft.",
        deliverables=req.deliverables or ["Discovery & Planning", "Implementation", "Deployment"],
        pricing=req.pricing,
        full_content=req.full_content or f"# Proposal for {req.client_name}\n\n## Overview\n{req.executive_summary}",
        lead_id=req.lead_id
    )
    db.add(proposal)
    await db.commit()
    await db.refresh(proposal)
    return ProposalResponse.model_validate(proposal)

@router.get("/leads", response_model=List[LeadResponse])
async def list_leads(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Lead).order_by(Lead.updated_at.desc()))
    leads = result.scalars().all()
    return [LeadResponse.model_validate(l) for l in leads]

@router.post("/leads", response_model=LeadResponse)
async def create_lead(req: LeadCreate, db: AsyncSession = Depends(get_db)):
    lead = Lead(
        user_id="user-default",
        client_name=req.client_name,
        company=req.company,
        project_title=req.project_title,
        description=req.description,
        value=req.value,
        status=req.status or "New Lead",
        source=req.source or "Direct"
    )
    db.add(lead)
    await db.commit()
    await db.refresh(lead)
    return LeadResponse.model_validate(lead)
