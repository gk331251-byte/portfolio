"""
SaaS Starter API - Production-ready FastAPI for GCP Cloud Run
Demonstrates Firestore integration, health checks, and auto-scaling
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from google.cloud import firestore
from datetime import datetime
import os
import time

# Initialize FastAPI app
app = FastAPI(
    title="SaaS Starter API",
    description="Production-ready API for GCP Cloud Run with Firestore",
    version="1.0.0"
)

# CORS middleware for web clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Firestore client
try:
    db = firestore.Client()
    firestore_enabled = True
except Exception as e:
    print(f"Firestore not initialized: {e}")
    firestore_enabled = False

# Store startup time for uptime calculation
startup_time = time.time()

# Request counter
request_count = 0


# Pydantic models
class DataItem(BaseModel):
    key: str
    value: str
    metadata: dict = {}


class StatsResponse(BaseModel):
    users: int
    requests: int
    uptime_seconds: int
    firestore_enabled: bool
    timestamp: str


# Health check endpoint
@app.get("/")
async def health_check():
    """Health check endpoint for Cloud Run"""
    global request_count
    request_count += 1

    return {
        "status": "healthy",
        "service": "SaaS Starter API",
        "version": "1.0.0",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": os.getenv("ENVIRONMENT", "production")
    }


# Stats endpoint
@app.get("/api/stats", response_model=StatsResponse)
async def get_stats():
    """Return sample statistics"""
    global request_count
    request_count += 1

    uptime = int(time.time() - startup_time)

    return StatsResponse(
        users=1247,  # Sample data
        requests=request_count,
        uptime_seconds=uptime,
        firestore_enabled=firestore_enabled,
        timestamp=datetime.utcnow().isoformat()
    )


# Write to Firestore
@app.post("/api/data")
async def create_data(item: DataItem):
    """Write data to Firestore"""
    global request_count
    request_count += 1

    if not firestore_enabled:
        raise HTTPException(
            status_code=503,
            detail="Firestore not available"
        )

    try:
        # Write to Firestore collection
        doc_ref = db.collection('saas_data').document(item.key)
        doc_ref.set({
            'value': item.value,
            'metadata': item.metadata,
            'created_at': firestore.SERVER_TIMESTAMP,
            'updated_at': firestore.SERVER_TIMESTAMP
        })

        return {
            "success": True,
            "message": f"Data written to Firestore",
            "key": item.key,
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to write to Firestore: {str(e)}"
        )


# Read from Firestore
@app.get("/api/data")
async def get_all_data():
    """Read all data from Firestore"""
    global request_count
    request_count += 1

    if not firestore_enabled:
        raise HTTPException(
            status_code=503,
            detail="Firestore not available"
        )

    try:
        # Read from Firestore collection
        docs = db.collection('saas_data').limit(100).stream()

        data = []
        for doc in docs:
            doc_data = doc.to_dict()
            data.append({
                'key': doc.id,
                'value': doc_data.get('value'),
                'metadata': doc_data.get('metadata', {}),
                'created_at': doc_data.get('created_at')
            })

        return {
            "success": True,
            "count": len(data),
            "data": data,
            "timestamp": datetime.utcnow().isoformat()
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to read from Firestore: {str(e)}"
        )


# Get specific item from Firestore
@app.get("/api/data/{key}")
async def get_data_by_key(key: str):
    """Read specific data item from Firestore"""
    global request_count
    request_count += 1

    if not firestore_enabled:
        raise HTTPException(
            status_code=503,
            detail="Firestore not available"
        )

    try:
        doc_ref = db.collection('saas_data').document(key)
        doc = doc_ref.get()

        if not doc.exists:
            raise HTTPException(
                status_code=404,
                detail=f"Item with key '{key}' not found"
            )

        doc_data = doc.to_dict()
        return {
            "success": True,
            "key": key,
            "value": doc_data.get('value'),
            "metadata": doc_data.get('metadata', {}),
            "created_at": doc_data.get('created_at'),
            "timestamp": datetime.utcnow().isoformat()
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to read from Firestore: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8080))
    uvicorn.run("main:app", host="0.0.0.0", port=port)
