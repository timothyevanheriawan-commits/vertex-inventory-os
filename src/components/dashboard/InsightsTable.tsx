'use client'

import { AlertTriangle, Clock, ArrowUpRight, Info } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/app/lib/utils'
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip'
import { EmptyState } from '@/components/ui/EmptyState'
import { ShieldCheck } from 'lucide-react'

interface InsightItem {
    product_id: string
    name: string
    sku: string
    stock_level: number
    daily_demand: number
    days_remaining: number
    status: 'Healthy' | 'Watch' | 'Critical'
    reorder_point: number
}

export default function InsightsTable({ items }: { items: InsightItem[] }) {
    const problemItems = items
        .filter(i => i.status !== 'Healthy')
        .sort((a) => (a.status === 'Critical' ? -1 : 1));

    // POLISH 5: Empathetic Empty State
    if (problemItems.length === 0) {
        return (
            <EmptyState
                icon={ShieldCheck}
                title="Logistics Optimized"
                description="All high-velocity items are currently above their calculated reorder points. No immediate action required."
                className="border-none shadow-none bg-slate-50/50" // Makes it blend into the dashboard layout
                action={
                    <Link href="/dashboard/inventory" className="text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                        View Catalog →
                    </Link>
                }
            />
        )
    }

    return (
        <TooltipProvider> {/* Provider wraps the entire interactive area */}
            <div className="overflow-hidden bg-white rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50/50 border-b border-slate-200">
                        <tr>
                            <th className="px-5 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
                                Product Catalog
                            </th>
                            <th className="px-5 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] text-right">
                                <Tooltip content="30-day moving average of daily units sold.">
                                    <div className="flex items-center justify-end gap-1 cursor-help group">
                                        Burn <Info className="h-2.5 w-2.5 text-slate-500 group-hover:text-indigo-500" />
                                    </div>
                                </Tooltip>
                            </th>
                            <th className="px-5 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] text-right">
                                <Tooltip content="Current units vs. Reorder Point (ROP) trigger.">
                                    <div className="flex items-center justify-end gap-1 cursor-help group">
                                        Runway <Info className="h-2.5 w-2.5 text-slate-500 group-hover:text-indigo-500" />
                                    </div>
                                </Tooltip>
                            </th>
                            <th className="px-5 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em]">
                                Status
                            </th>
                            <th className="px-5 py-2.5 w-20"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {problemItems.map((item) => (
                            <tr key={item.product_id} className="group hover:bg-indigo-50/40 transition-all duration-150">
                                <td className="px-5 py-2 align-middle">
                                    <Link href={`/dashboard/inventory/${item.product_id}`} className="flex flex-col justify-center">
                                        <div className="flex items-center gap-1 leading-tight">
                                            <span className="font-bold text-[13px] text-slate-900 group-hover:text-indigo-600 transition-colors">
                                                {item.name}
                                            </span>
                                            <ArrowUpRight className="h-3 w-3 text-slate-300 opacity-0 group-hover:opacity-100" />
                                        </div>
                                        <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tighter leading-none mt-0.5">
                                            {item.sku}
                                        </span>
                                    </Link>
                                </td>
                                <td className="px-5 py-2 text-right align-middle font-mono font-bold text-sm text-slate-700">
                                    {item.daily_demand.toFixed(1)}
                                </td>
                                <td className="px-5 py-2 text-right align-middle">
                                    <div className={cn(
                                        "font-mono font-black text-sm leading-none",
                                        item.stock_level <= item.reorder_point ? "text-rose-600" : "text-amber-700"
                                    )}>
                                        {item.stock_level} / {item.reorder_point}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-black uppercase mt-1">
                                        {item.days_remaining}d Left
                                    </div>
                                </td>
                                <td className="px-5 py-2 align-middle">
                                    <div className={cn(
                                        "inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] font-black uppercase",
                                        item.status === 'Critical' ? "bg-rose-50 border-rose-200 text-rose-700" : "bg-amber-50 border-amber-200 text-amber-700"
                                    )}>
                                        {item.status === 'Critical' ? <AlertTriangle className="h-2.5 w-2.5" /> : <Clock className="h-2.5 w-2.5" />}
                                        {item.status}
                                    </div>
                                </td>
                                <td className="px-5 py-2 text-right align-middle">
                                    <Link href={`/dashboard/inventory/${item.product_id}`} className="opacity-0 group-hover:opacity-100 bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded shadow-sm hover:bg-indigo-700 transition-all">
                                        View
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </TooltipProvider>
    )
}