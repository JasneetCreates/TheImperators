'use client';

import React, { useState } from 'react';

type AccessEvent = {
    id: string;
    time: string; // HH:mm
    user: string;
    location: string;
    score: number; // 0-100
    status: 'GRANTED' | 'DENIED' | 'CHALLENGE';
};

export default function BehavioralAnalytics() {
    const [events, setEvents] = useState<AccessEvent[]>([
        { id: 'EVT-1024', time: '09:00', user: 'Alice Smith', location: 'Main Lobby', score: 98, status: 'GRANTED' },
        { id: 'EVT-1025', time: '09:15', user: 'Bob Jones', location: 'Server Room A', score: 95, status: 'GRANTED' },
    ]);

    const [simTime, setSimTime] = useState('14:00');

    const simulateAccess = (time: string, isAnomaly: boolean) => {
        let score = 90 + Math.floor(Math.random() * 10);
        let status: 'GRANTED' | 'DENIED' | 'CHALLENGE' = 'GRANTED';

        // Rules Logic
        // 1. Time based anomaly (e.g. 3 AM)
        const hour = parseInt(time.split(':')[0]);
        if (hour < 6 || hour > 22) {
            score -= 40; // Penalty for off-hours
        }

        // 2. Location anomaly (if explicitly anomalous)
        if (isAnomaly) {
            score -= 30;
        }

        // Decision Status
        if (score > 90) status = 'GRANTED';
        else if (score > 50) status = 'CHALLENGE';
        else status = 'DENIED';

        const newEvent: AccessEvent = {
            id: 'EVT-' + Math.floor(Math.random() * 10000),
            time: time,
            user: 'Sim User',
            location: isAnomaly ? 'Restricted Vault' : 'Common Area',
            score,
            status
        };

        setEvents(prev => [newEvent, ...prev]);
        setSimTime(time);
    };

    return (
        <div className="grid-cols-2" style={{ height: '100%', gap: '2rem' }}>
            {/* Event Log */}
            <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Live Access Log</h3>
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {events.map(evt => (
                        <div key={evt.id} style={{
                            padding: '0.8rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: 'var(--radius-sm)',
                            borderLeft: `4px solid ${evt.status === 'GRANTED' ? 'hsl(var(--status-success))' : evt.status === 'DENIED' ? 'hsl(var(--status-danger))' : 'hsl(var(--status-warning))'}`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                                <span style={{ fontWeight: 'bold' }}>{evt.time} - {evt.user}</span>
                                <span style={{
                                    color: evt.status === 'GRANTED' ? 'hsl(var(--status-success))' : evt.status === 'DENIED' ? 'hsl(var(--status-danger))' : 'hsl(var(--status-warning))',
                                    fontWeight: 'bold', fontSize: '0.8rem'
                                }}>
                                    {evt.status}
                                </span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                <span>{evt.location}</span>
                                <span>Score: {evt.score}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Simulation Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center' }}>
                <div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Behavioral Analytics</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Heuristic analysis of access patterns.
                        <br />
                        Low confidence scores trigger "Step-Up Auth" challenges instead of immediate blocks.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <button
                        onClick={() => simulateAccess('10:30', false)}
                        className="glass-panel"
                        style={{ padding: '1rem', cursor: 'pointer', textAlign: 'left', borderColor: 'hsl(var(--status-success))' }}
                    >
                        <div style={{ fontWeight: 'bold' }}>Normal Business Hour Access</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>10:30 AM - Common Area. High Confidence.</div>
                    </button>

                    <button
                        onClick={() => simulateAccess('03:15', false)}
                        className="glass-panel"
                        style={{ padding: '1rem', cursor: 'pointer', textAlign: 'left', borderColor: 'hsl(var(--status-warning))' }}
                    >
                        <div style={{ fontWeight: 'bold', color: 'hsl(var(--status-warning))' }}>Off-Hours Access (3 AM)</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>03:15 AM - Common Area. Medium Confidence: Challenge.</div>
                    </button>

                    <button
                        onClick={() => simulateAccess('03:15', true)}
                        className="glass-panel"
                        style={{ padding: '1rem', cursor: 'pointer', textAlign: 'left', borderColor: 'hsl(var(--status-danger))' }}
                    >
                        <div style={{ fontWeight: 'bold', color: 'hsl(var(--status-danger))' }}>Critical Anomaly</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>03:15 AM - Restricted Vault. Low Confidence: DENIED.</div>
                    </button>
                </div>
            </div>
        </div>
    );
}
