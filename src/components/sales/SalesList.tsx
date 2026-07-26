'use client'

import { useState, useEffect } from 'react' // Added useEffect
import { RotateCcw } from 'lucide-react'
import { voidSale } from '@/app/dashboard/sales/actions'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner';

interface SaleRecord {
    id: string
    sale_date: string
    quantity: number
    products: {
        name: string
        sku: string
    } | null
}

export default function SalesList({ sales: initialSales }: { sales: SaleRecord[] }) {
    const router = useRouter()

    // 1. Create a local state for the sales list
    const [localSales, setLocalSales] = useState(initialSales)

    // 2. Keep local state in sync if the server sends new props
    useEffect(() => {
        setLocalSales(initialSales)
    }, [initialSales])

    async function handleVoid(id: string) {
        if (!confirm("Voiding this sale will return stock to inventory. Proceed?")) return;

        const backup = [...localSales];
        setLocalSales(prev => prev.filter(sale => sale.id !== id));

        const res = await voidSale(id);

        if (res?.success) {
            router.refresh();
            // 2. Success Toast
            toast.info("Transaction Voided", {
                description: "Stock has been returned to warehouse inventory."
            });
        } else {
            setLocalSales(backup);
            toast.error("Void Failed", {
                description: res?.error
            });
        }
    }

    if (!localSales || localSales.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-slate-200 p-12 text-center bg-white">
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest font-sans">No recent transactions found</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-sm border-collapse">
                <thead className="bg-slate-50/50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">Date</th>
                        <th className="px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500">Product</th>
                        <th className="px-6 py-3 font-black text-[10px] uppercase tracking-[0.2em] text-slate-500 text-right">Qty</th>
                        <th className="px-6 py-3 w-20"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                    {localSales.map((sale) => (
                        <tr key={sale.id} className="group hover:bg-slate-50/80 transition-colors animate-in fade-in duration-300">
                            <td className="px-6 py-3 text-slate-500 font-mono text-[11px] font-bold uppercase">
                                {new Date(sale.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </td>
                            <td className="px-6 py-3">
                                <div className="font-bold text-slate-900 leading-tight">{sale.products?.name}</div>
                                <div className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-tighter mt-0.5">{sale.products?.sku}</div>
                            </td>
                            <td className="px-6 py-3 text-right">
                                <span className="font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded text-xs tabular-nums border border-indigo-100">
                                    {sale.quantity}
                                </span>
                            </td>
                            <td className="px-6 py-3 text-right">
                                <button
                                    onClick={() => handleVoid(sale.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all cursor-pointer active:scale-90"
                                    title="Void Transaction"
                                    aria-label={`Void sale of ${sale.products?.name ?? 'item'}`}
                                >
                                    <RotateCcw className="h-3.5 w-3.5" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}