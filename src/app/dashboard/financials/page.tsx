import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getVerifiedUser } from '@/utils/supabase/verified-user'
import {
    DollarSign,
    PieChart,
    TrendingUp,
    AlertCircle,
    Wallet,
    Activity,
    ChevronRight,
    Info
} from 'lucide-react'
import StatCard from '@/components/dashboard/StatCard'
import { cn } from '@/app/lib/utils'
import Link from 'next/link'
import { Tooltip, TooltipProvider } from '@/components/ui/Tooltip'

export default async function FinancialsPage() {
    const supabase = await createClient()

    const user = await getVerifiedUser()
    if (!user) redirect('/login')

    const { data: items } = await supabase
        .from('inventory_insights')
        .select('*')
        .eq('user_id', user.id)
        .order('inventory_value', { ascending: false })

    const financials = items || []

    // Calculations
    const totalInventoryValue = financials.reduce((acc, curr) => acc + (curr.inventory_value || 0), 0)
    const totalPotentialProfit = financials.reduce((acc, curr) => acc + (curr.potential_profit || 0), 0)

    const capitalAtRisk = financials
        .filter(i => i.status !== 'Healthy')
        .reduce((acc, curr) => acc + (curr.inventory_value || 0), 0)

    const totalRevenuePotential = totalInventoryValue + totalPotentialProfit
    const avgMargin = totalRevenuePotential > 0
        ? ((totalPotentialProfit / totalRevenuePotential) * 100).toFixed(1)
        : "0"

    return (
        <TooltipProvider> {/* FIX 1: Wrap the whole page container, not just inside the thead */}
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col gap-2 border-b border-slate-200 pb-4">
                    {/* BREADCRUMB + HEADER */}
                    <div className="space-y-3">
                        <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                            <Link href="/dashboard" className="text-slate-500 hover:text-indigo-600 transition-colors">Dashboard</Link>
                            <ChevronRight className="h-3 w-3 text-slate-300" />
                            <span className="text-slate-600">Financials</span>
                        </nav>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 shadow-sm">
                                    <DollarSign className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                        Capital Allocation
                                    </h1>
                                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                        {financials.length} POSITIONS • PROFITABILITY & ASSET EXPOSURE
                                    </p>
                                </div>
                            </div>
                            {/* Optional: Add a 'Export Report' button here if desired */}
                        </div>
                    </div>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard
                        title="Working Capital"
                        value={`$${totalInventoryValue.toLocaleString('en-US')}`}
                        icon={Wallet}
                        description="Total Liquidity in Stock"
                    />
                    <StatCard
                        title="Potential Profit"
                        value={`$${totalPotentialProfit.toLocaleString('en-US')}`}
                        icon={TrendingUp}
                        description="Projected Gross Return"
                    />
                    <StatCard
                        title="Avg. Margin"
                        value={`${avgMargin}%`}
                        icon={PieChart}
                        description="Portfolio Weighted"
                    />
                    <StatCard
                        title="Capital At Risk"
                        value={`$${capitalAtRisk.toLocaleString('en-US')}`}
                        icon={AlertCircle}
                        color={capitalAtRisk > 0 ? "warning" : "default"}
                        description="Low Stock Exposure"
                    />
                </div>

                {/* Asset Table */}
                <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                    <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                        <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Activity className="h-3.5 w-3.5 text-indigo-500" />
                            Asset Concentration
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead className="bg-slate-50/80 text-slate-500 border-b border-slate-200">
                                <tr>
                                    <th className="px-6 py-2.5 font-bold text-[10px] uppercase tracking-widest">Product Asset</th>
                                    <th className="px-6 py-2.5 font-bold text-[10px] uppercase tracking-widest text-right">
                                        <Tooltip content="Price paid to supplier per unit. Basis for capital calculation.">
                                            <div className="flex items-center justify-end gap-1 cursor-help group">
                                                Unit Cost <Info className="h-2.5 w-2.5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                                            </div>
                                        </Tooltip>
                                    </th>
                                    <th className="px-6 py-2.5 font-bold text-[10px] uppercase tracking-widest text-right">
                                        <Tooltip content="Total capital currently tied up in this SKU (Stock × Cost).">
                                            <div className="flex items-center justify-end gap-1 cursor-help group">
                                                Position Value <Info className="h-2.5 w-2.5 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                                            </div>
                                        </Tooltip>
                                    </th>
                                    <th className="px-6 py-2.5 font-bold text-[10px] uppercase tracking-widest text-right">Margin</th>
                                    <th className="px-6 py-2.5 w-20"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {financials.map((item) => {
                                    const profitPerUnit = item.unit_price - item.unit_cost;
                                    const margin = item.unit_price > 0
                                        ? ((profitPerUnit / item.unit_price) * 100).toFixed(0)
                                        : 0;
                                    const isHighMargin = Number(margin) >= 30;

                                    return (
                                        <tr key={item.product_id} className="group hover:bg-indigo-50/40 transition-all duration-150">
                                            <td className="px-6 py-2 align-middle">
                                                <Link href={`/dashboard/inventory/${item.product_id}`} className="flex flex-col justify-center">
                                                    <span className="font-bold text-slate-900 text-[13px] group-hover:text-indigo-600 transition-colors">
                                                        {item.name}
                                                    </span>
                                                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tighter leading-none mt-0.5">
                                                        {item.sku}
                                                    </span>
                                                </Link>
                                            </td>

                                            <td className="px-6 py-2 text-right align-middle">
                                                <span className="font-mono text-slate-600 font-bold text-sm tabular-nums">
                                                    ${item.unit_cost.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                                </span>
                                            </td>

                                            <td className="px-6 py-2 text-right align-middle">
                                                <span className="font-mono font-black text-slate-900 text-sm tabular-nums">
                                                    ${item.inventory_value.toLocaleString('en-US')}
                                                </span>
                                            </td>

                                            <td className="px-6 py-2 text-right align-middle">
                                                <span className={cn(
                                                    "inline-flex items-center gap-1 font-mono font-bold text-[10px] px-2 py-0.5 rounded border uppercase tracking-tight",
                                                    isHighMargin
                                                        ? "text-emerald-700 bg-emerald-50 border-emerald-100"
                                                        : "text-amber-700 bg-amber-50 border-amber-100"
                                                )}>
                                                    {isHighMargin && <TrendingUp className="h-2.5 w-2.5" />}
                                                    {margin}%
                                                </span>
                                            </td>

                                            <td className="px-6 py-2 text-right align-middle">
                                                <Link
                                                    href={`/dashboard/inventory/${item.product_id}`}
                                                    className="opacity-0 group-hover:opacity-100 bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded shadow-sm hover:bg-indigo-700 transition-all"
                                                >
                                                    Audit
                                                </Link>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </TooltipProvider>
    )
}