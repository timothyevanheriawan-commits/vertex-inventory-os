'use client'

import * as React from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { cn } from '@/app/lib/utils'

export function TooltipProvider({ children }: { children: React.ReactNode }) {
    return <TooltipPrimitive.Provider delayDuration={200}>{children}</TooltipPrimitive.Provider>
}

export function Tooltip({ children, content }: { children: React.ReactNode, content: string }) {
    return (
        <TooltipPrimitive.Root>
            <TooltipPrimitive.Trigger asChild>
                {children}
            </TooltipPrimitive.Trigger>
            <TooltipPrimitive.Portal>
                <TooltipPrimitive.Content
                    sideOffset={5}
                    className={cn(
                        "z-110 overflow-hidden rounded-lg bg-[#1e1b4b] px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-indigo-100 shadow-xl animate-in fade-in zoom-in-95 duration-200 border border-indigo-500/30 max-w-50"
                    )}
                >
                    {content}
                    <TooltipPrimitive.Arrow className="fill-[#1e1b4b]" />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        </TooltipPrimitive.Root>
    )
}