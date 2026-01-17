import { Skeleton } from "@/components/ui/Skeleton";

export default function FinancialsLoading() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            {/* Breadcrumb + Header Skeleton */}
            <div className="space-y-4">
                <Skeleton className="h-3 w-32" />
                <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-lg" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-48" />
                        <Skeleton className="h-3 w-64" />
                    </div>
                </div>
            </div>

            {/* Financial KPI Grid (4 Cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-28 rounded-xl border border-slate-200" />
                ))}
            </div>

            {/* Asset Concentration Table Skeleton */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5 rounded-md" />
                    <Skeleton className="h-4 w-40" />
                </div>

                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                    {/* Table Header Placeholder */}
                    <div className="h-10 bg-slate-50/50 border-b border-slate-200" />

                    {/* Table Row Placeholders */}
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <div key={i} className="p-4 border-b border-slate-50 flex justify-between items-center gap-8">
                            {/* Product Info Column */}
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/4" />
                            </div>
                            {/* Unit Cost Column */}
                            <Skeleton className="h-4 w-16" />
                            {/* Total Value Column */}
                            <Skeleton className="h-4 w-20" />
                            {/* Margin Column */}
                            <Skeleton className="h-5 w-12 rounded-full" />
                            {/* Action Column */}
                            <Skeleton className="h-3 w-10" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}