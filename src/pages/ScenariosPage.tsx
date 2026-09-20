import { useState } from 'react';

export interface TimelineEvent {
  id: string;
  assetId: string;
  date: Date;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

export default function ScenariosPage() {
  const [events, setEvents] = useState<TimelineEvent[]>([
    { id: '1', assetId: 'cert-1', date: new Date('2026-06-01'), type: 'expiry', severity: 'critical', description: 'Main Web Certificate Expires' },
    { id: '2', assetId: 'db-1', date: new Date('2026-08-15'), type: 'policy_violation', severity: 'high', description: 'Database Encryption Algorithm Deprecated' },
  ]);

  const runSimulation = () => {
    // In a real implementation this would fetch all the active timelines and apply scenario logic
    const updated = events.map(e => ({
      ...e,
      description: e.description + ' (Simulated)',
    }));
    setEvents(updated);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Migration Scenarios & Timeline</h1>
      <p>Simulate timeline events for PQ migration and track asset vulnerabilities.</p>
      
      <button onClick={runSimulation} style={{ padding: '0.5rem 1rem', marginBottom: '1rem', cursor: 'pointer' }}>
        Run Timeline Simulation
      </button>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {events.map((e) => (
          <li key={e.id} style={{ borderLeft: `4px solid ${e.severity === 'critical' ? 'red' : 'orange'}`, padding: '1rem', margin: '1rem 0', backgroundColor: 'var(--surface)' }}>
            <strong>{e.date.toISOString().split('T')[0]}</strong>: {e.description} 
            <span style={{ float: 'right', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: 'bold', color: e.severity === 'critical' ? 'red' : 'orange' }}>
              {e.severity}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
