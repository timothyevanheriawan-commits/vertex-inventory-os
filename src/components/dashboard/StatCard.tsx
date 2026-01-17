import { LucideIcon, ArrowUpRight, ArrowDownRight, Minus, AlertCircle, CheckCircle2 } from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface StatCardProps {
    title: string
    value: string | number
    icon: LucideIcon
    description?: string
    trend?: {
        value: string
        direction: 'up' | 'down' | 'neutral'
    }
    color?: 'default' | 'critical' | 'warning'
}

export default function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    color = 'default'
}: StatCardProps) {

    const iconStyles = {
        default: "bg-indigo-50 text-indigo-600 border-indigo-100",
        critical: "bg-rose-50 text-rose-600 border-rose-100",
        warning: "bg-amber-50 text-amber-600 border-amber-100"
    }

    const StatusIcon = color === 'critical' ? AlertCircle : color === 'warning' ? AlertCircle : Icon

    return (
        <div className={cn(
            "group rounded-xl border bg-white p-4 transition-all duration-200 shadow-sm hover:shadow-md flex flex-col",
            color === 'critical'
                ? "border-rose-200 hover:border-rose-300"
                : color === 'warning'
                    ? "border-amber-200 hover:border-amber-300"
                    : "border-slate-200 hover:border-indigo-300 hover:-translate-y-0.5"
        )}>
            {/* Header: Title + Icon */}
            <div className="flex items-center justify-between mb-2">
                <p className="text-[9px] font-black uppercase tracking-[0.12em] text-slate-400">
                    {title}
                </p>
                <div className={cn(
                    "rounded-lg p-1.5 border transition-colors",
                    iconStyles[color]
                )}>
                    <StatusIcon className="h-3.5 w-3.5" />
                </div>
            </div>

            {/* Value */}
            <p className={cn(
                "text-2xl font-mono font-bold tracking-tight tabular-nums leading-none mb-2",
                color === 'critical' ? "text-rose-600" :
                    color === 'warning' ? "text-amber-600" :
                        "text-slate-900"
            )}>
                {value}
            </p>

            {/* Footer: Description + Trend */}
            {(description || trend) && (
                <div className="mt-auto pt-2 border-t border-slate-100 space-y-1.5">
                    {description && (
                        <p className={cn(
                            "text-[9px] font-bold uppercase tracking-wide leading-tight",
                            color === 'critical' ? "text-rose-500" :
                                color === 'warning' ? "text-amber-500" :
                                    "text-slate-500"
                        )}>
                            {description}
                        </p>
                    )}
                    {trend && (
                        <span className={cn(
                            "inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tight border",
                            trend.direction === 'up'
                                ? "text-emerald-700 bg-emerald-50 border-emerald-200"
                                : trend.direction === 'down'
                                    ? "text-rose-700 bg-rose-50 border-rose-200"
                                    : "text-slate-600 bg-slate-100 border-slate-200"
                        )}>
                            {trend.direction === 'up' && <ArrowUpRight className="h-2.5 w-2.5" />}
                            {trend.direction === 'down' && <ArrowDownRight className="h-2.5 w-2.5" />}
                            {trend.direction === 'neutral' && <Minus className="h-2.5 w-2.5" />}
                            {trend.value}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}