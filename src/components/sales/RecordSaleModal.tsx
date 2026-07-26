'use client'

import { useState } from 'react'
import { Plus, X, Search, Check, Loader2 } from 'lucide-react'
import { recordSale } from '@/app/dashboard/sales/actions'
import { cn } from '@/app/lib/utils'
import { toast } from 'sonner';

// 1. Define the Interface to replace 'any'
interface SimpleProduct {
    id: string;
    name: string;
    sku: string;
    stock_level: number;
}

export default function RecordSaleModal({ products }: { products: SimpleProduct[] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedProductId, setSelectedProductId] = useState('')

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 5);

    async function handleSubmit(formData: FormData): Promise<void> {
        if (!selectedProductId) {
            toast.warning("Selection Required", { description: "Please select a product first." });
            return;
        }

        setIsPending(true);
        const result = await recordSale(formData);
        setIsPending(false);

        if (result?.success) {
            setIsOpen(false);
            setSelectedProductId('');
            setSearchQuery('');
            toast.success("Transaction Verified", { description: "Stock and logs updated." });
        } else {
            toast.error("Transaction Error", { description: result?.error });
        }

        // Ensure we return nothing (void)
        return;
    }


    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm hover:bg-indigo-700 transition-all"
            >
                <Plus className="h-4 w-4" /> Record Sale
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-slate-900">New Transaction</h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Close modal"
                                title="Close"
                                className="text-slate-500 hover:text-slate-600 cursor-pointer"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form action={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="product_search" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    Search Product
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                    <input
                                        id="product_search"
                                        type="text"
                                        placeholder="Type name or SKU..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20"
                                    />
                                </div>

                                {searchQuery && (
                                    <div className="mt-2 rounded-lg border border-slate-100 bg-white shadow-xl overflow-hidden">
                                        {filteredProducts.map(p => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                aria-label={`Select ${p.name}`}
                                                onClick={() => {
                                                    setSelectedProductId(p.id);
                                                    setSearchQuery(p.name);
                                                }}
                                                className={cn(
                                                    "flex items-center justify-between w-full px-4 py-3 text-left text-sm hover:bg-slate-50 transition-colors",
                                                    selectedProductId === p.id && "bg-indigo-50"
                                                )}
                                            >
                                                <div>
                                                    <p className="font-bold text-slate-900">{p.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono">{p.sku} • Stock: {p.stock_level}</p>
                                                </div>
                                                {selectedProductId === p.id && <Check className="h-4 w-4 text-indigo-600" />}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                <input type="hidden" name="product_id" value={selectedProductId} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label htmlFor="quantity" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Qty Sold</label>
                                    <input
                                        id="quantity"
                                        name="quantity"
                                        type="number"
                                        required
                                        min="1"
                                        defaultValue="1"
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label htmlFor="sale_date" className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                                    <input
                                        id="sale_date"
                                        name="sale_date"
                                        type="date"
                                        required
                                        defaultValue={new Date().toISOString().split('T')[0]}
                                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-4 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    Discard
                                </button>
                                <button
                                    disabled={isPending || !selectedProductId}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
                                >
                                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                    Confirm Sale
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}