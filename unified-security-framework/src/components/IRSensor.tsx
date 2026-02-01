'use client';

import React, { useState, useEffect } from 'react';

export default function IRSensor() {
    const ROWS = 10;
    const COLS = 15;
    const [grid, setGrid] = useState<number[][]>(Array(ROWS).fill(Array(COLS).fill(0)));
    const [status, setStatus] = useState<'SECURE' | 'TAILGATE_DETECTED' | 'ENTRY'>('SECURE');
    const [simulationStep, setSimulationStep] = useState(0);
    const [simMode, setSimMode] = useState<'NONE' | 'SINGLE' | 'TAILGATE'>('NONE');

    // Heatmap Color scale
    const getCellColor = (val: number) => {
        if (val === 0) return 'transparent';
        // Gradient from Blue (low) to Red (high) to White (Very high)
        // Simplified: just opacity of red
        return `rgba(255, 50, 50, ${val})`;
    };

    const simulateFrame = () => {
        setGrid(prevGrid => {
            const newGrid = prevGrid.map(row => [...row]);

            // Clear grid
            for (let r = 0; r < ROWS; r++)
                for (let c = 0; c < COLS; c++)
                    newGrid[r][c] = Math.max(0, newGrid[r][c] - 0.2); // Decay

            const centerRow = Math.floor(ROWS / 2);

            // Simulation Logic: Move blobs from left to right
            const pos = simulationStep;

            if (simMode === 'SINGLE') {
                if (pos < COLS) {
                    // Blob 1
                    addHeat(newGrid, centerRow, pos, 1.0);
                    addHeat(newGrid, centerRow + 1, pos, 0.6);
                    addHeat(newGrid, centerRow - 1, pos, 0.6);
                }
            } else if (simMode === 'TAILGATE') {
                if (pos < COLS) {
                    // Blob 1 (Front)
                    addHeat(newGrid, centerRow, pos + 2, 1.0);
                    // Blob 2 (Behind)
                    if (pos > 1) addHeat(newGrid, centerRow, pos - 2, 1.0);
                }
            }

            return newGrid;
        });

        setSimulationStep(prev => prev + 1);
    };

    const addHeat = (g: number[][], r: number, c: number, amount: number) => {
        if (r >= 0 && r < ROWS && c >= 0 && c < COLS) {
            g[r][c] = Math.min(1, g[r][c] + amount);
        }
    };

    // Run Loop
    useEffect(() => {
        if (simMode !== 'NONE') {
            const interval = setInterval(() => {
                simulateFrame();
                // Check Trigger
                if (simulationStep > COLS + 5) {
                    setSimMode('NONE');
                    setSimulationStep(0);
                    setStatus('SECURE');
                } else if (simMode === 'TAILGATE' && simulationStep > 3 && simulationStep < COLS) {
                    setStatus('TAILGATE_DETECTED');
                } else if (simMode === 'SINGLE' && simulationStep > 3 && simulationStep < COLS) {
                    setStatus('ENTRY');
                }
            }, 200);
            return () => clearInterval(interval);
        }
    }, [simMode, simulationStep]);

    const trigger = (mode: 'SINGLE' | 'TAILGATE') => {
        setSimMode(mode);
        setSimulationStep(0);
        setStatus(mode === 'SINGLE' ? 'ENTRY' : 'SECURE'); // Initial state
    };

    return (
        <div className="grid-cols-2" style={{ height: '100%', gap: '2rem' }}>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-panel)', borderRadius: 'var(--radius-md)' }}>
                <h3 style={{ marginBottom: '1rem' }}>IR Heatmap Grid</h3>

                <div style={{
                    display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: '2px',
                    width: '100%', maxWidth: '500px', aspectRatio: `${COLS}/${ROWS}`
                }}>
                    {grid.map((row, r) => (
                        row.map((val, c) => (
                            <div key={`${r}-${c}`} style={{ background: getCellColor(val), border: '1px solid #333', borderRadius: '2px' }}></div>
                        ))
                    ))}
                </div>

                <div style={{ marginTop: '1rem', height: '2rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>SENSOR STATUS:</span>
                    {status === 'TAILGATE_DETECTED' && <span className="neon-text" style={{ color: 'hsl(var(--status-danger))', fontWeight: 'bold' }}>⚠️ TAILGATING ALERT</span>}
                    {status === 'ENTRY' && <span style={{ color: 'hsl(var(--status-success))', fontWeight: 'bold' }}>AUTHORIZED ENTRY</span>}
                    {status === 'SECURE' && <span style={{ color: 'var(--text-secondary)' }}>SECURE</span>}
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', justifyContent: 'center' }}>
                <div>
                    <h2 style={{ marginBottom: '0.5rem' }}>Physical Integrity</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        High-resolution IR arrays detect mass and movement.
                        <br />
                        Logic: One badge Authorization vs Two Physical Mass entries.
                    </p>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    <button
                        onClick={() => trigger('SINGLE')}
                        disabled={simMode !== 'NONE'}
                        className="glass-panel"
                        style={{ padding: '1rem', cursor: 'pointer', textAlign: 'left', borderColor: simMode === 'SINGLE' ? 'hsl(var(--status-success))' : 'var(--glass-border)' }}
                    >
                        <div style={{ fontWeight: 'bold' }}>Normal Entry</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Single person walking through.</div>
                    </button>

                    <button
                        onClick={() => trigger('TAILGATE')}
                        disabled={simMode !== 'NONE'}
                        className="glass-panel"
                        style={{ padding: '1rem', cursor: 'pointer', textAlign: 'left', borderColor: simMode === 'TAILGATE' ? 'hsl(var(--status-danger))' : 'var(--glass-border)' }}
                    >
                        <div style={{ fontWeight: 'bold', color: 'hsl(var(--status-danger))' }}>Tailgate Attempt</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Two people close together ("Piggybacking").</div>
                    </button>
                </div>
            </div>
        </div>
    );
}
