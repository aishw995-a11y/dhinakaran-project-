import React, { useState, useEffect } from 'react';
import {
  Database,
  Plus,
  Upload,
  Download,
  Search,
  Filter,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { api } from '../services/api';
import { SalesRecord } from '../types';
import { useSales } from '../contexts/SalesContext';
import { RecordModal } from '../components/common/RecordModal';

export const SalesDataPage: React.FC = () => {
  const { dataVersion, refreshData, setIsUploadModalOpen } = useSales();
  const [records, setRecords] = useState<SalesRecord[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [region, setRegion] = useState('All');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const [availableRegions, setAvailableRegions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SalesRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSalesRecords();
  }, [page, category, region, dataVersion]);

  // Debounced search trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchSalesRecords();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchSalesRecords = async () => {
    try {
      setLoading(true);
      const res = await api.getSales({
        page,
        limit: 15,
        search,
        category: category !== 'All' ? category : undefined,
        region: region !== 'All' ? region : undefined,
      });

      setRecords(res.records);
      setTotalRecords(res.pagination.totalRecords);
      setTotalPages(res.pagination.totalPages);

      if (res.filters) {
        setAvailableCategories(res.filters.categories || []);
        setAvailableRegions(res.filters.regions || []);
      }
    } catch (err) {
      console.error('Failed to fetch sales records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this sales transaction?')) {
      try {
        await api.deleteSale(id);
        refreshData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete record');
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('WARNING: This will permanently delete all records in your dataset. Continue?')) {
      try {
        await api.clearAllData();
        refreshData();
      } catch (err: any) {
        alert(err.message || 'Failed to clear data');
      }
    }
  };

  const handleDownloadSample = () => {
    const link = document.createElement('a');
    link.href = '/public/sample_sales_data.csv';
    link.download = 'sample_sales_data.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-5 bg-slate-900/60 border border-slate-800 rounded-2xl backdrop-blur-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Sales Data Management
            </h1>
            <span className="text-xs text-slate-400 font-mono">
              · {totalRecords.toLocaleString()} Records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse, search, edit, and validate all raw historical transactions stored in the SQLite database
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setEditingRecord(null);
              setIsRecordModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm shadow-blue-500/20"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Transaction</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-cyan-400 text-xs font-semibold rounded-lg transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={handleDownloadSample}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white text-xs font-medium rounded-lg transition-colors"
            title="Download formatted sample template CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sample CSV</span>
          </button>

          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800/50 text-rose-300 text-xs font-medium rounded-lg transition-colors"
            title="Purge all records"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Purge</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-slate-900/40 border border-slate-800 rounded-xl">
        {/* Search */}
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Order ID, Product, Category, or Region..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            {availableCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Region Filter */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-slate-300">
          <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <select
            value={region}
            onChange={(e) => {
              setRegion(e.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent text-white focus:outline-none cursor-pointer"
          >
            <option value="All">All Regions</option>
            {availableRegions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs whitespace-nowrap">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Qty</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-4 text-right">Revenue</th>
                <th className="py-3 px-4 text-right">Cost</th>
                <th className="py-3 px-4 text-right">Profit</th>
                <th className="py-3 px-4">Region</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono tabular-nums text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500 font-sans">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-cyan-400" />
                    <span>Loading database records...</span>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-400 font-sans">
                    <Database className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="text-sm font-medium text-white">No sales records found</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Upload a new CSV dataset or reset to the synthetic sample dataset.
                    </p>
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="mt-4 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                    >
                      Import Dataset
                    </button>
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">{r.order_id}</td>
                    <td className="py-3 px-4 text-slate-400">{r.order_date}</td>
                    <td className="py-3 px-4 font-sans font-medium text-slate-200">{r.product_name}</td>
                    <td className="py-3 px-4 font-sans text-slate-400">{r.category}</td>
                    <td className="py-3 px-4 text-right">{r.quantity}</td>
                    <td className="py-3 px-4 text-right">${r.unit_price.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-cyan-400 font-bold">
                      ${r.revenue.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-slate-400">${r.cost.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-emerald-400 font-medium">
                      ${r.profit.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-sans text-slate-300">{r.region}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditingRecord(r);
                            setIsRecordModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 rounded transition-colors"
                          title="Edit transaction"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(r.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
                          title="Delete transaction"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 bg-slate-950/70 border-t border-slate-800 text-xs">
          <div className="text-slate-400">
            Showing <span className="font-mono text-white font-medium">{records.length}</span> of{' '}
            <span className="font-mono text-white font-medium">{totalRecords.toLocaleString()}</span> records
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-300 text-xs px-2">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-1.5 text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Record Add/Edit Modal */}
      <RecordModal
        isOpen={isRecordModalOpen}
        onClose={() => {
          setIsRecordModalOpen(false);
          setEditingRecord(null);
        }}
        recordToEdit={editingRecord}
        onSuccess={() => {
          fetchSalesRecords();
          refreshData();
        }}
        categories={availableCategories}
        regions={availableRegions}
      />
    </div>
  );
};
