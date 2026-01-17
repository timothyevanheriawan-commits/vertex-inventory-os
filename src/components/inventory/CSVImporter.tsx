'use client'

import { useState, useRef } from 'react'
import Papa from 'papaparse'
import { Upload, CheckCircle2, AlertTriangle, FileText, Loader2, Database } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import { bulkAddProducts } from '@/app/dashboard/inventory/actions'

interface RawCSVRow {
    sku?: string;
    name?: string;
    category?: string;
    stock_level?: string;
    min_stock_threshold?: string;
    unit_cost?: string;
    unit_price?: string;
}


interface ParsedRow {
    sku: string;
    name: string;
    category: string;
    stock_level: number;
    min_stock_threshold: number;
    unit_cost: number;
    unit_price: number;
    errors: string[];
}

export default function CSVImporter() {
    const [data, setData] = useState<ParsedRow[]>([])
    const [isPending, setIsPending] = useState(false)
    const [step, setStep] = useState<'upload' | 'review'>('upload')
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        Papa.parse<RawCSVRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                const parsed: ParsedRow[] = results.data.map((row) => {
                    const errors: string[] = []

                    if (!row.sku) errors.push("Missing SKU")
                    if (!row.name) errors.push("Missing Name")
                    if (isNaN(Number(row.unit_cost)) || Number(row.unit_cost) < 0)
                        errors.push("Invalid Cost")

                    return {
                        sku: row.sku ?? '',
                        name: row.name ?? '',
                        category: row.category ?? 'General',
                        stock_level: Number(row.stock_level) || 0,
                        min_stock_threshold: Number(row.min_stock_threshold) || 5,
                        unit_cost: Number(row.unit_cost) || 0,
                        unit_price: Number(row.unit_price) || 0,
                        errors
                    }
                })

                setData(parsed)
                setStep('review')
            }
        })

    }

    const handleConfirm = async () => {
        const validData = data.filter(r => r.errors.length === 0)
        if (validData.length === 0) return alert("No valid rows to import")

        setIsPending(true)
        // Remove the 'errors' helper field before sending to DB
        const cleanData = validData.map(({ errors, ...rest }) => rest)
        const res = await bulkAddProducts(cleanData)
        setIsPending(false)

        if (res.success) {
            alert(`Successfully imported ${res.count} products`)
            setData([])
            setStep('upload')
        } else {
            alert(res.error)
        }
    }

    return (
        <div className="w-full">
            {step === 'upload' ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group relative cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-white p-12 text-center transition-all hover:border-indigo-400 hover:bg-indigo-50/30"
                >
                    <input title="-" type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".csv" className="hidden" />
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Bulk Import Products</h3>
                    <p className="mt-1 text-xs text-slate-500">Click to upload or drag and drop your .CSV file</p>
                    <div className="mt-6 flex justify-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        <span>Required: SKU, Name, Cost</span>
                    </div>
                </div>
            ) : (
                <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                    <div className="flex items-center justify-between bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 uppercase">Review Import Data</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {data.length} Rows Detected • {data.filter(r => r.errors.length > 0).length} Errors
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setStep('upload')}
                                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isPending || data.filter(r => r.errors.length === 0).length === 0}
                                className="flex items-center gap-2 px-6 py-2 text-xs font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Database className="h-3 w-3" />}
                                Confirm {data.filter(r => r.errors.length === 0).length} Rows
                            </button>
                        </div>
                    </div>

                    {/* VALIDATION TABLE */}
                    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden overflow-x-auto">
                        <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Status</th>
                                    <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">SKU</th>
                                    <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Name</th>
                                    <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px] text-right">Cost</th>
                                    <th className="px-4 py-2 font-black uppercase tracking-widest text-[9px]">Issues</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.map((row, idx) => (
                                    <tr key={idx} className={cn("hover:bg-slate-50", row.errors.length > 0 && "bg-rose-50/30")}>
                                        <td className="px-4 py-2">
                                            {row.errors.length > 0 ? (
                                                <AlertTriangle className="h-4 w-4 text-rose-500" />
                                            ) : (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                            )}
                                        </td>
                                        <td className="px-4 py-2 font-mono font-bold text-slate-900">{row.sku}</td>
                                        <td className="px-4 py-2 font-bold text-slate-700">{row.name}</td>
                                        <td className="px-4 py-2 text-right font-mono font-bold">${row.unit_cost.toFixed(2)}</td>
                                        <td className="px-4 py-2">
                                            {row.errors.length > 0 ? (
                                                <span className="text-[9px] font-black text-rose-600 uppercase tracking-tighter">
                                                    {row.errors.join(", ")}
                                                </span>
                                            ) : (
                                                <span className="text-[9px] font-bold text-emerald-600 uppercase">Ready</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}