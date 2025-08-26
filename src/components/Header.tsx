import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BellIcon, MenuIcon, RefreshCw, SunIcon, MoonIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { NotificationPanel } from './NotificationPanel';

interface HeaderProps {
  onRefresh?: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function Header({ onRefresh, searchQuery, onSearchChange }: HeaderProps) {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [offlineCount, setOfflineCount] = useState(0);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const toggleDark = () => {
    setDark(d => {
      if (d) {
        document.documentElement.classList.remove('dark');
      } else {
        document.documentElement.classList.add('dark');
      }
      return !d;
    });
  };

  // Check for offline services periodically
  useEffect(() => {
    const checkOfflineServices = async () => {
      try {
        // Import services data dynamically to avoid circular dependency
        const servicesData = await import('../services.json');
        
        const checkServiceStatus = async (service: any) => {
          const name = service.name.toLowerCase();
          const isCheckable = service.category.toLowerCase() !== 'development' && !name.includes('database');
          
          if (!isCheckable) {
            return { ...service, status: 'unknown' as const };
          }
          
          try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 3000);
            await fetch(service.url, { method: 'HEAD', mode: 'no-cors', signal: controller.signal });
            clearTimeout(timeout);
            return { ...service, status: 'online' as const };
          } catch {
            return { ...service, status: 'offline' as const };
          }
        };

        const statusPromises = servicesData.default.map(checkServiceStatus);
        const checkedServices = await Promise.all(statusPromises);
        const offline = checkedServices.filter(service => service.status === 'offline');
        setOfflineCount(offline.length);
      } catch (error) {
        console.error('Error checking offline services:', error);
      }
    };

    // Check immediately
    checkOfflineServices();

    // Check every 30 seconds
    const interval = setInterval(checkOfflineServices, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="http://10.176.18.105:8080/scp/logo.php?login" 
                  alt="Caava Group Logo" 
                  className="w-12 h-12 rounded-xl shadow-lg ring-2 ring-white/20 dark:ring-gray-700/50" 
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Services Hub
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Enterprise Dashboard</p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <SearchIcon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
              </div>
              <input 
                type="text" 
                placeholder="Search services by name, URL, or category..." 
                value={searchQuery} 
                onChange={e => onSearchChange(e.target.value)} 
                className="block w-full py-3 pl-12 pr-4 text-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent dark:text-gray-100 shadow-lg transition-all duration-200 hover:shadow-xl focus:shadow-xl" 
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                <FilterIcon className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="flex items-center px-4 py-2.5 font-semibold rounded-xl shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 hover:shadow-xl"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            )}

            <button 
              onClick={toggleDark} 
              className="p-2.5 text-gray-600 dark:text-gray-300 transition-all duration-300 rounded-xl hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900" 
              title="Toggle dark mode"
            >
              {dark ? (
                <SunIcon className="w-5 h-5" />
              ) : (
                <MoonIcon className="w-5 h-5" />
              )}
            </button>

            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="relative p-2.5 text-gray-600 dark:text-gray-300 transition-all duration-300 rounded-xl hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              title="Service notifications"
            >
              <BellIcon className="w-5 h-5" />
              {offlineCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {offlineCount > 9 ? '9+' : offlineCount}
                </span>
              )}
            </button>

            <button 
              onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              className="p-2.5 text-gray-600 dark:text-gray-300 transition-all duration-300 rounded-xl md:hidden hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              title="Search"
            >
              <SearchIcon className="w-5 h-5" />
            </button>

            <button className="p-2.5 text-gray-600 dark:text-gray-300 transition-all duration-300 rounded-xl md:hidden hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
              <MenuIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Search Bar */}
      {isMobileSearchOpen && (
        <div className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-white/20 dark:border-gray-700/50 px-4 py-3">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <SearchIcon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            </div>
            <input 
              type="text" 
              placeholder="Search services by name, URL, or category..." 
              value={searchQuery} 
              onChange={e => onSearchChange(e.target.value)} 
              className="block w-full py-3 pl-12 pr-4 text-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent dark:text-gray-100 shadow-lg transition-all duration-200 hover:shadow-xl focus:shadow-xl" 
              autoFocus
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
              <FilterIcon className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      )}

      <NotificationPanel 
        isOpen={isNotificationOpen} 
        onClose={() => setIsNotificationOpen(false)} 
      />
    </>
  );
}