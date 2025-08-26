import { useState, useEffect, useRef } from 'react';
import { XIcon, AlertTriangleIcon, WifiOffIcon, ExternalLinkIcon } from 'lucide-react';
import servicesData from '../services.json';

interface Service {
  name: string;
  url: string;
  category: string;
  ip?: string;
  icon?: string;
  status?: 'online' | 'offline' | 'unknown';
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [offlineServices, setOfflineServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Check service status
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

  // Load offline services
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      const loadOfflineServices = async () => {
        const statusPromises = servicesData.map(checkServiceStatus);
        const checkedServices = await Promise.all(statusPromises);
        const offline = checkedServices
          .filter(service => service.status === 'offline')
          .slice(0, 3); // Get latest 3 offline services
        setOfflineServices(offline);
        setIsLoading(false);
      };
      
      loadOfflineServices();
    }
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Notification Panel */}
      <div 
        ref={panelRef}
        className="fixed top-20 right-4 w-96 max-h-96 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/50 z-50 overflow-hidden animate-fade-in-up"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
              <AlertTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                Service Alerts
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {offlineServices.length} service{offlineServices.length !== 1 ? 's' : ''} offline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <div className="p-6 text-center">
              <div className="w-8 h-8 border-2 border-red-200 border-t-red-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Checking services...</p>
            </div>
          ) : offlineServices.length === 0 ? (
            <div className="p-6 text-center">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                All services operational
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                No offline services detected
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {offlineServices.map((service, index) => (
                <div 
                  key={service.name}
                  className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200/50 dark:border-red-800/50 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <WifiOffIcon className="w-4 h-4 text-red-500 flex-shrink-0" />
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                          {service.name}
                        </h4>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono mb-2">
                        {service.url}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium bg-red-100 dark:bg-red-800/50 text-red-700 dark:text-red-300 rounded-full">
                          {service.category}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          Offline
                        </span>
                      </div>
                    </div>
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200 flex-shrink-0"
                      title="Open service"
                    >
                      <ExternalLinkIcon className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {offlineServices.length > 0 && (
          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">
                Showing latest {offlineServices.length} offline service{offlineServices.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={() => {
                  // Refresh the notification panel
                  setIsLoading(true);
                  setTimeout(() => {
                    const loadOfflineServices = async () => {
                      const statusPromises = servicesData.map(checkServiceStatus);
                      const checkedServices = await Promise.all(statusPromises);
                      const offline = checkedServices
                        .filter(service => service.status === 'offline')
                        .slice(0, 3);
                      setOfflineServices(offline);
                      setIsLoading(false);
                    };
                    loadOfflineServices();
                  }, 100);
                }}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                Refresh
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
