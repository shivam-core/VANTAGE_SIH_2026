import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './AppLayout';
import LandingPage from '../pages/LandingPage';
import GraphPage from '../pages/GraphPage';
import ScenariosPage from '../pages/ScenariosPage';
import ReportsPage from '../pages/ReportsPage';
import ImportPage from '../pages/ImportPage';
import CoveragePage from '../pages/CoveragePage';
import SettingsPage from '../pages/SettingsPage';
import OverviewPage from '../pages/OverviewPage';
import InventoryPage from '../pages/InventoryPage';
import PlanPage from '../pages/PlanPage';

function Placeholder({ name }: { name: string }) {
  return <div><h2>{name}</h2><p>This is a placeholder for {name}.</p></div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="import" element={<ImportPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="assets/:id" element={<Placeholder name="Asset Details" />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="scenarios" element={<ScenariosPage />} />
          <Route path="plan" element={<PlanPage />} />
          <Route path="compare" element={<Placeholder name="Compare" />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="coverage" element={<CoveragePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
