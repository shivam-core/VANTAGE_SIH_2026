import { useState, useEffect } from 'react';
import { useVantage } from '../storage/store';
import { CalendarClock, Play, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isQuantumVulnerable } from '../utils/pqcClassifier';

export interface TimelineEvent {
  id: string;
  assetId: string;
  date: Date;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
}

export default function ScenariosPage() {
  const { reports } = useVantage();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  useEffect(() => {
    if (reports.length > 0) {
      const latestReport = reports[reports.length - 1];
      const vulnerableAssets = latestReport.assets.filter(a => isQuantumVulnerable(a.canonicalName));
      
      const newEvents: TimelineEvent[] = [];
      
      // NIST 2030 Deadline
      if (vulnerableAssets.length > 0) {
        newEvents.push({
          id: 'nist-2030',
          assetId: 'all-vulnerable',
          date: new Date('2030-01-01'),
          type: 'policy_violation',
          severity: 'critical',
          description: `NIST Post-Quantum Cryptography compliance deadline. ${vulnerableAssets.length} assets will be strictly non-compliant.`
        });
      }

      // Random expiry for some vulnerable assets
      vulnerableAssets.slice(0, 3).forEach((asset, i) => {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + (i + 1) * 3);
        newEvents.push({
          id: `expiry-${i}`,
          assetId: asset.id || `asset-${i}`,
          date: expiryDate,
          type: 'expiry',
          severity: i === 0 ? 'critical' : 'high',
          description: `Asset using ${asset.canonicalName || 'legacy crypto'} is scheduled for rotation/expiry.`
        });
      });

      setEvents(newEvents.sort((a, b) => a.date.getTime() - b.date.getTime()));
    }
  }, [reports]);

  if (reports.length === 0) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center h-[80vh] text-center">
        <CalendarClock size={64} className="text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Timeline Scenarios</h1>
        <p className="text-gray-400 mb-6">Import an SBOM to generate risk scenarios and migration timelines.</p>
        <Link to="/app/import" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">Import SBOM</Link>
      </div>
    );
  }

  const runSimulation = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const updated = events.map(e => ({
        ...e,
        description: e.description.includes('(Simulated)') ? e.description : e.description + ' (Simulated impact: severe)',
        severity: 'critical' as const
      }));
      setEvents(updated);
      setIsSimulating(false);
    }, 1000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Migration Scenarios & Timeline</h1>
          <p className="text-gray-400">Simulate timeline events for PQ migration and track asset vulnerabilities.</p>
        </div>
        
        <button 
          onClick={runSimulation} 
          disabled={isSimulating || events.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Play size={16} /> {isSimulating ? 'Simulating...' : 'Run Simulation'}
        </button>
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6">
        {events.length === 0 ? (
           <p className="text-gray-500 text-center py-8">No vulnerable assets detected. Your timeline is clear.</p>
        ) : (
          <div className="space-y-6">
            {events.map((e) => (
              <div 
                key={e.id} 
                className={`relative pl-6 border-l-4 ${e.severity === 'critical' ? 'border-red-500' : 'border-orange-500'} bg-[#222] rounded-r-xl p-4`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-gray-300 font-medium">
                    <Calendar size={16} />
                    {e.date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                  </div>
                  <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${e.severity === 'critical' ? 'bg-red-900/30 text-red-400' : 'bg-orange-900/30 text-orange-400'}`}>
                    {e.severity}
                  </span>
                </div>
                <p className="text-gray-400">{e.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
