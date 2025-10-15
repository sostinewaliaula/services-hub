import React, { memo, useMemo } from 'react';
import { ExternalLinkIcon, ServerIcon, UsersIcon, CodeIcon, LifeBuoyIcon, DatabaseIcon, GlobeIcon, MailIcon, CalendarIcon, GitBranchIcon, ClockIcon, LayersIcon, FileTextIcon, MonitorIcon, NetworkIcon, ShieldIcon, TicketIcon, BookOpenIcon, WifiIcon, WifiOffIcon, HelpCircleIcon } from 'lucide-react';

interface ServiceProps {
  name: string;
  url: string;
  category?: string;
  ip?: string;
  icon?: string;
  status?: 'online' | 'offline' | 'unknown';
  displayUrl?: string; // New field for friendly URL display
  categoryDisplayName?: string; // New: display name for color logic
  highlight?: boolean;
}

// Memoized helper function to get appropriate icon based on service name or category
const getServiceIcon = (name: string, category: string = '') => {
  const lowerName = name.toLowerCase();
  const lowerCategory = category.toLowerCase();
  
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
  if (lowerCategory === 'admin') return <ShieldIcon className="w-5 h-5" />;
  if (lowerCategory === 'collaboration') return <UsersIcon className="w-5 h-5" />;
  if (lowerCategory === 'development') return <CodeIcon className="w-5 h-5" />;
  if (lowerCategory === 'support') return <LifeBuoyIcon className="w-5 h-5" />;
  // Default icon
  return <ServerIcon className="w-5 h-5" />;
};

