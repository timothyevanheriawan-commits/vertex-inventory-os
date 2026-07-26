'use client'

import { useState } from 'react'
import { updateUserSettings } from '@/app/dashboard/settings/actions'
import { Save, AlertTriangle, Truck, Clock, Loader2 } from 'lucide-react'

// 1. DEFINE THE STRICT INTERFACE (Replaces 'any')
interface UserSettings {
    lead_time_days: number;
    critical_threshold_days: number;
    watch_threshold_days: number;
}

export default function SettingsForm({ initialSettings }: { initialSettings: UserSettings | null }) {
    const [isPending, setIsPending] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsPending(true)
        const res = await updateUserSettings(formData)
        setIsPending(false)

        if (res?.success) {
            alert("Logic Engine Updated. Dashboard recalculated.")
        } else {
            alert(res?.error || "Failed to update settings")
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
                {/* Global Lead Time */}
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/30 p-5 hover:border-indigo-200 transition-colors">
                    <div className="flex items-center gap-2 mb-3 text-indigo-700">
                        <Truck className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Supply Chain</span>
                    </div>
                    {/* Added id/htmlFor for A11y */}
                    <label htmlFor="lead_time" className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-tight">
                        Global Lead Time
                    </label>
                    <p className="text-[10px] font-medium text-slate-500 mb-4 leading-relaxed">
                        Avg. days from PO to warehouse receipt.
                    </p>
                    <div className="relative">
                        <input
                            id="lead_time"
                            name="lead_time"
                            type="number"
                            aria-label="Global Lead Time in Days"
                            defaultValue={initialSettings?.lead_time_days ?? 5}
                            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-mono font-bold text-lg text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        />
                        <span className="absolute right-3 top-3.5 text-[10px] font-black text-slate-500 pointer-events-none uppercase">DAYS</span>
                    </div>
                </div>

                {/* Critical Threshold */}
                <div className="rounded-xl border border-rose-100 bg-rose-50/30 p-5 hover:border-rose-200 transition-colors">
                    <div className="flex items-center gap-2 mb-3 text-rose-700">
                        <AlertTriangle className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Critical Alert</span>
                    </div>
                    <label htmlFor="critical" className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-tight">
                        Safety Buffer
                    </label>
                    <p className="text-[10px] font-medium text-slate-500 mb-4 leading-relaxed">
                        Trigger &quot;Critical&quot; status when runway drops below Lead Time + X.
                    </p>
                    <div className="relative">
                        <input
                            id="critical"
                            name="critical"
                            type="number"
                            aria-label="Critical Threshold in Days"
                            defaultValue={initialSettings?.critical_threshold_days ?? 7}
                            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-mono font-bold text-lg text-rose-700 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none transition-all"
                        />
                        <span className="absolute right-3 top-3.5 text-[10px] font-black text-rose-300 pointer-events-none uppercase">DAYS</span>
                    </div>
                </div>

                {/* Watch Threshold */}
                <div className="rounded-xl border border-amber-100 bg-amber-50/30 p-5 hover:border-amber-200 transition-colors">
                    <div className="flex items-center gap-2 mb-3 text-amber-700">
                        <Clock className="h-4 w-4" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Watchlist</span>
                    </div>
                    <label htmlFor="watch" className="block text-xs font-bold text-slate-900 mb-1 uppercase tracking-tight">
                        Warning Horizon
                    </label>
                    <p className="text-[10px] font-medium text-slate-500 mb-4 leading-relaxed">
                        Trigger &quot;Watch&quot; status for items needing review soon.
                    </p>
                    <div className="relative">
                        <input
                            id="watch"
                            name="watch"
                            type="number"
                            aria-label="Watch Threshold in Days"
                            defaultValue={initialSettings?.watch_threshold_days ?? 21}
                            className="w-full rounded-lg border border-slate-200 bg-white p-2.5 font-mono font-bold text-lg text-amber-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                        />
                        <span className="absolute right-3 top-3.5 text-[10px] font-black text-amber-300 pointer-events-none uppercase">DAYS</span>
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                    disabled={isPending}
                    type="submit"
                    className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Update Logic Engine
                </button>
            </div>
        </form>
    )
}