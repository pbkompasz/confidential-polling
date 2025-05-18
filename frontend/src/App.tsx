import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { init } from './fhevmjs';
import './App.css';
import Event from './pages/Event.tsx';
import Analytics from './pages/Analytics.tsx';
import Admin from './pages/Admin.tsx';
import { Link, Route, Routes } from 'react-router-dom';
import Connection from './components/Connect.tsx';
import Home from './components/Home.tsx';

function App() {
  

  return (
    <>
      <div className="flex justify-between py-2 px-2 border-b min-h-[80px]">
        <h1>
          <Link to="/">ConfidentialSurvey</Link>
        </h1>

        <Connection />
      </div>
      <Routes>
        <Route path="/" element={<Home key={location.pathname} />} />
        <Route
          path="/:eventId/analytics"
          element={<Analytics key={location.pathname} />}
        />
        <Route
          path="/:eventId/settings"
          element={<Admin key={location.pathname} />}
        />
        <Route path="/:eventId" element={<Event key={location.pathname} />} />
      </Routes>
 
      {/* 
      {connectors?.map((connector) => (
        <button
          key={connector.uid}
          onClick={() => connect.connect({ connector })}
        >
          Connect
        </button>
      ))} */}
      <Toaster />
    </>
  );
}

export default App;
