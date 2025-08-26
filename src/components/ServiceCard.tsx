import React from 'react';
import { ExternalLinkIcon, ServerIcon, UsersIcon, CodeIcon, LifeBuoyIcon, DatabaseIcon, GlobeIcon, MailIcon, CalendarIcon, GitBranchIcon, ClockIcon, LayersIcon, FileTextIcon, MonitorIcon, NetworkIcon, ShieldIcon, TicketIcon, BookOpenIcon, WifiIcon, WifiOffIcon, HelpCircleIcon } from 'lucide-react';

interface ServiceProps {
  name: string;
  url: string;
  category?: string;
  ip?: string;
  icon?: string;
  status?: 'online' | 'offline' | 'unknown';
}

// Helper function to get appropriate icon based on service name or category
const getServiceIcon = (name: string, category: string = '') => {
  const lowerName = name.toLowerCase();
  // Check name first
  if (lowerName.includes('dns') || lowerName.includes('network')) return <NetworkIcon className="w-5 h-5" />;
  if (lowerName.includes('monitor')) return <MonitorIcon className="w-5 h-5" />;
  if (lowerName.includes('user')) return <UsersIcon className="w-5 h-5" />;
  if (lowerName.includes('jira')) return <LayersIcon className="w-5 h-5" />;
  if (lowerName.includes('confluence')) return <FileTextIcon className="w-5 h-5" />;
  if (lowerName.includes('slack')) return <GlobeIcon className="w-5 h-5" />;
  if (lowerName.includes('email') || lowerName.includes('mail')) return <MailIcon className="w-5 h-5" />;
  if (lowerName.includes('calendar')) return <CalendarIcon className="w-5 h-5" />;
  if (lowerName.includes('weblogic') || lowerName.includes('console')) return <ServerIcon className="w-5 h-5" />;
  if (lowerName.includes('jenkins')) return <ClockIcon className="w-5 h-5" />;
  if (lowerName.includes('git')) return <GitBranchIcon className="w-5 h-5" />;
  if (lowerName.includes('artifactory')) return <DatabaseIcon className="w-5 h-5" />;
  if (lowerName.includes('api') || lowerName.includes('swagger')) return <CodeIcon className="w-5 h-5" />;
  if (lowerName.includes('help')) return <LifeBuoyIcon className="w-5 h-5" />;
  if (lowerName.includes('knowledge') || lowerName.includes('kb')) return <BookOpenIcon className="w-5 h-5" />;
  if (lowerName.includes('ticket')) return <TicketIcon className="w-5 h-5" />;
  // Fallback to category
  if (category.toLowerCase() === 'admin') return <ShieldIcon className="w-5 h-5" />;
  if (category.toLowerCase() === 'collaboration') return <UsersIcon className="w-5 h-5" />;
  if (category.toLowerCase() === 'development') return <CodeIcon className="w-5 h-5" />;
  if (category.toLowerCase() === 'support') return <LifeBuoyIcon className="w-5 h-5" />;
  // Default icon
  return <ServerIcon className="w-5 h-5" />;
};

// Get category color scheme
const getCategoryColors = (category: string = '') => {
  switch (category.toLowerCase()) {
    case 'admin':
      return {
        bg: 'bg-gradient-to-br from-indigo-500 to-purple-600',
        text: 'text-indigo-600 dark:text-indigo-400',
        hover: 'hover:from-indigo-600 hover:to-purple-700'
      };
    case 'collaboration':
      return {
        bg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
        text: 'text-emerald-600 dark:text-emerald-400',
        hover: 'hover:from-emerald-600 hover:to-teal-700'
      };
    case 'development':
      return {
        bg: 'bg-gradient-to-br from-amber-500 to-orange-600',
        text: 'text-amber-600 dark:text-amber-400',
        hover: 'hover:from-amber-600 hover:to-orange-700'
      };
    case 'support':
      return {
        bg: 'bg-gradient-to-br from-sky-500 to-blue-600',
        text: 'text-sky-600 dark:text-sky-400',
        hover: 'hover:from-sky-600 hover:to-blue-700'
      };
    default:
      return {
        bg: 'bg-gradient-to-br from-gray-500 to-slate-600',
        text: 'text-gray-600 dark:text-gray-400',
        hover: 'hover:from-gray-600 hover:to-slate-700'
      };
  }
};

// Get status configuration
const getStatusConfig = (status: 'online' | 'offline' | 'unknown') => {
  switch (status) {
    case 'online':
      return {
        icon: <WifiIcon className="w-4 h-4" />,
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-100 dark:bg-green-900/30',
        border: 'border-green-200 dark:border-green-800',
        pulse: 'animate-pulse'
      };
    case 'offline':
      return {
        icon: <WifiOffIcon className="w-4 h-4" />,
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-100 dark:bg-red-900/30',
        border: 'border-red-200 dark:border-red-800',
        pulse: ''
      };
    default:
      return {
        icon: <HelpCircleIcon className="w-4 h-4" />,
        color: 'text-gray-600 dark:text-gray-400',
        bg: 'bg-gray-100 dark:bg-gray-800',
        border: 'border-gray-200 dark:border-gray-700',
        pulse: ''
      };
  }
};

export function ServiceCard({
  name,
  url,
  category = '',
  ip,
  icon,
  status = 'unknown'
}: ServiceProps) {
  const categoryColors = getCategoryColors(category);
  const statusConfig = getStatusConfig(status);
  const defaultIcon = getServiceIcon(name, category);
  const iconElement = icon ? (
    <img src={icon} alt={name + ' icon'} className="w-5 h-5" />
  ) : defaultIcon;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`
        group relative flex flex-col justify-between h-full p-6 
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
        border border-white/30 dark:border-gray-700/30 
        rounded-2xl shadow-lg hover:shadow-2xl 
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900
      `}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 ${categoryColors.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
      
      <div className="relative flex flex-col h-full">
        {/* Header with icon and name */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`
              p-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110
              ${categoryColors.bg} ${categoryColors.hover}
            `}>
              <div className="text-white">
                {iconElement}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                {name}
              </h3>
            </div>
          </div>
        </div>

        {/* URL and IP info */}
        <div className="space-y-2 mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate font-mono">
            {url}
          </p>
          {ip && (
            <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
              IP: {ip}
            </p>
          )}
        </div>

        {/* Status indicator */}
        <div className="mt-auto">
          <div className={`
            flex items-center justify-between p-3 rounded-xl border transition-all duration-200
            ${statusConfig.bg} ${statusConfig.border}
          `}>
            <div className="flex items-center space-x-2">
              <div className={`${statusConfig.color} ${statusConfig.pulse}`}>
                {statusConfig.icon}
              </div>
              <span className={`text-sm font-medium ${statusConfig.color}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            
            <div className={`flex items-center space-x-1 ${categoryColors.text} font-medium text-sm`}>
              <span>Open</span>
              <ExternalLinkIcon className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-indigo-500/5 transition-all duration-300 rounded-2xl"></div>
    </a>
  );
}