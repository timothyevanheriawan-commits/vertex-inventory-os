'use client';

import { useMemo, useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

interface Item {
    category: string | null;
    stock_level: number;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6'];

export default function CategoryDistribution({ items }: { items: Item[] }) {
    // FIX 1: Prevent Hydration Mismatch safely
    const [mounted, setMounted] = useState(false);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setMounted(true);
        }, 0);
        return () => clearTimeout(timeout);
    }, []);

    const { chartData, totalStock } = useMemo(() => {
        if (!items || items.length === 0) return { chartData: [], totalStock: 0 };
        
        const total = items.reduce((acc, curr) => acc + (curr.stock_level || 0), 0);
        
        const dataMap = items.reduce((acc, item) => {
            const cat = item.category || 'Uncategorized';
            acc[cat] = (acc[cat] || 0) + item.stock_level;
            return acc;
        }, {} as Record<string, number>);

        const formattedData = Object.entries(dataMap)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6);
        
        return { chartData: formattedData, totalStock: total };
    }, [items]);

    // Render skeleton while mounting
    if (!mounted) {
        return (
            <div className="h-full w-full bg-white rounded-xl border border-slate-200 animate-pulse flex items-center justify-center">
                <PieIcon className="h-8 w-8 text-slate-100" />
            </div>
        );
    }

    if (totalStock === 0) return null;

    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm h-full flex flex-col">
            <div className="flex items-center gap-3 mb-2">
                <div className="rounded-lg bg-indigo-50 p-2 text-indigo-600 border border-indigo-100">
                    <PieIcon className="h-4 w-4" />
                </div>
                <div>
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Category Split</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <span className="font-mono font-bold text-slate-600">
                            {totalStock.toLocaleString('en-US')}
                        </span> TOTAL UNITS
                    </p>
                </div>
            </div>

            <div className="flex-1 min-h-50 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={85}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {chartData.map((entry, index) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={COLORS[index % COLORS.length]} 
                                    stroke="#fff" 
                                    strokeWidth={2} 
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                                fontSize: '11px'
                            }}
                            formatter={(value: number | string | undefined) => {
                                if (value == null) return ['0', 'Units'];

                                const numValue =
                                    typeof value === 'string' ? Number(value) : value;

                                return [numValue.toLocaleString('en-US'), 'Units'];
                            }}
                        />
                        <Legend 
                            verticalAlign="bottom" 
                            align="center" 
                            iconType="circle" 
                            iconSize={8} 
                            wrapperStyle={{ 
                                fontSize: '10px', 
                                fontWeight: 'bold', 
                                textTransform: 'uppercase', 
                                paddingTop: '20px' 
                            }} 
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}