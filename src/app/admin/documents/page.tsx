"use client";

import { useState } from "react";
import { FileText, Search, Plus, Trash2, Download, Filter, FileCode2, FileSpreadsheet, Lock, Users } from "lucide-react";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([
    { id: "D-9001", name: "Community Guidelines 2026", type: "PDF", size: "2.4 MB", uploadDate: "2026-01-15", access: "All Residents", apartment: "PropVista Heights" },
    { id: "D-9002", name: "AGM Minutes - Q2", type: "DOCX", size: "1.1 MB", uploadDate: "2026-06-30", access: "Owners Only", apartment: "Green Valley" },
    { id: "D-9003", name: "Gym Rules & Waiver", type: "PDF", size: "850 KB", uploadDate: "2026-07-05", access: "All Residents", apartment: "PropVista Heights" },
    { id: "D-9004", name: "Maintenance Audit Report", type: "XLSX", size: "3.2 MB", uploadDate: "2026-07-01", access: "Admin Only", apartment: "All Communities" },
  ]);
  
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [name, setName] = useState("");
  const [access, setAccess] = useState("All Residents");
  const [apartment, setApartment] = useState("All Communities");

  const filteredDocs = documents.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.apartment.toLowerCase().includes(search.toLowerCase()) ||
    d.type.toLowerCase().includes(search.toLowerCase())
  );

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc = {
      id: "D-" + Math.floor(Math.random() * 9000 + 1000),
      name,
      type: "PDF", // Mocked
      size: "1.5 MB", // Mocked
      uploadDate: new Date().toISOString().split('T')[0],
      access,
      apartment
    };
    setDocuments([newDoc, ...documents]);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Permanently delete this document?")) {
      setDocuments(documents.filter(d => d.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setAccess("All Residents");
    setApartment("All Communities");
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'PDF': return <FileText className="h-5 w-5 text-red-500" />;
      case 'DOCX': return <FileCode2 className="h-5 w-5 text-blue-500" />;
      case 'XLSX': return <FileSpreadsheet className="h-5 w-5 text-emerald-500" />;
      default: return <FileText className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Document Center</h1>
          <p className="text-sm text-slate-500 mt-1">Manage policies, forms, and official records</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" /> Upload Document
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-indigo-600">
            <FileText className="h-5 w-5" />
            <h3 className="font-bold">Total Documents</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{documents.length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-emerald-600">
            <Users className="h-5 w-5" />
            <h3 className="font-bold">Public Files</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{documents.filter(d => d.access === 'All Residents').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-orange-500">
            <Lock className="h-5 w-5" />
            <h3 className="font-bold">Restricted Files</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">{documents.filter(d => d.access !== 'All Residents').length}</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2 text-blue-500">
            <Filter className="h-5 w-5" />
            <h3 className="font-bold">Storage Used</h3>
          </div>
          <div className="text-3xl font-black text-slate-900">7.6 MB</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name, type, or community..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Document</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Community</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Access Level</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date & Size</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-100 rounded-xl flex items-center justify-center">
                      {getIconForType(doc.type)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{doc.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{doc.type}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <p className="font-semibold text-slate-700">{doc.apartment}</p>
                </td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${doc.access === 'All Residents' ? 'bg-emerald-100 text-emerald-700' : doc.access === 'Admin Only' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                    {doc.access}
                  </span>
                </td>
                <td className="p-4">
                  <p className="text-sm font-semibold text-slate-700">{doc.uploadDate}</p>
                  <p className="text-xs text-slate-500">{doc.size}</p>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Download className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(doc.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredDocs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">No documents found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-fade-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Upload New Document</h2>
            </div>
            <form onSubmit={handleUpload} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Document Name</label>
                <input 
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  placeholder="e.g. Rules 2026"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">File Attachment (Mocked)</label>
                <div className="w-full px-3 py-4 border-2 border-dashed border-slate-200 rounded-lg text-center bg-slate-50">
                  <span className="text-xs text-slate-500">Click or drag file to upload</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Community Target</label>
                  <select 
                    value={apartment} onChange={(e) => setApartment(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All Communities">All Communities</option>
                    <option value="PropVista Heights">PropVista Heights</option>
                    <option value="Green Valley">Green Valley</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Access Level</label>
                  <select 
                    value={access} onChange={(e) => setAccess(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500"
                  >
                    <option value="All Residents">All Residents</option>
                    <option value="Owners Only">Owners Only</option>
                    <option value="Tenants Only">Tenants Only</option>
                    <option value="Admin Only">Admin Only</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm">
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
