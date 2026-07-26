import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { getVerifiedUser } from '@/utils/supabase/verified-user'
import AddProductModal from '@/components/inventory/AddProductModal'
import ProductTable from '@/components/inventory/ProductTable'
import { Package, AlertTriangle, CheckCircle, ChevronRight, FileUp } from 'lucide-react'
import Link from 'next/link'
import { escapePostgrestFilterValue } from '@/app/lib/utils'

export default async function InventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; category?: string }>
}) {
    const { q, category } = await searchParams
    const supabase = await createClient()

    const user = await getVerifiedUser()
    if (!user) redirect('/login')

    let query = supabase.from('products').select('*').eq('user_id', user.id)
    if (q) {
        const safeQ = escapePostgrestFilterValue(q)
        query = query.or(`name.ilike.%${safeQ}%,sku.ilike.%${safeQ}%`)
    }
    if (category && category !== 'All') query = query.eq('category', category)

    const { data: products } = await query.order('name', { ascending: true })
    const productList = products || []

    const { data: categories } = await supabase
        .from('products')
        .select('category')
        .eq('user_id', user.id)
    const uniqueCategories = Array.from(new Set(categories?.map(c => c.category).filter(Boolean)))

    // Quick Stats
    const totalProducts = productList.length
    const lowStockCount = productList.filter(p => p.stock_level <= p.min_stock_threshold && p.stock_level > 0).length
    const outOfStockCount = productList.filter(p => p.stock_level === 0).length
    const healthyCount = totalProducts - lowStockCount - outOfStockCount

    return (
        <div className="space-y-6">
            {/* BREADCRUMB + HEADER */}
            <div className="space-y-3">
                {/* BREADCRUMB */}
                <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                    <Link href="/dashboard" className="text-slate-500 hover:text-indigo-600 transition-colors">
                        Dashboard
                    </Link>
                    <ChevronRight className="h-3 w-3 text-slate-300" />
                    <span className="text-slate-600">Inventory</span>
                </nav>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* TITLE & METADATA */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 shadow-sm">
                            <Package className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                Inventory Management
                            </h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {totalProducts} Products
                            </p>
                        </div>
                    </div>

                    {/* ACTION GROUP: Manual + Bulk */}
                    <div className="flex items-center gap-2">
                        {/* Secondary Action: Bulk Import */}
                        <Link
                            href="/dashboard/inventory/import"
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200"
                        >
                            <FileUp className="h-4 w-4" />
                            Bulk Import
                        </Link>

                        {/* Primary Action: Add Product */}
                        <AddProductModal />
                    </div>
                </div>
            </div>

            {/* QUICK STATUS BAR */}
            <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="p-2 rounded-lg bg-emerald-50">
                        <CheckCircle className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Healthy</p>
                        <p className="text-lg font-mono font-bold text-slate-900 tabular-nums">{healthyCount}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="p-2 rounded-lg bg-amber-50">
                        <AlertTriangle className="h-4 w-4 text-amber-700" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Low Stock</p>
                        <p className="text-lg font-mono font-bold text-amber-700 tabular-nums">{lowStockCount}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="p-2 rounded-lg bg-rose-50">
                        <AlertTriangle className="h-4 w-4 text-rose-600" />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Out of Stock</p>
                        <p className="text-lg font-mono font-bold text-rose-600 tabular-nums">{outOfStockCount}</p>
                    </div>
                </div>
            </div>

            {/* DATA TABLE */}
            <ProductTable
                products={productList}
                categories={uniqueCategories as string[]}
            />
        </div>
    )
}
