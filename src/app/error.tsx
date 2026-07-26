'use client'

import { useEffect } from 'react'

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('Root error boundary caught:', error)
    }, [error])

    return (
        <html lang="en">
            <body className="min-h-screen flex items-center justify-center bg-white">
                <div className="text-center space-y-4 px-6">
                    <h1 className="text-2xl font-black text-slate-900">Something went wrong</h1>
                    <p className="text-sm text-slate-500 max-w-sm">
                        We hit an unexpected error. Please try again.
                    </p>
                    <button
                        onClick={reset}
                        className="rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-700 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </body>
        </html>
    )
}
