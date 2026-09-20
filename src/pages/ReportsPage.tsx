import { Download, Share2, FileText, CheckCircle, AlertTriangle, Clock, FileSpreadsheet } from 'lucide-react';
import { useVantage } from '../storage/store';
import { Link } from 'react-router-dom';
import { isQuantumVulnerable } from '../utils/pqcClassifier';

export default function ReportsPage() {
  const { cryptoAssetsFound, reports } = useVantage();

  if (reports.length === 0) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center h-[80vh] text-center">
        <FileSpreadsheet size={64} className="text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Reports Available</h1>
        <p className="text-gray-400 mb-6">Import an SBOM to generate compliance and readiness reports.</p>
        <Link to="/app/import" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">Import SBOM</Link>
      </div>
    );
  }

  const latestReport = reports[reports.length - 1];
  const nonCompliant = latestReport.assets.filter(a => isQuantumVulnerable(a.canonicalName)).length;
  const remediationMonths = nonCompliant > 0 ? Math.max(1, Math.ceil(nonCompliant * 1.5)) : 0;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Compliance Reports</h1>
          <p className="text-gray-400">Download structured data for integrations or share executive summaries.</p>
        </div>
        
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#222] border border-[#444] hover:bg-[#333] rounded-lg text-sm font-medium transition-colors">
            <Share2 size={16} /> Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Download size={16} /> Export JSON
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#1a1a1a] border border-blue-900/30 rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <h3 className="font-semibold mb-1">PQC Readiness Report</h3>
          <p className="text-sm text-gray-400 mb-4">Generated today at 08:00 AM</p>
          <button className="text-blue-400 text-sm font-medium hover:underline">Download PDF</button>
        </div>
        
        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-[#222] text-gray-400 rounded-full flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <h3 className="font-semibold mb-1">NIST Compliance</h3>
          <p className="text-sm text-gray-400 mb-4">Generated 2 days ago</p>
          <button className="text-blue-400 text-sm font-medium hover:underline">Download PDF</button>
        </div>

        <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-[#222] text-gray-400 rounded-full flex items-center justify-center mb-4">
            <FileText size={24} />
          </div>
          <h3 className="font-semibold mb-1">SBOM (CycloneDX)</h3>
          <p className="text-sm text-gray-400 mb-4">Continuously Updated</p>
          <button className="text-blue-400 text-sm font-medium hover:underline">Download JSON</button>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[#333] bg-[#111]">
          <h2 className="text-lg font-semibold">Executive Summary</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-900/20 text-blue-500 flex items-center justify-center shrink-0">
                <CheckCircle size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{cryptoAssetsFound}</p>
                <p className="text-sm text-gray-400">Total Cryptographic Assets</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-orange-900/20 text-orange-500 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{nonCompliant}</p>
                <p className="text-sm text-gray-400">Non-compliant for PQC</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-purple-900/20 text-purple-500 flex items-center justify-center shrink-0">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{remediationMonths > 0 ? `${remediationMonths} mos` : 'Ready'}</p>
                <p className="text-sm text-gray-400">Est. Remediation Time</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
