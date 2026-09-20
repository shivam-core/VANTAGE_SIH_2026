import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div>
      <h1>Understand your cryptography before you change it.</h1>
      <p>Discover supported cryptographic assets, trace their dependencies, and plan post-quantum migration with evidence and explicit assumptions.</p>
      <div>
        <Link to="/app/graph"><button>Open demo</button></Link>
        <Link to="/app/graph"><button>Analyse my files</button></Link>
      </div>
    </div>
  );
}
