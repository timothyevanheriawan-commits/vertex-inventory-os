'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

interface Sale {
    sale_date: string;
    quantity: number;
}

export default function SalesChart({
    sales,
    projectionMultiplier = 1
}: {
    sales: Sale[],
    projectionMultiplier?: number
}) {
    // Process Data
    const dataMap = sales.reduce((acc, sale) => {
        const date = new Date(sale.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        acc[date] = (acc[date] || 0) + sale.quantity;
        return acc;
    }, {} as Record<string, number>);

    const rawData = Object.entries(dataMap).map(([date, total]) => ({ date, total }));

    // Calculate Moving Average + Projection
    const chartData = rawData.map((item, index, array) => {
        const window = array.slice(Math.max(0, index - 2), index + 1);
        const avg = window.reduce((sum, curr) => sum + curr.total, 0) / window.length;
        return {
            ...item,
            average: parseFloat(avg.toFixed(1)),
            projection: parseFloat((avg * projectionMultiplier).toFixed(1))
        };
    }).slice(-14);

    // Empty State
    if (chartData.length < 3) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center py-8">
                    <div className="rounded-full bg-slate-100 p-3 mb-3 border border-slate-200">
                        <BarChart3 className="h-6 w-6 text-slate-500" />
                    </div>
                    <p className="text-sm font-bold text-slate-900">Insufficient Data</p>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-50">
                        Record more sales to generate demand analysis.
                    </p>
                </div>
            </div>
        );
    }

    const isSimulating = projectionMultiplier !== 1;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div className="flex items-center gap-2">
                    <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600">
                        <TrendingUp className="h-4 w-4" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-900 tracking-tight">
                            14-Day Demand Analysis
                        </h3>
                        <p className="text-[10px] text-slate-500 font-medium">
                            Sales volume with trend projection
                        </p>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-sm bg-indigo-600"></div>
                        <span className="text-slate-500">Actuals</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="h-0.5 w-3 bg-emerald-500 rounded"></div>
                        <span className="text-slate-500">Baseline</span>
                    </div>
                    {isSimulating && (
                        <div className="flex items-center gap-1.5">
                            <div className="h-0.5 w-3 bg-indigo-400 border-dashed"></div>
                            <span className="text-indigo-600">Simulated</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Chart */}
            <div className="h-65 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                            dy={8}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'monospace' }}
                        />
                        <Tooltip
                            cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                            contentStyle={{
                                borderRadius: '10px',
                                border: 'none',
                                boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)',
                                padding: '10px 14px',
                                backgroundColor: '#1e1b4b',
                            }}
                            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold' }}
                            labelStyle={{
                                color: '#a5b4fc',
                                fontSize: '9px',
                                marginBottom: '6px',
                                fontWeight: 'bold',
                            }}
                            formatter={(value: number | undefined, name?: string) => {
                                if (value == null) {
                                    return ['0 units', ''];
                                }

                                const label =
                                    name === 'total'
                                        ? 'Actual'
                                        : name === 'average'
                                            ? 'Baseline'
                                            : 'Projected';

                                return [`${value.toLocaleString()} units`, label];
                            }}
                        />


                        <Bar
                            dataKey="total"
                            name="total"
                            fill="#4f46e5"
                            radius={[3, 3, 0, 0]}
                            barSize={18}
                            opacity={isSimulating ? 0.3 : 1}
                        />
                        <Line
                            type="monotone"
                            dataKey="average"
                            name="average"
                            stroke="#10b981"
                            strokeWidth={2}
                            dot={false}
                        />
                        {isSimulating && (
                            <Line
                                type="monotone"
                                dataKey="projection"
                                name="projection"
                                stroke="#6366f1"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={{ fill: '#6366f1', r: 3 }}
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}