import Link from 'next/link';
import React from 'react';

// Mock Data for Initial Shell
const pillars = [
  { id: 'presence', name: 'Presence Identification', status: 'Active', icon: '📡' },
  { id: 'biometrics', name: 'Biometric Verification', status: 'Standby', icon: '👁️' },
  { id: 'integrity', name: 'Physical Integrity', status: 'Secure', icon: '🚪' },
  { id: 'heartbeat', name: 'Digital Heartbeat', status: 'Monitoring', icon: '💓' },
  { id: 'behavior', name: 'Behavioral Analytics', status: 'Learning', icon: '🧠' },
];

export default function Home() {
  return (
    <main className="container">
      {/* Header */}
      <header className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="neon-text">UNIFIED SECURITY</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Live Perimeter Control System</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>System Status</div>
          <div style={{ color: 'hsl(var(--status-success))', fontWeight: 'bold' }}>OPERATIONAL</div>
        </div>
      </header>

      {/* Global Status Overview */}
      <section className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Global Threat Level</h2>
        <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem' }}>
          <div style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <h3 style={{ color: 'hsl(var(--status-success))', fontSize: '3rem' }}>LOW</h3>
            <p style={{ color: 'var(--text-muted)' }}>No Active Threats</p>
          </div>
          <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'center' }}>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Active Personnel</span>
              <span className="neon-text">124</span>
            </p>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Guest Badges</span>
              <span style={{ color: 'var(--text-secondary)' }}>12</span>
            </p>
            <p style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Failed Attempts (24h)</span>
              <span style={{ color: 'hsl(var(--status-warning))' }}>3</span>
            </p>
          </div>
        </div>
      </section>

      {/* The 5 Pillars Grid */}
      <section>
        <h2 style={{ marginBottom: '1.5rem' }}>Security Pillars</h2>
        <div className="grid-cols-3">
          {pillars.map((pillar) => (
            <Link href={`/simulations?pillar=${pillar.id}`} key={pillar.id}>
              <div className="glass-panel" style={{ padding: '1.5rem', transition: 'transform 0.2s', cursor: 'pointer' }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{pillar.icon}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{pillar.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'hsl(var(--primary-neon))', boxShadow: '0 0 5px hsl(var(--primary-neon))' }}></span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{pillar.status}</span>
                </div>
              </div>
            </Link>
          ))}

          {/* Simulation Control Link */}
          <Link href="/simulations">
            <div className="glass-panel neon-border" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', cursor: 'pointer' }}>
              <h3 style={{ color: 'hsl(var(--primary-neon))' }}>RUN SIMULATION</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textAlign: 'center', marginTop: '0.5rem' }}>
                Test hardware integration logic
              </p>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
