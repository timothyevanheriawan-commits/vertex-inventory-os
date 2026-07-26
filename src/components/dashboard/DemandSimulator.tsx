'use client';

import { useState } from 'react';
import { Sliders, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/app/lib/utils';

interface SimulatorProps {
    currentBurnRate: number;
    currentStock: number;
    onSimulate: (val: number) => void; // ADD THIS
}

export default function DemandSimulator({
    currentBurnRate,
    currentStock,
    onSimulate // ADD THIS
}: SimulatorProps) {
    // State: Growth Percentage (-50% to +100%)
    const [growth, setGrowth] = useState(0);

    // Math
    const simulatedBurn = currentBurnRate * (1 + growth / 100);
    const baselineDays = currentBurnRate > 0 ? currentStock / currentBurnRate : Infinity;
    const simulatedDays = simulatedBurn > 0
        ? (currentStock / simulatedBurn)
        : Infinity;

    const impact = simulatedDays - baselineDays;
    const displayDays = simulatedDays === Infinity ? "∞" : simulatedDays.toFixed(0);

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                    <Sliders className="h-4 w-4" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold tracking-tight text-slate-900">
                        What-If Scenario Simulator
                    </h3>
                    <p className="text-xs text-slate-500">
                        Model demand changes
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                {/* Slider */}
                <div>
                    <div className="flex items-center justify-between mb-3">
                        <label className="text-sm font-medium text-slate-700">
                            Projected Demand Change
                        </label>
                        <span className={cn(
                            "text-sm font-mono font-bold px-2 py-0.5 rounded",
                            growth > 0
                                ? "text-rose-700 bg-rose-50"
                                : growth < 0
                                    ? "text-emerald-700 bg-emerald-50"
                                    : "text-slate-700 bg-slate-100"
                        )}>
                            {growth > 0 ? '+' : ''}{growth}%
                        </span>
                    </div>

                    <input
                        title="-"
                        type="range"
                        min="-50"
                        max="100"
                        step="10"
                        value={growth}
                        onChange={(e) => setGrowth(parseInt(e.target.value))}
                        className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    />

                    <div className="flex justify-between text-[11px] text-slate-500 mt-2 font-mono">
                        <span>-50% Cooling</span>
                        <span>Baseline</span>
                        <span>+100% Surge</span>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <div className="grid grid-cols-2 gap-6">
                        {/* New Burn Rate */}
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                New Burn Rate
                            </p>
                            <p className="text-2xl font-mono font-bold tracking-tight text-slate-900">
                                {simulatedBurn.toFixed(1)}
                                <span className="text-sm text-slate-500 font-sans font-normal ml-1">
                                    /day
                                </span>
                            </p>
                        </div>

                        {/* Adjusted Runway */}
                        <div className="text-right">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                Adjusted Runway
                            </p>
                            <p className="text-2xl font-mono font-bold tracking-tight text-slate-900">
                                {displayDays}
                                <span className="text-sm text-slate-500 font-sans font-normal ml-1">
                                    Days
                                </span>
                            </p>

                            {/* Impact Badge */}
                            {growth !== 0 && isFinite(impact) && (
                                <div className={cn(
                                    "inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs font-semibold",
                                    impact < 0
                                        ? "text-rose-700 bg-rose-50 border border-rose-200"
                                        : "text-emerald-700 bg-emerald-50 border border-emerald-200"
                                )}>
                                    {impact < 0
                                        ? <TrendingDown className="h-3 w-3" />
                                        : <TrendingUp className="h-3 w-3" />
                                    }
                                    {impact > 0 ? '+' : ''}{impact.toFixed(0)} days
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}