import { useEffect, useState, forwardRef, useImperativeHandle, useMemo, useCallback, useRef, memo } from 'react';
import { ServiceCard } from './ServiceCard';
import { GridIcon } from 'lucide-react';

// Custom hook for debounced search
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Memoized StatusSummary component
const StatusSummary = memo(function StatusSummary({ services }: { services: Service[] }) {
  const { onlineCount, totalCount, percentage } = useMemo(() => {
    const online = services.filter(s => s.status === 'online').length;
    const total = services.length;
    const percent = total > 0 ? Math.round((online / total) * 100) : 0;
    return { onlineCount: online, totalCount: total, percentage: percent };
  }, [services]);

  return (
    <div className="flex items-center space-x-3 px-4 py-2 bg-white/50 dark:bg-gray-800/50 rounded-full border border-white/30 dark:border-gray-700/30 backdrop-blur-sm">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        {onlineCount}/{totalCount} online
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
        ({percentage}%)
      </span>
    </div>
  );
});

interface Service {
  name: string;
  url: string;
  category: string;
  ip?: string;
  icon?: string;
  status?: 'online' | 'offline' | 'unknown';
  statusCode?: number;
  statusText?: string;
  displayUrl?: string;
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

// Helper function to get category background color
const getCategoryBgColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'admin':
      return 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20';
    case 'collaboration':
      return 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20';
    case 'development':
      return 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20';
    case 'support':
      return 'bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20';
    default:
      return 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20';
  }
};

// Helper function to get server display name from category ID
const getServerDisplayName = (categoryId: string): string => {
  // Map category IDs to display names
  const categoryMap: Record<string, string> = {
    'default': 'Uncategorized',
    'dns-server': 'DNS Server',
    'system-monitor': 'System Monitor',
    'user-management': 'User Management',
    'network-config': 'Network Config',
    'confluence-server': 'Confluence Server',
    'slack-server': 'Slack Server',
    'email-server': 'Email Server',
    'calendar-server': 'Calendar Server',
    'gitlab-server': 'GitLab Server',
    'artifactory-server': 'Artifactory Server',
    'jira-server': 'Jira Server',
    'help-desk-server': 'Help Desk Server',
    'knowledge-base-server': 'Knowledge Base Server',
    'ticket-system-server': 'Ticket System Server',
    'remote-desktop-server': 'Remote Desktop Server',
    'jenkins-server': 'Jenkins Server',
    'gerrit-server': 'Gerrit Server',
    'jenkins-server-2': 'Jenkins Server 2',
    'vpn-server': 'VPN Server',
    'v6-api-server': 'v6 API Server',
    'jira-test-server': 'Jira Test Server',
    'turnkey-api-server': 'Turnkey API Server',
    'weblogic-server-vm130': 'WebLogic Server (VM 130)',
    'weblogic-server-vm35': 'WebLogic Server (VM 35)',
    'weblogic-server-vm70': 'WebLogic Server (VM 70)',
    'weblogic-server-vm97': 'WebLogic Server (VM 97)',
    'weblogic-server-vm98': 'WebLogic Server (VM 98)',
    'weblogic-server-vm103': 'WebLogic Server (VM 103)',
    'weblogic-server-vm140': 'WebLogic Server (VM 140)',
    'zimbra-email-server': 'Zimbra Email Server',
    'oracle-database': 'Oracle 12C Database'
  };
  
  return categoryMap[categoryId] || categoryId;
};

interface ServiceGridProps {
  searchQuery: string;
  highlightService?: string | null;
}

