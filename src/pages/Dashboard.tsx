import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header } from '../components/Header';
import { ServiceGrid } from '../components/ServiceGrid';
import { ParticleBackground } from '../components/ParticleBackground';
import { ClockIcon, SparklesIcon, TrendingUpIcon } from 'lucide-react';

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const serviceGridRef = useRef<{ refresh: () => void }>(null);

  // Get highlight param from query string
  const params = new URLSearchParams(location.search);
  const highlightService = params.get('highlight');

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning ☀️');
    else if (hour < 18) setGreeting('Good afternoon 🌤️');
    else setGreeting('Good evening 🌙');

    // Set current time
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      setCurrentTime(now.toLocaleDateString(undefined, options));
    };
    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-green-50 relative">
      <ParticleBackground />
      <Header 
        onRefresh={() => serviceGridRef.current?.refresh()} 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Hero Section with green theme */}
      <div className="relative overflow-hidden animate-fade-in-up">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-400 via-green-200 to-green-100 dark:from-green-900 dark:via-green-800 dark:to-green-700">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px'
            }}></div>
          </div>
        </div>
        <div className="relative px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="space-y-4 animate-slide-in-right">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100/60 backdrop-blur-sm rounded-full hover-lift">
                  <SparklesIcon className="w-6 h-6 text-green-700" />
                </div>
                <h2 className="text-4xl font-bold text-green-700 drop-shadow-lg font-smooth">
                  {greeting}
                </h2>
              </div>
              <p className="text-xl text-green-700 font-medium">
                Welcome to our services dashboard
              </p>
              <p className="text-green-800 max-w-2xl">
                Access all our internal services, monitor their status, and stay connected with your team's tools and resources.
              </p>
            </div>

            <div className="flex flex-col items-center mt-8 space-y-4 md:mt-0 md:items-end animate-slide-in-right">
              <div className="flex items-center px-6 py-3 bg-green-100/60 backdrop-blur-sm rounded-2xl border border-green-200 hover-lift">
                <ClockIcon className="w-5 h-5 mr-3 text-green-700" />
                <span className="text-green-700 font-medium">{currentTime}</span>
              </div>

              <div className="flex items-center px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30 status-pulse">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-green-700 text-sm font-medium">All systems operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 py-8 mx-auto w-full max-w-7xl sm:px-6 lg:px-8">
        {/* Info card with green theme */}
        <div className="mb-8 p-8 bg-green-100/70 dark:bg-green-900/70 backdrop-blur-sm rounded-2xl shadow-xl border border-green-200 dark:border-green-800 animate-fade-in-up">
          <div className="flex items-start space-x-4">
            <div className="p-3 bg-gradient-to-br from-green-500 to-green-400 rounded-xl hover-lift">
              <TrendingUpIcon className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2 font-smooth">
                Internal Services Hub
              </h2>
              <p className="text-green-700 dark:text-green-300 text-lg leading-relaxed">
                Quick access to all our internal services. Click on any card to open the service in a new tab. 
                All services are monitored for real-time status updates.
              </p>
            </div>
          </div>
        </div>

        <ServiceGrid ref={serviceGridRef} searchQuery={searchQuery} highlightService={highlightService} />
      </main>

      {/* Footer with green theme */}
      <footer className="py-8 text-sm text-center bg-green-100/50 dark:bg-green-900/50 backdrop-blur-sm border-t border-green-200 dark:border-green-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center space-y-2">
            <p className="text-green-700 dark:text-green-400 font-medium">
              © {new Date().getFullYear()} Turnkey Africa. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-xs text-green-600 dark:text-green-500">
              <span>Version 1.2.0</span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}