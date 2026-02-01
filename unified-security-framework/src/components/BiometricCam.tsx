'use client';

import React, { useState, useEffect } from 'react';

export default function BiometricCam() {
    const [status, setStatus] = useState<'IDLE' | 'SCANNING' | 'VERIFIED' | 'REJECTED'>('IDLE');
    const [progress, setProgress] = useState(0);
    const [facePosition, setFacePosition] = useState({ x: 50, y: 50 });

    const verificationSteps = [
        'Locating Face...',
        'Analyzing Geometry...',
        'Checking Liveness...',
        'Matching Database...',
    ];
    const [currentStep, setCurrentStep] = useState(0);

    const startScan = () => {
        setStatus('SCANNING');
        setProgress(0);
        setCurrentStep(0);
    };

    useEffect(() => {
        if (status === 'SCANNING') {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        // 90% chance success (to simulate low false rejection)
                        const passed = Math.random() > 0.1;
                        setStatus(passed ? 'VERIFIED' : 'REJECTED');
                        return 100;
                    }
                    // Advance text steps based on progress
                    setCurrentStep(Math.floor((prev / 100) * verificationSteps.length));
                    return prev + 2;
                });

                // Jitter face position slightly
                setFacePosition({
                    x: 50 + (Math.random() - 0.5) * 5,
                    y: 50 + (Math.random() - 0.5) * 5
                });

            }, 50);
            return () => clearInterval(interval);
        }
    }, [status]);

    return (
        <div className="grid-cols-2" style={{ height: '100%', gap: '2rem' }}>
            {/* Camera Feed Simulation */}
            <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-md)', background: '#000', border: '1px solid var(--glass-border)', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'lime', fontSize: '0.8rem', fontFamily: 'monospace' }}>
                    REC ● [LIVE FEED]
                </div>

                {/* Fake Face Silhouette */}
                <div style={{
                    width: '150px', height: '200px',
                    border: `2px dashed ${status === 'VERIFIED' ? 'lime' : status === 'REJECTED' ? 'red' : 'rgba(0,255,255,0.5)'}`,
                    borderRadius: '50%',
                    position: 'relative',
                    boxShadow: status === 'SCANNING' ? '0 0 20px rgba(0,255,255,0.2)' : 'none',
                    transition: 'all 0.2s',
                    transform: `translate(${facePosition.x - 50}px, ${facePosition.y - 50}px)`
                }}>
                    {status === 'SCANNING' && (
                        <div style={{
                            position: 'absolute', top: `${progress}%`, left: 0, right: 0, height: '2px',
                            background: 'hsl(var(--primary-neon))',
                            boxShadow: '0 0 10px hsl(var(--primary-neon))'
                        }}></div>
                    )}
                </div>

                {/* Status Overlay */}
                <div style={{ position: 'absolute', bottom: '20px', left: '0', right: '0', textAlign: 'center' }}>
                    {status === 'SCANNING' && <div style={{ color: 'hsl(var(--primary-neon))', background: 'rgba(0,0,0,0.5)', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '4px' }}>{verificationSteps[currentStep]} {progress}%</div>}
                    {status === 'VERIFIED' && <div style={{ color: 'hsl(var(--status-success))', background: 'rgba(0,0,0,0.8)', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '1.2rem', fontWeight: 'bold' }}>ACCESS GRANTED</div>}
                    {status === 'REJECTED' && <div style={{ color: 'hsl(var(--status-danger))', background: 'rgba(0,0,0,0.8)', display: 'inline-block', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '1.2rem', fontWeight: 'bold' }}>ACCESS DENIED</div>}
                </div>
            </div>

            {/* Controls & Details */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2rem' }}>
                <div>
                    <h2 style={{ marginBottom: '1rem' }}>Biometric Verification</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                        Multi-modal facial geometry analysis with liveness detection.
                        <br />
                        Target False Rejection Rate: &lt; 0.1%
                    </p>
                </div>

                <button
                    onClick={startScan}
                    disabled={status === 'SCANNING'}
                    className="glass-panel"
                    style={{
                        padding: '1.5rem',
                        fontSize: '1.2rem',
                        cursor: status === 'SCANNING' ? 'not-allowed' : 'pointer',
                        borderColor: 'hsl(var(--primary-neon))',
                        color: 'hsl(var(--primary-neon))',
                        background: status === 'SCANNING' ? 'rgba(0,0,0,0.5)' : undefined
                    }}
                >
                    {status === 'SCANNING' ? 'Scanning...' : 'Initiate Verification'}
                </button>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Confidence Score</span>
                        <span>{status === 'VERIFIED' ? '98.5%' : status === 'IDLE' ? '-' : '...'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Liveness Check</span>
                        <span style={{ color: status === 'VERIFIED' ? 'hsl(var(--status-success))' : 'inherit' }}>{status === 'VERIFIED' ? 'PASS' : '-'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
