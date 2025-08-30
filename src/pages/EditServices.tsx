import React, { useState, useEffect } from 'react';
// Helper function to get server display name
const getServerDisplayName = (category: string): string => {
  switch (category) {
    case 'IP-001': return 'DNS Server';
    case 'IP-004': return 'System Monitor';
    case 'IP-005': return 'User Management';
    case 'IP-006': return 'Network Config';
    case 'IP-007': return 'Confluence Server';
    case 'IP-008': return 'Slack Server';
    case 'IP-009': return 'Email Server';
    case 'IP-010': return 'Calendar Server';
    case 'IP-012': return 'GitLab Server';
    case 'IP-013': return 'Artifactory Server';
    case 'IP-014': return 'Jira Server';
    case 'IP-015': return 'Help Desk Server';
    case 'IP-016': return 'Knowledge Base Server';
    case 'IP-017': return 'Ticket System Server';
    case 'IP-019': return 'Remote Desktop Server';
    case 'IP-026': return 'Jenkins Server';
    case 'IP-027': return 'Gerrit Server';
    case 'IP-055': return 'Jenkins Server 2';
    case 'IP-069': return 'VPN Server';
    case 'IP-073': return 'v6 API Server';
    case 'IP-093': return 'Jira Test Server';
    case 'IP-105': return 'Turnkey API Server';
    case 'IP-130': return 'WebLogic Server (VM 130)';
    case 'IP-035': return 'WebLogic Server (VM 35)';
    case 'IP-070': return 'WebLogic Server (VM 70)';
    case 'IP-097': return 'WebLogic Server (VM 97)';
    case 'IP-098': return 'WebLogic Server (VM 98)';
    case 'IP-103': return 'WebLogic Server (VM 103)';
    case 'IP-140': return 'WebLogic Server (VM 140)';
    case 'IP-143': return 'Zimbra Email Server';
    default: return category;
  }
};
type Service = {
  name: string;
  url: string;
  category: string;
  ip: string;
  icon?: string;
  displayUrl?: string;
};
import { SparklesIcon, PencilIcon, Trash2Icon, PlusIcon, SaveIcon, EyeIcon, XIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EditServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<Service>({
    name: '',
    url: '',
    category: '',
    ip: '',
    icon: '',
    displayUrl: ''
  });
  // Get unique categories from services, mapped to display names
  const categoryOptions = Array.from(new Set(services.map(s => getServerDisplayName(s.category)).filter(Boolean)));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const navigate = useNavigate();

  // Load services from backend
  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        setServices(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load services');
        setLoading(false);
      });
  }, []);

  // Save services to backend
  const saveServices = async (updated: Service[], action: 'add' | 'edit' | 'delete' = 'edit') => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Save failed');
      setServices(updated);
      let msg = '';
      if (action === 'add') msg = 'Service added successfully!';
      else if (action === 'edit') msg = 'Service updated successfully!';
      else if (action === 'delete') msg = 'Service deleted successfully!';
      setToast({ message: msg, type: 'success' });
    } catch {
      setError('Failed to save services');
      setToast({ message: 'Failed to save services', type: 'error' });
    }
    setSaving(false);
  };

  const handleAdd = () => {
    setEditIndex(null);
    setNewService({
      name: '',
      url: '',
      category: '',
      ip: '',
      icon: '',
      displayUrl: ''
    });
    setShowModal(true);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setNewService({ ...services[index] });
    setShowModal(true);
  };

  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newService.name && newService.url && newService.category && newService.ip) {
      let updated: Service[];
      if (editIndex !== null) {
        updated = services.map((s, i) => (i === editIndex ? { ...newService } : s));
        saveServices(updated, 'edit');
      } else {
        updated = [...services, { ...newService }];
        saveServices(updated, 'add');
      }
      setNewService({
        name: '',
        url: '',
        category: '',
        ip: '',
        icon: '',
        displayUrl: ''
      });
      setShowModal(false);
      setEditIndex(null);
    }
  };

  const handleDelete = (index: number) => {
    const updated = services.filter((_, i) => i !== index);
    saveServices(updated, 'delete');
  };
  // Toast auto-hide effect
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleUpdate = (index: number, updatedService: Service) => {
    const updated = services.map((service, i) => (i === index ? updatedService : service));
    saveServices(updated);
  };

  if (loading) return <div className="flex items-center justify-center h-96 text-lg text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-green-50 p-0 flex flex-col items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center">
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg font-semibold text-lg transition-all
            ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
          >
            {toast.message}
          </div>
        )}
        {/* Fixed Header with Search Bar */}
        <div className="fixed top-0 left-0 w-full z-40 bg-green-100 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-6" style={{ maxWidth: '100vw' }}>
          <div>
            <h1 className="text-4xl font-bold text-green-700 mb-2">Service Management</h1>
            <p className="text-green-900 text-lg">View, add, edit, and manage all services.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            <input className="w-full md:w-96 px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400" type="text" placeholder="Search by name, url, category, or IP..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-600" onClick={() => setSearch('')}>Reset Filters</button>
            <button className="bg-gradient-to-r from-green-500 to-purple-400 text-white px-6 py-3 rounded-full shadow flex items-center gap-2 text-lg font-semibold hover:scale-105 transition-transform" onClick={handleAdd} disabled={saving}>
              <PlusIcon className="w-5 h-5" /> Add New Service
            </button>
          </div>
        </div>

        {/* Spacer for fixed header */}
        <div style={{ height: '120px' }}></div>

        {/* Modal for Add Service */}
        {showModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative animate-fade-in-up"
              onClick={e => e.stopPropagation()}
            >
              <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500" onClick={() => setShowModal(false)}>
                <XIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-green-700 mb-6 flex items-center gap-2">
                {editIndex !== null ? (
                  <>
                    <PencilIcon className="w-5 h-5 text-yellow-500" /> Edit Service
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-5 h-5 text-green-500" /> Add New Service
                  </>
                )}
              </h2>
              <form onSubmit={handleModalSubmit} className="grid grid-cols-1 gap-4">
                <div>
                  <input className="rounded-lg border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm px-4 py-2 transition-all w-full" type="text" placeholder="Name" value={newService.name} onChange={e => setNewService({ ...newService, name: e.target.value })} disabled={saving} required />
                  <div className="text-xs text-green-700 mt-1">e.g. <span className="font-mono">Heritage FMS</span></div>
                </div>
                <div>
                  <input className="rounded-lg border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm px-4 py-2 transition-all w-full" type="text" placeholder="URL" value={newService.url} onChange={e => setNewService({ ...newService, url: e.target.value })} disabled={saving} required />
                  <div className="text-xs text-green-700 mt-1">e.g. <span className="font-mono">http://10.176.18.35:7008/FMS</span></div>
                </div>
                <div>
                  <select
                    className="rounded-lg border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm px-4 py-2 transition-all w-full bg-white"
                    value={getServerDisplayName(newService.category)}
                    onChange={e => {
                      // Find the code for the selected display name
                      const selectedCode = services.find(s => getServerDisplayName(s.category) === e.target.value)?.category || e.target.value;
                      setNewService({ ...newService, category: selectedCode });
                    }}
                    disabled={saving}
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {categoryOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                  <div className="text-xs text-green-700 mt-1">e.g. <span className="font-mono">WebLogic Server (VM 35)</span></div>
                </div>
                <div>
                  <input className="rounded-lg border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm px-4 py-2 transition-all w-full" type="text" placeholder="IP" value={newService.ip} onChange={e => setNewService({ ...newService, ip: e.target.value })} disabled={saving} required />
                  <div className="text-xs text-green-700 mt-1">e.g. <span className="font-mono">10.176.18.35</span></div>
                </div>
                <div>
                  <input className="rounded-lg border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm px-4 py-2 transition-all w-full" type="text" placeholder="Icon URL" value={newService.icon} onChange={e => setNewService({ ...newService, icon: e.target.value })} disabled={saving} />
                  <div className="text-xs text-green-700 mt-1">e.g. <span className="font-mono">https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/jira.svg</span></div>
                </div>
                <div>
                  <input className="rounded-lg border-2 border-green-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 shadow-sm px-4 py-2 transition-all w-full" type="text" placeholder="Display URL" value={newService.displayUrl} onChange={e => setNewService({ ...newService, displayUrl: e.target.value })} disabled={saving} />
                  <div className="text-xs text-green-700 mt-1">e.g. <span className="font-mono">heritagefms7008-dot35.turnkey.local</span></div>
                </div>
                <button type="submit" className="mt-4 flex items-center gap-2 justify-center px-6 py-3 rounded-full shadow font-semibold text-white text-lg bg-gradient-to-r from-green-500 to-purple-400 hover:scale-105 transition-transform" disabled={saving}>
                  {editIndex !== null ? (
                    <>
                      <PencilIcon className="w-4 h-4" /> Save Changes
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-4 h-4" /> Add Service
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
  {/* Search/Filter Bar removed, now in header */}
        {/* Table */}
  <div className="bg-white rounded-2xl shadow overflow-x-auto w-full" style={{ maxWidth: '100vw' }}>
          <table className="min-w-full text-left table-fixed">
            <colgroup>
              <col style={{ width: '220px' }} />
              <col style={{ width: '400px' }} />
              <col style={{ width: '160px' }} />
              <col style={{ width: '180px' }} />
              <col style={{ width: '220px' }} />
              <col style={{ width: '260px' }} />
              <col style={{ width: '180px' }} />
            </colgroup>
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-3 text-green-700 font-bold whitespace-nowrap">Name</th>
                <th className="px-4 py-3 text-green-700 font-bold whitespace-nowrap">URL</th>
                <th className="px-4 py-3 text-green-700 font-bold whitespace-nowrap">Category</th>
                <th className="px-4 py-3 text-green-700 font-bold whitespace-nowrap">IP</th>
                <th className="px-4 py-3 text-green-700 font-bold whitespace-nowrap">Icon</th>
                <th className="px-4 py-3 text-green-700 font-bold whitespace-nowrap">Display URL</th>
                <th className="px-4 py-3 text-green-700 font-bold whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services
                .map((service, originalIdx) => ({ service, originalIdx }))
                .filter(({ service }) => {
                  const q = search.toLowerCase();
                  return (
                    service.name?.toLowerCase().includes(q) ||
                    service.url?.toLowerCase().includes(q) ||
                    service.category?.toLowerCase().includes(q) ||
                    service.ip?.toLowerCase().includes(q)
                  );
                })
                .map(({ service, originalIdx }) => (
                  <tr key={originalIdx} className="border-b last:border-none hover:bg-green-50">
                  <td className="px-4 py-3 font-semibold whitespace-nowrap">
                    <input className="w-full bg-green-50 rounded px-2 py-1 border border-green-200" type="text" value={service.name || ''} onChange={e => handleUpdate(originalIdx, { ...service, name: e.target.value })} disabled={saving} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input className="w-full bg-green-50 rounded px-2 py-1 border border-green-200" type="text" value={service.url || ''} onChange={e => handleUpdate(originalIdx, { ...service, url: e.target.value })} disabled={saving} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <select
                      className="w-full bg-green-50 rounded px-2 py-1 border border-green-200"
                      value={getServerDisplayName(service.category) || ''}
                      onChange={e => {
                        // Find the code for the selected display name
                        const selectedCode = services.find(s => getServerDisplayName(s.category) === e.target.value)?.category || e.target.value;
                        handleUpdate(originalIdx, { ...service, category: selectedCode });
                      }}
                      disabled={saving}
                    >
                      <option value="" disabled>Select category</option>
                      {categoryOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input className="w-full bg-green-50 rounded px-2 py-1 border border-green-200" type="text" value={service.ip || ''} onChange={e => handleUpdate(originalIdx, { ...service, ip: e.target.value })} disabled={saving} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {service.icon ? (
                        <img src={service.icon} alt="icon" className="w-10 h-10 rounded-full border" />
                      ) : (
                        <span className="w-10 h-10 rounded-full bg-green-200 text-green-700 flex items-center justify-center">IMG</span>
                      )}
                      <input className="flex-1 bg-green-50 rounded px-2 py-1 border border-green-200" type="text" value={service.icon || ''} onChange={e => handleUpdate(originalIdx, { ...service, icon: e.target.value })} disabled={saving} placeholder="Icon URL" />
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <input className="w-full bg-green-50 rounded px-2 py-1 border border-green-200" type="text" value={service.displayUrl || ''} onChange={e => handleUpdate(originalIdx, { ...service, displayUrl: e.target.value })} disabled={saving} />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded p-2" title="Edit" onClick={() => handleEdit(originalIdx)}><PencilIcon className="w-4 h-4" /></button>
                      <button className="bg-red-100 hover:bg-red-200 text-red-700 rounded p-2" onClick={() => handleDelete(originalIdx)} disabled={saving} title="Delete"><Trash2Icon className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {saving && <div className="p-4 text-green-600 flex items-center gap-2"><SaveIcon className="w-4 h-4 animate-spin" /> Saving...</div>}
        </div>
      </div>
    </div>
  );
};

export default EditServices;
