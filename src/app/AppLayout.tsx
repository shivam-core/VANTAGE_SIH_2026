import { Outlet, Link } from 'react-router-dom';

export default function AppLayout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <nav style={{ width: '224px', borderRight: '1px solid var(--border)', padding: 'var(--space-4)' }}>
        <h2>VANTAGE</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li><Link to="/app">Overview</Link></li>
          <li><Link to="/app/import">Import</Link></li>
          <li><Link to="/app/inventory">Inventory</Link></li>
          <li><Link to="/app/graph">Graph</Link></li>
          <li><Link to="/app/scenarios">Scenarios</Link></li>
          <li><Link to="/app/plan">Plan</Link></li>
          <li><Link to="/app/compare">Compare</Link></li>
          <li><Link to="/app/reports">Reports</Link></li>
          <li><Link to="/app/coverage">Coverage</Link></li>
          <li><Link to="/app/settings">Settings</Link></li>
        </ul>
      </nav>
      <main style={{ flex: 1, padding: 'var(--space-4)', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
