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
import ComparePage from '../pages/ComparePage';
import AssetDetailsPage from '../pages/AssetDetailsPage';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/app" element={<AppLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="import" element={<ImportPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="assets/:id" element={<AssetDetailsPage />} />
          <Route path="graph" element={<GraphPage />} />
          <Route path="scenarios" element={<ScenariosPage />} />
          <Route path="plan" element={<PlanPage />} />
          <Route path="compare" element={<ComparePage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="coverage" element={<CoveragePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
