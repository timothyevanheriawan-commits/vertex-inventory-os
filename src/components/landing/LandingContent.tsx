'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
    TrendingUp,
    Activity,
    Sliders,
    AlertTriangle,
    Brain,
    ArrowRight,
    CheckCircle,
    Upload,
    BarChart3,
    Target,
    ChevronDown,
    Package,
    Zap,
    Shield,
    Clock,
    Menu,
    X,
    Database,
    RefreshCw,
    Lock,
    Layers,
} from 'lucide-react'
import Logo from '@/components/Logo'
import { Variants } from 'framer-motion' // Add this import

// ============================================
// ANIMATION VARIANTS
// ============================================
// Animation Variants with explicit Typing
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
}

const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
}

const scaleIn: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 0.5, ease: 'easeOut' }
    }
}

// ============================================
// NAVBAR COMPONENT
// ============================================
function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2.5 group">
                        <Logo className="h-7 w-7 transition-transform group-hover:-translate-y-0.5" />
                        <div className="flex flex-col">
                            <span className="font-bold text-base tracking-tight text-slate-900 leading-none">
                                Vertex
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                                Inventory OS
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        {['Features', 'How It Works', 'FAQ'].map((item) => (
                            <Link
                                key={item}
                                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-xs font-bold text-slate-500 uppercase tracking-wider hover:text-indigo-600 transition-colors duration-200"
                            >
                                {item}
                            </Link>
                        ))}
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="/login"
                            className="text-xs font-bold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors px-3 py-2"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white uppercase tracking-wider shadow-sm hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
                        >
                            Get Started
                            <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden p-2 text-slate-600 hover:text-slate-900 transition-colors"
                    >
                        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-slate-100 py-4"
                    >
                        <div className="flex flex-col gap-3">
                            {['Features', 'How It Works', 'Pricing', 'FAQ'].map((item) => (
                                <Link
                                    key={item}
                                    href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
                                    className="text-sm font-medium text-slate-600 py-2"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {item}
                                </Link>
                            ))}
                            <hr className="border-slate-100 my-2" />
                            <Link href="/login" className="text-sm font-medium text-slate-600 py-2">
                                Sign In
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white"
                            >
                                Get Started Free
                            </Link>
                        </div>
                    </motion.div>
                )}
            </div>
        </nav>
    )
}

