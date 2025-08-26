import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOutIcon, UserIcon, BellIcon, MenuIcon } from 'lucide-react';
import { useState } from 'react';
export function Header() {
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
  return <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center">
          <img src="http://10.176.18.105:8080/scp/logo.php?login" alt="Caava Group Logo" className="w-10 h-10 mr-3 rounded-md" />
          <h1 className="text-xl font-bold text-gray-900">
            Caava Group
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative p-1 text-gray-500 transition-colors duration-200 rounded-full hover:text-gray-700 hover:bg-gray-100">
            <BellIcon className="w-6 h-6" />
            <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
              3
            </span>
          </button>
          <button onClick={toggleDark} className="p-1 text-gray-500 transition-colors duration-200 rounded-full hover:text-gray-700 hover:bg-gray-100 dark:hover:text-gray-300 dark:hover:bg-gray-800" title="Toggle dark mode">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </button>
          <button className="p-1 text-gray-500 transition-colors duration-200 rounded-full md:hidden hover:text-gray-700 hover:bg-gray-100">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>;
}