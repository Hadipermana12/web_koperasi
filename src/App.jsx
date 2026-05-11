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
import LoanCategoryPage from './pages/LoanCategoryPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<DashboardPage />} />
            
            {/* HEAD & ADMIN Access */}
            <Route element={<ProtectedRoute allowedRoles={['HEAD', 'ADMIN', 'KEPALA_KOPERASI', 'KETUA_KOPERASI', 'FINANCE']} />}>
              <Route path="/anggota" element={<MemberPage />} />
              <Route path="/persetujuan" element={<ApprovalPage />} />
              <Route path="/kategori-pinjaman" element={<LoanCategoryPage />} />
            </Route>

            <Route path="/keuangan" element={<FinancePage />} />
          </Route>
        </Route>

        {/* Catch-all 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
