import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useVantage } from '../storage/store';
import { Network } from 'lucide-react';
import { Link } from 'react-router-dom';
import { isQuantumVulnerable } from '../utils/pqcClassifier';

export default function GraphPage() {
  const { reports } = useVantage();

  if (reports.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto flex flex-col items-center justify-center h-[80vh] text-center">
        <Network size={64} className="text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Dependency Data</h1>
        <p className="text-gray-400 mb-6">Import an SBOM to visualize your cryptographic dependencies.</p>
        <Link to="/app/import" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">Import SBOM</Link>
      </div>
    );
  }

  const latestReport = reports[reports.length - 1];
  
  const rootNode = {
    id: 'root',
    position: { x: 400, y: 50 },
    data: { label: 'Scanned Application' },
    style: { background: '#1e3a8a', color: 'white', border: '1px solid #3b82f6', borderRadius: '8px', padding: '10px' }
  };

  const nodes = [rootNode];
  const edges = [];

  const uniqueAssets = Array.from(new Set(latestReport.assets.map(a => a.canonicalName || a.algorithm || 'Unknown')));

  uniqueAssets.forEach((assetName, index) => {
    const x = 100 + (index % 5) * 150;
    const y = 200 + Math.floor(index / 5) * 100;
    const id = `asset-${index}`;
    
    const isVulnerable = isQuantumVulnerable(assetName);

    nodes.push({
      id,
      position: { x, y },
      data: { label: assetName },
      style: isVulnerable 
        ? { background: '#7f1d1d', color: 'white', border: '1px solid #ef4444', borderRadius: '8px', padding: '10px' }
        : { background: '#14532d', color: 'white', border: '1px solid #22c55e', borderRadius: '8px', padding: '10px' }
    });

    edges.push({
      id: `e-root-${id}`,
      source: 'root',
      target: id,
      animated: true,
      style: { stroke: isVulnerable ? '#ef4444' : '#22c55e' }
    });
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 flex flex-col h-[calc(100vh-4rem)]">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dependency Exploration</h1>
        <p className="text-gray-400">Visual representation of cryptographic dependencies across applications.</p>
      </div>
      <div className="flex-1 border border-[#333] rounded-xl overflow-hidden bg-[#111] min-h-[500px]">
        <ReactFlow nodes={nodes} edges={edges} fitView>
          <Background color="#333" gap={16} />
          <Controls className="bg-[#222] border-[#444] fill-white" />
        </ReactFlow>
      </div>
    </div>
  );
}
