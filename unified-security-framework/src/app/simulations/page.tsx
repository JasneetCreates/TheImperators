'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

// Component imports
import BLEScanner from '../../components/BLEScanner';
import BiometricCam from '../../components/BiometricCam';
import IRSensor from '../../components/IRSensor';
import HeartbeatMonitor from '../../components/HeartbeatMonitor';
import BehavioralAnalytics from '../../components/BehavioralAnalytics';

// Navigation Content Component
function SimulationContent() {
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('pillar') || 'presence';
    const [activeTab, setActiveTab] = useState(initialTab);

    const pillars = [
        { id: 'presence', name: 'Presence (BLE)' },
        { id: 'biometrics', name: 'Biometrics' },
        { id: 'integrity', name: 'Integrity (IR)' },
        { id: 'heartbeat', name: 'Heartbeat (Zero Trust)' },
        { id: 'behavior', name: 'Behavior (Analytics)' },
    ];

    return (
        <>
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {pillars.map((pillar) => (
                    <button
                        key={pillar.id}
                        onClick={() => setActiveTab(pillar.id)}
                        style={{
                            background: activeTab === pillar.id ? 'hsl(var(--primary-neon))' : 'var(--bg-panel)',
                            color: activeTab === pillar.id ? 'black' : 'var(--text-secondary)',
                            border: activeTab === pillar.id ? 'none' : '1px solid var(--glass-border)',
                            padding: '0.8rem 1.5rem',
                            borderRadius: 'var(--radius-full)',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                        }}
                    >
                        {pillar.name}
                    </button>
                ))}
            </div>

            {/* Simulation Content Area */}
            <div className="glass-panel" style={{ minHeight: '600px', padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                {activeTab === 'presence' && <BLEScanner />}
                {activeTab === 'biometrics' && <BiometricCam />}
                {activeTab === 'integrity' && <IRSensor />}
                {activeTab === 'heartbeat' && <HeartbeatMonitor />}
                {activeTab === 'behavior' && <BehavioralAnalytics />}
            </div>
        </>
    );
}

// Main Page Component
export default function SimulationsPage() {
    return (
        <main className="container">
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>← Back to Dashboard</Link>
                <h1 className="neon-text" style={{ marginTop: '0.5rem' }}>SIMULATION LAB</h1>
            </div>

            <Suspense fallback={<div className="glass-panel" style={{ padding: '2rem' }}>Loading Simulation Lab...</div>}>
                <SimulationContent />
            </Suspense>
        </main>
    );
}
