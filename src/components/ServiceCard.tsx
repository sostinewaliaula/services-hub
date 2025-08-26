import React from 'react';
import { ExternalLinkIcon, ServerIcon, UsersIcon, CodeIcon, LifeBuoyIcon, DatabaseIcon, GlobeIcon, MailIcon, CalendarIcon, GitBranchIcon, ClockIcon, LayersIcon, FileTextIcon, MonitorIcon, NetworkIcon, ShieldIcon, TicketIcon, BookOpenIcon } from 'lucide-react';
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
// Get category color
const getCategoryColor = (category: string = '') => {
  switch (category.toLowerCase()) {
    case 'admin':
      return 'border-l-indigo-500 bg-indigo-50';
    case 'collaboration':
      return 'border-l-emerald-500 bg-emerald-50';
    case 'development':
      return 'border-l-amber-500 bg-amber-50';
    case 'support':
      return 'border-l-sky-500 bg-sky-50';
    default:
      return 'border-l-gray-500 bg-gray-50';
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
  const categoryColor = getCategoryColor(category);
  const defaultIcon = getServiceIcon(name, category);
  const iconElement = icon ? (
    <img src={icon} alt={name + ' icon'} className="w-5 h-5" />
  ) : defaultIcon;
  const statusColor = status === 'online' ? 'bg-green-500' : status === 'offline' ? 'bg-red-500' : 'bg-gray-400';
  const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
  return <a href={url} target="_blank" rel="noopener noreferrer" className={`flex flex-col justify-between h-full transition-all duration-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md hover:translate-y-[-2px] border-l-4 ${categoryColor} relative`}>
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center mb-4">
        <div className="p-2 mr-3 text-white rounded-full bg-opacity-90" style={{
          backgroundColor: category?.toLowerCase() === 'admin' ? '#6366f1' : category?.toLowerCase() === 'collaboration' ? '#10b981' : category?.toLowerCase() === 'development' ? '#f59e0b' : category?.toLowerCase() === 'support' ? '#0ea5e9' : '#6b7280'
        }}>
          {iconElement}
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{name}</h3>
      </div>
      <p className="mt-1 mb-4 text-xs text-gray-400 dark:text-gray-300 truncate">{url}</p>
      {ip && <p className="mb-2 text-xs text-gray-500 dark:text-gray-400">IP: {ip}</p>}
      <div className="flex items-center mt-auto text-sm font-medium" style={{
        color: category?.toLowerCase() === 'admin' ? '#4f46e5' : category?.toLowerCase() === 'collaboration' ? '#059669' : category?.toLowerCase() === 'development' ? '#d97706' : category?.toLowerCase() === 'support' ? '#0284c7' : '#4b5563'
      }}>
        <span className="mr-1">Open</span>
        <ExternalLinkIcon className="w-4 h-4" />
      </div>
      {/* Status indicator in bottom right */}
      <div className="absolute bottom-3 right-3 flex items-center space-x-1">
        <span className={`w-2.5 h-2.5 rounded-full ${statusColor}`} title={statusLabel}></span>
        <span className="text-xs text-gray-500 dark:text-gray-300">{statusLabel}</span>
      </div>
    </div>
  </a>;
}