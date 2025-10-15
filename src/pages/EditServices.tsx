import React, { useState, useEffect } from 'react';
type Service = {
  name: string;
  url: string;
  category: string;
  ip: string;
  icon?: string;
  displayUrl?: string;
};

type Category = {
  id: string;
  name: string;
};
import { PencilIcon, Trash2Icon, PlusIcon, SaveIcon, XIcon, SearchIcon } from 'lucide-react';

const EditServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [newService, setNewService] = useState<Service>({
    name: '',
    url: '',
    category: '',
    ip: '',
    icon: '',
    displayUrl: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState<Category>({ id: '', name: '' });
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; category: Category | null }>({ show: false, category: null });

  // Load services and categories from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        const [servicesRes, categoriesRes] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/categories')
        ]);
        
        const servicesData = await servicesRes.json();
        const categoriesData = await categoriesRes.json();
        
        setServices(servicesData);
        setCategories(categoriesData);
        setLoading(false);
      } catch (err) {
        setToast({ message: 'Failed to load data', type: 'error' });
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Save services to backend
  const saveServices = async (updated: Service[], action: 'add' | 'edit' | 'delete' = 'edit') => {
    setSaving(true);
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

  // Category management functions

  const saveCategories = async (updated: Category[], action: 'add' | 'edit' | 'delete' = 'edit') => {
    setSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error('Save failed');
      setCategories(updated);
      let msg = '';
      if (action === 'add') msg = 'Category added successfully!';
      else if (action === 'edit') msg = 'Category updated successfully!';
      else if (action === 'delete') msg = 'Category deleted successfully!';
      setToast({ message: msg, type: 'success' });
    } catch {
      setToast({ message: 'Failed to save categories', type: 'error' });
    }
    setSaving(false);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setNewCategory({ id: '', name: '' });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setNewCategory({ ...category });
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newCategory.id && newCategory.name) {
      let updated: Category[];
      if (editingCategory) {
        updated = categories.map(cat => (cat.id === editingCategory.id ? newCategory : cat));
        saveCategories(updated, 'edit');
      } else {
        updated = [...categories, newCategory];
        saveCategories(updated, 'add');
      }
      setNewCategory({ id: '', name: '' });
      setShowCategoryModal(false);
      setEditingCategory(null);
    }
  };

  const handleDeleteCategory = (category: Category) => {
    setDeleteConfirm({ show: true, category });
  };

  const confirmDeleteCategory = async () => {
    if (!deleteConfirm.category) return;
    
    try {
      const res = await fetch(`/api/categories/${deleteConfirm.category.id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const errorMsg = await res.text();
        setToast({ message: errorMsg, type: 'error' });
        return;
      }
      
      const result = await res.json();
      const updated = categories.filter(cat => cat.id !== deleteConfirm.category!.id);
      saveCategories(updated, 'delete');
      
      // Show success message with details about moved services
      if (result.movedServices > 0) {
        setToast({ 
          message: `Category deleted successfully. ${result.movedServices} service(s) moved to default category.`, 
          type: 'success' 
        });
        // Refresh services to show updated categories
        const servicesResponse = await fetch('/api/services');
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
      } else {
        setToast({ message: 'Category deleted successfully', type: 'success' });
      }
    } catch {
      setToast({ message: 'Failed to delete category', type: 'error' });
    } finally {
      setDeleteConfirm({ show: false, category: null });
    }
  };

  const cancelDeleteCategory = () => {
    setDeleteConfirm({ show: false, category: null });
  };

  const getServiceCountForCategory = (categoryId: string): number => {
    return services.filter(service => service.category === categoryId).length;
  };

  // Filter services based on search
  const filteredServices = services.filter(service => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      service.name.toLowerCase().includes(searchLower) ||
      service.url.toLowerCase().includes(searchLower) ||
      service.category.toLowerCase().includes(searchLower) ||
      service.ip.toLowerCase().includes(searchLower) ||
      (service.displayUrl && service.displayUrl.toLowerCase().includes(searchLower))
    );
  });

  const handleFixUndefinedCategories = async () => {
    try {
      const res = await fetch('/api/fix-undefined-categories', {
        method: 'POST',
      });
      
      if (!res.ok) {
        const errorMsg = await res.text();
        setToast({ message: errorMsg, type: 'error' });
        return;
      }
      
      const result = await res.json();
      if (result.fixedServices > 0) {
        setToast({ 
          message: `Fixed ${result.fixedServices} service(s) with undefined categories`, 
          type: 'success' 
        });
        // Refresh both services and categories
        const servicesResponse = await fetch('/api/services');
        const servicesData = await servicesResponse.json();
        setServices(servicesData);
        
        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
      } else {
        setToast({ message: 'No services with undefined categories found', type: 'info' });
      }
    } catch {
      setToast({ message: 'Failed to fix undefined categories', type: 'error' });
    }
  };

  if (loading) return <div className="flex items-center justify-center h-96 text-lg text-gray-500">Loading...</div>;

  return (
    <div className="min-h-screen bg-green-50">
      <div className="w-full bg-green-50">
        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-8 left-1/2 transform -translate-x-1/2 z-[9999] px-6 py-3 rounded-xl shadow-lg font-semibold text-lg transition-all
            ${toast.type === 'success' ? 'bg-green-500 text-white' : 
              toast.type === 'info' ? 'bg-blue-500 text-white' : 
              'bg-red-500 text-white'}`}
          >
            {toast.message}
          </div>
        )}
        {/* Fixed Header with Search Bar */}
        <div className="fixed top-0 left-0 w-full z-40 bg-green-100 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-4" style={{ maxWidth: '100vw' }}>
          <div>
            <h1 className="text-4xl font-bold text-green-700 mb-2">Service Management</h1>
            <p className="text-green-900 text-lg">View, add, edit, and manage all services.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
            <input className="w-full md:w-96 px-4 py-2 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400" type="text" placeholder="Search by name, url, category, or IP..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-600" onClick={() => setSearch('')}>Reset Filters</button>
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-orange-600" onClick={handleFixUndefinedCategories} disabled={saving}>
              Fix Undefined Categories
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-blue-600" onClick={handleAddCategory} disabled={saving}>
              Manage Categories
            </button>
            <button className="bg-gradient-to-r from-green-500 to-purple-400 text-white px-6 py-3 rounded-full shadow flex items-center gap-2 text-lg font-semibold hover:scale-105 transition-transform" onClick={handleAdd} disabled={saving}>
              <PlusIcon className="w-5 h-5" /> Add New Service
            </button>
          </div>
        </div>

        {/* Content area with proper spacing */}
        <div className="pt-44 px-4 w-full max-w-7xl mx-auto min-h-screen">

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
                    value={newService.category}
                    onChange={e => setNewService({ ...newService, category: e.target.value })}
                    disabled={saving}
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
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

        {/* Category Management Modal */}
        {showCategoryModal && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            onClick={() => setShowCategoryModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-4xl max-h-[80vh] overflow-y-auto relative animate-fade-in-up"
              onClick={e => e.stopPropagation()}
            >
              <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500" onClick={() => setShowCategoryModal(false)}>
                <XIcon className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-blue-700 mb-6 flex items-center gap-2">
                <PencilIcon className="w-5 h-5 text-blue-500" /> Manage Categories
              </h2>
              
              {/* Add/Edit Category Form */}
              <form onSubmit={handleCategorySubmit} className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-blue-700 mb-4">
                  {editingCategory ? 'Edit Category' : 'Add New Category'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input 
                      className="rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm px-4 py-2 transition-all w-full" 
                      type="text" 
                      placeholder="Category ID (e.g., web-server)" 
                      value={newCategory.id} 
                      onChange={e => setNewCategory({ ...newCategory, id: e.target.value })} 
                      disabled={saving || !!editingCategory} 
                      required 
                    />
                    <div className="text-xs text-blue-700 mt-1">Unique identifier (lowercase, no spaces)</div>
                  </div>
                  <div>
                    <input 
                      className="rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm px-4 py-2 transition-all w-full" 
                      type="text" 
                      placeholder="Category Name (e.g., Web Server)" 
                      value={newCategory.name} 
                      onChange={e => setNewCategory({ ...newCategory, name: e.target.value })} 
                      disabled={saving} 
                      required 
                    />
                    <div className="text-xs text-blue-700 mt-1">Display name for the category</div>
                  </div>
                </div>
                <button 
                  type="submit" 
                  className="mt-4 flex items-center gap-2 justify-center px-6 py-3 rounded-full shadow font-semibold text-white text-lg bg-gradient-to-r from-blue-500 to-purple-400 hover:scale-105 transition-transform" 
                  disabled={saving}
                >
                  {editingCategory ? (
                    <>
                      <PencilIcon className="w-4 h-4" /> Update Category
                    </>
                  ) : (
                    <>
                      <PlusIcon className="w-4 h-4" /> Add Category
                    </>
                  )}
                </button>
              </form>

              {/* Categories List */}
              <div className="bg-white rounded-lg border">
                <div className="bg-blue-100 px-4 py-3 rounded-t-lg">
                  <h3 className="text-lg font-semibold text-blue-700">Existing Categories</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center justify-between p-4 border-b last:border-none hover:bg-blue-50">
                      <div className="flex-1">
                        <div className="font-semibold text-gray-800">{category.name}</div>
                        <div className="text-sm text-gray-500">ID: {category.id}</div>
                        <div className="text-xs text-blue-600">
                          {getServiceCountForCategory(category.id)} service(s) using this category
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded p-2" 
                          title="Edit" 
                          onClick={() => handleEditCategory(category)}
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button 
                          className="bg-red-100 hover:bg-red-200 text-red-700 rounded p-2" 
                          onClick={() => handleDeleteCategory(category)} 
                          disabled={saving} 
                          title="Delete"
                        >
                          <Trash2Icon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search Results Info */}
        {search && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-blue-700 font-medium">
              Showing {filteredServices.length} result(s) for "{search}"
              <button 
                onClick={() => setSearch('')} 
                className="ml-2 text-blue-500 hover:text-blue-700 underline"
              >
                Clear search
              </button>
            </p>
          </div>
        )}

        {/* Table or No Results */}
        {filteredServices.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <SearchIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No services found</h3>
            <p className="text-gray-500 mb-4">
              {search ? `No services match your search for "${search}"` : 'No services available'}
            </p>
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow overflow-x-auto w-full mt-4">
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
            <thead className="bg-green-100 sticky top-0 z-10 shadow-sm border-b-2 border-green-200">
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
              {filteredServices
                .map((service, originalIdx) => ({ service, originalIdx }))
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
                      value={service.category || ''}
                      onChange={e => handleUpdate(originalIdx, { ...service, category: e.target.value })}
                      disabled={saving}
                    >
                      <option value="" disabled>Select category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
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
        )}
        </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.show && deleteConfirm.category && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md mx-4 animate-fade-in-up">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <Trash2Icon className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Delete Category</h3>
                <p className="text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-2">
                Are you sure you want to delete the category <strong>"{deleteConfirm.category.name}"</strong>?
              </p>
              <p className="text-sm text-gray-500">
                {getServiceCountForCategory(deleteConfirm.category.id) > 0 
                  ? `${getServiceCountForCategory(deleteConfirm.category.id)} service(s) will be moved to the "Uncategorized" category.`
                  : 'No services are using this category.'
                }
              </p>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDeleteCategory}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteCategory}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                disabled={saving}
              >
                {saving ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default EditServices;
