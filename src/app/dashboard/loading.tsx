import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>

            {/* KPI Grid Skeleton */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-36.25 rounded-xl border border-slate-200" />
                ))}
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <Skeleton className="h-6 w-32" />
                    <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Skeleton key={i} className="h-12 w-full border-b border-slate-50 last:border-0" />
                        ))}
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-87.5 rounded-xl border border-slate-200" />
                    <Skeleton className="h-37.5 rounded-xl border border-slate-200" />
                </div>
            </div>
        </div>
    );
}