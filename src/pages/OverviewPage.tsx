import { Activity, ShieldAlert, ShieldCheck, FileCheck, ArrowRight } from 'lucide-react';
import { useVantage } from '../storage/store';
import { Link } from 'react-router-dom';

export default function OverviewPage() {
  const { reports, filesScanned, cryptoAssetsFound } = useVantage();
  
  const allAssets = reports.flatMap(r => r.assets);
  const vulnerableCount = allAssets.filter(a => a.canonicalName === 'RSA' || a.canonicalName === 'SHA1').length;
  const safeCount = allAssets.length - vulnerableCount;
  
  const readinessScore = allAssets.length > 0 
    ? Math.round((safeCount / allAssets.length) * 100) 
    : 0;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Vantage Dashboard</h1>
        <p className="text-gray-400">High-level overview of your organization's cryptographic posture and Post-Quantum readiness.</p>
      </div>

      {/* Top Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="text-blue-500" size={20} />
            <h3 className="text-gray-400 font-medium">Files Scanned</h3>
          </div>
          <p className="text-3xl font-bold text-white">{filesScanned.toLocaleString()}</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <FileCheck className="text-purple-500" size={20} />
            <h3 className="text-gray-400 font-medium">Crypto Assets Found</h3>
          </div>
          <p className="text-3xl font-bold text-white">{cryptoAssetsFound.toLocaleString()}</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <ShieldAlert className="text-red-500" size={20} />
            <h3 className="text-gray-400 font-medium">Vulnerable Assets</h3>
          </div>
          <p className="text-3xl font-bold text-red-500">{vulnerableCount}</p>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <ShieldCheck className="text-green-500" size={20} />
            <h3 className="text-gray-400 font-medium">Readiness Score</h3>
          </div>
          <p className="text-3xl font-bold text-green-500">{readinessScore}%</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Col - Getting Started / Actions */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4 border-b border-[#333] pb-2">Next Steps</h2>
            {reports.length === 0 ? (
              <p className="text-gray-400 mb-6 leading-relaxed">
                Welcome to Vantage. Get started by importing a Software Bill of Materials (SBOM) to analyze your cryptographic posture.
              </p>
            ) : (
              <p className="text-gray-400 mb-6 leading-relaxed">
                Based on your most recent SBOM import, we have identified cryptographic assets that do not meet NIST standards for Post-Quantum safety.
              </p>
            )}
          </div>
          
          <div className="space-y-4">
            <Link to="/app/inventory" className="flex items-center justify-between p-4 bg-[#222] border border-[#444] rounded-lg hover:border-blue-500 transition-colors group">
              <div>
                <h4 className="font-medium text-gray-200">Review Inventory</h4>
                <p className="text-sm text-gray-500">See exactly where vulnerable keys are located.</p>
              </div>
              <ArrowRight className="text-gray-600 group-hover:text-blue-500 transition-colors" />
            </Link>
            
            <Link to="/app/plan" className="flex items-center justify-between p-4 bg-[#222] border border-[#444] rounded-lg hover:border-purple-500 transition-colors group">
              <div>
                <h4 className="font-medium text-gray-200">Migration Plan</h4>
                <p className="text-sm text-gray-500">Get an automated step-by-step PQC migration strategy.</p>
              </div>
              <ArrowRight className="text-gray-600 group-hover:text-purple-500 transition-colors" />
            </Link>
          </div>
        </div>

        {/* Right Col - Recent Activity */}
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg">
          <h2 className="text-xl font-bold mb-4 border-b border-[#333] pb-2">Recent Scans</h2>
          {reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <p>No scans completed yet.</p>
              <Link to="/app/import" className="text-blue-400 hover:underline mt-2">Upload an SBOM to begin</Link>
            </div>
          ) : (
            <div className="space-y-4 mt-4">
              {reports.slice().reverse().map((report, idx) => (
                <div key={idx} className="flex items-start justify-between p-3 border-l-2 border-blue-500 bg-[#222] rounded-r-lg">
                  <div>
                    <h4 className="font-medium text-gray-300">SBOM Analysis Completed</h4>
                    <p className="text-xs text-gray-500 mt-1">Found {report.assets.length} assets</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {new Date(report.finishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
