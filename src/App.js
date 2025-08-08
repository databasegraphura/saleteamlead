// src/App.js - CORRECTED (Remove useLocation import and usage)
import React from 'react';
// REMOVED useLocation import:
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import all page components (no change here)
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import TotalSalesPage from './pages/TotalSalesPage';
import ProspectPage from './pages/ProspectPage';
import ReportPage from './pages/ReportPage';
import TeamMemberPage from './pages/TeamMemberPage';
import TransferDataPage from './pages/TransferDataPage';
import UntouchedDataPage from './pages/UntouchedDataPage';
import ProspectFormPage from './pages/ProspectFormPage';
import NotFoundPage from './pages/NotFoundPage';
import ProtectedRoute from './pages/ProtectedRoute';
import Layout from './components/Layout/Layout';

function App() {
  // REMOVED: const location = useLocation();

  return (
    <Router>
      <Routes>
        {/* Public route for Authentication (Login/Signup) */}
        <Route path="/login" element={<AuthPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Team Lead Specific Pages */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/total-sales" element={<TotalSalesPage />} />
            {/* REMOVED key={location.key} from here */}
            <Route path="/prospects" element={<ProspectPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/team-member" element={<TeamMemberPage />} />
            <Route path="/transfer-data" element={<TransferDataPage />} />
            <Route path="/untouched-data" element={<UntouchedDataPage />} />
            <Route path="/prospect-form" element={<ProspectFormPage />} />
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;