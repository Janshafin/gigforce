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
    
    print(f"[*] Drafting email using Gemini LLM for {recipient_name}...")
    try:
        response = model.generate_content(f"{system_instruction}\n\nUser's instruction: {prompt}")
        text = response.text.strip()
        
        # Remove any markdown formatting
        text = text.replace("**", "").replace("```", "").strip()
        
        # Parse using --- separator
        if "---" in text:
            parts = text.split("---", 1)
            subject_part = parts[0].strip()
            body_part = parts[1].strip() if len(parts) > 1 else ""
        elif "SUBJECT:" in text.upper() and "BODY:" in text.upper():
            import re
            subject_match = re.search(r'SUBJECT:\s*(.*?)(?:\n|BODY:)', text, re.IGNORECASE | re.DOTALL)
            body_match = re.search(r'BODY:\s*(.*)', text, re.IGNORECASE | re.DOTALL)
            subject_part = subject_match.group(1).strip() if subject_match else prompt[:50]
            body_part = body_match.group(1).strip() if body_match else text
        else:
            lines = text.strip().split("\n", 1)
            subject_part = lines[0].strip()
            body_part = lines[1].strip() if len(lines) > 1 else text
        
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
        print(f"\n[SUCCESS] Email sent to {to_email}!")
    except Exception as e:
        print(f"[ERROR] Failed to send email: {e}")

if __name__ == "__main__":
    print("--- GigForge Autonomous Email Agent ---")
    
    print("\nPlease provide the email details:")
    target_email = input("  📧 Recipient Email: ").strip()
    target_name = input("  👤 Recipient Name: ").strip()
    user_prompt = input("  ✏️  What should the email say?: ").strip()
    
    # 1. Draft the email using LLM
    draft = draft_email_with_llm(user_prompt, target_name)
    
    if draft:
        # 2. Show preview first
        print("\n" + "="*50)
        print("📋 EMAIL PREVIEW")
        print("="*50)
        print(f"TO: {target_email}")
        print(f"SUBJECT: {draft['subject']}")
        print("-" * 50)
        print(draft['body'])
        print("="*50)
        
        # 3. Ask for confirmation
        confirm = input("\n🚀 Send this email? (yes/no): ").strip().lower()
        
        if confirm in ['yes', 'y']:
            send_email(
                to_email=target_email,
                subject=draft['subject'],
                body=draft['body'],
                dry_run=False
            )
        else:
            print("[CANCELLED] Email was NOT sent.")
