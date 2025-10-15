from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from google.cloud import firestore
from datetime import datetime, timedelta
from typing import Optional
import os
from pydantic import BaseModel

app = FastAPI(title="Portfolio Analytics API")

# CORS configuration - allow requests from portfolio frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Local development
        "https://gkellyportfolio.vercel.app",  
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firestore client
db = firestore.Client()

# Event model for request validation
class TrackEvent(BaseModel):
    event_type: str  # e.g., "page_view", "api_call", "demo_interaction"
    page: Optional[str] = None
    demo_name: Optional[str] = None
    api_endpoint: Optional[str] = None
    api_method: Optional[str] = None
    success: Optional[bool] = None
    error_message: Optional[str] = None
    session_id: Optional[str] = None
    user_agent: Optional[str] = None

@app.get("/")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "portfolio-analytics-api",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/api/track")
async def track_event(event: TrackEvent):
    """
    Track a portfolio event (page view, API call, demo interaction, etc.)

    Example request body:
    {
        "event_type": "api_call",
        "demo_name": "API Explorer",
        "api_endpoint": "https://api.github.com/users/github",
        "api_method": "GET",
        "success": true,
        "session_id": "abc123",
        "user_agent": "Mozilla/5.0..."
    }
    """
    try:
        # Create event document
        event_data = {
            "event_type": event.event_type,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "created_at": datetime.utcnow().isoformat(),
        }

        # Add optional fields if provided
        if event.page:
            event_data["page"] = event.page
        if event.demo_name:
            event_data["demo_name"] = event.demo_name
        if event.api_endpoint:
            event_data["api_endpoint"] = event.api_endpoint
        if event.api_method:
            event_data["api_method"] = event.api_method
        if event.success is not None:
            event_data["success"] = event.success
        if event.error_message:
            event_data["error_message"] = event.error_message
        if event.session_id:
            event_data["session_id"] = event.session_id
        if event.user_agent:
            event_data["user_agent"] = event.user_agent

        # Store in Firestore
        doc_ref = db.collection("portfolio_events").add(event_data)

        return {
            "status": "success",
            "event_id": doc_ref[1].id,
            "message": "Event tracked successfully"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to track event: {str(e)}")

@app.get("/api/analytics/summary")
async def get_analytics_summary():
    """
    Get aggregated analytics for the portfolio (last 30 days)

    Returns:
    - Total events
    - API calls count
    - API success rate
    - Unique visitors (by session_id)
    - Popular demos
    - Recent activity timeline
    """
    try:
        # Calculate 30 days ago
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)

        # Query events from last 30 days
        events_ref = db.collection("portfolio_events")
        query = events_ref.where("created_at", ">=", thirty_days_ago.isoformat())
        events = list(query.stream())

        # Initialize counters
        total_events = len(events)
        api_calls = 0
        api_successes = 0
        unique_sessions = set()
        demo_interactions = {}
        page_views = 0

        # Process events
        for event in events:
            event_data = event.to_dict()

            # Count by event type
            if event_data.get("event_type") == "api_call":
                api_calls += 1
                if event_data.get("success") is True:
                    api_successes += 1

            elif event_data.get("event_type") == "page_view":
                page_views += 1

            elif event_data.get("event_type") == "demo_interaction":
                demo_name = event_data.get("demo_name", "Unknown")
                demo_interactions[demo_name] = demo_interactions.get(demo_name, 0) + 1

            # Track unique sessions
            if event_data.get("session_id"):
                unique_sessions.add(event_data["session_id"])

        # Calculate success rate
        api_success_rate = round((api_successes / api_calls * 100), 1) if api_calls > 0 else 0

        # Sort demos by popularity
        popular_demos = sorted(
            demo_interactions.items(),
            key=lambda x: x[1],
            reverse=True
        )[:5]  # Top 5 demos

        return {
            "status": "success",
            "period": "last_30_days",
            "data": {
                "total_events": total_events,
                "api_calls": api_calls,
                "api_success_rate": api_success_rate,
                "unique_visitors": len(unique_sessions),
                "page_views": page_views,
                "popular_demos": [
                    {"name": name, "interactions": count}
                    for name, count in popular_demos
                ],
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch analytics: {str(e)}")

@app.get("/api/analytics/realtime")
async def get_realtime_activity():
    """
    Get recent activity feed (last 20 events)

    Returns a chronological feed of recent portfolio events
    """
    try:
        # Query last 20 events, ordered by timestamp
        events_ref = db.collection("portfolio_events")
        query = events_ref.order_by("created_at", direction=firestore.Query.DESCENDING).limit(20)
        events = list(query.stream())

        # Format events for response
        activity_feed = []
        for event in events:
            event_data = event.to_dict()
            activity_feed.append({
                "event_id": event.id,
                "event_type": event_data.get("event_type"),
                "timestamp": event_data.get("created_at"),
                "demo_name": event_data.get("demo_name"),
                "page": event_data.get("page"),
                "api_endpoint": event_data.get("api_endpoint"),
                "api_method": event_data.get("api_method"),
                "success": event_data.get("success"),
            })

        return {
            "status": "success",
            "count": len(activity_feed),
            "events": activity_feed
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch realtime activity: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8080)
