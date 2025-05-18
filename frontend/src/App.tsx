import { useEffect, useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { init } from './fhevmjs';
import './App.css';
import { useConnect, useConnectors } from 'wagmi';
import Event from './pages/Event.tsx';
import Analytics from './pages/Analytics.tsx';
import Admin from './pages/Admin.tsx';
import { Link, Route, Routes } from 'react-router-dom';
import Connection from './components/Connect.tsx';
import Home from './components/Home.tsx';

function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  const connect = useConnect();
  const connectors = useConnectors();

  useEffect(() => {
    // Trick to avoid double init with HMR
    if (window.fhevmjsInitialized) return;
    window.fhevmjsInitialized = true;
    init()
      .then(() => {
        setIsInitialized(true);
      })
      .catch((e) => {
        console.log(e);
        setIsInitialized(false);
      });
  }, []);

  if (!isInitialized) return null;

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
      {/* <Connect>
        {(account, provider) => (
          <Devnet account={account} provider={provider} />
        )}
      </Connect> */}

      {/* {connectors?.map((connector) => (
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
