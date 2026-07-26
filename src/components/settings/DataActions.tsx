'use client';

import { useState } from 'react';
import { Download, AlertOctagon, Loader2, CheckCircle2, FileDown, Trash2 } from 'lucide-react';

interface ExportableProduct {
    sku: string;
    name: string;
    category: string | null;
    stock_level: number;
    min_stock_threshold: number;
    status?: string;
}

// Prevents CSV/Formula Injection: if a cell value starts with =, +, -, or @,
// spreadsheet apps (Excel, Sheets) may interpret it as a formula when the
// file is opened. Prefixing with a single quote neutralizes that.
function toSafeCsvCell(value: string | number): string {
    const str = String(value ?? '');
    const escaped = str.replace(/"/g, '""');
    const neutralized = /^[=+\-@]/.test(escaped) ? `'${escaped}` : escaped;
    return `"${neutralized}"`;
}

export default function DataActions({ products }: { products: ExportableProduct[] }) {
    const [isExporting, setIsExporting] = useState(false);
    const [exportSuccess, setExportSuccess] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        setExportSuccess(false);

        await new Promise(r => setTimeout(r, 800));

        const headers = ['SKU', 'Product', 'Category', 'Stock', 'Threshold', 'Status'];
        const rows = products.map(p => [
            toSafeCsvCell(p.sku),
            toSafeCsvCell(p.name),
            toSafeCsvCell(p.category || 'Uncategorized'),
            toSafeCsvCell(p.stock_level),
            toSafeCsvCell(p.min_stock_threshold),
            toSafeCsvCell(p.status ?? ''),
        ]);

        const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        const date = new Date().toISOString().split('T')[0];
        link.href = url;
        link.setAttribute('download', `vertex_inventory_${date}.csv`);

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsExporting(false);
        setExportSuccess(true);
        setTimeout(() => setExportSuccess(false), 3000);
    };

    return (
        <div className="space-y-6">
            {/* Export Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                    onClick={handleExport}
                    disabled={isExporting || products.length === 0}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white uppercase tracking-wide shadow-sm hover:bg-indigo-700 hover:-translate-y-0.5 disabled:opacity-50 transition-all focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {isExporting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <FileDown className="h-4 w-4" />
                    )}
                    Export Inventory CSV
                </button>

                {exportSuccess && (
                    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-wide">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Download Started
                    </span>
                )}

                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                    {products.length} Records
                </span>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-5">
                <div className="flex items-center gap-2 mb-3">
                    <div className="rounded-lg bg-rose-100 p-1.5 border border-rose-200">
                        <AlertOctagon className="h-4 w-4 text-rose-600" />
                    </div>
                    <h3 className="text-[10px] font-black text-rose-800 uppercase tracking-widest">
                        Danger Zone
                    </h3>
                </div>

                <p className="text-xs text-rose-700 mb-5 leading-relaxed font-medium">
                    Resetting your account will permanently delete all product records and sales history.
                    This action cannot be undone.
                </p>

                <button
                    disabled
                    title="Not yet implemented — contact support to request account deletion"
                    className="inline-flex items-center gap-2 rounded-lg border border-rose-200 bg-white px-4 py-2 text-xs font-bold text-rose-300 uppercase tracking-wide cursor-not-allowed opacity-60 shadow-sm"
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    Reset All Data (Coming Soon)
                </button>
            </div>
        </div>
    );
}