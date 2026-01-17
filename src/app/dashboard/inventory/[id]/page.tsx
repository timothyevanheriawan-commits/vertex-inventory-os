import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle, CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { cn } from '@/app/lib/utils'
import ProductAnalysisDashboard from '@/components/inventory/ProductAnalysisDashboard'
import InventoryHistory from '@/components/inventory/InventoryHistory'

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('inventory_insights')
        .select('*')
        .eq('product_id', id)
        .single()

    if (!product) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <p className="text-sm font-semibold text-slate-900">Product not found</p>
                <Link href="/dashboard/inventory" className="text-xs text-indigo-600 mt-2 hover:underline">
                    Return to inventory
                </Link>
            </div>
        )
    }

    const { data: sales } = await supabase
        .from('sales')
        .select('sale_date, quantity')
        .eq('product_id', id)
        .order('sale_date', { ascending: true })
        .limit(60)

    const statusConfig = {
        Critical: {
            icon: AlertTriangle,
            bg: 'bg-rose-50',
            border: 'border-rose-200',
            text: 'text-rose-700'
        },
        Watch: {
            icon: Clock,
            bg: 'bg-amber-50',
            border: 'border-amber-200',
            text: 'text-amber-700'
        },
        Healthy: {
            icon: CheckCircle,
            bg: 'bg-emerald-50',
            border: 'border-emerald-200',
            text: 'text-emerald-700'
        }
    }

    // 3. NEW: Fetch Audit Logs
    const { data: logs } = await supabase
        .from('inventory_logs')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false })
        .limit(10)

    const status = statusConfig[product.status as keyof typeof statusConfig] || statusConfig.Healthy
    const StatusIcon = status.icon


    
    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* BREADCRUMB NAV - Compact */}
            <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                <Link
                    href="/dashboard"
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    Dashboard
                </Link>
                <ChevronRight className="h-3 w-3 text-slate-300" />
                <Link
                    href="/dashboard/inventory"
                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                >
                    Inventory
                </Link>
                <ChevronRight className="h-3 w-3 text-slate-300" />
                <span className="text-slate-600">{product.sku}</span>
            </nav>

            {/* HEADER - Compact with Status */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 pb-4 border-b border-slate-200">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard/inventory"
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-all"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                            {product.name}
                        </h1>
                    </div>
                    <p className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider pl-10">
                        {product.sku} • {product.category || 'GENERAL'}
                    </p>
                </div>

                {/* Status Badge - With Icon */}
                <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-widest shadow-sm",
                    status.bg, status.border, status.text
                )}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {product.status} STATUS
                </div>
            </div>

            {/* ANALYSIS DASHBOARD */}
            <div className="lg:col-span-2 space-y-8">
                {/* Your Analysis Dashboard component */}
                <ProductAnalysisDashboard
                    product={{
                        product_id: product.product_id,
                        name: product.name,
                        stock_level: product.stock_level,
                        daily_demand: product.daily_demand,
                        min_stock_threshold: product.min_stock_threshold
                    }}
                    sales={sales || []}
                />
                {/* NEW: Audit History Section */}
                <div className="space-y-4">
                    <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Activity History</h2>
                    <InventoryHistory logs={logs || []} />
                </div>
            </div>        </div>
    )
}