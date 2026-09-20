import { ReactFlow, Controls, Background } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 100, y: 100 }, data: { label: 'Application: Records Vault' } },
  { id: '2', position: { x: 300, y: 300 }, data: { label: 'Certificate: shared.pem' } },
  { id: '3', position: { x: 100, y: 500 }, data: { label: 'Application: Citizen Portal' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', label: 'depends-on', animated: true },
  { id: 'e3-2', source: '3', target: '2', label: 'depends-on', animated: true },
];

export default function GraphPage() {
  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <h1>Dependency Exploration</h1>
      <p>Visual representation of cryptographic dependencies across applications.</p>
      <div style={{ width: '100%', height: '100%', border: '1px solid var(--border)' }}>
        <ReactFlow nodes={initialNodes} edges={initialEdges} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}
