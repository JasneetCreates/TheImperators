import React from 'react';
import { Activity, XCircle, UserX, AlertTriangle, RefreshCcw } from "lucide-react";
import axios from 'axios';

const SimulationPanel: React.FC<{ onUpdate: () => void }> = ({ onUpdate }) => {
    const injectEvent = async (type: string) => {
        try {
            if (type === 'reset') {
                await axios.post('http://127.0.0.1:8000/simulate/reset');
            } else {
                await axios.post('http://127.0.0.1:8000/simulate/event', {
                    event_type: type,
                    severity: 'high'
                });
            }
            onUpdate();
        } catch (e) {
            console.error("Simulation failed", e);
        }
    };

    return (
        <div className="mt-8 p-6 bg-slate-50 border rounded-lg">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4">
                Simulation Controls (Debug)
            </h3>
            <div className="flex flex-wrap gap-3">
                <button onClick={() => injectEvent('tailgating_detected')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border shadow-sm rounded-md hover:bg-slate-50 text-sm font-medium text-slate-700 transition-all">
                    <UserX className="w-4 h-4 text-orange-500" />
                    Inject Tailgating
                </button>
                <button onClick={() => injectEvent('biometric_failure')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border shadow-sm rounded-md hover:bg-slate-50 text-sm font-medium text-slate-700 transition-all">
                    <XCircle className="w-4 h-4 text-red-500" />
                    Fail Biometrics
                </button>
                <button onClick={() => injectEvent('device_health_drop')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border shadow-sm rounded-md hover:bg-slate-50 text-sm font-medium text-slate-700 transition-all">
                    <Activity className="w-4 h-4 text-yellow-500" />
                    Degrade Device
                </button>
                <button onClick={() => injectEvent('after_hours_access')}
                    className="flex items-center gap-2 px-4 py-2 bg-white border shadow-sm rounded-md hover:bg-slate-50 text-sm font-medium text-slate-700 transition-all">
                    <AlertTriangle className="w-4 h-4 text-purple-500" />
                    After Hours
                </button>
                <div className="w-px h-8 bg-slate-200 mx-2"></div>
                <button onClick={() => injectEvent('reset')}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white shadow-sm rounded-md hover:bg-slate-900 text-sm font-medium transition-all">
                    <RefreshCcw className="w-4 h-4" />
                    Reset System
                </button>
            </div>
        </div>
    );
};

export default SimulationPanel;
