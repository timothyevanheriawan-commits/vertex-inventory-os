import { createClient } from '@/utils/supabase/server'
import RecordSaleModal from '@/components/sales/RecordSaleModal'
import SalesList from '@/components/sales/SalesList'
import { TrendingUp, BarChart3, TrendingDown, Minus, ShoppingCart, ChevronRight } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import Link from 'next/link'

interface SaleItem {
    id: string
    quantity: number
    sale_date: string
    products: {
        name: string
        sku: string
        category: string | null
    } | null
}

export default async function SalesPage() {
    const supabase = await createClient()

    // 1. Fetch Sales
    const { data: sales } = await supabase
        .from('sales')
        .select('id, quantity, sale_date, products (name, sku, category)')
        .order('sale_date', { ascending: false })
        .limit(100) as unknown as { data: SaleItem[] }

    // 2. Fetch Products
    const { data: products } = await supabase
        .from('products')
        .select('id, name, sku, stock_level')
        .order('name')

    // ---------------------------------------------------------
    // 3. DYNAMIC INSIGHT LOGIC
    // ---------------------------------------------------------
    const salesData = sales || []

    const totalVolume = salesData.reduce((acc, curr) => acc + curr.quantity, 0)
    const uniqueDates = new Set(salesData.map(s => s.sale_date))
    const daysCount = uniqueDates.size || 1
    const avgDailyVolume = (totalVolume / daysCount).toFixed(1)

    let insightText = "Analyzing patterns..."
    let trendDirection: 'up' | 'down' | 'neutral' = 'neutral'
    let percentageLabel = "0%"
    let mostAffectedCategory = "General"

    if (salesData.length >= 10) {
        const midpoint = Math.floor(salesData.length / 2)
        const recentSales = salesData.slice(0, midpoint)
        const olderSales = salesData.slice(midpoint)

        const recentVol = recentSales.reduce((a, b) => a + b.quantity, 0)
        const olderVol = olderSales.reduce((a, b) => a + b.quantity, 0)

        const diff = recentVol - olderVol
        const percentChange = olderVol > 0 ? ((diff / olderVol) * 100).toFixed(0) : "0"
        percentageLabel = `${Math.abs(Number(percentChange))}%`

        // 2. Inside the component, update the category logic:
        const catStats = salesData.slice(0, Math.floor(salesData.length / 2)).reduce((acc, curr) => {
            // We now have a guaranteed object structure
            const cat = curr.products?.category || 'Uncategorized'
            acc[cat] = (acc[cat] || 0) + curr.quantity
            return acc;
        }, {} as Record<string, number>);

        <SalesList sales={salesData as unknown as SaleItem[]} />

        mostAffectedCategory = Object.entries(catStats)
            .sort((a, b) => b[1] - a[1])[0]?.[0] || "General items"

        if (Number(percentChange) > 5) {
            trendDirection = 'up'
            insightText = `Volume increased by ${percentageLabel}, driven by ${mostAffectedCategory}.`
        } else if (Number(percentChange) < -5) {
            trendDirection = 'down'
            insightText = `Volume dropped ${percentageLabel}. ${mostAffectedCategory} seeing lowest velocity.`
        } else {
            trendDirection = 'neutral'
            insightText = `Velocity stable. Volume matches historical baseline.`
        }
    } else {
        insightText = "Insufficient data for trend analysis."
    }

    const trendConfig = {
        up: { icon: TrendingUp, color: "text-emerald-700 bg-emerald-50 border-emerald-100", label: "SURGE" },
        down: { icon: TrendingDown, color: "text-rose-700 bg-rose-50 border-rose-100", label: "COOLING" },
        neutral: { icon: Minus, color: "text-slate-600 bg-slate-50 border-slate-200", label: "STABLE" }
    }[trendDirection];

    return (
        <div className="space-y-6">
            {/* BREADCRUMB + HEADER */}
            <div className="space-y-3">
                <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                    <Link href="/dashboard" className="text-slate-400 hover:text-indigo-600 transition-colors">
                        Dashboard
                    </Link>
                    <ChevronRight className="h-3 w-3 text-slate-300" />
                    <span className="text-slate-600">Sales & Demand</span>
                </nav>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50">
                            <TrendingUp className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                Sales Intelligence
                            </h1>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                {salesData.length} Transactions
                            </p>
                        </div>
                    </div>
                    <RecordSaleModal products={products || []} />
                </div>
            </div>

            {/* QUICK STATUS BAR (Identical Styling to Inventory) */}
            <div className="grid grid-cols-3 gap-3">
                {/* Total Volume Card */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="p-2 rounded-lg bg-indigo-50">
                        <BarChart3 className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Total Volume</p>
                        <p className="text-lg font-mono font-bold text-slate-900 tabular-nums">{totalVolume}</p>
                    </div>
                </div>

                {/* Daily Velocity Card */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="p-2 rounded-lg bg-indigo-50">
                        <ShoppingCart className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Daily Velocity</p>
                        <p className="text-lg font-mono font-bold text-slate-900 tabular-nums">{avgDailyVolume}</p>
                    </div>
                </div>

                {/* Dynamic Analysis Card */}
                <div className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl border shadow-sm transition-colors",
                    trendConfig.color.split(' ')[1] === 'bg-emerald-50' ? "bg-emerald-50 border-emerald-200" :
                        trendConfig.color.split(' ')[1] === 'bg-rose-50' ? "bg-rose-50 border-rose-200" :
                            "bg-white border-slate-200"
                )}>
                    <div className={cn(
                        "p-2 rounded-lg",
                        trendDirection === 'up' ? "bg-emerald-100/50" : trendDirection === 'down' ? "bg-rose-100/50" : "bg-slate-100"
                    )}>
                        <trendConfig.icon className={cn(
                            "h-4 w-4",
                            trendDirection === 'up' ? "text-emerald-600" : trendDirection === 'down' ? "text-rose-600" : "text-slate-600"
                        )} />
                    </div>
                    <div>
                        <p className={cn(
                            "text-[9px] font-bold uppercase tracking-widest",
                            trendDirection === 'up' ? "text-emerald-700/60" : trendDirection === 'down' ? "text-rose-700/60" : "text-slate-400"
                        )}>
                            {trendConfig.label} {trendDirection !== 'neutral' && percentageLabel}
                        </p>
                        <p className={cn(
                            "text-xs font-bold leading-tight truncate max-w-45",
                            trendDirection === 'up' ? "text-emerald-700" : trendDirection === 'down' ? "text-rose-700" : "text-slate-900"
                        )}>
                            {insightText.split(',')[0]} {/* Shortened text to fit the small KPI height */}
                        </p>
                    </div>
                </div>
            </div>
        

            {/* Transactions Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-500">Transaction Log</h2>
                    <span className="text-[10px] font-mono font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded">LAST 100</span>
                </div>
                <SalesList sales={salesData} />
            </div>
        </div>
    )
}