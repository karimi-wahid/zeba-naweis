'use client';

import { Copy, Heart } from 'lucide-react';

interface NicknamePreviewProps {
    results: string[];
    copiedId: string | null;
    onCopy: (text: string, id: string) => void;
    onAddFavorite: (text: string) => void;
    fontClass?: string;
}

export default function NicknamePreview({
    results,
    copiedId,
    onCopy,
    onAddFavorite,
    fontClass = 'font-vazirmatn',
}: NicknamePreviewProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.map((nickname, idx) => (
                <div
                    key={idx}
                    className="group relative bg-linear-to-br from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-4 hover:border-purple-400 transition-all hover:shadow-md"
                >
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <p className="text-gray-600 text-sm mb-2">نام #{idx + 1}</p>
                            <p className={`text-2xl font-bold text-purple-700 break-all text-right ${fontClass}`}>
                                {nickname}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => onCopy(nickname, `nick-${idx}`)}
                                className={`p-2 rounded-lg transition-all ${copiedId === `nick-${idx}`
                                        ? 'bg-green-500 text-white'
                                        : 'bg-purple-200 text-purple-700 hover:bg-purple-300'
                                    }`}
                                title="کپی کن"
                            >
                                <Copy className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => onAddFavorite(nickname)}
                                className="p-2 rounded-lg bg-red-200 text-red-700 hover:bg-red-300 transition-all"
                                title="علاقه‌مندی"
                            >
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
