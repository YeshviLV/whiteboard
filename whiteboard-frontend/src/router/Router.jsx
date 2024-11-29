import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Room from '../pages/Room';
import NotFound from '../pages/NotFound';
import Dashboard from '../pages/Dashboard';

const AppRouter = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />    
    <Route path="*" element={<NotFound />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/room/:roomId" element={<Room />} />
  </Routes>
);

export default AppRouter;
