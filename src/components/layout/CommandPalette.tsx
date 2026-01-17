'use client'

import React, { useEffect, useState } from 'react'
import { Command } from 'cmdk'
import { useRouter } from 'next/navigation'
import { Search, Package, TrendingUp, DollarSign, BookOpen } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import './command-palette.css' // We will create this next

interface PaletteProduct {
    id: string
    name: string
    sku: string
    category: string | null
}

export default function CommandPalette() {
    const [open, setOpen] = useState(false)
    const [products, setProducts] = useState<PaletteProduct[]>([]) // FIXED 'any'
    const router = useRouter()
    const supabase = createClient()

    // 1. Listen for Keyboard Shortcut
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    // 2. Fetch products for search when palette opens
    useEffect(() => {
        if (open) {
            const fetchProducts = async () => {
                const { data } = await supabase
                    .from('products')
                    .select('id, name, sku, category')
                    .order('name')
                if (data) setProducts(data)
            }
            fetchProducts()
        }
    }, [open, supabase])

    const runCommand = (command: () => void) => {
        setOpen(false)
        command()
    }

    return (
        <Command.Dialog
            open={open}
            onOpenChange={setOpen}
            label="Global Command Menu"
            className="fixed inset-0 z-100 flex items-start justify-center pt-[20vh] p-4 bg-slate-900/40 backdrop-blur-sm"
        >
            <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center border-b border-slate-100 px-4">
                    <Search className="h-4 w-4 text-slate-400 mr-3" />
                    <Command.Input
                        placeholder="Search products, SKUs, or pages..."
                        className="w-full py-4 text-sm outline-none placeholder:text-slate-400 text-slate-900 font-medium"
                    />
                    <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border border-slate-200 bg-slate-50 px-1.5 font-mono text-[10px] font-medium text-slate-500 opacity-100">
                        <span className="text-xs">ESC</span>
                    </kbd>
                </div>

                <Command.List className="max-h-80 overflow-y-auto p-2 scroll-py-2">
                    <Command.Empty className="py-12 text-center text-sm text-slate-500">
                        No results found for that query.
                    </Command.Empty>

                    {/* QUICK NAVIGATION */}
                    <Command.Group heading="Navigation" className="px-2 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        <Command.Item onSelect={() => runCommand(() => router.push('/dashboard'))} className="palette-item">
                            <TrendingUp className="h-4 w-4 mr-3 text-slate-400" />
                            <span>Dashboard Overview</span>
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => router.push('/dashboard/financials'))} className="palette-item">
                            <DollarSign className="h-4 w-4 mr-3 text-slate-400" />
                            <span>Financial Intelligence</span>
                        </Command.Item>
                        <Command.Item onSelect={() => runCommand(() => router.push('/dashboard/guide'))} className="palette-item">
                            <BookOpen className="h-4 w-4 mr-3 text-slate-400" />
                            <span>System Manual</span>
                        </Command.Item>
                    </Command.Group>

                    {/* PRODUCT DRILL-DOWN */}
                    <Command.Group heading="Inventory Items" className="px-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                        {products.map((p) => (
                            <Command.Item
                                key={p.id}
                                onSelect={() => runCommand(() => router.push(`/dashboard/inventory/${p.id}`))}
                                className="palette-item"
                            >
                                <div className="h-8 w-8 rounded bg-slate-50 flex items-center justify-center mr-3 border border-slate-100">
                                    <Package className="h-4 w-4 text-indigo-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                                    <span className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-tighter">
                                        {p.sku} • {p.category || 'General'}
                                    </span>
                                </div>
                            </Command.Item>
                        ))}
                    </Command.Group>
                </Command.List>

                {/* Footer Insight */}
                <div className="bg-slate-50/80 px-4 py-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>Vertex Search Engine</span>
                    <div className="flex gap-2">
                        <span>↑↓ to navigate</span>
                        <span>↵ to select</span>
                    </div>
                </div>
            </div>
        </Command.Dialog>
    )
}