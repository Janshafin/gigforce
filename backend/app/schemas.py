from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    provider: Optional[str] = "google"

class UserResponse(UserBase):
    id: str
    gemini_api_key: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

class MagicLinkRequest(BaseModel):
    email: EmailStr

class MagicLinkVerify(BaseModel):
    token: str

class GoogleAuthRequest(BaseModel):
    id_token: str
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    avatar_url: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LeadBase(BaseModel):
    client_name: str
    company: Optional[str] = None
    project_title: str
    description: Optional[str] = None
    value: float = 0.0
    status: Optional[str] = "New Lead"
    source: Optional[str] = "Direct"

class LeadCreate(LeadBase):
    pass

class LeadResponse(LeadBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ProposalBase(BaseModel):
    title: str
    client_name: str
    status: Optional[str] = "Draft"
    executive_summary: Optional[str] = None
    deliverables: Optional[List[str]] = None
    pricing: float = 0.0
    full_content: Optional[str] = None
    lead_id: Optional[str] = None

class ProposalCreate(ProposalBase):
    pass

class ProposalResponse(ProposalBase):
    id: str
    user_id: str
    version: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ChatMessageCreate(BaseModel):
    content: str

class ChatMessageResponse(BaseModel):
    id: str
    role: str
    content: str
    action_type: Optional[str] = None
    action_meta: Optional[Any] = None
    created_at: datetime

    class Config:
        from_attributes = True

class DashboardSummary(BaseModel):
    active_proposals_count: int
    leads_pipeline_value: float
    monthly_earnings: float
    recent_leads: List[LeadResponse]
    active_proposals: List[ProposalResponse]
