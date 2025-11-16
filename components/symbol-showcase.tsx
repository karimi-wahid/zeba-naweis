'use client';

type SymbolKeys = 'stars' | 'brackets' | 'hearts' | 'arrows' | 'decorative' | 'none';

interface SymbolShowcaseProps {
    symbols: Record<SymbolKeys, string[]>;
}

export default function SymbolShowcase({ symbols }: SymbolShowcaseProps) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/40">
            <h3 className="font-semibold text-gray-800 mb-4 text-right">نمادهای دسترس</h3>
            <div className="space-y-4">
                {(Object.entries(symbols) as Array<[SymbolKeys, string[]]>).map(([key, syms]) => (
                    <div key={key}>
                        <p className="text-xs font-semibold text-gray-600 mb-2 uppercase">{key}</p>
                        <div className="flex flex-wrap gap-2">
                            {syms.map((sym, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center justify-center w-10 h-10 bg-linear-to-br from-purple-100 to-blue-100 rounded-lg text-xl hover:from-purple-200 hover:to-blue-200 transition-all cursor-pointer"
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
