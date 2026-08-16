from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import smtplib
import re
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import google.generativeai as genai
from app.config import settings

router = APIRouter(prefix="/api/email", tags=["email"])

class DraftEmailRequest(BaseModel):
    recipient_email: str
    recipient_name: str
    prompt: str
    context: str = ""
    send_immediately: bool = False
    # Optional: user can provide their own SMTP creds
    sender_email: Optional[str] = None
    sender_password: Optional[str] = None

class SendDraftRequest(BaseModel):
    recipient_email: str
    subject: str
    body: str
    # Optional: user can provide their own SMTP creds
    sender_email: Optional[str] = None
    sender_password: Optional[str] = None

# Configure Gemini
if settings.GEMINI_API_KEY:
    genai.configure(api_key=settings.GEMINI_API_KEY)

def draft_email_with_llm(prompt: str, recipient_name: str, context: str = "") -> dict:
    if not settings.GEMINI_API_KEY:
        return {
            "subject": f"Connecting regarding {prompt[:20]}...",
            "body": f"Hi {recipient_name},\n\nI wanted to reach out regarding: {prompt}.\n\nLet's connect soon!\n\nBest regards,\nGigForge Agent"
        }
        
    try:
        model = genai.GenerativeModel('gemini-3.5-flash')
        
        system_instruction = f"""You are an email writing assistant. Write exactly what the user asks.

RULES:
- The recipient's name is "{recipient_name}". Address them by this name.
- Follow the user's instructions EXACTLY. Do NOT add extra content.
- Keep it natural and human.
- Sign off as "GigForge Team" unless told otherwise.
{f'Additional Context: {context}' if context else ''}

CRITICAL OUTPUT FORMAT - follow this EXACTLY:
Line 1: The subject line text only (no prefix, no "Subject:", no quotes)
Line 2: ---
Line 3 onwards: The email body text only (no prefix, no "Body:")

Example output:
Meeting Follow-up for Project Discussion
---
Hi John,

I wanted to follow up on our meeting last week.

Best regards,
GigForge Team"""
        
        response = model.generate_content(f"{system_instruction}\n\nUser's instruction: {prompt}")
        text = response.text.strip()
        
        # Remove any markdown formatting Gemini might add
        text = text.replace("**", "").replace("```", "").strip()
        
        # Strategy 1: Split on "---" separator
        if "---" in text:
            parts = text.split("---", 1)
            subject = parts[0].strip()
            body = parts[1].strip() if len(parts) > 1 else ""
        # Strategy 2: Try SUBJECT:/BODY: format as fallback
        elif "SUBJECT:" in text.upper() and "BODY:" in text.upper():
            # Case-insensitive split
            subject_match = re.search(r'SUBJECT:\s*(.*?)(?:\n|BODY:)', text, re.IGNORECASE | re.DOTALL)
            body_match = re.search(r'BODY:\s*(.*)', text, re.IGNORECASE | re.DOTALL)
            subject = subject_match.group(1).strip() if subject_match else prompt[:50]
            body = body_match.group(1).strip() if body_match else text
        # Strategy 3: First line is subject, rest is body  
        else:
            lines = text.strip().split("\n", 1)
            subject = lines[0].strip()
            body = lines[1].strip() if len(lines) > 1 else text
        
        # Clean up subject - remove any leftover prefixes
        subject = re.sub(r'^(Subject|SUBJECT|subject)\s*:\s*', '', subject).strip()
        subject = re.sub(r'^(Body|BODY|body)\s*:\s*', '', subject).strip()
        
        # Clean up body - remove any leftover prefixes  
        body = re.sub(r'^(Body|BODY|body)\s*:\s*', '', body).strip()
        
        # Safety: if subject and body ended up the same, extract differently
        if subject == body or not body:
            lines = text.strip().split("\n")
            subject = lines[0].strip()
            body = "\n".join(lines[1:]).strip()
            # Clean again
            subject = re.sub(r'^(Subject|SUBJECT)\s*:\s*', '', subject).strip()
            body = re.sub(r'^(Body|BODY)\s*:\s*', '', body).strip()
            body = re.sub(r'^---\s*', '', body).strip()

        return {
            "subject": subject,
            "body": body
        }
    except Exception as e:
        print(f"LLM Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to draft email with AI")

def send_smtp_email(to_email: str, subject: str, body: str, sender_email: str = None, sender_password: str = None):
    """
    Send email via SMTP. If sender_email and sender_password are provided,
    use those (so the email comes FROM the user's own account).
    Otherwise fall back to the server's default SMTP credentials.
    """
    smtp_user = sender_email or settings.SMTP_USERNAME
    smtp_pass = sender_password or settings.SMTP_PASSWORD
    
    if not smtp_user or not smtp_pass:
        raise HTTPException(
            status_code=400, 
            detail="No email credentials provided. Please enter your email and app password, or configure server SMTP."
        )
        
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
        return True
    except smtplib.SMTPAuthenticationError:
        raise HTTPException(
            status_code=401, 
            detail="Email authentication failed. Make sure you're using a Gmail App Password (not your regular password). Go to Google Account → Security → App Passwords."
        )
    except Exception as e:
        print(f"SMTP Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")

@router.post("/draft")
async def draft_email(req: DraftEmailRequest):
    """
    Uses AI to draft an email. If send_immediately is true, sends it right away.
    Otherwise, returns the draft for preview.
    """
    draft = draft_email_with_llm(req.prompt, req.recipient_name, req.context)
    
    if req.send_immediately:
        send_smtp_email(req.recipient_email, draft["subject"], draft["body"], req.sender_email, req.sender_password)
        return {"status": "sent", "draft": draft}
        
    return {"status": "drafted", "draft": draft}

@router.post("/send")
async def send_draft(req: SendDraftRequest):
    """
    Sends a pre-approved draft via SMTP.
    Uses the user's own email credentials if provided.
    """
    send_smtp_email(req.recipient_email, req.subject, req.body, req.sender_email, req.sender_password)
    return {"status": "sent"}
