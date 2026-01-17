import { createClient } from '@/utils/supabase/server'
import { AlertTriangle, TrendingUp, Activity, RefreshCw, Plus, ShoppingCart, CheckCircle2, Clock } from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import InsightsTable from '@/components/dashboard/InsightsTable'
import SalesChart from '@/components/dashboard/SalesChart'
import CategoryDistribution from '@/components/dashboard/CategoryDistribution'
import Link from 'next/link'
import { EmptyState } from '@/components/ui/EmptyState'
import { PackagePlus, FileUp } from 'lucide-react'

export default async function DashboardPage() {
    const supabase = await createClient()

    // 1. Fetch Inventory Snapshot
    const { data: insights } = await supabase.from('inventory_insights').select('*')
    const items = insights || []

    // 2. Fetch Sales Data (Last 30 Days for Velocity)
    const today = new Date()
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30)).toISOString()

    const { data: salesData } = await supabase
        .from('sales')
        .select('sale_date, quantity')
        .gte('sale_date', thirtyDaysAgo)
        .order('sale_date', { ascending: true })

    const sales = salesData || []

    // 3. CALCULATE TIER 1 METRICS
    const criticalItems = items.filter(i => i.status === 'Critical').length
    const watchItems = items.filter(i => i.status === 'Watch').length

    const totalStock = items.reduce((acc, curr) => acc + curr.stock_level, 0)
    const totalSold30d = sales.reduce((acc, curr) => acc + curr.quantity, 0)

    const totalInventoryFlow = totalStock + totalSold30d
    const sellThroughRate = totalInventoryFlow > 0
        ? ((totalSold30d / totalInventoryFlow) * 100).toFixed(1)
        : "0.0"

    const activeItems = items.filter(i => i.daily_demand > 0)
    const avgDaysHeld = activeItems.length > 0
        ? (activeItems.reduce((acc, curr) => acc + curr.days_remaining, 0) / activeItems.length).toFixed(0)
        : "∞"

    if (items.length === 0) {
        return (
            <div className="max-w-xl mx-auto pt-[10vh]">
                <EmptyState
                    icon={PackagePlus}
                    title="Initialize Inventory"
                    description="Your workspace is empty. To begin forecasting, you must ingest your product catalog or generate sample data."
                    action={
                        <div className="flex items-center gap-3">
                            <Link href="/dashboard/inventory/import" className="btn-secondary py-2 px-4 text-xs font-black uppercase tracking-widest">
                                <FileUp className="h-4 w-4" /> Import CSV
                            </Link>
                            <Link href="/dashboard/inventory" className="btn-primary py-2 px-4 text-xs font-black uppercase tracking-widest">
                                Add Product
                            </Link>
                        </div>
                    }
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-slate-200 pb-5">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">
                        Command Center
                    </h1>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">
                        Operational Intelligence & Logistics
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                        </span>
                        <span className="text-[10px] text-slate-700 font-mono font-bold uppercase tracking-wider">
                            System Live: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* KPI GRID */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Risk Analysis"
                    value={criticalItems}
                    icon={AlertTriangle}
                    color={criticalItems > 0 ? "critical" : "default"}
                    trend={criticalItems > 0
                        ? { value: "Immediate Action", direction: "down" }
                        : undefined
                    }
                    description={criticalItems > 0
                        ? "Stockout predicted < 7 days"
                        : "Inventory health optimal"
                    }
                />
                <StatCard
                    title="Sell-Through Rate"
                    value={`${sellThroughRate}%`}
                    icon={RefreshCw}
                    trend={{ value: "30-Day Window", direction: "neutral" }}
                    description="Efficiency metric"
                />
                <StatCard
                    title="Avg. Inventory Age"
                    value={avgDaysHeld}
                    icon={Activity}
                    description="Days to clear stock"
                    trend={{ value: "Global Average", direction: "neutral" }}
                />
                <StatCard
                    title="Total Volume (30d)"
                    value={totalSold30d.toLocaleString()}
                    icon={TrendingUp}
                    color="default"
                    description="Units processed"
                />
            </div>

            {/* SPLIT LAYOUT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT COLUMN: 2/3 Width */}
                <div className="lg:col-span-2 space-y-6">
                    {/* 1. Action Table */}
                    <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                        <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3 flex items-center justify-between">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600">
                                Priority Actions
                            </h2>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-wide">
                                <AlertTriangle className="h-3 w-3 text-amber-500" />
                                {items.filter(i => i.status !== 'Healthy').length} Flags
                            </span>
                        </div>
                        <InsightsTable items={items} />
                    </section>

                    {/* 2. Demand Chart */}
                    <section className="rounded-xl border border-slate-200 bg-white shadow-sm p-5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-600">
                                Demand Baseline
                            </h2>
                            <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-widest bg-slate-50 px-2 py-1 rounded border border-slate-100">
                                Last 14 days
                            </span>
                        </div>
                        <SalesChart sales={sales} />
                    </section>
                </div>

                {/* RIGHT COLUMN: 1/3 Width */}
                <div className="space-y-6">
                    {/* 1. Category Distribution */}
                    <div className="h-80">
                        <CategoryDistribution items={items} />
                    </div>

                    {/* 2. Quick Actions */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">
                            Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <Link
                                href="/dashboard/sales"
                                className="group flex items-center justify-center gap-2 w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 uppercase tracking-widest shadow-sm transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 active:scale-[0.98]"
                            >
                                <ShoppingCart className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                                Log Transaction
                            </Link>
                            <Link
                                href="/dashboard/inventory"
                                className="flex items-center justify-center gap-2 w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white uppercase tracking-widest shadow-sm shadow-indigo-200 transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-300 active:scale-[0.98]"
                            >
                                <Plus className="h-4 w-4" />
                                Add Product
                            </Link>
                        </div>
                    </div>

                    {/* 3. Status Summary */}
                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 mb-4">
                            System Health
                        </h3>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-default">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:border-emerald-200 transition-colors">
                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Optimal</span>
                                </div>
                                <span className="text-sm font-mono font-bold text-emerald-700">
                                    {items.filter(i => i.status === 'Healthy').length}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-default">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100 group-hover:border-amber-200 transition-colors">
                                        <Clock className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Watchlist</span>
                                </div>
                                <span className="text-sm font-mono font-bold text-amber-700">
                                    {watchItems}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors group cursor-default">
                                <div className="flex items-center gap-2.5">
                                    <div className="p-1.5 rounded-md bg-rose-50 text-rose-600 border border-rose-100 group-hover:border-rose-200 transition-colors">
                                        <AlertTriangle className="h-3.5 w-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">Critical</span>
                                </div>
                                <span className="text-sm font-mono font-bold text-rose-700">
                                    {criticalItems}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}