'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Trash2, Search, Calendar } from 'lucide-react';

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
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'alphabetical'>('recent');

    const filteredFavorites = useMemo(() => {
        let filtered = favorites.filter(fav =>
            fav.text.toLowerCase().includes(searchQuery.toLowerCase())
        );

        switch (sortBy) {
            case 'oldest':
                return filtered.sort((a, b) => a.timestamp - b.timestamp);
            case 'alphabetical':
                return filtered.sort((a, b) => a.text.localeCompare(b.text, 'fa-IR'));
            case 'recent':
            default:
                return filtered.sort((a, b) => b.timestamp - a.timestamp);
        }
    }, [favorites, searchQuery, sortBy]);

    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInHours = (now.getTime() - timestamp) / (1000 * 60 * 60);

        if (diffInHours < 1) return 'الآن';
        if (diffInHours < 24) return `${Math.floor(diffInHours)} ساعت پیش`;

        const diffInDays = Math.floor((now.getTime() - timestamp) / (1000 * 60 * 60 * 24));
        if (diffInDays < 7) return `${diffInDays} روز پیش`;

        return date.toLocaleDateString('fa-IR');
    };

    if (favorites.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-5xl mb-4">❤️</div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">علاقه‌مندی‌های شما اینجا ظاهر می‌شوند</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">نام‌های دوست‌داشتنی را برای دسترسی سریع ذخیره کنید</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Search and Filter Controls */}
            <div className="flex flex-col gap-3">
                <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="جستجو در علاقه‌مندی‌ها..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:border-red-500 outline-none text-right"
                    />
                </div>

                <div className="flex gap-2 flex-wrap">
                    <button
                        onClick={() => setSortBy('recent')}
                        className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all ${sortBy === 'recent'
                            ? 'bg-red-600 dark:bg-red-700 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        جدیدترین
                    </button>
                    <button
                        onClick={() => setSortBy('oldest')}
                        className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all ${sortBy === 'oldest'
                            ? 'bg-red-600 dark:bg-red-700 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        قدیمی‌ترین
                    </button>
                    <button
                        onClick={() => setSortBy('alphabetical')}
                        className={`px-3 py-1.5 text-sm rounded-full font-medium transition-all ${sortBy === 'alphabetical'
                            ? 'bg-red-600 dark:bg-red-700 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                            }`}
                    >
                        الفبایی
                    </button>
                </div>

                {searchQuery && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        {filteredFavorites.length} نتیجه یافت شد
                    </div>
                )}
            </div>

            {/* Filtered Results */}
            {filteredFavorites.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">نتیجه‌ای یافت نشد</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredFavorites.map((fav) => (
                        <div
                            key={fav.id}
                            className="flex items-center justify-between gap-3 bg-linear-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 hover:border-red-300 dark:hover:border-red-700 transition-all group"
                        >
                            <div className="flex-1">
                                <p className={`text-xl font-bold text-red-700 dark:text-red-400 text-right ${fontClass}`}>{fav.text}</p>
                                <div className="flex items-center justify-end gap-2 mt-1">
                                    <Calendar className="w-3.5 h-3.5 text-red-600 dark:text-red-500" />
                                    <p className="text-xs text-red-600 dark:text-red-500">{formatDate(fav.timestamp)}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => onCopy(fav.text, fav.id)}
                                    className={`p-2 rounded-lg transition-all ${copiedId === fav.id
                                        ? 'bg-green-500 text-white'
                                        : 'bg-red-200 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-300 dark:hover:bg-red-800'
                                        }`}
                                    title="کپی کن"
                                >
                                    <Copy className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => onRemove(fav.id)}
                                    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                    title="حذف"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
