'use client';

import { Copy, Trash2 } from 'lucide-react';

interface Nickname {
    id: string;
    text: string;
    timestamp: number;
}

interface FavoritesListProps {
    favorites: Nickname[];
    copiedId: string | null;
    onCopy: (text: string, id: string) => void;
    onRemove: (id: string) => void;
    fontClass?: string;
}

export default function FavoritesList({
    favorites,
    copiedId,
    onCopy,
    onRemove,
    fontClass = 'font-vazirmatn',
}: FavoritesListProps) {
    if (favorites.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-5xl mb-4">❤️</div>
                <p className="text-gray-500 text-lg">علاقه‌مندی‌های شما اینجا ظاهر می‌شوند</p>
                <p className="text-gray-400 text-sm mt-2">نام‌های دوست‌داشتنی را برای دسترسی سریع ذخیره کنید</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {favorites.map((fav) => (
                <div
                    key={fav.id}
                    className="flex items-center justify-between gap-3 bg-linear-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 hover:border-red-300 transition-all"
                >
                    <p className={`text-xl font-bold text-red-700 flex-1 text-right ${fontClass}`}>{fav.text}</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onCopy(fav.text, fav.id)}
                            className={`p-2 rounded-lg transition-all ${copiedId === fav.id
                                ? 'bg-green-500 text-white'
                                : 'bg-red-200 text-red-700 hover:bg-red-300'
                                }`}
                            title="کپی کن"
                        >
                            <Copy className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => onRemove(fav.id)}
                            className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-all"
                            title="حذف"
                        >
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
