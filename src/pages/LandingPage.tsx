import { useNavigate, Link } from 'react-router-dom';
import { PlayCircle, GitBranch, ArrowDown } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-full" style={{ backgroundColor: 'var(--bg)' }}>
      {/* Top Navigation */}
      <header className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img src="/logo.png" alt="Vantage Logo" className="w-10 h-10 object-contain" />
        </Link>
        <div className="flex items-center gap-4">
          <button className="btn btn-ghost">
            <PlayCircle size={16} /> Demo Video
          </button>
          <a href="https://github.com/shivam-core/VANTAGE_SIH_2026" target="_blank" rel="noreferrer" className="btn btn-ghost">
            <GitBranch size={16} /> GitHub Repo
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="badge">
          <span className="badge-dot"></span> v1.0 Production
        </div>

        <h1 className="hero-title">
          Cryptography,<br/>
          <span>Quantum-Safe.</span>
        </h1>

        <p className="hero-subtitle">
          Turn vulnerable cryptographic algorithms into post-quantum secured code — right inside your codebase.
        </p>
        <p className="text-sm text-muted mb-8 max-w-2xl">
          Vantage analyzes your codebase, identifies outdated assets, and builds a comprehensive migration plan for maximum security.
        </p>

        <button 
          onClick={() => navigate('/app/import')}
          className="btn btn-primary"
          style={{ marginBottom: 'var(--space-8)' }}
        >
          Scan Codebase <ArrowDown size={18} />
        </button>
        <p className="text-xs text-muted">Optimized for Python, Java, & TypeScript</p>
      </main>

      {/* How it Works Section */}
      <section className="flex flex-col items-center pb-20 px-6 max-w-6xl w-full">
        <h3 className="font-bold mb-8 text-lg">How to Migrate</h3>
        <div className="flex justify-between w-full gap-8">
          <div className="step-card">
            <div className="step-circle">1</div>
            <p className="text-sm font-medium">Connect</p>
            <p className="text-xs text-muted mt-2">Upload your code or connect your repo</p>
          </div>
          <div className="step-card">
            <div className="step-circle">2</div>
            <p className="text-sm font-medium">Analyze</p>
            <p className="text-xs text-muted mt-2">Vantage identifies legacy crypto</p>
          </div>
          <div className="step-card">
            <div className="step-circle">3</div>
            <p className="text-sm font-medium">Migrate</p>
            <p className="text-xs text-muted mt-2">Apply quantum-safe algorithms</p>
          </div>
        </div>
      </section>
    </div>
  );
}
