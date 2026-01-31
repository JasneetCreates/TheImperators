from fastapi import APIRouter, HTTPException
from typing import List
from models import TrustScore, SimulationEvent
from engine import engine

router = APIRouter()

@router.get("/trust-score", response_model=TrustScore)
def get_trust_score():
    """
    Returns the current simulated trust score and access level.
    """
    return engine.get_current_state()

@router.post("/simulate/event")
def inject_event(event: SimulationEvent):
    """
    Simulate a security event to impact the trust score.
    """
    engine.process_event(event)
    return {"message": "Event processed", "new_state": engine.get_current_state()}

@router.post("/simulate/reset")
def reset_simulation():
    """
    Reset the simulation to a clean, high-trust state.
    """
    engine.reset_state()
    return {"message": "Simulation reset", "new_state": engine.get_current_state()}

@router.get("/history", response_model=List[dict])
def get_history():
    """
    Returns the history of events (Mocked for now as we don't persist strictly yet).
    """
    # In a real app we'd query the DB.
    # For this simulated engine, we can return the active risks as 'history' or mock previous points.
    return engine.active_risks
