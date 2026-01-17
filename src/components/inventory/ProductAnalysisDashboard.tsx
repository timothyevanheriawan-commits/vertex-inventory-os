'use client'

import { useState } from 'react'
import SalesChart from '@/components/dashboard/SalesChart'
import DemandSimulator from '@/components/dashboard/DemandSimulator'
import UpdateStockModal from './UpdateStockModal'
import { Activity } from 'lucide-react'
import { cn } from '@/app/lib/utils'

// 1. Define strict interfaces for the data
interface Product {
    product_id: string;
    name: string;
    stock_level: number;
    daily_demand: number;
    min_stock_threshold: number;
}

interface Sale {
    sale_date: string;
    quantity: number;
}

export default function ProductAnalysisDashboard({ product, sales }: { product: Product, sales: Sale[] }) {
    const [growth, setGrowth] = useState(0)

    const burnRate = product.daily_demand
    const simulatedBurn = burnRate * (1 + growth / 100)
    const simulatedDays = simulatedBurn > 0 ? (product.stock_level / simulatedBurn).toFixed(1) : "∞"

    const leadTime = 5
    const isRunwayDangerous = Number(simulatedDays) < leadTime

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                            <Activity className="h-4 w-4 text-indigo-500" />
                            Intelligence Summary
                        </h3>
                        <UpdateStockModal
                            productId={product.product_id}
                            currentStock={product.stock_level}
                            productName={product.name}
                        />
                    </div>

                    <p className="text-slate-600 text-sm font-medium leading-relaxed mb-8">
                        At current velocity, stock is projected to last <span className="font-black text-slate-900 underline decoration-indigo-200 underline-offset-4">{simulatedDays} days</span>.
                        {isRunwayDangerous && (
                            <span className="text-rose-600 font-black ml-2 animate-pulse">
                                ⚠️ CRITICAL: BELOW LEAD TIME
                            </span>
                        )}
                    </p>

                    <div className="grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
                        <div>
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">On Hand</p>
                            <p className="text-xl font-mono font-black text-slate-900 tabular-nums">{product.stock_level}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Burn Rate</p>
                            <p className="text-xl font-mono font-black text-slate-900 tabular-nums">{simulatedBurn.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Remaining</p>
                            <p className={cn("text-xl font-mono font-black tabular-nums", isRunwayDangerous ? "text-rose-600" : "text-slate-900")}>
                                {simulatedDays}d
                            </p>
                        </div>
                    </div>
                </div>

                <SalesChart sales={sales} projectionMultiplier={1 + growth / 100} />
            </div>

            <div className="space-y-6">
                <DemandSimulator
                    currentBurnRate={burnRate}
                    currentStock={product.stock_level}
                    onSimulate={setGrowth}
                />

                <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h3 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em] mb-6">Operational Context</h3>

                    {/* FIX: Corrected <dl> structure for A11y */}
                    <dl className="space-y-4">
                        <div className="flex justify-between items-center">
                            <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Lead Time</dt>
                            <dd className="text-sm font-mono font-black text-slate-900">{leadTime} Days</dd>
                        </div>
                        <div className="flex justify-between items-center">
                            <dt className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Safety Stock</dt>
                            <dd className="text-sm font-mono font-black text-slate-900">{product.min_stock_threshold} Units</dd>
                        </div>
                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs font-bold">
                            <dt className="text-slate-400 uppercase tracking-tighter">Last Restock</dt>
                            <dd className="text-slate-400 font-mono italic">Jan 12, 2026</dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    )
}