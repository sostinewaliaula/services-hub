import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOutIcon, UserIcon, BellIcon, MenuIcon } from 'lucide-react';
export function Header() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    navigate('/');
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
          <button className="p-1 text-gray-500 transition-colors duration-200 rounded-full md:hidden hover:text-gray-700 hover:bg-gray-100">
            <MenuIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>;
}