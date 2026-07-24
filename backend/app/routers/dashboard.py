from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models import Lead, Proposal, User
from app.schemas import DashboardSummary, LeadResponse, ProposalResponse

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

async def seed_demo_data_if_empty(db: AsyncSession):
    leads_res = await db.execute(select(Lead))
    if not leads_res.scalars().first():
        user_res = await db.execute(select(User))
        user = user_res.scalars().first()
        user_id = user.id if user else "demo-user-id"

        sample_leads = [
            Lead(user_id=user_id, client_name="TechCorp AI", company="TechCorp", project_title="Next.js Enterprise Dashboard", value=12500.00, status="In Discussion", source="Upwork", description="Need a senior Next.js developer to build a AI management dashboard."),
            Lead(user_id=user_id, client_name="FinPulse Studio", company="FinPulse Inc", project_title="FastAPI Microservice Migration", value=8400.00, status="Proposal Sent", source="LinkedIn", description="Migrate legacy Node monolith to FastAPI with async Postgres."),
            Lead(user_id=user_id, client_name="Nexus Health", company="Nexus Digital", project_title="HIPAA Compliant Client Portal", value=18500.00, status="New Lead", source="Referral", description="Redesign client facing web application with modern Tailwind design system."),
            Lead(user_id=user_id, client_name="Aura Design Agency", company="Aura Agency", project_title="Design System & Component Library", value=5800.00, status="Won", source="Direct", description="Build custom React Tailwind UI kit with Storybook documentation."),
        ]
        db.add_all(sample_leads)

        sample_proposals = [
            Proposal(user_id=user_id, client_name="TechCorp AI", title="TechCorp Next.js Dashboard Architecture Proposal", status="Draft", pricing=12500.00, executive_summary="High-performance Next.js 14 App Router platform integrated with Google Cloud Run & Gemini AI co-founder agent.", deliverables=["Full UX design & tailwind code", "FastAPI backend integration", "Cloud Run deployment pipeline"]),
            Proposal(user_id=user_id, client_name="FinPulse Studio", title="FastAPI Async Backend Migration Blueprint", status="Sent", pricing=8400.00, executive_summary="Modernizing backend architecture to asynchronous FastAPI with PostgreSQL database layer.", deliverables=["FastAPI REST API", "SQLAlchemy Async ORM", "Docker environment"]),
            Proposal(user_id=user_id, client_name="Aura Design Agency", title="Lumina Forge UI Component Kit Proposal", status="Accepted", pricing=5800.00, executive_summary="Design system package with dark mode first aesthetic and glassmorphism styling.", deliverables=["Figma to React components", "Tailwind CSS tokens", "Documentation"]),
        ]
        db.add_all(sample_proposals)
        await db.commit()

@router.get("/summary", response_model=DashboardSummary)
async def get_dashboard_summary(db: AsyncSession = Depends(get_db)):
    await seed_demo_data_if_empty(db)

    leads_res = await db.execute(select(Lead))
    leads = leads_res.scalars().all()

    proposals_res = await db.execute(select(Proposal))
    proposals = proposals_res.scalars().all()

    active_proposals_count = len([p for p in proposals if p.status in ["Draft", "Sent", "Review"]])
    leads_pipeline_value = sum(l.value for l in leads if l.status != "Lost")
    monthly_earnings = sum(p.pricing for p in proposals if p.status == "Accepted") or 8400.00

    return DashboardSummary(
        active_proposals_count=active_proposals_count,
        leads_pipeline_value=leads_pipeline_value,
        monthly_earnings=monthly_earnings,
        recent_leads=[LeadResponse.model_validate(l) for l in leads[:5]],
        active_proposals=[ProposalResponse.model_validate(p) for p in proposals[:4]]
    )
