import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShieldAlert, ShieldCheck, Code, FileText, Link as LinkIcon, AlertTriangle } from 'lucide-react';
import { useVantage } from '../storage/store';

export default function AssetDetailsPage() {
  const { id } = useParams();
  const { reports } = useVantage();
  
  // Find the asset from reports
  const allAssets = reports.flatMap(r => r.assets);
  const asset = allAssets.find(a => a.id === id);

  if (!asset) {
    return (
      <div className="p-8 max-w-5xl mx-auto text-center">
        <ShieldAlert size={48} className="mx-auto mb-4 text-gray-500" />
        <h2 className="text-2xl font-bold mb-2">Asset Not Found</h2>
        <p className="text-gray-400 mb-6">The requested cryptographic asset could not be located in the current inventory.</p>
        <Link to="/app/inventory" className="text-blue-400 hover:underline inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Inventory
        </Link>
      </div>
    );
  }

  const isVulnerable = asset.canonicalName === 'RSA' || asset.canonicalName === 'SHA1';

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <Link to="/app/inventory" className="text-gray-400 hover:text-white mb-4 inline-flex items-center gap-2 text-sm transition-colors">
          <ArrowLeft size={16} /> Back to Inventory
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              {asset.displayName}
              {isVulnerable ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50">
                  <ShieldAlert size={14} /> Vulnerable
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
                  <ShieldCheck size={14} /> Quantum Safe
                </span>
              )}
            </h1>
            <p className="text-gray-400">Cryptographic {asset.kind} discovered during SBOM analysis.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b border-[#333] pb-2 flex items-center gap-2">
              <Code size={20} className="text-blue-400" />
              Technical Details
            </h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Asset ID</dt>
                <dd className="mt-1 text-sm text-gray-200 bg-[#222] p-2 rounded border border-[#333] font-mono break-all">{asset.id}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Canonical Name</dt>
                <dd className="mt-1 text-sm text-gray-200 bg-[#222] p-2 rounded border border-[#333]">{asset.canonicalName || 'Unknown'}</dd>
              </div>
              <div className="md:col-span-2">
                <dt className="text-sm font-medium text-gray-500 mb-2">Properties</dt>
                <dd className="bg-[#222] p-4 rounded border border-[#333] overflow-x-auto">
                  <pre className="text-xs text-green-400">
                    {JSON.stringify(asset.details, null, 2)}
                  </pre>
                </dd>
              </div>
            </dl>
          </div>

          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4 border-b border-[#333] pb-2 flex items-center gap-2">
              <FileText size={20} className="text-purple-400" />
              Discovery Evidence
            </h2>
            {asset.evidenceIds.length === 0 ? (
              <p className="text-gray-500 text-sm">No evidence linked to this asset.</p>
            ) : (
              <div className="space-y-4">
                {asset.evidenceIds.map((eid, idx) => (
                  <div key={idx} className="p-4 bg-[#222] border border-[#444] rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-blue-400">{eid}</span>
                      <span className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">Source Code</span>
                    </div>
                    <p className="text-sm text-gray-300">Found during regex scanning in application source.</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Context & Remediation */}
        <div className="space-y-6">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-xl p-6 shadow-lg">
            <h2 className="text-lg font-semibold mb-4 border-b border-[#333] pb-2 flex items-center gap-2">
              <LinkIcon size={18} className="text-gray-400" />
              Relationships
            </h2>
            <div className="text-sm text-gray-400 space-y-3">
              <p>This asset is currently isolated in the dependency graph.</p>
              <Link to="/app/graph" className="text-blue-400 hover:underline block mt-2">View in Dependency Graph</Link>
            </div>
          </div>

          {isVulnerable && (
            <div className="bg-red-900/10 border border-red-900/30 rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2">
                <AlertTriangle size={18} />
                Remediation
              </h2>
              <p className="text-sm text-gray-300 mb-4">
                This algorithm does not meet NIST Post-Quantum standards. It must be migrated before the target PQC date.
              </p>
              <Link to="/app/plan" className="w-full inline-flex justify-center items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded font-medium transition-colors">
                View Migration Plan
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
