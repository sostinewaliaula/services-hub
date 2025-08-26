import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { ServiceCard } from './ServiceCard';
import { SearchIcon, FilterIcon, GridIcon } from 'lucide-react';
import { RefreshCw } from 'lucide-react';
import servicesData from '../services.json';

interface Service {
  name: string;
  url: string;
  category: string;
  ip?: string;
  icon?: string;
  status?: 'online' | 'offline' | 'unknown';
}

// Helper function to get category icon color
const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'admin':
      return 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white';
    case 'collaboration':
      return 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white';
    case 'development':
      return 'bg-gradient-to-r from-amber-500 to-orange-600 text-white';
    case 'support':
      return 'bg-gradient-to-r from-sky-500 to-blue-600 text-white';
    default:
      return 'bg-gradient-to-r from-gray-500 to-slate-600 text-white';
  }
};

export const ServiceGrid = forwardRef(function ServiceGrid(props, ref) {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to determine if a service should be checked
  const isCheckable = (service: Service) => {
    const name = service.name.toLowerCase();
    return service.category.toLowerCase() !== 'development' && !name.includes('database');
  };

  // Status check logic as a function for reuse
  const checkStatuses = async () => {
    setIsLoading(true);
    const statusPromises = servicesData.map(async (service) => {
      if (!isCheckable(service)) {
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
    });
    const checked = await Promise.all(statusPromises);
    setServices(checked);
    setFilteredServices(checked);
    setIsLoading(false);
  };

  useImperativeHandle(ref, () => ({ refresh: checkStatuses }), [checkStatuses]);

  // Initial load
  useEffect(() => {
    checkStatuses();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredServices(services);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = services.filter(service => 
        service.name.toLowerCase().includes(query) || 
        service.url.toLowerCase().includes(query) || 
        service.category.toLowerCase().includes(query)
      );
      setFilteredServices(filtered);
    }
  }, [searchQuery, services]);

  // Group services by category
  const servicesByCategory = filteredServices.reduce<Record<string, Service[]>>((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full py-16">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-purple-600 rounded-full animate-spin" style={{ animationDelay: '0.5s' }}></div>
          </div>
          <div className="text-lg font-medium text-gray-600 dark:text-gray-300">Loading services...</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Checking service status</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
            <span className="text-red-600 dark:text-red-400 text-sm font-bold">!</span>
          </div>
          <p className="text-red-700 dark:text-red-300 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="p-12 text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
          <GridIcon className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">No services available</p>
        <p className="text-gray-500 dark:text-gray-400">Please check your configuration or contact support.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Search bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
        </div>
        <input 
          type="text" 
          placeholder="Search services by name, URL, or category..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="block w-full py-4 pl-12 pr-4 text-sm bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent dark:text-gray-100 shadow-lg transition-all duration-200 hover:shadow-xl focus:shadow-xl" 
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <FilterIcon className="w-5 h-5 text-gray-400" />
        </div>
      </div>

      {Object.entries(servicesByCategory).length === 0 ? (
        <div className="p-12 text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <SearchIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">No matching services found</p>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms.</p>
        </div>
      ) : (
        Object.entries(servicesByCategory).map(([category, categoryServices]) => (
          <div key={category} className="space-y-6">
            {/* Enhanced Category Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`px-4 py-2 rounded-xl shadow-lg ${getCategoryColor(category)}`}>
                  <span className="font-semibold">{category}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {categoryServices.length}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 font-medium">
                    {categoryServices.length === 1 ? 'service' : 'services'}
                  </span>
                </div>
              </div>
              
              {/* Status summary */}
              <div className="flex items-center space-x-2">
                {(() => {
                  const onlineCount = categoryServices.filter(s => s.status === 'online').length;
                  const totalCount = categoryServices.length;
                  const percentage = totalCount > 0 ? Math.round((onlineCount / totalCount) * 100) : 0;
                  
                  return (
                    <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium text-green-700 dark:text-green-300">
                        {onlineCount}/{totalCount} online ({percentage}%)
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categoryServices.map(service => (
                <ServiceCard 
                  key={service.name} 
                  name={service.name} 
                  url={service.url} 
                  category={service.category} 
                  ip={service.ip} 
                  icon={service.icon} 
                  status={service.status} 
                />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
});