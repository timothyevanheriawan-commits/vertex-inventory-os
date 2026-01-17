"use client";

import Logo from "@/components/Logo";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Package, TrendingUp, Settings, LogOut, User, DollarSign, HelpCircle } from "lucide-react";
import { cn } from "@/app/lib/utils";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

// 2. Update the navigation array
const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/dashboard/inventory", icon: Package },
    { name: "Sales & Demand", href: "/dashboard/sales", icon: TrendingUp },
    { name: "Financials", href: "/dashboard/financials", icon: DollarSign },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Guide", href: "/dashboard/guide", icon: HelpCircle }, 
];

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const supabase = createClient();
    const [userEmail, setUserEmail] = useState<string>("Loading...");

    useEffect(() => {
        async function getUser() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) setUserEmail(user.email || "No Email");
        }
        getUser();
    }, []);

    const handleSignOut = async () => {
        // 1. Clear the Supabase session
        await supabase.auth.signOut();

        // 2. FORCE redirect to login page
        router.replace('/');

        // 3. Optional: Refresh to ensure server cache is cleared
        router.refresh();
    };

    return (
        <div className="flex h-screen w-64 flex-col bg-[#1e1b4b] border-r border-indigo-900 fixed left-0 top-0 z-50 shadow-xl">

            {/* --- LOGO SECTION --- */}
            <div className="flex h-20 items-center px-6 border-b border-indigo-900/50">
                <Link href="/dashboard" className="flex items-center gap-3 group">
                    <div className="relative transition-transform duration-300 group-hover:-translate-y-0.5">
                        <Logo className="h-8 w-8" light={true} />
                        <div className="absolute inset-0 -z-10 blur-lg bg-indigo-400/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="flex flex-col">
                        <span className="font-bold text-lg tracking-tight text-white leading-none">
                            Vertex
                        </span>
                        <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest leading-none mt-1">
                            Inventory OS
                        </span>
                    </div>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-6">
                <div className="px-3 mb-2 text-xs font-semibold text-indigo-300/60 uppercase tracking-wider">
                    Menu
                </div>
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "group flex items-center rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                                isActive
                                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                                    : "text-indigo-200/70 hover:bg-white/5 hover:text-white"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "mr-3 h-5 w-5 shrink-0 transition-colors",
                                    isActive ? "text-white" : "text-indigo-400 group-hover:text-white"
                                )}
                            />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* User Footer */}
            <div className="border-t border-indigo-900/50 p-4 bg-[#17153b]">
                <div className="flex items-center gap-3 mb-3 px-1">
                    <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-200 border border-indigo-500/30 shadow-sm">
                        <User className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-semibold text-white truncate">Store Owner</span>
                        <span className="text-[10px] text-indigo-300 truncate font-mono opacity-80">{userEmail}</span>
                    </div>
                </div>
                <button
                    onClick={handleSignOut}
                    className="flex w-full items-center justify-center rounded-md border border-indigo-800 bg-indigo-900/50 px-3 py-1.5 text-xs font-medium text-indigo-200 hover:bg-red-900/30 hover:text-red-300 hover:border-red-900/50 transition-colors cursor-pointer"
                >
                    <LogOut className="mr-2 h-3 w-3" />
                    Sign Out
                </button>
            </div>
        </div>
    );
}