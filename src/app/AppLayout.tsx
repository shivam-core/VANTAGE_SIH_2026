import { Outlet, NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, FileUp, Database, Network, GitPullRequest, ListTodo, Columns, FileBarChart, ShieldCheck, Settings } from 'lucide-react';

export default function AppLayout() {
  const navItems = [
    { to: "/app", icon: <LayoutDashboard size={18} />, label: "Overview", end: true },
    { to: "/app/import", icon: <FileUp size={18} />, label: "Import" },
    { to: "/app/inventory", icon: <Database size={18} />, label: "Inventory" },
    { to: "/app/graph", icon: <Network size={18} />, label: "Graph" },
    { to: "/app/scenarios", icon: <GitPullRequest size={18} />, label: "Scenarios" },
    { to: "/app/plan", icon: <ListTodo size={18} />, label: "Plan" },
    { to: "/app/compare", icon: <Columns size={18} />, label: "Compare" },
    { to: "/app/reports", icon: <FileBarChart size={18} />, label: "Reports" },
    { to: "/app/coverage", icon: <ShieldCheck size={18} />, label: "Coverage" },
    { to: "/app/settings", icon: <Settings size={18} />, label: "Settings" }
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Sidebar */}
      <nav className="sidebar">
        <div className="px-6 py-6 border-b" style={{ borderColor: 'var(--border)', marginBottom: 'var(--space-4)' }}>
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="Vantage Logo" className="w-10 h-10 object-contain" />
          </Link>
        </div>
        
        <div className="sidebar-nav overflow-y-auto flex-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto" style={{ backgroundColor: 'var(--bg)', padding: 'var(--space-8)' }}>
        <Outlet />
      </main>
    </div>
  );
}
