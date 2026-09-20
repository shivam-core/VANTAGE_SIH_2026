import { ArrowDown, ShieldCheck, ShieldAlert } from 'lucide-react';
import { useVantage } from '../storage/store';

export default function ComparePage() {
  const { reports } = useVantage();

  // For the sake of the mock demo, we'll pretend there was a "baseline" scan 
  // that was worse than the current one to show positive progress.
  const allAssets = reports.flatMap(r => r.assets);
  const currentVulnerable = allAssets.filter(a => a.canonicalName === 'RSA' || a.canonicalName === 'SHA1').length;
  
  const baselineVulnerable = currentVulnerable + 5; // Fake baseline

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Compare Scans</h1>
        <p className="text-gray-400">Track your Post-Quantum migration progress by comparing your current inventory against the baseline.</p>
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="text-center p-4 border border-[#333] bg-[#222] rounded-lg">
            <h3 className="text-gray-400 text-sm font-medium mb-1">Baseline Scan</h3>
            <p className="text-xs text-gray-500 mb-4">Jan 1, 2026</p>
            <div className="flex justify-center items-end gap-2">
              <span className="text-4xl font-bold text-red-400">{baselineVulnerable}</span>
              <span className="text-sm text-gray-500 mb-1">vulnerabilities</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 text-green-500 rounded-full border border-green-900/50">
              <ArrowDown size={20} />
              <span className="font-bold text-lg">-5 Vulnerabilities</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">14% Improvement</p>
          </div>

          <div className="text-center p-4 border border-blue-900/50 bg-[#222] rounded-lg">
            <h3 className="text-blue-400 text-sm font-medium mb-1">Current Scan</h3>
            <p className="text-xs text-gray-500 mb-4">Latest Import</p>
            <div className="flex justify-center items-end gap-2">
              <span className="text-4xl font-bold text-blue-400">{currentVulnerable}</span>
              <span className="text-sm text-gray-500 mb-1">vulnerabilities</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Resolved Issues</h2>
      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#333] bg-[#222]">
              <th className="p-4 font-semibold text-sm text-gray-300">Asset</th>
              <th className="p-4 font-semibold text-sm text-gray-300">Previous Status</th>
              <th className="p-4 font-semibold text-sm text-gray-300">Current Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#333]">
            <tr className="hover:bg-[#252525] transition-colors">
              <td className="p-4 text-gray-300 font-medium">RSA-1024</td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1 text-red-400 text-sm">
                  <ShieldAlert size={14} /> Vulnerable
                </span>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1 text-gray-500 text-sm line-through">
                  Removed from codebase
                </span>
              </td>
            </tr>
            <tr className="hover:bg-[#252525] transition-colors">
              <td className="p-4 text-gray-300 font-medium">ECDSA-P256</td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1 text-red-400 text-sm">
                  <ShieldAlert size={14} /> Vulnerable
                </span>
              </td>
              <td className="p-4">
                <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                  <ShieldCheck size={14} /> Migrated to ML-DSA
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
