// Routes.tsx
import React from 'react';
import { Routes as ReactRoutes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/reducers';
import HomeScreen from '../../pages/HomeScreen';
import RegisterScreen from '../../pages/RegisterScreen';
import LoginScreen from '../../pages/LoginScreen';
import AdminDashboardScreen from '../../pages/AdminDashboardScreen';
import ComplaintScreen from '../../pages/ComplaintScreen';
import ProfilePage from '../../pages/ProfileScreen';
import BillScreen from '../../pages/BillScreen';

const Routes: React.FC = () => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const userRole = useSelector((state: RootState) => state.auth.user?.role);

  return (
    <ReactRoutes>
      <Route path="/" element={isLoggedIn ? (userRole === 'admin' ? <Navigate to="/admin-dashboard" /> : <Navigate to="dashboard" />) : <LoginScreen />} />
      <Route path='/SignUp' element={<RegisterScreen />} />
      <Route path='/login' element={isLoggedIn ? <Navigate to="/" /> : <LoginScreen />} />
      <Route path='/adminDashboard' element={<AdminDashboardScreen />} />
      <Route path='/dashboard' element={<HomeScreen />} />
      <Route path='/customersupport' element={<ComplaintScreen />} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/bill" element={<BillScreen/>} />
      <Route 
        path="/admin-dashboard" 
        element={userRole === 'admin' ? <AdminDashboardScreen /> : <Navigate to="/" />} 
      />
    </ReactRoutes>
  );
};

export default Routes;
