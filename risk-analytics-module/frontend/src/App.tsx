import { useEffect, useState } from 'react';
import axios from 'axios';
import { Shield, Lock, LayoutDashboard } from 'lucide-react';

import TrustGauge from './components/TrustGauge';
import ExplainabilityCard from './components/ExplainabilityCard';
import SimulationPanel from './components/SimulationPanel';
import { cn } from './lib/utils';

interface TrustData {
  score: number;
  access_level: string;
  risk_factors: string[];
  explanation: string;
  confidence_band: string;
}

function App() {
  const [data, setData] = useState<TrustData | null>(null);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://127.0.0.1:8000/trust-score');
      setData(res.data);
    } catch (e) {
      console.error("Failed to fetch trust score", e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 2000); // Poll every 2s
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="flex h-screen items-center justify-center text-slate-400">Loading Intelligence Layer...</div>;

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="h-16 border-b bg-white/80 backdrop-blur-sm fixed top-0 w-full z-10 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-900 text-white rounded flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg tracking-tight">Living Security Perimeter</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium text-slate-500">
          <span className="text-slate-900 cursor-pointer">Risk Analytics</span>
          <span className="cursor-pointer hover:text-slate-900">Incidents</span>
          <span className="cursor-pointer hover:text-slate-900">Policy Map</span>
          <div className="w-px h-4 bg-slate-200"></div>
          <div className="flex items-center gap-2 text-xs bg-slate-100 px-2 py-1 rounded border">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SYSTEM ACTIVE
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 px-8 pb-12 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-12 gap-8">

          {/* Left Column: Gauge & High Level */}
          <div className="col-span-4 space-y-6">
            <TrustGauge score={data.score} confidenceBand={data.confidence_band} />

            <div className="bg-white rounded-lg border p-6 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Current Access Level</h4>
                <div className={cn("text-xl font-bold", {
                  'text-emerald-600': data.confidence_band === 'GREEN',
                  'text-amber-600': data.confidence_band === 'YELLOW',
                  'text-orange-600': data.confidence_band === 'ORANGE',
                  'text-red-600': data.confidence_band === 'RED',
                })}>
                  {data.access_level.replace("_", " ").toUpperCase()}
                </div>
              </div>
              <Lock className="w-8 h-8 text-slate-200" />
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Policy Gates</h4>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center opacity-50">
                  <span>SaaS Access</span>
                  <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">ALLOWED</span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Production DB</span>
                  <span className={cn("text-xs px-2 py-0.5 rounded font-medium",
                    data.score >= 80 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                  )}>
                    {data.score >= 80 ? "ALLOWED" : "DENIED"}
                  </span>
                </li>
                <li className="flex justify-between items-center">
                  <span>Internal Wiki</span>
                  <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded font-medium">ALLOWED</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Explanation, Timeline (Mock), Controls */}
          <div className="col-span-8 space-y-6">
            <ExplainabilityCard explanation={data.explanation} riskFactors={data.risk_factors} />

            {/* Mock Timeline - for visual completeness */}
            <div className="bg-white rounded-lg border p-6 h-64 flex flex-col items-center justify-center text-slate-300">
              <LayoutDashboard className="w-12 h-12 mb-2 opacity-20" />
              <span className="text-sm">Real-time Behavior Heatmap usually renders here (Simulated)</span>
            </div>

            <SimulationPanel onUpdate={fetchData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
