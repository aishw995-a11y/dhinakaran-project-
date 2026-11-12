import React, { useState, useRef } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Download, RefreshCw } from 'lucide-react';
import { useSales } from '../../contexts/SalesContext';
import { api } from '../../services/api';
import { CleaningSummary } from '../../types';

export const UploadModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, refreshData } = useSales();
  const [file, setFile] = useState<File | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [previewRows, setPreviewRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<CleaningSummary | null>(null);
  const [replaceExisting, setReplaceExisting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isUploadModalOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      processFile(selected);
    }
  };

  const processFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.txt')) {
      setError('Please upload a valid .csv file format.');
      return;
    }

    setError(null);
    setSummary(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvContent(text);

      // Parse preview
      const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
      if (lines.length > 1) {
        const headers = lines[0].split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
        const preview = lines.slice(1, 6).map((line) => {
          const parts = line.split(',').map((p) => p.trim().replace(/^"|"$/g, ''));
          const rowObj: any = {};
          headers.forEach((h, idx) => {
            rowObj[h] = parts[idx] || '';
          });
          return rowObj;
        });
        setPreviewRows(preview);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!csvContent) {
      setError('Please select or drag a CSV file first.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.uploadSales({
        csvData: csvContent,
        replaceExisting,
      });
      setSummary(res.cleaningSummary);
      refreshData();
    } catch (err: any) {
      setError(err.message || 'Dataset processing failed. Please verify format.');
    } finally {
      setLoading(false);
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

  const resetModal = () => {
    setFile(null);
    setCsvContent('');
    setPreviewRows([]);
    setSummary(null);
    setError(null);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div>
            <h3 className="text-base font-semibold text-white">Import Sales Dataset</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload custom CSV records with automatic validation and ML preprocessing
            </p>
          </div>
          <button
            onClick={resetModal}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-3 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {summary ? (
            <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Dataset Ingested &amp; Validated Successfully!</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-lg">
                  <div className="text-slate-400 text-[10px] uppercase font-sans">Total Rows</div>
                  <div className="text-white text-base font-bold mt-1">
                    {summary.totalRowsProcessed}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-lg">
                  <div className="text-slate-400 text-[10px] uppercase font-sans">Valid Inserted</div>
                  <div className="text-emerald-400 text-base font-bold mt-1">
                    {summary.validInserted}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-lg">
                  <div className="text-slate-400 text-[10px] uppercase font-sans">Inferred Fields</div>
                  <div className="text-cyan-400 text-base font-bold mt-1">
                    {summary.inferredFields}
                  </div>
                </div>
                <div className="p-2.5 bg-slate-950/50 border border-slate-800 rounded-lg">
                  <div className="text-slate-400 text-[10px] uppercase font-sans">Hygiene Score</div>
                  <div className="text-white text-base font-bold mt-1">
                    {summary.dataHygieneScore}
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300">
                Data pipeline verified column integrity. Missing revenue/profit amounts were
                recalculated using unit price and quantity. All analytics and ML models have been
                synced.
              </p>

              <button
                onClick={resetModal}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition-colors"
              >
                Close &amp; View Updated Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Dropzone */}
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-cyan-500/60 rounded-xl p-8 text-center cursor-pointer bg-slate-950/40 hover:bg-slate-950/80 transition-all group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,.txt"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-cyan-400 group-hover:scale-105 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-medium text-white mb-1">
                  {file ? file.name : 'Click to upload or drag & drop CSV file'}
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Standard expected headers: Order_ID, Order_Date, Product_Name, Category,
                  Quantity, Unit_Price, Revenue, Cost, Profit, Region
                </p>
              </div>

              {/* Sample Template & Options */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Need a formatted template?</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white rounded-lg transition-colors whitespace-nowrap shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Sample CSV
                </button>
              </div>

              {/* Replace existing checkbox */}
              <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={replaceExisting}
                  onChange={(e) => setReplaceExisting(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-0"
                />
                <span>Replace existing records with this new dataset (recommended for full migrations)</span>
              </label>

              {/* Data Preview if file selected */}
              {previewRows.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Parsed Dataset Preview (First 5 Rows)</span>
                    <span className="font-mono">{file?.name}</span>
                  </div>
                  <div className="overflow-x-auto border border-slate-800 rounded-lg max-h-40">
                    <table className="w-full text-left text-[11px] font-mono whitespace-nowrap">
                      <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 sticky top-0">
                        <tr>
                          {Object.keys(previewRows[0]).slice(0, 7).map((key) => (
                            <th key={key} className="p-2 font-medium">
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 bg-slate-900/40 text-slate-300">
                        {previewRows.map((row, i) => (
                          <tr key={i}>
                            {Object.values(row).slice(0, 7).map((val: any, j) => (
                              <td key={j} className="p-2">
                                {String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!summary && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-950/50">
            <button
              onClick={resetModal}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUploadSubmit}
              disabled={loading || !file}
              className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-sm shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating &amp; Training...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Start Validation &amp; Ingestion</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
