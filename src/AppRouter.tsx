import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import EditServices from './pages/EditServices';

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/edit" element={<EditServices />} />
      </Routes>
    </BrowserRouter>
  );
}