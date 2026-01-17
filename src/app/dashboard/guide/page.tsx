import {
    BookOpen, Calculator, ShieldAlert, Zap,
    FileUp, TrendingUp, DollarSign, Settings2, ArrowRight,
    ChevronRight, AlertTriangle, Clock, CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/app/lib/utils'

export default function GuidePage() {
    return (
        <div className="space-y-6">
            {/* --- COMPACT HEADER --- */}
            <div className="space-y-2.5">
                <nav className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
                    <ChevronRight className="h-3 w-3 text-slate-300" />
                    <span className="text-slate-600">Operations Guide</span>
                </nav>

                <div className="flex items-center justify-between border-b border-slate-200 pb-5">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 shadow-sm">
                            <BookOpen className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                Intelligence Manual
                            </h1>
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                Vertex Intelligence Engine v2.4 • Documentation
                            </p>
                        </div>
                    </div>
                    <div className="hidden sm:block">
                        <span className="text-[10px] font-black bg-white border border-slate-200 text-slate-500 px-3 py-1.5 rounded-lg uppercase tracking-tight shadow-sm">
                            Technical Reference
                        </span>
                    </div>
                </div>
            </div>

            {/* --- ONBOARDING GRID (Reduced Spacing, Larger Font) --- */}
            <div className="grid gap-4 md:grid-cols-3">
                {[
                    {
                        step: '01',
                        icon: FileUp,
                        title: 'Data Ingestion',
                        desc: 'Import your furniture catalog via CSV. Vertex enforces unique SKU constraints and validates numeric integrity.',
                        link: '/dashboard/inventory/import',
                        action: 'Go to Import'
                    },
                    {
                        step: '02',
                        icon: Settings2,
                        title: 'Calibrate Logic',
                        desc: 'Define Global Lead Times in Settings to tune the sensitivity of Reorder Point health alerts.',
                        link: '/dashboard/settings',
                        action: 'Open Settings'
                    },
                    {
                        step: '03',
                        icon: TrendingUp,
                        title: 'Demand Baseline',
                        desc: 'Record daily sales manually or via API to establish the 30-day moving average demand model.',
                        link: '/dashboard/sales',
                        action: 'Log Sale'
                    }
                ].map((item, i) => (
                    <Link
                        key={i}
                        href={item.link}
                        className="group relative p-5 rounded-xl border border-slate-200 bg-white shadow-sm hover:border-indigo-400 hover:shadow-md transition-all block"
                    >
                        <span className="absolute top-2 right-4 text-3xl font-black text-slate-50 group-hover:text-indigo-50 transition-colors">
                            {item.step}
                        </span>
                        <div className="relative z-10">
                            <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-2 w-fit mb-4 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors">
                                <item.icon className="h-5 w-5 text-indigo-600 group-hover:text-white transition-colors" />
                            </div>
                            <h3 className="font-bold text-sm text-slate-900 uppercase tracking-tight mb-2">{item.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-4">{item.desc}</p>
                            <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 group-hover:translate-x-1 transition-transform">
                                {item.action} <ArrowRight className="h-3 w-3" />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>

            {/* --- LOGIC ENGINE (High Impact) --- */}
            <section className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                    <Calculator className="h-4 w-4 text-indigo-600" />
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                        Forecasting Methodology
                    </h2>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {[
                        {
                            title: 'Reorder Point (ROP)',
                            formula: '(Daily Burn x Lead Time) + Safety Stock',
                            desc: 'The automated "Buy Signal." Vertex calculates this to ensure new stock arrives before your safety buffer is depleted.',
                        },
                        {
                            title: 'Daily Burn Rate',
                            formula: 'Total Units Sold (30d) / 30 Days',
                            desc: 'Calculated as a standard 30-day moving average. This provides a stable baseline by distributing historical demand equally over the period to prevent short-term spikes from distorting long-term planning.',
                        }
                    ].map((item, i) => (
                        <div key={i} className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:border-indigo-300 transition-all">
                            <div className="flex items-center gap-2 mb-3">
                                <Zap className="h-4 w-4 text-indigo-600" />
                                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">{item.title}</h3>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed mb-6">
                                {item.desc}
                            </p>
                            <div className="relative">
                                <div className="absolute -top-2.5 left-3 px-2 bg-white text-[9px] font-black text-slate-400 uppercase tracking-widest border border-slate-100 rounded-full">
                                    Logic Formula
                                </div>
                                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 font-mono text-xs font-bold text-indigo-900 flex items-center justify-center text-center shadow-inner">
                                    {item.formula}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- 2. RISK & FINANCE (Balanced & Readable) --- */}
            <div className="grid gap-8 lg:grid-cols-2 items-start pt-4">

                {/* Health Classifications (Increased Spacing) */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                        <ShieldAlert className="h-4 w-4 text-indigo-600" />
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                            Health Classifications
                        </h2>
                    </div>

                    <div className="space-y-4"> {/* Increased spacing from space-y-2 to space-y-4 */}
                        {[
                            { label: 'Critical', border: 'border-rose-200', left: 'border-l-rose-500', bg: 'bg-rose-50/30', text: 'text-rose-900', icon: AlertTriangle, desc: 'Stock is below ROP. You are currently eroding your safety buffer. Order immediately.' },
                            { label: 'Watch', border: 'border-amber-200', left: 'border-l-amber-500', bg: 'bg-amber-50/30', text: 'text-amber-900', icon: Clock, desc: 'Stockout predicted within 14-21 days. Start preparing purchase orders with vendors.' },
                            { label: 'Healthy', border: 'border-emerald-200', left: 'border-l-emerald-500', bg: 'bg-emerald-50/30', text: 'text-emerald-900', icon: CheckCircle2, desc: 'Inventory levels are optimal. Current stock covers demand and lead-time requirements.' }
                        ].map((s, i) => (
                            <div key={i} className={cn(
                                "flex items-center gap-5 p-4 rounded-xl border transition-all shadow-sm",
                                s.bg, s.border, "border-l-4", s.left
                            )}>
                                {/* All icons are now Indigo (Purple) for brand consistency */}
                                <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 shrink-0">
                                    <s.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className={cn("text-[11px] font-black uppercase tracking-[0.2em]", s.text)}>{s.label}</p>
                                    <p className="text-sm font-medium text-slate-700 leading-snug mt-1">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Asset Intelligence (Bigger Fonts) */}
                <section className="space-y-6">
                    <div className="flex items-center gap-2 px-1">
                        <DollarSign className="h-4 w-4 text-indigo-600" />
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                            Asset Intelligence
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm divide-y divide-slate-100 h-full">
                        <div className="pb-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                    <TrendingUp className="h-4 w-4" />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Working Capital</h4>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed pl-11">
                                Vertex monitors your <strong>Liquidity</strong>. High-value furniture assets with low burn rates are flagged as &quot;Capital Traps,&quot; suggesting a need for clearance pricing to free up cash.
                            </p>
                        </div>

                        <div className="pt-8 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
                                    <DollarSign className="h-4 w-4" />
                                </div>
                                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Margin Protection</h4>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed pl-11">
                                Items with <span className="text-indigo-600 font-bold">Gross Margins &gt; 30%</span> are prioritized in restock recommendations to maximize your return on every warehouse slot.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}