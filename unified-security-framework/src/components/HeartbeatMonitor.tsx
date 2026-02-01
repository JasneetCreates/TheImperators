'use client';

import React, { useState, useEffect } from 'react';

type Device = {
    id: string;
    name: string;
    lastHeartbeat: number; // timestamp
    status: 'ONLINE' | 'LOST' | 'REVOKED';
};

export default function HeartbeatMonitor() {
    const [devices, setDevices] = useState<Device[]>([
        { id: 'DEV-001', name: 'Admin Tablet A', lastHeartbeat: Date.now(), status: 'ONLINE' },
        { id: 'DEV-002', name: 'Security Console', lastHeartbeat: Date.now(), status: 'ONLINE' },
        { id: 'DEV-003', name: 'Roaming Guard 1', lastHeartbeat: Date.now(), status: 'ONLINE' },
    ]);

    const [vaultStatus, setVaultStatus] = useState<'OPEN' | 'LOCKED'>('OPEN');
    const [simPaused, setSimPaused] = useState(false);

    // Update loop
    useEffect(() => {
        if (simPaused) return;

        const interval = setInterval(() => {
            const now = Date.now();

            setDevices(prev => prev.map(dev => {
                // Randomly skip heartbeat for simulation effect if status is ONLINE
                // 5% chance to miss a beat
                const newHeartbeat = (dev.status === 'ONLINE' && Math.random() > 0.05) ? now : dev.lastHeartbeat;

                let status = dev.status;
                if (dev.status !== 'REVOKED') {
                    if (now - newHeartbeat > 5000) status = 'LOST';
                    else status = 'ONLINE';
                }

                return { ...dev, lastHeartbeat: newHeartbeat, status };
            }));

        }, 1000);
        return () => clearInterval(interval);
    }, [simPaused]);

    // Zero Trust Logic: Lock Vault if any device is LOST or REVOKED? 
    // Requirement: "If heartbeat stops... access is paused"
    useEffect(() => {
        const anyLost = devices.some(d => d.status === 'LOST' || d.status === 'REVOKED');
        setVaultStatus(anyLost ? 'LOCKED' : 'OPEN');
    }, [devices]);

    const toggleConnection = (id: string) => {
        setDevices(prev => prev.map(d => {
            if (d.id === id) {
                if (d.status === 'ONLINE') return { ...d, status: 'REVOKED' }; // Simulate kill switch or disconnect
                return { ...d, status: 'ONLINE', lastHeartbeat: Date.now() }; // Reconnect
            }
            return d;
        }));
    };

    return (
        <div className="grid-cols-2" style={{ height: '100%', gap: '2rem' }}>
            {/* Device List & Status */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {devices.map(dev => {
                    const secondsAgo = Math.floor((Date.now() - dev.lastHeartbeat) / 1000);
                    return (
                        <div key={dev.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderColor: dev.status === 'ONLINE' ? 'var(--glass-border)' : 'hsl(var(--status-danger))' }}>
                            <div>
                                <div style={{ fontWeight: 'bold' }}>{dev.name}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: {dev.id}</div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{
                                    color: dev.status === 'ONLINE' ? 'hsl(var(--status-success))' : 'hsl(var(--status-danger))',
                                    fontWeight: 'bold', fontSize: '0.9rem'
                                }}>
                                    {dev.status === 'ONLINE' ? '● SIGNAL OK' : '✕ NO SIGNAL'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    {secondsAgo}s ago
                                </div>
                            </div>
                            <button
                                onClick={() => toggleConnection(dev.id)}
                                style={{
                                    marginLeft: '1rem', padding: '0.5rem',
                                    background: dev.status === 'ONLINE' ? 'rgba(255,50,50,0.2)' : 'rgba(50,255,50,0.2)',
                                    color: dev.status === 'ONLINE' ? 'hsl(var(--status-danger))' : 'hsl(var(--status-success))',
                                    border: 'none', borderRadius: '4px', cursor: 'pointer'
                                }}
                            >
                                {dev.status === 'ONLINE' ? 'CUT' : 'FIX'}
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Logic Visualizer */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <h2 style={{ marginBottom: '2rem' }}>Zero Trust Air Gap</h2>

                <div style={{
                    width: '200px', height: '200px',
                    border: `4px solid ${vaultStatus === 'OPEN' ? 'hsl(var(--status-success))' : 'hsl(var(--status-danger))'}`,
                    borderRadius: '50%',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 0 30px ${vaultStatus === 'OPEN' ? 'hsl(var(--status-success))' : 'hsl(var(--status-danger))'}`,
                    transition: 'all 0.5s'
                }}>
                    <div style={{ fontSize: '3rem' }}>{vaultStatus === 'OPEN' ? '🔓' : '🔒'}</div>
                    <div style={{ fontWeight: 'bold', marginTop: '1rem', color: vaultStatus === 'OPEN' ? 'hsl(var(--status-success))' : 'hsl(var(--status-danger))' }}>
                        {vaultStatus === 'OPEN' ? 'DATA ACCESSIBLE' : 'VAULT LOCKED'}
                    </div>
                </div>

                <p style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', maxWidth: '80%' }}>
                    Continuous Validation Logic:
                    <br />
                    If <strong>ANY</strong> authorized device misses heartbeat (over 5s), the system assumes compromise and imposes an immediate logic air-gap.
                </p>
            </div>
        </div>
    );
}
