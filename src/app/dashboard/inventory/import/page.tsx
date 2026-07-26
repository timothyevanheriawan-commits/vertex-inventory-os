import CSVImporter from '@/components/inventory/CSVImporter'
import Link from 'next/link'
import { ChevronRight, FileDown } from 'lucide-react'

export default function ImportPage() {
    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <nav className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest">
                <Link href="/dashboard/inventory" className="text-slate-500 hover:text-indigo-600">Inventory</Link>
                <ChevronRight className="h-3 w-3 text-slate-300" />
                <span className="text-slate-600">Bulk Import</span>
            </nav>

            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-slate-900">Data Migration</h1>
                    <p className="text-sm text-slate-500 font-medium">Upload your existing product catalog to Vertex.</p>
                </div>

                <a
                    href="/template.csv"
                    download
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 shadow-sm transition-all"
                >
                    <FileDown className="h-4 w-4" />
                    Download Template
                </a>
            </div>

            <CSVImporter />
        </div>
    )
}