// ============================================
// HERO SECTION
// ============================================
function HeroSection() {
    return (
        <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-linear-to-b from-slate-50 to-white" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-150 bg-indigo-100/40 rounded-full blur-3xl" />
            </div>

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Left: Content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            variants={fadeInUp}
                            className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 mb-6"
                        >
                            <Zap className="h-3.5 w-3.5 text-indigo-600" />
                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">
                                Predictive Intelligence
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            variants={fadeInUp}
                            className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-[1.1] normal-case"
                        >
                            Inventory Management,{' '}
                            <span className="text-indigo-600">Powered by Data.</span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            variants={fadeInUp}
                            className="mt-6 text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0"
                        >
                            Stop guessing your stock levels. Vertex combines real-time tracking
                            with &quot;What-If&quot; demand forecasting to ensure you never miss a sale
                            or over-order again.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                            variants={fadeInUp}
                            className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center lg:justify-start"
                        >
                            <Link
                                href="/login"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white uppercase tracking-wide shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all duration-200"
                            >
                                Launch Dashboard
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            variants={fadeInUp}
                            className="mt-8 flex items-center gap-5 justify-center lg:justify-start"
                        >
                            {[
                                { icon: CheckCircle, text: 'Free 14-day trial' },
                                { icon: Lock, text: 'No credit card' },
                                { icon: Clock, text: '5-min setup' }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <item.icon className="h-3.5 w-3.5 text-emerald-500" />
                                    <span className="font-medium">{item.text}</span>
                                </div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Right: Dashboard Preview */}
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                        className="relative"
                    >
                        {/* Glow */}
                        <div className="absolute -inset-4 bg-linear-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-2xl" />

                        {/* Dashboard Card */}
                        <div className="relative rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 overflow-hidden">
                            {/* Browser Chrome */}
                            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 bg-slate-50">
                                <div className="flex gap-1.5">
                                    <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                                </div>
                                <div className="flex-1 mx-4">
                                    <div className="h-5 w-40 mx-auto rounded bg-slate-100 flex items-center justify-center">
                                        <span className="text-[10px] text-slate-500 font-mono">vertex.app/dashboard</span>
                                    </div>
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-5 space-y-4 bg-slate-50/50">
                                {/* KPI Row */}
                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { label: 'Items at Risk', value: '3', color: 'text-rose-600', icon: AlertTriangle, iconColor: 'text-rose-500' },
                                        { label: 'Sell-Through', value: '24.3%', color: 'text-slate-900', icon: RefreshCw, iconColor: 'text-indigo-500' },
                                        { label: 'Avg. Runway', value: '18d', color: 'text-slate-900', icon: Activity, iconColor: 'text-emerald-500' },
                                    ].map((stat, i) => (
                                        <div key={i} className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.label}</p>
                                                <stat.icon className={`h-3.5 w-3.5 ${stat.iconColor}`} />
                                            </div>
                                            <p className={`text-xl font-mono font-bold ${stat.color}`}>{stat.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Chart */}
                                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">14-Day Demand</span>
                                        <span className="text-[10px] text-slate-500 font-mono">Live</span>
                                    </div>
                                    <div className="flex items-end gap-1 h-16">
                                        {[40, 65, 45, 80, 55, 70, 90, 60, 75, 85, 70, 95, 80, 100].map((h, i) => (
                                            <div
                                                key={i}
                                                className="flex-1 bg-indigo-500 rounded-t hover:bg-indigo-600 transition-colors"
                                                style={{ height: `${h}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Alert */}
                                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 flex items-center gap-3">
                                    <div className="rounded-lg bg-amber-100 p-1.5">
                                        <AlertTriangle className="h-3.5 w-3.5 text-amber-700" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-amber-900">Widget Pro Max</p>
                                        <p className="text-[10px] text-amber-700">Stockout in 5 days</p>
                                    </div>
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-1 rounded-full border border-amber-200 uppercase tracking-wide">
                                        Restock
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Floating Cards */}
                        <motion.div
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                            className="absolute -right-3 top-1/4 rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg"
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-medium">Revenue Impact</p>
                                    <p className="text-xs font-mono font-bold text-emerald-600">+$12,450</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 5, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                            className="absolute -left-3 bottom-1/4 rounded-xl border border-slate-200 bg-white p-2.5 shadow-lg"
                        >
                            <div className="flex items-center gap-2">
                                <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                                    <Brain className="h-3.5 w-3.5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-medium">Smart Insight</p>
                                    <p className="text-xs font-medium text-slate-700">3 actions ready</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

// ============================================
// PROBLEM/SOLUTION SECTION
// ============================================
function ProblemSolutionSection() {
    const problems = [
        {
            icon: Target,
            title: 'Eliminate Stockouts',
            description: 'Our "Runway" logic calculates exactly how many days of stock remain based on real sales velocity.',
            color: 'bg-rose-50 text-rose-600 border-rose-100'
        },
        {
            icon: Package,
            title: 'Stop Overstocking',
            description: 'Identify "Dead Stock" instantly and optimize warehouse space for items that actually move.',
            color: 'bg-amber-50 text-amber-700 border-amber-100'
        },
        {
            icon: RefreshCw,
            title: 'Real-Time Sync',
            description: 'Powered by Supabase, your team sees updates the second a sale is recorded. No more refreshing.',
            color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
        }
    ]

    return (
        <section className="py-20 bg-white border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="text-center max-w-2xl mx-auto mb-12"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 mb-4">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            Built for Operators
                        </span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                        Not Another Spreadsheet.
                    </h2>
                    <p className="mt-4 text-slate-600">
                        Purpose-built for businesses that need actionable intelligence, not just data.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-6"
                >
                    {problems.map((item, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            whileHover={{ y: -5 }}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <div className={`inline-flex rounded-xl p-3 border ${item.color} mb-4`}>
                                <item.icon className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold tracking-tight text-slate-900 mb-2">
                                {item.title}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

// ============================================
// FEATURES SECTION
// ============================================
function FeaturesSection() {
    const features = [
        {
            icon: Sliders,
            title: 'What-If Simulation',
            description: 'Model demand surges or seasonal cooling. Watch your stock runways recalculate in real-time.',
            color: 'bg-indigo-50 text-indigo-600'
        },
        {
            icon: Brain,
            title: 'Automated Insights',
            description: 'Narrative intelligence that tells you exactly what to restock and when—no analysis required.',
            color: 'bg-emerald-50 text-emerald-600'
        },
        {
            icon: AlertTriangle,
            title: 'Dead Stock Detection',
            description: 'Identify capital traps before they hurt cash flow. Turn slow movers into smart decisions.',
            color: 'bg-amber-50 text-amber-700'
        },
        {
            icon: TrendingUp,
            title: 'Demand Forecasting',
            description: 'Predict future demand based on historical patterns. Stay ahead of market shifts.',
            color: 'bg-purple-50 text-purple-600'
        },
        {
            icon: Target,
            title: 'Reorder Points',
            description: 'Calculated thresholds based on actual sell-through velocity—not arbitrary numbers.',
            color: 'bg-rose-50 text-rose-600'
        },
        {
            icon: BarChart3,
            title: 'Decision-Grade KPIs',
            description: 'Sell-through rate, days of inventory, runway calculations—all updating in real-time.',
            color: 'bg-cyan-50 text-cyan-600'
        }
    ]

    return (
        <section id="features" className="py-20 bg-slate-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="text-center max-w-2xl mx-auto mb-12"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 mb-4">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">
                            Features
                        </span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                        Everything You Need
                    </h2>
                    <p className="mt-4 text-slate-600">
                        Built for operators who need answers, not just data. Every feature drives action.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            whileHover={{ y: -3 }}
                            className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all duration-200"
                        >
                            <div className={`inline-flex rounded-xl p-3 ${feature.color} mb-4`}>
                                <feature.icon className="h-5 w-5" />
                            </div>
                            <h3 className="text-sm font-bold tracking-tight text-slate-900 mb-2 uppercase">
                                {feature.title}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

// ============================================
// HOW IT WORKS SECTION
// ============================================
function HowItWorksSection() {
    const steps = [
        {
            step: '01',
            icon: Upload,
            title: 'Ingest Assets',
            description: 'Sync your catalog via high-speed CSV import. We enforce SKU integrity automatically.'
        },
        {
            step: '02',
            icon: BarChart3,
            title: 'Analyze Demand',
            description: 'Our engine calculates burn rates and safety buffers using EWMA logic.'
        },
        {
            step: '03',
            icon: Target,
            title: 'Optimize Stock',
            description: 'Follow the reorder triggers to maintain 100% availability with 0% waste.'
        }
    ]

    return (
        <section id="how-it-works" className="py-16 bg-white border-b border-slate-100 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Header Animation */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="text-center max-w-2xl mx-auto mb-20"
                >
                    <span className="inline-flex items-center justify-center font-black uppercase tracking-[0.3em] text-[10px] text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                        Methodology
                    </span>
                    <h2 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase">
                        Precision in 3 Stages
                    </h2>
                </motion.div>

                {/* Steps Container with Stagger Logic */}
                <motion.div
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-3 gap-12 relative"
                >
                    {/* Connecting Line - Animates width for a "drawing" effect */}
                    <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: '66%' }}
                        transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
                        className="hidden md:block absolute top-10 left-[16.6%] h-px bg-slate-100 -z-10"
                    />

                    {steps.map((item, i) => (
                        <motion.div
                            key={i}
                            variants={fadeInUp}
                            className="flex flex-col items-center text-center group"
                        >
                            {/* Animated Icon Box */}
                            <motion.div
                                whileHover={{ scale: 1.05, y: -5 }}
                                className="h-20 w-20 rounded-2xl bg-white border-2 border-slate-100 flex items-center justify-center relative shadow-sm group-hover:border-indigo-500 group-hover:shadow-xl group-hover:shadow-indigo-500/10 transition-all duration-300"
                            >
                                <item.icon className="h-8 w-8 text-slate-500 group-hover:text-indigo-600 transition-colors duration-300" />

                                {/* Step Badge */}
                                <span className="absolute -top-3 -right-3 h-8 w-8 rounded-lg bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-xs shadow-lg shadow-indigo-200 group-hover:rotate-12 transition-transform">
                                    {item.step}
                                </span>
                            </motion.div>

                            <h3 className="mt-8 text-sm font-black text-slate-900 uppercase tracking-widest leading-none">
                                {item.title}
                            </h3>
                            <p className="mt-3 text-[11px] font-medium text-slate-500 leading-relaxed max-w-[220px] mx-auto">
                                {item.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

// ============================================
// STATS SECTION
// ============================================
function StatsSection() {
    const stats = [
        { value: '40%', label: 'Fewer stockouts', icon: Shield },
        { value: '3hrs', label: 'Saved weekly', icon: Clock },
        { value: '25%', label: 'Better sell-through', icon: TrendingUp },
        { value: '$50K', label: 'Avg. Year 1 savings', icon: Target }
    ]

    return (
        <section className="py-16 bg-slate-900">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="text-center p-6 rounded-xl bg-slate-800/50 border border-slate-700"
                        >
                            <div className="inline-flex rounded-xl bg-indigo-500/20 p-2.5 mb-3">
                                <stat.icon className="h-5 w-5 text-indigo-400" />
                            </div>
                            <p className="text-3xl font-mono font-bold text-white tracking-tight">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-xs text-slate-400 font-medium uppercase tracking-wider">
                                {stat.label}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

// ============================================
// TECH STACK SECTION
// ============================================
function TechStackSection() {
    const techs = [
        {
            icon: Zap,
            title: 'Next.js 15',
            description: 'Lightning-fast page transitions and SEO-optimized architecture.',
            color: 'bg-slate-900 text-white'
        },
        {
            icon: Database,
            title: 'Supabase',
            description: 'Real-time database with encrypted authentication and instant sync.',
            color: 'bg-emerald-600 text-white'
        },
        {
            icon: Layers,
            title: 'Data Portability',
            description: 'Your data belongs to you. Export to CSV anytime with one click.',
            color: 'bg-indigo-600 text-white'
        }
    ]

    return (
        <section className="py-20 bg-slate-50 border-y border-slate-100">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="text-center max-w-2xl mx-auto mb-12"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 mb-4">
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
                            Infrastructure
                        </span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                        Enterprise-Grade Stack
                    </h2>
                    <p className="mt-4 text-slate-600">
                        Built on the modern web for speed, security, and reliability.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="grid md:grid-cols-3 gap-6"
                >
                    {techs.map((tech, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            whileHover={{ y: -3 }}
                            className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <div className={`inline-flex rounded-xl p-3 ${tech.color} mb-4`}>
                                <tech.icon className="h-5 w-5" />
                            </div>
                            <h3 className="text-base font-bold tracking-tight text-slate-900 mb-2">
                                {tech.title}
                            </h3>
                            <p className="text-sm text-slate-600 leading-relaxed">
                                {tech.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

// ============================================
// FAQ SECTION
// ============================================
function FAQSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: 'How long does setup take?',
            answer: 'Most users are operational in under 5 minutes. Upload a CSV and our system immediately calculates insights.'
        },
        {
            question: 'What data do I need?',
            answer: 'Product names/SKUs, current stock levels, and historical sales. More history = more accurate forecasting.'
        },
        {
            question: 'How accurate is forecasting?',
            answer: 'Our 30-day moving average with trend analysis achieves 85-90% accuracy on reorder timing predictions.'
        },
        {
            question: 'Is my data secure?',
            answer: 'Bank-grade encryption (AES-256) at rest, TLS 1.3 in transit. Your data is never shared or sold.'
        }
    ]

    return (
        <section id="faq" className="py-20 bg-white">
            <div className="max-w-3xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="text-center mb-12"
                >
                    <span className="inline-flex items-center gap-2 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 mb-4">
                        <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-widest">
                            FAQ
                        </span>
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                        Questions & Answers
                    </h2>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={staggerContainer}
                    className="space-y-3"
                >
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            variants={fadeInUp}
                            className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors duration-200"
                            >
                                <span className="text-sm font-bold text-slate-900 pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown className={`h-4 w-4 text-slate-500 shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} />
                            </button>
                            <motion.div
                                initial={false}
                                animate={{
                                    height: openIndex === index ? 'auto' : 0,
                                    opacity: openIndex === index ? 1 : 0
                                }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden"
                            >
                                <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </motion.div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}

// ============================================
// CTA SECTION
// ============================================
function CTASection() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="max-w-4xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    variants={scaleIn}
                    className="relative rounded-2xl bg-linear-to-br from-indigo-600 to-indigo-700 p-10 lg:p-14 text-center overflow-hidden"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-3xl" />
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                            Ready to Take Control?
                        </h2>
                        <p className="mt-3 text-base text-indigo-100 max-w-xl mx-auto">
                            Join businesses using Vertex to scale operations. No credit card required.
                        </p>
                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <Link
                                href="/login"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-indigo-600 uppercase tracking-wide shadow-lg hover:bg-indigo-50 transition-all duration-200"
                            >
                                Create Free Account
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                            <Link
                                href="#features"
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-indigo-400 px-6 py-3 text-sm font-bold text-white uppercase tracking-wide hover:bg-indigo-500 transition-all duration-200"
                            >
                                Learn More
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}

// ============================================
// FOOTER
// ============================================
function Footer() {
    const footerLinks = {
        product: ['Changelog', 'Roadmap', 'API Reference'],
        company: ['About', 'Privacy Policy', 'Terms of Service'],
        support: ['Help Center', 'Contact Us', 'System Status']
    }

    return (
        <footer className="bg-slate-900 py-12">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="grid md:grid-cols-5 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-white">
                                <Logo className="h-7 w-7 transition-transform group-hover:-translate-y-0.5" />
                            </div>
                            <span className="font-bold text-base tracking-tight text-white">
                                Vertex
                            </span>
                        </Link>
                        <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                            The inventory intelligence OS for modern retailers. Stop guessing, start forecasting.
                        </p>
                    </div>

                    {/* Links */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                                {category}
                            </h4>
                            <ul className="space-y-2">
                                {links.map((link) => (
                                    <li key={link}>
                                        <Link href="#" className="text-sm text-slate-400 hover:text-white transition-colors duration-200">
                                            {link}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-slate-400">
                        © {new Date().getFullYear()} Vertex OS. Built for efficiency.
                    </p>
                    <div className="flex items-center gap-4">
                        {['twitter', 'github', 'linkedin'].map((social) => (
                            <Link
                                key={social}
                                href="#"
                                className="text-slate-400 hover:text-white transition-colors duration-200"
                            >
                                <span className="sr-only">{social}</span>
                                <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors">
                                    {social === 'twitter' && (
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                        </svg>
                                    )}
                                    {social === 'github' && (
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                    {social === 'linkedin' && (
                                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default function LandingContent() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <HeroSection />
            <ProblemSolutionSection />
            <FeaturesSection />
            <HowItWorksSection />
            <StatsSection />
            <TechStackSection />
            <FAQSection />
            <CTASection />
            <Footer />
        </main>
    )
}