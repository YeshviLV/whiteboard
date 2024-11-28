import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login';
import Room from '../pages/Room';
import NotFound from '../pages/NotFound';

const AppRouter = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/room/:roomId" element={<Room />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

export default AppRouter;
