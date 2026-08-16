import stripe
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import settings

router = APIRouter(prefix="/api/payments", tags=["Payments"])

stripe.api_key = settings.STRIPE_SECRET_KEY


class CheckoutRequest(BaseModel):
    plan: str


@router.post("/create-checkout-session")
async def create_checkout_session(request: CheckoutRequest):
    if request.plan == "starter":
        return {"checkout_url": "http://localhost:3000/dashboard?payment=success"}

    if request.plan == "pro":
        price_id = settings.STRIPE_PRO_PRICE_ID
    elif request.plan == "elite":
        price_id = settings.STRIPE_ELITE_PRICE_ID
    else:
        raise HTTPException(status_code=400, detail="Invalid plan")

    if not settings.STRIPE_SECRET_KEY:
        raise HTTPException(status_code=500, detail="Stripe secret key is not configured")

    if not price_id:
        raise HTTPException(status_code=500, detail=f"Stripe price ID is not configured for {request.plan}")

    try:
        checkout_session = stripe.checkout.Session.create(
            mode="subscription",
            line_items=[{"price": price_id, "quantity": 1}],
            success_url="http://localhost:3000/dashboard?payment=success",
            cancel_url="http://localhost:3000/dashboard?payment=cancelled",
        )
        return {"checkout_url": checkout_session.url}
    except stripe.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))