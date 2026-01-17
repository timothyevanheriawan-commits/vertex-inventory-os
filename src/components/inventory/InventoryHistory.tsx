import { History, ArrowUpRight, ArrowDownRight, User } from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface LogEntry {
    id: string
    previous_stock: number
    new_stock: number
    change_amount: number
    change_type: string
    created_at: string
}

export default function InventoryHistory({ logs }: { logs: LogEntry[] }) {
    if (!logs || logs.length === 0) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">No activity history found</p>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
            <div className="bg-slate-50/80 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                    <History className="h-3 w-3" />
                    Audit Trail
                </h3>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Last 60 Days</span>
            </div>

            <div className="divide-y divide-slate-100">
                {logs.map((log) => {
                    const isPositive = log.change_amount > 0;
                    return (
                        <div key={log.id} className="p-4 flex items-center justify-between group hover:bg-slate-50/50 transition-colors">
                            <div className="flex items-center gap-4">
                                {/* Visual Indicator */}
                                <div className={cn(
                                    "h-8 w-8 rounded-lg flex items-center justify-center border",
                                    isPositive ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-rose-50 border-rose-100 text-rose-600"
                                )}>
                                    {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                                </div>

                                <div>
                                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                                        {log.change_type}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                                        {new Date(log.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                    </p>
                                </div>
                            </div>

                            <div className="text-right">
                                <p className={cn(
                                    "text-sm font-mono font-black tabular-nums",
                                    isPositive ? "text-emerald-600" : "text-rose-600"
                                )}>
                                    {isPositive ? '+' : ''}{log.change_amount}
                                </p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                    Result: {log.new_stock} units
                                </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}