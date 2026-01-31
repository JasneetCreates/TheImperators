# Living Security Perimeter - Risk & Behavior Analytics

**Project Status**: 🟢 Active | **Version**: 1.0.0

A unified Full-Stack Security Dashboard that emulates enterprise-grade Zero Trust analytics. This system acts as the "brain" of a security framework, converting raw signals (presence, physiological data, device health) into a real-time **Trust Score**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-FastAPI_React_Tailwind-orange.svg)

---

## 🚀 Quick Start (Windows)

We have included automated scripts to get you running instantly.

### 1. First Time Setup
Double-click `install.bat` in this folder.
*   Installs Python dependencies.
*   Installs Node.js dependencies.
*   Builds the Frontend.

### 2. Run the System
Double-click `run_app.bat`.
*   Starts the integrated Full-Stack server.
*   Access the Dashboard at: **[http://localhost:8000](http://localhost:8000)**

---

## 🏗 Architecture

### **Frontend (Visualization)**
*   **Path**: `/frontend`
*   **Tech**: React, TypeScript, Tailwind CSS, Recharts.
*   **Design**: Hacuity-inspired (Clean, Medical/Enterprise aesthetic).

### **Backend (Intelligence)**
*   **Path**: `/backend`
*   **Tech**: Python, FastAPI, In-Memory Trust Engine.
*   **Role**:
    *   **Trust Engine**: Calculates `Score = Presence + Biometric + Device - Risk`.
    *   **Simulation**: Injects mock events (Tailgating, Device Failure) via API.
    *   **Static Serving**: Hosts the compiled React app for a seamless experience.

---

## 🧪 Simulation Capabilities

This is a **Digital Twin** framework. It does not require physical sensors. You can simulate the following scenarios via the "Simulation Panel" in the web UI:

1.  **Tailgating Event** represented by `tailgating_detected` -> drops presence confidence.
2.  **Biometric Failure** represented by `biometric_failure` -> zeroes out biometric score.
3.  **Device Compromise** represented by `device_health_drop`.
4.  **After Hours Access** adds environmental risk context.

---

## 📁 Source Map
*   **[backend/engine.py](backend/engine.py)**: The core algorithm logic.
*   **[frontend/src/components/TrustGauge.tsx](frontend/src/components/TrustGauge.tsx)**: The main visualization component.
*   **[frontend/src/App.tsx](frontend/src/App.tsx)**: Main application layout.
