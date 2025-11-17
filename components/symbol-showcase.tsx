'use client';

import React from 'react';

type SymbolKeys = 'stars' | 'brackets' | 'hearts' | 'arrows' | 'decorative' | 'none';

interface SymbolShowcaseProps {
    symbols: Record<SymbolKeys, string[]>;
}

export default function SymbolShowcase({ symbols }: SymbolShowcaseProps) {
    return (
        <div className="bg-background/80 dark:bg-background/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-border">
            <h3 className="font-semibold text-foreground mb-4 text-right">نمادهای دسترس</h3>
            <div className="space-y-4">
                {(Object.entries(symbols) as Array<[SymbolKeys, string[]]>).map(([key, syms]) => (
                    <div key={key}>
                        <p className="text-xs font-semibold text-foreground/70 mb-2 uppercase">{key}</p>
                        <div className="flex flex-wrap gap-2">
                            {syms.map((sym, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-center w-10 h-10 bg-primary/15 dark:bg-primary/20 rounded-lg text-xl hover:bg-primary/25 dark:hover:bg-primary/35 transition-all cursor-pointer border border-border/50 dark:border-border/40"
                                >
                                    {sym || '∅'}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
