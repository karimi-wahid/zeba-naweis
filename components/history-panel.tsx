'use client';

import React from 'react';
import { Copy, Trash2, Clock } from 'lucide-react';

interface HistoryItem {
    id: string;
    text: string;
    timestamp: number;
}

interface HistoryPanelProps {
    history: HistoryItem[];
    copiedId: string | null;
    onCopy: (text: string, id: string) => void;
    onClear: () => void;
    onRemoveItem: (id: string) => void;
    fontClass?: string;
}

export default function HistoryPanel({
    history,
    copiedId,
    onCopy,
    onClear,
    onRemoveItem,
    fontClass = 'font-vazirmatn',
}: HistoryPanelProps) {

    const formatTime = (timestamp: number): string => {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'الآن';
        if (minutes < 60) return `${minutes} دقیقه پیش`;
        if (hours < 24) return `${hours} ساعت پیش`;
        if (days < 7) return `${days} روز پیش`;
        return new Date(timestamp).toLocaleDateString('fa-IR');
    };

    if (history.length === 0) {
        return (
            <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">هیستوری شما خالی است</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">نام‌هایی که تولید می‌کنید اینجا نشان داده می‌شوند</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">آخرین تولیدات</h3>
                <button
                    onClick={onClear}
                    className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                >
                    پاک کن
                </button>
            </div>
            <div className="max-h-96 overflow-y-auto space-y-2">
                {history.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between gap-3 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:border-gray-300 dark:hover:border-gray-500 transition-all"
                    >
                        <div className="flex-1">
                            <p className={`text-sm font-medium text-gray-800 dark:text-gray-200 text-right ${fontClass}`}>{item.text}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-right mt-1">{formatTime(item.timestamp)}</p>
                        </div>
                        <div className="flex gap-1">
                            <button
                                onClick={() => onCopy(item.text, item.id)}
                                className={`p-1.5 rounded transition-all text-sm ${copiedId === item.id
                                        ? 'bg-green-500 text-white'
                                        : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                    }`}
                                title="کپی کن"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => onRemoveItem(item.id)}
                                className="p-1.5 rounded bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500 transition-all"
                                title="حذف"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
