from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel
from sqlmodel import SQLModel, Field

class TrustScore(BaseModel):
    score: int
    access_level: str  # "full", "throttled", "read_only", "contained"
    risk_factors: List[str]
    explanation: str
    confidence_band: str  # "GREEN", "YELLOW", "ORANGE", "RED"
    last_updated: datetime

class SimulationEvent(BaseModel):
    event_type: str  # e.g., "tailgating", "biometric_failure", "device_health_drop", "reset"
    severity: str = "medium"
    description: Optional[str] = None
    timestamp: datetime = Field(default_factory=datetime.now)

# Database Models (using SQLModel for potential future DB ease, though we stay in-memory/sqlite for now)
class EventLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    event_type: str
    severity: str
    description: str
    timestamp: datetime

class SessionState(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str
    current_trust_score: int
    active_risks: str  # JSON string of list
    access_level: str
    last_activity: datetime
