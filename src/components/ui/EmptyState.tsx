'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    action?: React.ReactNode
    className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn(
            "flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-dashed border-slate-200 animate-in fade-in zoom-in-95 duration-500",
            className
        )}>
            <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center mb-5 border border-slate-100 shadow-inner">
                <Icon className="h-8 w-8 text-slate-300" />
            </div>

            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest leading-none mb-2">
                {title}
            </h3>

            <p className="text-xs text-slate-500 max-w-65 leading-relaxed font-medium">
                {description}
            </p>

            {action && (
                <div className="mt-6">
                    {action}
                </div>
            )}
        </div>
    )
}