export const ServiceGrid = forwardRef(function ServiceGrid({ searchQuery, highlightService }: ServiceGridProps, ref) {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [error, setError] = useState('');
  const isCheckingStatusRef = useRef(false);
  
  // Debounce search query to prevent excessive filtering
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const isSearching = searchQuery !== debouncedSearchQuery;

  // Helper to determine if a service should be checked
  const isCheckable = (service: Service) => {
    const name = service.name.toLowerCase();
    const url = service.url.toLowerCase();
    
    // Skip development and database services
    if (service.category.toLowerCase() === 'development' || name.includes('database')) {
      return false;
    }
    
    // Skip internal services that are not accessible from the server
    if (url.includes('.internal.') || url.includes('localhost') || url.includes('127.0.0.1')) {
      return false;
    }
    
    return true;
  };

  // Load services from API
  const loadServices = useCallback(async () => {
    try {
      const response = await fetch('/api/services');
      if (!response.ok) throw new Error('Failed to load services');
      const data = await response.json();
      setServices(data);
    } catch (err) {
      setError('Failed to load services');
    }
  }, []);

  // Status check logic as a function for reuse
  const checkStatuses = useCallback(async () => {
    if (isCheckingStatusRef.current) return; // Prevent multiple simultaneous checks
    
    setServices(currentServices => {
      if (currentServices.length === 0) return currentServices;
      
      isCheckingStatusRef.current = true;
      setIsCheckingStatus(true);
      
      // Run status checks asynchronously using server-side proxy
      const statusPromises = currentServices.map(async (service) => {
        if (!isCheckable(service)) {
          return { ...service, status: 'unknown' as const };
        }
        
        try {
          // Use server-side status check to avoid CORS issues
          const response = await fetch('/api/check-status', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url: service.url })
          });
          
          if (!response.ok) {
            throw new Error(`Status check failed: ${response.status}`);
          }
          
          const result = await response.json();
          
          return { 
            ...service, 
            status: result.status as 'online' | 'offline',
            statusCode: result.statusCode,
            statusText: result.statusText
          };
        } catch (error) {
          console.warn(`Status check failed for ${service.name} (${service.url}):`, error);
          return { ...service, status: 'offline' as const };
        }
      });
      
      // Update services when status checks complete
      Promise.all(statusPromises).then(checked => {
        setServices(checked);
        setIsCheckingStatus(false);
        isCheckingStatusRef.current = false;
      });
      
      return currentServices; // Return current state while processing
    });
  }, []);

  useImperativeHandle(ref, () => ({ refresh: checkStatuses }), [checkStatuses]);

  // Initial load
  useEffect(() => {
    const initializeData = async () => {
      await loadServices();
      setIsLoading(false);
    };
    initializeData();
  }, [loadServices]);

  // Check statuses after services are loaded (without affecting main loading state)
  useEffect(() => {
    if (services.length > 0 && !isCheckingStatusRef.current) {
      // Run status check in background without showing loading
      checkStatuses();
    }
  }, [services.length]); // Only depend on services.length to prevent infinite loop

  // Memoized filtered services based on debounced search query
  const filteredServices = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return services;
    }
    
    const query = debouncedSearchQuery.toLowerCase();
    return services.filter(service => {
      const name = service.name.toLowerCase();
      const url = service.url.toLowerCase();
      const category = service.category.toLowerCase();
      const displayName = getServerDisplayName(service.category).toLowerCase();
      
      return name.includes(query) || 
             url.includes(query) || 
             category.includes(query) ||
             displayName.includes(query);
    });
  }, [services, debouncedSearchQuery]);

  // Memoized category grouping with sorting
  const servicesByCategory = useMemo(() => {
    const grouped = filteredServices.reduce<Record<string, Service[]>>((acc, service) => {
      const categoryName = getServerDisplayName(service.category);
      if (!acc[categoryName]) {
        acc[categoryName] = [];
      }
      acc[categoryName].push(service);
      return acc;
    }, {});

    // Sort categories with WebLogic first
    return Object.fromEntries(
      Object.entries(grouped).sort(([catA], [catB]) => {
        const aIsWeblogic = getServerDisplayName(catA).toLowerCase().includes('weblogic');
        const bIsWeblogic = getServerDisplayName(catB).toLowerCase().includes('weblogic');
        if (aIsWeblogic && !bIsWeblogic) return -1;
        if (!aIsWeblogic && bIsWeblogic) return 1;
        return 0;
      })
    );
  }, [filteredServices]);

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
    <div className="space-y-12" data-service-grid style={{ willChange: 'scroll-position' }}>
      {/* Search indicator */}
      {isSearching && (
        <div className="flex items-center justify-center py-4">
          <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
            <div className="w-4 h-4 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <span className="text-sm font-medium">Searching...</span>
          </div>
        </div>
      )}

      {/* Status checking indicator */}
      {isCheckingStatus && (
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
            <div className="w-3 h-3 border-2 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
            <span className="text-xs font-medium">Checking service status...</span>
          </div>
        </div>
      )}

      {Object.entries(servicesByCategory).length === 0 ? (
        <div className="p-12 text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/50">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <GridIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">No matching services found</p>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="space-y-16">
          {Object.entries(servicesByCategory).map(([category, categoryServices], index) => (
            <CategorySection 
              key={category}
              category={category}
              categoryServices={categoryServices}
              index={index}
              totalCategories={Object.keys(servicesByCategory).length}
              highlightService={highlightService}
            />
          ))}
        </div>
      )}
    </div>
  );
});

// Memoized CategorySection component
const CategorySection = memo(function CategorySection({ 
  category, 
  categoryServices, 
  index, 
  totalCategories, 
  highlightService 
}: {
  category: string;
  categoryServices: Service[];
  index: number;
  totalCategories: number;
  highlightService?: string | null;
}) {
  return (
    <div className="relative">
      {/* Category Section with enhanced styling */}
      <div className={`p-8 rounded-3xl shadow-xl border border-white/20 dark:border-gray-700/50 backdrop-blur-sm ${getCategoryBgColor(category)}`}>
        {/* Category Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-6">
            <div className={`px-6 py-3 rounded-2xl shadow-lg ${getCategoryColor(getServerDisplayName(category))}`}>
              <span className="font-bold text-lg">{getServerDisplayName(category)}</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {categoryServices.length}
              </span>
              <span className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                {categoryServices.length === 1 ? 'service' : 'services'}
              </span>
            </div>
          </div>
          
          {/* Status summary */}
          <div className="flex items-center space-x-3">
            <StatusSummary services={categoryServices} />
          </div>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" style={{ contain: 'layout style paint' }}>
          {categoryServices.map(service => (
            <ServiceCard 
              key={service.name} 
              name={service.name} 
              url={service.url} 
              category={service.category} 
              ip={service.ip} 
              icon={service.icon} 
              status={service.status} 
              displayUrl={service.displayUrl}
              categoryDisplayName={getServerDisplayName(category)}
              highlight={highlightService === service.name}
            />
          ))}
        </div>
      </div>

      {/* Divider between categories (except for the last one) */}
      {index < totalCategories - 1 && (
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-1 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent rounded-full"></div>
        </div>
      )}
    </div>
  );
});