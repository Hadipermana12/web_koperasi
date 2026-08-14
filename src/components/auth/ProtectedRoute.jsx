import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const token = localStorage.getItem('access_token');
  const userInfo = JSON.parse(localStorage.getItem('user_info') || '{}');
  const userRole = userInfo.role?.toUpperCase();
  
  const globalAllowedRoles = ['ADMIN', 'HEAD', 'STAFF', 'KEPALA_KOPERASI', 'KETUA_KOPERASI', 'FINANCE'];

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Global validation: only ADMIN, HEAD, and STAFF can enter the app
  if (!userRole || !globalAllowedRoles.includes(userRole)) {
    window.alert("Akses Ditolak: Anda tidak memiliki izin untuk mengakses aplikasi ini.");
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_info');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
