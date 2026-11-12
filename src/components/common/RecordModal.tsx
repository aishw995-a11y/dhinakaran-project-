import React, { useState, useEffect } from 'react';
import { X, Save, Calculator, AlertCircle } from 'lucide-react';
import { SalesRecord } from '../../types';
import { api } from '../../services/api';

interface RecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  recordToEdit: SalesRecord | null;
  onSuccess: () => void;
  categories: string[];
  regions: string[];
}

export const RecordModal: React.FC<RecordModalProps> = ({
  isOpen,
  onClose,
  recordToEdit,
  onSuccess,
  categories,
  regions,
}) => {
  const [orderId, setOrderId] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [productName, setProductName] = useState('');
  const [category, setCategory] = useState('Enterprise Software');
  const [quantity, setQuantity] = useState(1);
  const [unitPrice, setUnitPrice] = useState(1000);
  const [cost, setCost] = useState(400);
  const [region, setRegion] = useState('North America');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recordToEdit) {
      setOrderId(recordToEdit.order_id);
      setOrderDate(recordToEdit.order_date);
      setProductName(recordToEdit.product_name);
      setCategory(recordToEdit.category);
      setQuantity(recordToEdit.quantity);
      setUnitPrice(recordToEdit.unit_price);
      setCost(recordToEdit.cost);
      setRegion(recordToEdit.region);
    } else {
      setOrderId(`ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
      setOrderDate(new Date().toISOString().split('T')[0]);
      setProductName('');
      setCategory(categories[0] || 'Enterprise Software');
      setQuantity(1);
      setUnitPrice(1200);
      setCost(480);
      setRegion(regions[0] || 'North America');
    }
    setError(null);
  }, [recordToEdit, isOpen, categories, regions]);

  if (!isOpen) return null;

  // Auto calculations
  const calculatedRevenue = quantity * unitPrice;
  const calculatedProfit = calculatedRevenue - cost;
  const calculatedMargin =
    calculatedRevenue > 0 ? ((calculatedProfit / calculatedRevenue) * 100).toFixed(1) : '0';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId || !orderDate || !productName || quantity <= 0 || unitPrice <= 0) {
      setError('Please provide valid values for all required fields.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        order_id: orderId,
        order_date: orderDate,
        product_name: productName,
        category,
        quantity,
        unit_price: unitPrice,
        revenue: calculatedRevenue,
        cost,
        profit: calculatedProfit,
        region,
      };

      if (recordToEdit) {
        await api.updateSale(recordToEdit.id, payload);
      } else {
        await api.createSale(payload);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save sales record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <h3 className="text-base font-semibold text-white">
            {recordToEdit ? 'Edit Sales Transaction' : 'Record New Sales Order'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Order ID</label>
              <input
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Order Date</label>
              <input
                type="date"
                required
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Product Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Enterprise AI Suite"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {categories.length > 0 ? (
                  categories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="Enterprise Software">Enterprise Software</option>
                    <option value="Cloud Infrastructure">Cloud Infrastructure</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                    <option value="Hardware & Servers">Hardware &amp; Servers</option>
                    <option value="Consulting & Support">Consulting &amp; Support</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Region</label>
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {regions.length > 0 ? (
                  regions.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="North America">North America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia Pacific">Asia Pacific</option>
                    <option value="Latin America">Latin America</option>
                    <option value="Middle East">Middle East</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Quantity</label>
              <input
                type="number"
                min="1"
                required
                value={quantity}
                onChange={(e) => {
                  const q = parseInt(e.target.value) || 1;
                  setQuantity(q);
                  setCost(Math.round(q * unitPrice * 0.4));
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Unit Price ($)</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={unitPrice}
                onChange={(e) => {
                  const p = parseFloat(e.target.value) || 0;
                  setUnitPrice(p);
                  setCost(Math.round(quantity * p * 0.4));
                }}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Total Cost ($)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={cost}
                onChange={(e) => setCost(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500 font-mono tabular-nums"
              />
            </div>
          </div>

          {/* Auto-computed metrics banner */}
          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 text-slate-400 font-sans">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>Calculated:</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="text-slate-400 mr-1.5 font-sans">Revenue:</span>
                <span className="text-white font-bold">${calculatedRevenue.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 mr-1.5 font-sans">Profit:</span>
                <span className="text-emerald-400 font-bold">
                  ${calculatedProfit.toLocaleString()} ({calculatedMargin}%)
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 rounded-lg transition-all shadow-sm shadow-blue-500/20"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{loading ? 'Saving...' : recordToEdit ? 'Save Changes' : 'Create Order'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
