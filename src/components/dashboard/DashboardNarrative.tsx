import { Info, CheckCircle, AlertTriangle, Clock } from 'lucide-react'
import { cn } from '@/app/lib/utils'

interface InsightItem {
    status: 'Healthy' | 'Watch' | 'Critical'
    category: string | null
    name: string
}

export default function DashboardNarrative({ items }: { items: InsightItem[] }) {
    // 1. Calculate the State
    const criticalItems = items.filter(i => i.status === 'Critical');
    const watchItems = items.filter(i => i.status === 'Watch');

    // 2. Find the "Problem Category" (Mode)
    const categoryCounts = criticalItems.reduce((acc, curr) => {
        const cat = curr.category || 'Uncategorized';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const problemCategory = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0];

    // 3. Generate the Narrative String
    let headline = "Inventory health is optimal.";
    let subheadline = "All products are stocked above safety thresholds based on current demand.";
    let Icon = CheckCircle;
    let containerStyles = "bg-emerald-50 border-emerald-200";
    let iconStyles = "bg-emerald-100 text-emerald-600";
    let headlineStyles = "text-emerald-900";
    let textStyles = "text-emerald-700";

    if (criticalItems.length > 0) {
        headline = `${criticalItems.length} item${criticalItems.length !== 1 ? 's' : ''} require immediate attention.`;
        subheadline = `Stockouts are predicted within 7 days${problemCategory ? `, primarily in the ${problemCategory} category` : ''}.`;
        Icon = AlertTriangle;
        containerStyles = "bg-rose-50 border-rose-200";
        iconStyles = "bg-rose-100 text-rose-600";
        headlineStyles = "text-rose-900";
        textStyles = "text-rose-700";
    } else if (watchItems.length > 0) {
        headline = "Inventory levels are stable but tightening.";
        subheadline = `${watchItems.length} item${watchItems.length !== 1 ? 's are' : ' is'} approaching reorder points.`;
        Icon = Clock;
        containerStyles = "bg-amber-50 border-amber-200";
        iconStyles = "bg-amber-100 text-amber-700";
        headlineStyles = "text-amber-900";
        textStyles = "text-amber-700";
    }

    return (
        <div className={cn(
            "rounded-xl border p-6 transition-all duration-200",
            containerStyles
        )}>
            {/* Header */}
            <div className="flex items-start gap-4">
                <div className={cn(
                    "rounded-lg p-2.5 flex-shrink-0",
                    iconStyles
                )}>
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                    <h2 className={cn(
                        "text-lg font-semibold tracking-tight",
                        headlineStyles
                    )}>
                        {headline}
                    </h2>
                    <p className={cn("mt-1 text-sm", textStyles)}>
                        {subheadline}
                    </p>
                </div>
            </div>

            {/* Assumption Transparency */}
            <div className={cn(
                "mt-5 pt-4 border-t flex items-start gap-2 text-xs",
                textStyles,
                "opacity-75 border-black/10"
            )}>
                <Info className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                <p>
                    <strong className="font-semibold">Assumption:</strong> Forecasts are based on a 30-day moving average.
                    Sudden spikes in demand (48h) may not be fully reflected in days-remaining calculations.
                </p>
            </div>
        </div>
    )
}