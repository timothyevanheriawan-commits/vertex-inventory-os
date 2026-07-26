'use client'

import { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { addProduct } from '@/app/dashboard/inventory/actions'
import { toast } from 'sonner';


export default function AddProductModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        const result = await addProduct(formData);
        setIsPending(false);

        if (result.success) {
            setIsOpen(false);
            // 2. Replace alert with toast
            toast.success(`Inventory Record Created`, {
                description: `${formData.get('name')} has been added to the catalog.`
            });
        } else {
            toast.error('Creation Failed', {
                description: result.error
            });
        }
    }
    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-100 hover:bg-indigo-700 transition-all"
            >
                <Plus className="h-4 w-4" />
                Add Product
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-xl font-bold text-slate-900">New Product Entry</h2>
                            <button title="-"
                                onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form action={handleSubmit} className="space-y-6">
                            {/* HUMAN-FIRST: Name goes first */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Name</label>
                                <input name="name" required placeholder="e.g. Premium Wireless Mouse" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SKU / ID</label>
                                    <input name="sku" required placeholder="SKU-001" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Category</label>
                                    <input name="category" placeholder="Electronics" className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Initial Stock</label>
                                    <input title="-" type="number" name="stock_level" required defaultValue="0" className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Min Threshold</label>
                                    <input type="number" name="min_stock_threshold" required placeholder="e.g. 10" className="w-full rounded-lg border border-indigo-200 bg-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Unit Cost ($)</label>
                                    <input
                                        name="unit_cost"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Selling Price ($)</label>
                                    <input
                                        name="unit_price"
                                        type="number"
                                        step="0.01"
                                        required
                                        placeholder="0.00"
                                        className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-sm font-mono outline-none focus:ring-2 focus:ring-emerald-500/20"
                                    />
                                </div>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsOpen(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                                    Discard
                                </button>
                                <button
                                    disabled={isPending}
                                    className="flex items-center gap-2 px-8 py-2.5 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all disabled:opacity-50"
                                >
                                    {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {isPending ? 'Saving...' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    )
}