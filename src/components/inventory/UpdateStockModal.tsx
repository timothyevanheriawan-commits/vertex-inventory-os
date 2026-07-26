'use client'

import { useState } from 'react'
import { X, Loader2, RefreshCcw } from 'lucide-react'
import { updateProductStock } from '@/app/dashboard/inventory/actions'

export default function UpdateStockModal({
    productId,
    currentStock,
    productName
}: {
    productId: string,
    currentStock: number,
    productName: string
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [isPending, setIsPending] = useState(false)

    // FIX 1: Ensure initial value is never undefined or NaN
    // We use the logical OR (|| 0) to guarantee a number
    const [value, setValue] = useState<number>(currentStock || 0)
    const openModal = () => {
        setValue(currentStock || 0)
        setIsOpen(true)
    }

   
    async function handleUpdate() {
        // Prevent updating if the value is invalid
        if (isNaN(value)) return;

        setIsPending(true)
        const res = await updateProductStock(productId, value)
        setIsPending(false)
        if (res?.success) setIsOpen(false)
        else alert(res?.error)
    }

    return (
        <>
            <button
                onClick={openModal}
                className="text-[10px] font-black bg-white border border-slate-200 px-3 py-1 rounded shadow-sm hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all uppercase tracking-widest flex items-center gap-1.5"
            >
                <RefreshCcw className="h-3 w-3" />
                Update Stock
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-200">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-slate-900">Adjust Inventory</h2>
                            <button aria-label="Close" onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-slate-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <p className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-widest">
                            {productName}
                        </p>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label htmlFor="update-stock-quantity" className="text-[10px] font-black text-slate-500 uppercase tracking-widest">New Quantity On Hand</label>
                                <input
                                    id="update-stock-quantity"
                                    type="number"
                                    // FIX 2: If value is NaN (user cleared input), show empty string instead of NaN
                                    value={isNaN(value) ? '' : value}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        // If user deletes everything, set to NaN temporarily to allow empty input
                                        // React will render '' based on FIX 2
                                        setValue(val);
                                    }}
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-2xl font-mono font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <div className="pt-2 flex gap-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 px-4 py-2.5 text-xs font-black text-slate-500 hover:bg-slate-50 rounded-lg transition-colors uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdate}
                                    disabled={isPending || isNaN(value)}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-black bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg shadow-indigo-100 disabled:opacity-50 transition-all uppercase tracking-widest"
                                >
                                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Change'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}