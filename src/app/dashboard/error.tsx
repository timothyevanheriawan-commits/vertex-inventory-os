'use client'

import { useEffect } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Send to your error tracking service (e.g. Sentry) in production.
        console.error('Dashboard error boundary caught:', error)
    }, [error])

    return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center px-6">
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
                <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Something went wrong</h2>
                <p className="text-sm text-slate-500 max-w-sm">
                    An unexpected error occurred while loading this page. You can try again,
                    or head back to the dashboard.
                </p>
            </div>
            <button
                onClick={reset}
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-sm hover:bg-indigo-700 transition-all"
            >
                <RotateCcw className="h-3.5 w-3.5" />
                Try Again
            </button>
        </div>
    )
}
