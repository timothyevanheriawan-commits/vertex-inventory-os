import Sidebar from "@/components/layout/Sidebar";
import CommandPalette from "@/components/layout/CommandPalette"; // Import

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Sidebar />
            {/* 1. Add the Palette here */}
            <CommandPalette />

            <main className="pl-64 transition-all duration-300">
                <div className="mx-auto max-w-7xl px-8 py-8 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
}