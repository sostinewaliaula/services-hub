import React, { useEffect, useState } from 'react';
import { ServiceCard } from './ServiceCard';
import { SearchIcon } from 'lucide-react';
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
      return 'bg-indigo-100 text-indigo-800';
    case 'collaboration':
      return 'bg-emerald-100 text-emerald-800';
    case 'development':
      return 'bg-amber-100 text-amber-800';
    case 'support':
      return 'bg-sky-100 text-sky-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
export function ServiceGrid() {
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

  // Check status of services
  useEffect(() => {
    const checkStatuses = async () => {
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
    checkStatuses();
  }, []);
  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredServices(services);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = services.filter(service => service.name.toLowerCase().includes(query) || service.url.toLowerCase().includes(query) || service.category.toLowerCase().includes(query));
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
    return <div className="flex items-center justify-center w-full py-12">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-lg text-gray-600">Loading services...</div>
        </div>
      </div>;
  }
  if (error) {
    return <div className="p-4 mt-4 text-red-700 bg-red-100 rounded-md">
        <p>{error}</p>
      </div>;
  }
  if (services.length === 0) {
    return <div className="p-6 text-center bg-white rounded-lg shadow">
        <p className="text-lg text-gray-600">No services available</p>
      </div>;
  }
  return <div className="space-y-8">
      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <SearchIcon className="w-5 h-5 text-gray-400" />
        </div>
        <input type="text" placeholder="Search services..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="block w-full py-3 pl-10 pr-3 text-sm bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
      </div>

      {Object.entries(servicesByCategory).length === 0 ? <div className="p-6 text-center bg-white rounded-lg shadow">
          <p className="text-lg text-gray-600">No matching services found</p>
        </div> : Object.entries(servicesByCategory).map(([category, categoryServices]) => <div key={category} className="space-y-4">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-gray-800">{category}</h2>
                <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(category)}`}>
                  {categoryServices.length}{' '}
                  {categoryServices.length === 1 ? 'service' : 'services'}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {categoryServices.map(service => <ServiceCard key={service.name} name={service.name} url={service.url} category={service.category} ip={service.ip} icon={service.icon} status={service.status} />)}
              </div>
            </div>)}
    </div>;
}