// Helper function to get category color scheme by display name
const categoryColorMap: Record<string, { bg: string; text: string; hover: string }> = {
  'Uncategorized': { bg: 'bg-gradient-to-br from-gray-500 to-slate-600', text: 'text-gray-700 dark:text-gray-300', hover: 'hover:from-gray-600 hover:to-slate-700' },
  'WebLogic Server (VM 97)': { bg: 'bg-gradient-to-br from-indigo-500 to-blue-600', text: 'text-indigo-700 dark:text-indigo-300', hover: 'hover:from-indigo-600 hover:to-blue-700' },
  'WebLogic Server (VM 35)': { bg: 'bg-gradient-to-br from-blue-500 to-cyan-600', text: 'text-blue-700 dark:text-blue-300', hover: 'hover:from-blue-600 hover:to-cyan-700' },
  'WebLogic Server (VM 70)': { bg: 'bg-gradient-to-br from-purple-500 to-pink-600', text: 'text-purple-700 dark:text-purple-300', hover: 'hover:from-purple-600 hover:to-pink-700' },
  'WebLogic Server (VM 130)': { bg: 'bg-gradient-to-br from-green-500 to-emerald-600', text: 'text-green-700 dark:text-green-300', hover: 'hover:from-green-600 hover:to-emerald-700' },
  'WebLogic Server (VM 98)': { bg: 'bg-gradient-to-br from-orange-500 to-yellow-500', text: 'text-orange-700 dark:text-orange-300', hover: 'hover:from-orange-600 hover:to-yellow-600' },
  'WebLogic Server (VM 103)': { bg: 'bg-gradient-to-br from-pink-500 to-rose-500', text: 'text-pink-700 dark:text-pink-300', hover: 'hover:from-pink-600 hover:to-rose-600' },
  'WebLogic Server (VM 140)': { bg: 'bg-gradient-to-br from-teal-500 to-cyan-500', text: 'text-teal-700 dark:text-teal-300', hover: 'hover:from-teal-600 hover:to-cyan-600' },
  'Jenkins Server': { bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600', text: 'text-yellow-700 dark:text-yellow-300', hover: 'hover:from-yellow-500 hover:to-yellow-700' },
  'Database Server': { bg: 'bg-gradient-to-br from-green-500 to-lime-500', text: 'text-green-700 dark:text-green-300', hover: 'hover:from-green-600 hover:to-lime-600' },
  'Email Server': { bg: 'bg-gradient-to-br from-pink-500 to-rose-500', text: 'text-pink-700 dark:text-pink-300', hover: 'hover:from-pink-600 hover:to-rose-600' },
  'Zimbra Email Server': { bg: 'bg-gradient-to-br from-fuchsia-500 to-purple-500', text: 'text-fuchsia-700 dark:text-fuchsia-300', hover: 'hover:from-fuchsia-600 hover:to-purple-600' },
  'Jira Server': { bg: 'bg-gradient-to-br from-blue-400 to-blue-700', text: 'text-blue-700 dark:text-blue-300', hover: 'hover:from-blue-500 hover:to-blue-800' },
  'Jira Test Server': { bg: 'bg-gradient-to-br from-sky-400 to-blue-400', text: 'text-sky-700 dark:text-sky-300', hover: 'hover:from-sky-500 hover:to-blue-500' },
  'GitLab Server': { bg: 'bg-gradient-to-br from-orange-500 to-red-500', text: 'text-orange-700 dark:text-orange-300', hover: 'hover:from-orange-600 hover:to-red-600' },
  'Gerrit Server': { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', text: 'text-amber-700 dark:text-amber-300', hover: 'hover:from-amber-600 hover:to-orange-700' },
  'Confluence Server': { bg: 'bg-gradient-to-br from-sky-400 to-blue-400', text: 'text-sky-700 dark:text-sky-300', hover: 'hover:from-sky-500 hover:to-blue-500' },
  'Calendar Server': { bg: 'bg-gradient-to-br from-lime-400 to-green-400', text: 'text-lime-700 dark:text-lime-300', hover: 'hover:from-lime-500 hover:to-green-500' },
  'Help Desk Server': { bg: 'bg-gradient-to-br from-fuchsia-500 to-purple-500', text: 'text-fuchsia-700 dark:text-fuchsia-300', hover: 'hover:from-fuchsia-600 hover:to-purple-600' },
  'VPN Server': { bg: 'bg-gradient-to-br from-cyan-500 to-teal-500', text: 'text-cyan-700 dark:text-cyan-300', hover: 'hover:from-cyan-600 hover:to-teal-600' },
  'DNS Server': { bg: 'bg-gradient-to-br from-gray-700 to-gray-900', text: 'text-gray-200', hover: 'hover:from-gray-800 hover:to-gray-900' },
  'System Monitor': { bg: 'bg-gradient-to-br from-emerald-500 to-teal-600', text: 'text-emerald-700 dark:text-emerald-300', hover: 'hover:from-emerald-600 hover:to-teal-700' },
  'User Management': { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', text: 'text-amber-700 dark:text-amber-300', hover: 'hover:from-amber-600 hover:to-orange-700' },
  'Network Config': { bg: 'bg-gradient-to-br from-gray-400 to-slate-600', text: 'text-gray-700 dark:text-gray-300', hover: 'hover:from-gray-500 hover:to-slate-700' },
  'Artifactory Server': { bg: 'bg-gradient-to-br from-rose-400 to-pink-500', text: 'text-rose-700 dark:text-rose-300', hover: 'hover:from-rose-500 hover:to-pink-600' },
  'Turnkey API Server': { bg: 'bg-gradient-to-br from-blue-500 to-indigo-500', text: 'text-blue-700 dark:text-blue-300', hover: 'hover:from-blue-600 hover:to-indigo-600' },
};
const getCategoryColors = (displayName: string = '') => {
  if (categoryColorMap[displayName]) return categoryColorMap[displayName];
  // fallback
  return { bg: 'bg-gradient-to-br from-gray-400 to-slate-600', text: 'text-gray-700 dark:text-gray-300', hover: 'hover:from-gray-500 hover:to-slate-700' };
};

// Helper to extract port from URL
const getPortFromUrl = (url: string): string | null => {
  try {
    const u = new URL(url);
    if (u.port) return u.port;
    // If no explicit port, infer from protocol
    if (u.protocol === 'http:') return '80';
    if (u.protocol === 'https:') return '443';
    return null;
  } catch {
    return null;
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

const ServiceCard = memo(function ServiceCard({
  name,
  url,
  category = '',
  ip,
  icon,
  status = 'unknown',
  displayUrl,
  categoryDisplayName = '',
  highlight = false
}: ServiceProps) {
  // Memoize expensive calculations
  const categoryColors = useMemo(() => getCategoryColors(categoryDisplayName), [categoryDisplayName]);
  const statusConfig = useMemo(() => getStatusConfig(status), [status]);
  const defaultIcon = useMemo(() => getServiceIcon(name, category), [name, category]);
  const iconElement = useMemo(() => 
    icon ? (
      <img src={icon} alt={name + ' icon'} className="w-5 h-5" />
    ) : defaultIcon,
    [icon, name, defaultIcon]
  );

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className={`
        group relative flex flex-col h-full p-6 
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm 
        border border-white/30 dark:border-gray-700/30 
        rounded-2xl shadow-lg hover:shadow-2xl 
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 dark:focus:ring-offset-gray-900
        ${highlight ? 'ring-4 ring-purple-400 ring-offset-2 z-10' : ''}
      `}
    >
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 ${categoryColors.bg} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}></div>
      
      <div className="relative flex flex-col h-full">
        {/* Header with icon and name */}
        <div className="mb-4">
          <div className="flex items-start space-x-3">
            <div className={`
              flex-shrink-0 p-3 rounded-xl shadow-lg transition-all duration-300 group-hover:scale-110
              ${categoryColors.bg} ${categoryColors.hover}
            `}>
              <div className="text-white">
          {iconElement}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 
                className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight break-words group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200 line-clamp-2"
                title={name}
              >
                {name}
              </h3>
            </div>
          </div>
        </div>

        {/* URL and IP info */}
        <div className="space-y-2 mb-4">
          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono truncate overflow-hidden whitespace-nowrap max-w-full" title={displayUrl || url}>
            {displayUrl || url}
          </p>
          <div className="flex flex-wrap gap-2 items-center">
            {ip && (
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono">
                IP: {ip}
              </p>
            )}
            {/* Show port if present */}
            {getPortFromUrl(url) && (
              <p className="text-xs text-blue-500 dark:text-blue-400 font-mono">
                Port: {getPortFromUrl(url)}
              </p>
            )}
          </div>
        </div>

        {/* Status indicator */}
        <div className="mt-auto pt-4">
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
});

export { ServiceCard };