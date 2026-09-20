import { ShieldAlert, ShieldCheck, Key, Code, HelpCircle } from 'lucide-react';
import { useVantage } from '../storage/store';
import { useNavigate } from 'react-router-dom';
import type { Asset } from '../domain/types';

export default function InventoryPage() {
  const { reports } = useVantage();
  const navigate = useNavigate();
  
  // Flatten all assets from all reports
  const allAssets = reports.flatMap(report => report.assets);

  const getAssetIcon = (kind: string) => {
    switch (kind) {
      case 'algorithm': return <Code size={18} className="text-blue-400" />;
      case 'key-metadata': return <Key size={18} className="text-yellow-400" />;
      default: return <HelpCircle size={18} className="text-gray-400" />;
    }
  };

  const getStatusBadge = (asset: Asset) => {
    // Basic mock logic: RSA and SHA-1 are vulnerable, AES is safe
    if (asset.canonicalName === 'RSA' || asset.canonicalName === 'SHA1') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-900/50">
          <ShieldAlert size={12} />
          Vulnerable (PQC)
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-900/50">
        <ShieldCheck size={12} />
        Quantum Safe
      </span>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cryptographic Inventory</h1>
          <p className="text-gray-400">Comprehensive list of all discovered cryptographic algorithms, keys, and certificates.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-[#1a1a1a] border border-[#333] rounded-lg p-4 text-center min-w-[120px]">
            <div className="text-2xl font-bold text-white">{allAssets.length}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">Total Assets</div>
          </div>
          <div className="bg-red-900/10 border border-red-900/30 rounded-lg p-4 text-center min-w-[120px]">
            <div className="text-2xl font-bold text-red-500">
              {allAssets.filter(a => a.canonicalName === 'RSA' || a.canonicalName === 'SHA1').length}
            </div>
            <div className="text-xs text-red-400/80 uppercase tracking-wider mt-1">At Risk</div>
          </div>
        </div>
      </div>

      <div className="bg-[#1a1a1a] border border-[#333] rounded-xl overflow-hidden shadow-2xl">
        {allAssets.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <ShieldAlert size={48} className="mx-auto mb-4 text-gray-700" />
            <p className="text-lg">No cryptographic assets found.</p>
            <p className="text-sm">Import an SBOM or connect a repository to populate this inventory.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#333] bg-[#222]">
                  <th className="p-4 font-semibold text-sm text-gray-300">Asset Name</th>
                  <th className="p-4 font-semibold text-sm text-gray-300">Kind</th>
                  <th className="p-4 font-semibold text-sm text-gray-300">Details</th>
                  <th className="p-4 font-semibold text-sm text-gray-300">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#333]">
                {allAssets.map(asset => (
                  <tr 
                    key={asset.id} 
                    className="hover:bg-[#252525] transition-colors cursor-pointer"
                    onClick={() => navigate(`/app/assets/${asset.id}`)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-[#333] rounded-md">
                          {getAssetIcon(asset.kind)}
                        </div>
                        <span className="font-medium text-gray-200">{asset.displayName}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="capitalize text-gray-400 text-sm">{asset.kind}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        {Object.entries(asset.details).map(([k, v]) => (
                          <span key={k} className="text-xs bg-[#2a2a2a] text-gray-300 px-2 py-1 rounded">
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      {getStatusBadge(asset)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
