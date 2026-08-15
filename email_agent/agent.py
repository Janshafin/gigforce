import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Email Configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

def draft_email_with_llm(prompt: str, recipient_name: str, context: str = "") -> dict:
    """
    Uses Google Gemini to draft an email subject and body based on the prompt.
    Returns a dictionary with 'subject' and 'body'.
    """
    if not GEMINI_API_KEY:
        print("[WARNING] GEMINI_API_KEY not found in .env. Using a generic fallback draft.")
        return {
            "subject": f"Connecting regarding {prompt[:20]}...",
            "body": f"Hi {recipient_name},\n\nI wanted to reach out regarding: {prompt}.\n\nLet's connect soon!\n\nBest regards,\nGigForge Agent"
        }
        
    model = genai.GenerativeModel('gemini-3.5-flash')
    
    system_instruction = f"""
    You are an expert executive assistant and email copywriter. 
    Write a highly professional, concise, and engaging email. 
    The recipient's name is {recipient_name}.
    Additional Context: {context}
    
    You must output EXACTLY in this format:
    SUBJECT: [Your generated subject line]
    BODY:
    [Your generated email body]
    """
    
    print(f"[*] Drafting email using Gemini LLM for {recipient_name}...")
    try:
        response = model.generate_content(f"{system_instruction}\n\nTask: {prompt}")
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
        print(f"[ERROR] Failed to generate email: {e}")
        return None

def send_email(to_email: str, subject: str, body: str, dry_run: bool = True):
    """
    Sends an email using SMTP. If dry_run is True, it only prints the email to the console.
    """
    if dry_run:
        print("\n" + "="*50)
        print("🚀 DRY RUN MODE: Email not actually sent.")
        print("="*50)
        print(f"TO: {to_email}")
        print(f"SUBJECT: {subject}")
        print("-" * 50)
        print(body)
        print("="*50 + "\n")
        return

    if not SMTP_USERNAME or not SMTP_PASSWORD:
        print("[ERROR] SMTP credentials not set in .env. Cannot send email.")
        return

    print(f"[*] Connecting to {SMTP_SERVER}:{SMTP_PORT} to send email...")
    
    msg = MIMEMultipart()
    msg['From'] = SMTP_USERNAME
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.send_message(msg)
        server.quit()
        print(f"[SUCCESS] Email sent to {to_email}!")
    except Exception as e:
        print(f"[ERROR] Failed to send email: {e}")

if __name__ == "__main__":
    print("--- GigForge Autonomous Email Agent ---")
    
    # Example Usage
    target_email = "test@example.com"
    target_name = "Alex"
    user_prompt = "Pitch our new Next.js UI redesign services. Mention we noticed their current dashboard is slow."
    
    # 1. Draft the email using LLM
    draft = draft_email_with_llm(user_prompt, target_name)
    
    if draft:
        # 2. Send the email (Dry run by default to prevent accidents)
        send_email(
            to_email=target_email,
            subject=draft['subject'],
            body=draft['body'],
            dry_run=True # Test AI generation safely
        )
