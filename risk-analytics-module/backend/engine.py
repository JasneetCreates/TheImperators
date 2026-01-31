from datetime import datetime, timedelta
from typing import List, Dict
import random
from models import TrustScore, SimulationEvent, EventLog

class TrustEngine:
    def __init__(self):
        # Base confidence scores (0-100)
        self.presence_confidence = 100
        self.biometric_score = 100
        self.device_health = 100
        self.behavior_deviation = 0
        self.environmental_risk = 0
        
        self.active_risks: List[Dict] = []
        self.history: List[TrustScore] = []

    def calculate_score(self) -> int:
        # Simple weighted formula
        # Base: 0
        # + Presence (max 30)
        # + Biometric (max 30)
        # + Device (max 40)
        # - Behavior (penalty)
        # - Env Risk (penalty)
        
        # Normalize inputs to weights
        p_val = self.presence_confidence * 0.3
        b_val = self.biometric_score * 0.3
        d_val = self.device_health * 0.4
        
        base_score = p_val + b_val + d_val
        penalty = self.behavior_deviation + self.environmental_risk
        
        final_score = base_score - penalty
        return int(max(0, min(100, final_score)))

    def get_access_level(self, score: int) -> str:
        if score >= 80: return "Full Access"
        if score >= 60: return "Throttled"
        if score >= 40: return "Read-Only"
        return "Contained"


    def get_confidence_band(self, score: int) -> str:
        if score >= 80: return "GREEN"
        if score >= 60: return "YELLOW"
        if score >= 40: return "ORANGE"
        return "RED"

    def generate_explanation(self, score: int, risks: List[Dict]) -> str:
        if score >= 85 and not risks:
            return "Trust is high. All security signals are nominal."
        
        if not risks:
            # Maybe just degradation?
            return "Trust is slightly degraded due to minor fluctuations in device health or presence confidence."

        reasons = []
        for r in risks:
            reasons.append(r['description'])
        
        reason_str = ", ".join(reasons)
        return f"Trust reduced due to: {reason_str}."

    def process_event(self, event: SimulationEvent):
        # Mapping events to state changes
        # This is where the simulation scenarios happen
        
        timestamp = event.timestamp
        eventType = event.event_type
        
        risk_entry = {"type": eventType, "description": "Unknown", "impact": 0, "time": timestamp}

        if eventType == "tailgating_detected":
            self.presence_confidence = 50 # Drop presence confidence
            self.behavior_deviation += 30 # Huge penalty
            risk_entry["description"] = "Physical entry anomaly (Tailgating)"
            risk_entry["impact"] = 30
            self.active_risks.append(risk_entry)
            
        elif eventType == "biometric_failure":
            self.biometric_score = 0
            risk_entry["description"] = "Biometric verification failed"
            risk_entry["impact"] = 30
            self.active_risks.append(risk_entry)
            
        elif eventType == "device_health_drop":
            self.device_health = 60
            risk_entry["description"] = "Device posture degraded"
            risk_entry["impact"] = 15
            self.active_risks.append(risk_entry)

        elif eventType == "after_hours_access":
            self.environmental_risk += 20
            risk_entry["description"] = "Access attempt outside normal hours"
            risk_entry["impact"] = 20
            self.active_risks.append(risk_entry)
            
        elif eventType == "reset":
            self.reset_state()
            return # Exit after reset

    def reset_state(self):
        self.presence_confidence = 100
        self.biometric_score = 100
        self.device_health = 100
        self.behavior_deviation = 0
        self.environmental_risk = 0
        self.active_risks = []

    def get_current_state(self) -> TrustScore:
        score = self.calculate_score()
        return TrustScore(
            score=score,
            access_level=self.get_access_level(score),
            risk_factors=[r['description'] for r in self.active_risks],
            explanation=self.generate_explanation(score, self.active_risks),
            confidence_band=self.get_confidence_band(score),
            last_updated=datetime.now()
        )

# Global singleton for the simulation state
engine = TrustEngine()
