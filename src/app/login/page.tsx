import Link from "next/link";
import Logo from "@/components/Logo";
import { login } from "./actions";
import { ArrowRight, Quote } from "lucide-react";

export default async function LoginPage({
    searchParams,
}: {
    searchParams: Promise<{ message?: string }>;
}) {
    const { message } = await searchParams;

    return (
        <div className="flex min-h-screen w-full bg-white">
            {/* LEFT: Brand / Visual Side */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative flex-col justify-between p-12 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/40 via-slate-900 to-slate-900 z-0" />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#a5b4fc 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

                {/* Logo Area */}
                <div className="relative z-10 flex items-center gap-3">
                    <Logo className="h-8 w-8" light={true} />
                    <span className="text-xl font-bold tracking-tight text-white">Vertex</span>
                </div>

                {/* Testimonial / Value Prop */}
                <div className="relative z-10 max-w-md">
                    <Quote className="h-8 w-8 text-indigo-400 mb-6 opacity-50" />
                    <blockquote className="text-2xl font-medium text-slate-200 leading-relaxed mb-6">
                        &quot;Vertex transformed our inventory from a chaotic spreadsheet into a predictable science. We cut stockouts by 40% in month one.&quot;
                    </blockquote>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-300 font-bold text-sm">
                            JD
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">James Dalton</p>
                            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">COO, RetailFlow</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="relative z-10 text-xs text-slate-400 font-medium">
                    © 2026 Vertex Intelligence OS
                </div>
            </div>

            {/* RIGHT: Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 bg-slate-50">
                <div className="w-full max-w-sm space-y-8">
                    {/* Mobile Logo (Visible only on small screens) */}
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <Logo className="h-8 w-8" />
                        <span className="text-xl font-bold tracking-tight text-slate-900">Vertex</span>
                    </div>

                    <div className="space-y-2 text-center lg:text-left">
                        <h1 className="text-3xl font-black tracking-tight text-slate-900">
                            Welcome back
                        </h1>
                        <p className="text-slate-500 text-sm">
                            Enter your credentials to access the command center.
                        </p>
                    </div>

                    {message && (
                        <div className="p-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2">
                            <span className="font-bold">Error:</span> {message}
                        </div>
                    )}

                    <form action={login} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                placeholder="name@company.com"
                                required
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">
                                    Password
                                </label>
                                <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                                    Forgot password?
                                </a>
                            </div>
                            <input
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-white text-slate-900 placeholder:text-slate-500 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                            />
                        </div>

                        <button className="group w-full h-12 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200">
                            Sign In to Workspace
                            <ArrowRight className="h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="pt-6 text-center border-t border-slate-200">
                        <p className="text-sm text-slate-500">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                                Create one now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}