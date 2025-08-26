import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ServiceGrid } from '../components/ServiceGrid';
import { ClockIcon } from 'lucide-react';
export function Dashboard() {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');else if (hour < 18) setGreeting('Good afternoon');else setGreeting('Good evening');
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
  return <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold">{greeting}</h2>
              <p className="mt-1 text-blue-100">
                Welcome to your service dashboard
              </p>
            </div>
            <div className="flex items-center mt-4 text-sm text-blue-100 md:mt-0">
              <ClockIcon className="w-4 h-4 mr-1" />
              <span>{currentTime}</span>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1 px-4 py-8 mx-auto w-full max-w-7xl sm:px-6 lg:px-8">
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Internal Services</h2>
          <p className="mt-2 text-gray-600">
            Quick access to all your internal services. Click on any card to
            open the service in a new tab.
          </p>
        </div>
        <ServiceGrid />
      </main>
      <footer className="py-6 text-sm text-center text-gray-500 bg-white border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} Turnkey Africa. All rights reserved.
          </p>
          <p className="mt-2 text-xs text-gray-400">
            Version 1.2.0 | Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>;
}