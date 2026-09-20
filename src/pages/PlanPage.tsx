import { AlertTriangle, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { useVantage } from '../storage/store';
import type { Asset } from '../domain/types';
import { isQuantumVulnerable } from '../utils/pqcClassifier';

export default function PlanPage() {
  const { reports } = useVantage();
  const allAssets = reports.flatMap(r => r.assets);
  
  // Filter vulnerable assets (mock logic)
  const vulnerableAssets = allAssets.filter(a => isQuantumVulnerable(a.canonicalName));
  
  const getRecommendation = (asset: Asset) => {
    if (asset.canonicalName === 'RSA') {
      return {
        action: 'Migrate to FIPS 204 (ML-DSA / Dilithium)',
        details: 'RSA-2048 will be easily broken by Shor\'s algorithm on a cryptographically relevant quantum computer (CRQC). Replace digital signatures with ML-DSA.',
        effort: 'High',
        timeline: 'Q3 2026'
      };
    }
    if (asset.canonicalName === 'SHA1') {
      return {
        action: 'Migrate to SHA-256 or SHA-3',
        details: 'SHA-1 is already classically broken. Quantum computers will further weaken hash functions via Grover\'s algorithm. Immediate upgrade required.',
        effort: 'Low',
        timeline: 'Immediate'
      };
    }
    if (asset.canonicalName === 'ECDSA' || asset.canonicalName === 'ECDH') {
      return {
        action: 'Migrate to FIPS 204 (ML-DSA) or FIPS 203 (ML-KEM)',
        details: `${asset.canonicalName} relies on elliptic curve discrete log, which Shor's algorithm solves efficiently. Replace with lattice-based PQC standards.`,
        effort: 'High',
        timeline: 'Q4 2026'
      };
    }
    if (asset.canonicalName === '3DES' || asset.canonicalName === 'DES') {
      return {
        action: 'Migrate to AES-256-GCM',
        details: '3DES/DES uses 64-bit block size and is deprecated by NIST. Replace with AES-256 in authenticated mode (GCM).',
        effort: 'Medium',
        timeline: 'Q2 2026'
      };
    }
    if (asset.canonicalName === 'MD5') {
      return {
        action: 'Migrate to SHA-256 or SHA-3',
        details: 'MD5 is completely broken for collision resistance. Grover\'s algorithm halves effective security. Replace immediately.',
        effort: 'Low',
        timeline: 'Immediate'
      };
    }
    return { action: 'Review', details: 'No automated recommendation available for this algorithm.', effort: 'Unknown', timeline: 'TBD' };
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Migration Plan</h1>
        <p className="text-gray-400">Automated Post-Quantum migration strategy based on your cryptographic inventory.</p>
      </div>

      {vulnerableAssets.length === 0 ? (
        <div className="bg-green-900/10 border border-green-900/30 rounded-xl p-12 text-center shadow-lg">
          <ShieldCheck size={64} className="mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold text-green-400 mb-2">No Vulnerabilities Detected</h2>
          <p className="text-gray-400">Your current cryptographic inventory appears to be Quantum Safe. Great job!</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" />
              Action Required: {vulnerableAssets.length} Vulnerable Assets
            </h2>
            <p className="text-gray-400 mb-6">
              We have identified assets that rely on pre-quantum cryptography. Below is the recommended migration timeline and strategy to ensure compliance with NIST standards.
            </p>
            
            <div className="space-y-4">
              {vulnerableAssets.map((asset, idx) => {
                const rec = getRecommendation(asset);
                return (
                  <div key={asset.id || idx} className="bg-[#222] border border-[#444] rounded-lg p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-lg text-red-400">{asset.displayName}</span>
                        <ArrowRight size={16} className="text-gray-500" />
                        <span className="font-semibold text-lg text-green-400">{rec.action}</span>
                      </div>
                      <p className="text-sm text-gray-400">{rec.details}</p>
                    </div>
                    
                    <div className="flex gap-4 md:flex-col md:items-end">
                      <div className="text-sm">
                        <span className="text-gray-500 block text-xs uppercase tracking-wider">Effort</span>
                        <span className={`font-medium ${rec.effort === 'High' ? 'text-orange-400' : 'text-blue-400'}`}>
                          {rec.effort}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500 block text-xs uppercase tracking-wider">Timeline</span>
                        <span className="font-medium text-white">{rec.timeline}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Export Plan</h3>
              <p className="text-gray-400 text-sm mb-4">Generate tickets in your project management tool for your engineering team to begin migration.</p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium transition-colors w-full flex justify-center items-center gap-2">
                <CheckCircle size={18} />
                Create Jira Epics
              </button>
            </div>
            <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg">
              <h3 className="font-bold text-lg mb-4">Generate Report</h3>
              <p className="text-gray-400 text-sm mb-4">Download a formal compliance report for stakeholders regarding current cryptographic posture.</p>
              <button className="bg-[#333] hover:bg-[#444] text-white px-4 py-2 rounded font-medium transition-colors w-full border border-[#555]">
                Download PDF Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
