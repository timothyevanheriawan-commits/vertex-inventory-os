import { Skeleton } from "@/components/ui/Skeleton";

export default function InventoryLoading() {
    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            {/* Breadcrumb + Header */}
            <div className="space-y-4">
                <Skeleton className="h-3 w-32" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <Skeleton className="h-10 w-32 rounded-lg" />
                </div>
            </div>

            {/* Status Bar Skeletons */}
            <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-16 rounded-xl border border-slate-200" />
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="h-10 bg-slate-50 border-b border-slate-200" />
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="p-4 border-b border-slate-50 flex justify-between gap-4">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
        </div>
    );
}