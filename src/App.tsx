import React, { useState } from 'react';
import Home from './Home';
import { ModelsPage } from './components/ModelsPage';
import { Routes, Route } from 'react-router-dom';

interface Story {
  id: string;
  type: 'jira' | 'manual';
  content: string;
  title: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/models" element={<ModelsPage />} />
    </Routes>
  );
}

export default App;