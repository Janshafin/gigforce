from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
import smtplib
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

class SendDraftRequest(BaseModel):
    recipient_email: str
    subject: str
    body: str

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
        
        system_instruction = f"""
        You are an email writing assistant. Your ONLY job is to write exactly what the user asks you to write.
        
        RULES:
        - The recipient's name is "{recipient_name}". You MUST address them by this name (e.g., "Hi {recipient_name},").
        - Follow the user's instructions EXACTLY. If they say "tell them it's a test mail", just write a short friendly email saying it's a test mail. Do NOT add extra content they didn't ask for.
        - Keep it natural and human. Don't over-embellish or add unnecessary formality unless the user asks for it.
        - Sign off as "GigForge Team" unless told otherwise.
        {f'Additional Context: {context}' if context else ''}
        
        You must output EXACTLY in this format:
        SUBJECT: [Your generated subject line]
        BODY:
        [Your generated email body]
        """
        
        response = model.generate_content(f"{system_instruction}\n\nUser's instruction: {prompt}")
        text = response.text.strip()
        
        # Parse the output
        parts = text.split("BODY:")
        subject_part = parts[0].replace("SUBJECT:", "").strip()
        body_part = parts[1].strip() if len(parts) > 1 else text
        
        return {
            "subject": subject_part,
            "body": body_part
        }
    except Exception as e:
        print(f"LLM Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to draft email with AI")

def send_smtp_email(to_email: str, subject: str, body: str):
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        raise HTTPException(status_code=500, detail="SMTP credentials not configured on the server")
        
    msg = MIMEMultipart()
    msg['From'] = settings.SMTP_USERNAME
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(settings.SMTP_SERVER, settings.SMTP_PORT)
        server.starttls()
        server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"SMTP Error: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to send email via SMTP: {str(e)}")

@router.post("/draft")
async def draft_email(req: DraftEmailRequest):
    """
    Uses AI to draft an email. If send_immediately is true, sends it right away.
    Otherwise, returns the draft for preview.
    """
    draft = draft_email_with_llm(req.prompt, req.recipient_name, req.context)
    
    if req.send_immediately:
        send_smtp_email(req.recipient_email, draft["subject"], draft["body"])
        return {"status": "sent", "draft": draft}
        
    return {"status": "drafted", "draft": draft}

@router.post("/send")
async def send_draft(req: SendDraftRequest):
    """
    Sends a pre-approved draft via SMTP.
    """
    send_smtp_email(req.recipient_email, req.subject, req.body)
    return {"status": "sent"}
