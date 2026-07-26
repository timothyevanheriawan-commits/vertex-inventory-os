import { createClient } from '@/utils/supabase/server'
import { User, Bell, Database, Shield, Mail, Copy, Cpu, CheckCircle2, ChevronRight, Settings2 } from 'lucide-react'
import DataActions from '@/components/settings/DataActions'
import { redirect } from 'next/navigation'
import { getVerifiedUser } from '@/utils/supabase/verified-user'
import SettingsForm from '@/components/settings/SettingsForm'
import Link from 'next/link'

export default async function SettingsPage() {
    const supabase = await createClient()
    const user = await getVerifiedUser()
    if (!user) redirect('/login')

    const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

    const { data: products } = await supabase
        .from('inventory_insights')
        .select('*')
        .eq('user_id', user.id)

    const maskedId = `${user.id.substring(0, 8)}...${user.id.substring(user.id.length - 4)}`

    return (
        <div className="mx-auto space-y-6 pb-12">
            {/* Header */}
            <div className="space-y-3">
                <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                    <Link href="/dashboard" className="text-slate-500 hover:text-indigo-600 transition-colors">Dashboard</Link>
                    <ChevronRight className="h-3 w-3 text-slate-300" />
                    <span className="text-slate-600">Settings</span>
                </nav>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100 shadow-sm">
                            <Settings2 className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">
                                Control Tower
                            </h1>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                SYSTEM PREFERENCES • DATA GOVERNANCE
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            {/* Operator Identity */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <User className="h-4 w-4 text-indigo-600" />
                    <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">
                        Operator Identity
                    </h2>
                </div>
                <div className="p-5 grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                            Auth Email
                        </label>
                        <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
                            <Mail className="h-4 w-4 text-slate-500" />
                            <span className="text-sm font-bold text-slate-700">{user.email}</span>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
                            System UUID
                        </label>
                        <div className="group flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5">
                            <span className="text-xs font-mono font-bold text-slate-500 tabular-nums">{maskedId}</span>
                            <button
                                title="Copy ID"
                                className="text-slate-500 hover:text-indigo-600 transition-colors"
                            >
                                <Copy className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Logic Engine */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-indigo-600" />
                        <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">
                            Intelligence Engine
                        </h2>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wide">
                        <CheckCircle2 className="h-3 w-3" />
                        Active
                    </span>
                </div>
                <div className="p-5">
                    <SettingsForm initialSettings={settings} />
                </div>
            </section>

            {/* Alert Channels */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <Bell className="h-4 w-4 text-indigo-600" />
                    <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">
                        Alert Channels
                    </h2>
                </div>
                <div className="p-5 space-y-3">
                    {[
                        { title: 'Critical Stock Alerts', desc: 'Notification when items hit critical runway.', enabled: true, channel: 'Email' },
                        { title: 'Weekly Digest', desc: 'Summary of sell-through rates every Monday.', enabled: false, channel: 'Email' }
                    ].map((alert, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-slate-200 transition-colors"
                        >
                            <div>
                                <p className="text-sm font-bold text-slate-900">{alert.title}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{alert.desc}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 uppercase tracking-wide">
                                    {alert.channel}
                                </span>
                                <button
                                    className={`h-5 w-9 rounded-full p-0.5 flex items-center transition-all ${alert.enabled
                                            ? 'bg-indigo-600 justify-end'
                                            : 'bg-slate-200 justify-start'
                                        }`}
                                >
                                    <div className="h-4 w-4 rounded-full bg-white shadow-sm" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Data Governance */}
            <section className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    <Database className="h-4 w-4 text-indigo-600" />
                    <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.15em]">
                        Data Governance
                    </h2>
                </div>
                <div className="p-5">
                    <DataActions products={products || []} />
                </div>
            </section>

            {/* Footer */}
            <footer className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] pt-4">
                <Shield className="h-3 w-3" />
                Secure Connection • Vertex OS v2.4
            </footer>
        </div>
    )
}