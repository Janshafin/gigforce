import secrets
from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from jose import jwt, JWTError

from app.database import get_db
from app.config import settings
from app.models import User, MagicToken
from app.schemas import (
    MagicLinkRequest, MagicLinkVerify, GoogleAuthRequest, 
    TokenResponse, UserResponse
)

router = APIRouter(prefix="/api/auth", tags=["auth"])

def create_access_token(user_id: str, email: str) -> str:
    expires_delta = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    expire = datetime.utcnow() + expires_delta
    to_encode = {"sub": user_id, "email": email, "exp": expire}
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/google", response_model=TokenResponse)
async def google_login(req: GoogleAuthRequest, db: AsyncSession = Depends(get_db)):
    # In production, verify id_token with google-auth library
    email = req.email or "user@gigforge.ai"
    full_name = req.full_name or "Alex Vance (Freelancer)"
    avatar_url = req.avatar_url or "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    
    if not user:
        user = User(
            email=email,
            full_name=full_name,
            avatar_url=avatar_url,
            provider="google"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)

    token = create_access_token(user.id, user.email)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))

@router.post("/magic-link")
async def request_magic_link(req: MagicLinkRequest, db: AsyncSession = Depends(get_db)):
    raw_token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(minutes=15)
    
    magic_token = MagicToken(
        email=req.email,
        token=raw_token,
        expires_at=expires_at
    )
    db.add(magic_token)
    await db.commit()
    
    # Return magic token in response for easy testing/demo
    magic_url = f"http://localhost:3000/login/verify?token={raw_token}"
    return {
        "message": f"Magic link generated for {req.email}",
        "magic_url": magic_url,
        "token": raw_token
    }

@router.post("/magic-link/verify", response_model=TokenResponse)
async def verify_magic_link(req: MagicLinkVerify, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(MagicToken).where(
            MagicToken.token == req.token, 
            MagicToken.used == False,
            MagicToken.expires_at > datetime.utcnow()
        )
    )
    token_record = result.scalars().first()
    if not token_record:
        raise HTTPException(status_code=400, detail="Invalid or expired magic link token")
        
    token_record.used = True
    
    user_res = await db.execute(select(User).where(User.email == token_record.email))
    user = user_res.scalars().first()
    if not user:
        name_parts = token_record.email.split("@")[0].capitalize()
        user = User(
            email=token_record.email,
            full_name=f"{name_parts} (Freelancer)",
            avatar_url="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
            provider="magic_link"
        )
        db.add(user)
    
    await db.commit()
    if user.id is None:
        await db.refresh(user)

    token = create_access_token(user.id, user.email)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))

@router.post("/demo", response_model=TokenResponse)
async def demo_login(db: AsyncSession = Depends(get_db)):
    email = "demo@gigforge.ai"
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    
    if not user:
        user = User(
            email=email,
            full_name="Sarah Jenkins",
            avatar_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
            provider="demo"
        )
        db.add(user)
        await db.commit()
        await db.refresh(user)
        
    token = create_access_token(user.id, user.email)
    return TokenResponse(access_token=token, user=UserResponse.model_validate(user))
