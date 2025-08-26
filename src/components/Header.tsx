import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOutIcon, UserIcon, BellIcon, MenuIcon, RefreshCw, SunIcon, MoonIcon } from 'lucide-react';
import { useState } from 'react';

export function Header({ onRefresh }: { onRefresh?: () => void }) {
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
  };

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

  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-lg border-b border-white/20 dark:border-gray-700/50 sticky top-0 z-50">
      <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
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

          <button className="p-2.5 text-gray-600 dark:text-gray-300 transition-all duration-300 rounded-xl hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
            <BellIcon className="w-5 h-5" />
          </button>

          <button className="p-2.5 text-gray-600 dark:text-gray-300 transition-all duration-300 rounded-xl hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
            <UserIcon className="w-5 h-5" />
          </button>

          <button 
            onClick={handleLogout}
            className="p-2.5 text-red-600 dark:text-red-400 transition-all duration-300 rounded-xl hover:text-red-700 hover:bg-red-50 dark:hover:text-red-300 dark:hover:bg-red-900/20 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            title="Logout"
          >
            <LogOutIcon className="w-5 h-5" />
          </button>

          <button className="p-2.5 text-gray-600 dark:text-gray-300 transition-all duration-300 rounded-xl md:hidden hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-gray-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
            <MenuIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}