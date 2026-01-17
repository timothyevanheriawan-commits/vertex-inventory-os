'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Search, Trash2, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react'
import { deleteProduct } from '@/app/dashboard/inventory/actions'
import { cn } from '@/app/lib/utils'
import Link from 'next/link'
import { SearchX } from 'lucide-react'
import { EmptyState } from '@/components/ui/EmptyState'

// 1. DEFINE THE INTERFACE (Replacing 'any')
interface Product {
    id: string
    name: string
    sku: string
    category: string | null
    stock_level: number
    min_stock_threshold: number
}

// 2. APPLY THE INTERFACE TO PROPS
export default function ProductTable({
    products,
    categories
}: {
    products: Product[],
    categories: string[]
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const handleSearch = (term: string) => {
        const params = new URLSearchParams(searchParams);
        if (term) params.set('q', term); else params.delete('q');
        router.replace(`${pathname}?${params.toString()}`);
    };

    const handleCategoryChange = (cat: string) => {
        const params = new URLSearchParams(searchParams);
        if (cat && cat !== 'All') params.set('category', cat); else params.delete('category');
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="space-y-4 font-sans">
            {/* 1. FUNCTIONAL CONTROLS: Search & Filter */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
                <div className="relative flex-1 w-full text-slate-900">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search SKU or Product Name..."
                        defaultValue={searchParams.get('q') || ''}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-medium placeholder:text-slate-400"
                    />
                </div>
                <select
                    title="Filter by Category"
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    defaultValue={searchParams.get('category') || 'All'}
                    className="w-full sm:w-48 px-3 py-2.5 text-sm font-bold rounded-lg border border-slate-200 bg-white text-slate-600 outline-none focus:ring-2 focus:ring-indigo-500/10 hover:border-slate-300 transition-colors cursor-pointer"
                >
                    <option value="All">All Categories</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
            </div>

            {/* 2. DATA GRID - High Density Cockpit Style */}
            <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-5 py-3 font-black text-[10px] text-slate-400 uppercase tracking-widest leading-none">Product Identity</th>
                            <th className="px-5 py-3 font-black text-[10px] text-slate-400 uppercase tracking-widest leading-none">Category</th>
                            <th className="px-5 py-3 font-black text-[10px] text-slate-400 uppercase tracking-widest leading-none text-right">Inventory Level</th>
                            <th className="px-5 py-3 font-black text-[10px] text-slate-400 uppercase tracking-widest leading-none">Operational Status</th>
                            <th className="px-5 py-3 w-12"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {products.map((product) => {
                            const isLow = product.stock_level <= product.min_stock_threshold;
                            const isOut = product.stock_level === 0;

                            return (
                                <tr key={product.id} className="group hover:bg-indigo-50/30 transition-colors duration-150">
                                    <td className="px-5 py-2.5">
                                        <div className="flex flex-col gap-0.5">
                                            <Link
                                                href={`/dashboard/inventory/${product.id}`}
                                                className="font-bold text-slate-900 text-sm hover:text-indigo-600 transition-colors cursor-pointer truncate max-w-50"
                                            >
                                                {product.name}
                                            </Link>
                                            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-tight">
                                                {product.sku}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-5 py-2.5">
                                        <span className="inline-block text-[10px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded uppercase tracking-wide">
                                            {product.category || 'General'}
                                        </span>
                                    </td>

                                    <td className="px-5 py-2.5 text-right">
                                        <div className="flex flex-col items-end gap-0.5">
                                            <div className={cn(
                                                "font-mono font-black text-sm tabular-nums",
                                                isOut ? "text-rose-600" : isLow ? "text-amber-600" : "text-slate-900"
                                            )}>
                                                {product.stock_level.toLocaleString()}
                                            </div>
                                            <div className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                                Target: {product.min_stock_threshold}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-5 py-2.5">
                                        <div className={cn(
                                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black border uppercase tracking-widest",
                                            isOut ? "bg-rose-50 border-rose-200 text-rose-700" :
                                                isLow ? "bg-amber-50 border-amber-200 text-amber-700" :
                                                    "bg-emerald-50 border-emerald-200 text-emerald-700"
                                        )}>
                                            {isOut ? <XCircle className="h-3.5 w-3.5" /> :
                                                isLow ? <AlertTriangle className="h-3.5 w-3.5" /> :
                                                    <CheckCircle2 className="h-3.5 w-3.5" />}
                                            {isOut ? 'Stockout' : isLow ? 'Low Stock' : 'Healthy'}
                                        </div>
                                    </td>

                                    <td className="px-5 py-2.5 text-right">
                                        <button
                                            onClick={() => deleteProduct(product.id)}
                                            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-all focus:opacity-100"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>

                {/* 3. EMPTY STATE */}
                {products.length === 0 && (
                    <EmptyState
                        icon={SearchX}
                        title="No Results Found"
                        description="We couldn't find any products matching your current filters or search query. Try clearing your parameters."
                        action={
                            <button
                                onClick={() => router.replace(pathname)}
                                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        }
                    />
                )}
            </div>
        </div>
    )
}