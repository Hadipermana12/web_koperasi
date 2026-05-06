import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import ApprovalPage from './pages/ApprovalPage';
import FinancePage from './pages/FinancePage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SyncPage from './pages/SyncPage';
import MemberPage from './pages/MemberPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/anggota" element={<MemberPage />} />
            <Route path="/persetujuan" element={<ApprovalPage />} />
            <Route path="/keuangan" element={<FinancePage />} />
            <Route path="/sinkronisasi" element={<SyncPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
