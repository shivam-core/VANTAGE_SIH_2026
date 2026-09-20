import { ArrowDown, ArrowUp, ShieldCheck, ShieldAlert, Columns } from 'lucide-react';
import { useVantage } from '../storage/store';
import { Link } from 'react-router-dom';
import { isQuantumVulnerable } from '../utils/pqcClassifier';

export default function ComparePage() {
  const { reports } = useVantage();

  if (reports.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center h-[80vh] text-center">
        <Columns size={64} className="text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Comparison Data</h1>
        <p className="text-gray-400 mb-6">Import your first SBOM to establish a baseline.</p>
        <Link to="/app/import" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">Import SBOM</Link>
      </div>
    );
  }

  if (reports.length === 1) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center h-[80vh] text-center">
        <Columns size={64} className="text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Baseline Established</h1>
        <p className="text-gray-400 mb-6">You need at least two scans to compare progress. Upload another SBOM when you have made changes.</p>
        <Link to="/app/import" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">Import Second SBOM</Link>
      </div>
    );
  }

  const currentReport = reports[reports.length - 1];
  const baselineReport = reports[reports.length - 2];

  const currentVulnerable = currentReport.assets.filter(a => isQuantumVulnerable(a.canonicalName)).length;
  const baselineVulnerable = baselineReport.assets.filter(a => isQuantumVulnerable(a.canonicalName)).length;

  const diff = currentVulnerable - baselineVulnerable;
  const improvement = baselineVulnerable > 0 ? Math.round((Math.abs(diff) / baselineVulnerable) * 100) : 0;

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
            <p className="text-xs text-gray-500 mb-4">{new Date(baselineReport.finishedAt).toLocaleDateString()}</p>
            <div className="flex justify-center items-end gap-2">
              <span className="text-4xl font-bold text-red-400">{baselineVulnerable}</span>
              <span className="text-sm text-gray-500 mb-1">vulnerabilities</span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            {diff < 0 ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 text-green-500 rounded-full border border-green-900/50">
                <ArrowDown size={20} />
                <span className="font-bold text-lg">{Math.abs(diff)} Vulnerabilities</span>
              </div>
            ) : diff > 0 ? (
              <div className="flex items-center gap-2 px-4 py-2 bg-red-900/20 text-red-500 rounded-full border border-red-900/50">
                <ArrowUp size={20} />
                <span className="font-bold text-lg">+{diff} Vulnerabilities</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-gray-400 rounded-full border border-gray-700">
                <span className="font-bold text-lg">No Change</span>
              </div>
            )}
            {diff !== 0 && <p className="text-xs text-gray-500 mt-2">{improvement}% {diff < 0 ? 'Improvement' : 'Degradation'}</p>}
          </div>

          <div className="text-center p-4 border border-blue-900/50 bg-[#222] rounded-lg">
            <h3 className="text-blue-400 text-sm font-medium mb-1">Current Scan</h3>
            <p className="text-xs text-gray-500 mb-4">{new Date(currentReport.finishedAt).toLocaleDateString()}</p>
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
            {baselineVulnerable === 0 && currentVulnerable === 0 ? (
              <tr className="hover:bg-[#252525] transition-colors">
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No vulnerabilities detected in baseline or current scan.
                </td>
              </tr>
            ) : diff < 0 ? (
              <tr className="hover:bg-[#252525] transition-colors">
                <td className="p-4 text-gray-300 font-medium">RSA/SHA Assets</td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-red-400 text-sm">
                    <ShieldAlert size={14} /> {baselineVulnerable} Vulnerable
                  </span>
                </td>
                <td className="p-4">
                  <span className="inline-flex items-center gap-1 text-green-400 text-sm">
                    <ShieldCheck size={14} /> {Math.abs(diff)} Migrated / Removed
                  </span>
                </td>
              </tr>
            ) : (
              <tr className="hover:bg-[#252525] transition-colors">
                <td colSpan={3} className="p-8 text-center text-gray-500">
                  No issues resolved in this scan period.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
