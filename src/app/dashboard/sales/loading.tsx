import { Skeleton } from "@/components/ui/Skeleton";

export default function SalesLoading() {
    return (
        <div className="space-y-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-end">
                <div className="space-y-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-8 w-48" />
                </div>
                <Skeleton className="h-10 w-32 rounded-lg" />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 rounded-xl border border-slate-200" />
                ))}
            </div>

            <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="p-4 border-b border-slate-50 flex justify-between items-center">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}