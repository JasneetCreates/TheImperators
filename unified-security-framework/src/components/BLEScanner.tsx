'use client';

import React, { useState, useEffect } from 'react';

type Badge = {
    id: string;
    name: string;
    distance: number; // meters
    status: 'Authorized' | 'Unauthorized' | 'Unknown';
};

export default function BLEScanner() {
    const [badges, setBadges] = useState<Badge[]>([]);
    const [scanning, setScanning] = useState(true);
    const [logs, setLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 10));
    };

    // Simulate finding badges
    const simulateDetection = (type: 'Authorized' | 'Unauthorized') => {
        const newBadge: Badge = {
            id: Math.random().toString(36).substr(2, 6).toUpperCase(),
            name: type === 'Authorized' ? 'Employee #' + Math.floor(Math.random() * 100) : 'Unknown Tag',
            distance: 5.0, // Starts far
            status: type,
        };
        setBadges(prev => [...prev, newBadge]);
        addLog(`Signal Detected: ${newBadge.id} (${type})`);
    };

    // Simulate movement
    useEffect(() => {
        if (!scanning) return;

        const interval = setInterval(() => {
            setBadges(prev => prev.map(b => {
                // Move closer
                const newDist = Math.max(0, b.distance - 0.5);

                // Log "Entry" if close enough
                if (b.distance > 0.5 && newDist <= 0.5) {
                    addLog(`Badge ${b.id} within entry range. Verifying...`);
                    if (b.status === 'Authorized') addLog(`ACCESS GRANTED: ${b.name}`);
                    else addLog(`ACCESS DENIED: ${b.id} - Unauthorized`);
                }

                // Remove if it stays at 0 too long (entered) or goes away? 
                // For visual, let's bounce simulation: move in then remove
                if (newDist === 0) return { ...b, distance: 0, remove: true };
                return { ...b, distance: newDist };
            }).filter((b: any) => !b.remove));
        }, 500);

        return () => clearInterval(interval);
    }, [scanning]);

    return (
        <div className="grid-cols-2" style={{ height: '100%', gap: '2rem' }}>
            {/* Radar Visualizer */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <h3 style={{ position: 'absolute', top: 0, left: 0 }}>Omni-Directional BLE Array</h3>

                {/* Radar Circles */}
                <div style={{
                    width: '300px', height: '300px',
                    border: '1px solid var(--glass-border)', borderRadius: '50%',
                    position: 'relative',
                    background: 'radial-gradient(circle, rgba(0,255,255,0.1) 0%, rgba(0,0,0,0) 70%)'
                }}>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', width: '10px', height: '10px', background: 'var(--text-primary)', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: 10 }}></div>
                    {/* Ripples */}
                    <div className={`animate-pulse-scan`} style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '50%', border: '1px solid var(--primary-neon)' }}></div>

                    {/* Badges on Radar */}
                    {badges.map(b => {
                        // Map distance (0-5m) to radius (0-150px)
                        // 0m = center, 5m = edge
                        const radius = (b.distance / 5) * 140;
                        // Random angle
                        const angle = Number(b.id.replace(/\D/g, '')) % 360;
                        const rad = angle * (Math.PI / 180);
                        const x = Math.cos(rad) * radius + 150;
                        const y = Math.sin(rad) * radius + 150;

                        return (
                            <div key={b.id} style={{
                                position: 'absolute', left: x, top: y,
                                transform: 'translate(-50%, -50%)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center'
                            }}>
                                <span style={{
                                    width: '12px', height: '12px', borderRadius: '50%',
                                    backgroundColor: b.status === 'Authorized' ? 'hsl(var(--status-success))' : 'hsl(var(--status-danger))',
                                    boxShadow: `0 0 10px ${b.status === 'Authorized' ? 'hsl(var(--status-success))' : 'hsl(var(--status-danger))'}`
                                }}></span>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-primary)', marginTop: '4px', background: 'rgba(0,0,0,0.5)', padding: '2px 4px', borderRadius: '4px' }}>{b.distance.toFixed(1)}m</span>
                            </div>
                        );
                    })}
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => simulateDetection('Authorized')}
                        style={{ padding: '0.8rem', background: 'hsl(var(--status-success))', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Simulate Authorized
                    </button>
                    <button
                        onClick={() => simulateDetection('Unauthorized')}
                        style={{ padding: '0.8rem', background: 'hsl(var(--status-danger))', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', color: 'white' }}
                    >
                        Simulate Intruder
                    </button>
                </div>
            </div>

            {/* Logs Panel */}
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)', height: '100%', overflowY: 'auto' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Proximity Logs</h3>
                <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {logs.length === 0 && <span style={{ color: 'var(--text-muted)' }}>Waiting for signals...</span>}
                    {logs.map((log, i) => (
                        <div key={i} style={{ borderBottom: '1px solid #333', paddingBottom: '0.25rem' }}>
                            <span style={{ color: log.includes('GRANTED') ? 'hsl(var(--status-success))' : log.includes('DENIED') ? 'hsl(var(--status-danger))' : 'var(--text-secondary)' }}>
                                {log}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
