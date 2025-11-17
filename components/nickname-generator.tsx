'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Download, Sparkles, Heart, RotateCcw, Zap, Clock, Undo2, Redo2 } from 'lucide-react';
import NicknamePreview from './nickname-preview';
import SymbolShowcase from './symbol-showcase';
import FavoritesList from './favorites-list';
import HistoryPanel from './history-panel';
import ThemeToggle from './theme-toggle';
import { useKeyboardShortcuts } from '@/hooks/use-keyboard-shortcuts';

type SymbolKeys = 'stars' | 'brackets' | 'hearts' | 'arrows' | 'decorative' | 'none';
type StyleKeys = 'fancy' | 'symbols' | 'mono' | 'spaced' | 'smallcaps' | 'none';
type FontKeys = 'vazirmatn' | 'sahel' | 'samim' | 'lalezar' | 'tanha' | 'shabnam' | 'yekanBakh' | 'iranSans' | 'iranNastaliq' | 'mitra' | 'titr' | 'roya' | 'traffic' | 'nassim' | 'byekan' | 'parastoo' | 'davat' | 'koodak' | 'zar' | 'homa';

interface Nickname {
    id: string;
    text: string;
    timestamp: number;
}

interface StateSnapshot {
    input: string;
    symbolSet: SymbolKeys;
    styleType: StyleKeys;
    fontType: FontKeys;
    count: number;
    results: string[];
}

export default function NicknameGenerator(): React.ReactElement {
    const [input, setInput] = useState<string>('');
    const [results, setResults] = useState<string[]>([]);
    const [symbolSet, setSymbolSet] = useState<SymbolKeys>('none');
    const [styleType, setStyleType] = useState<StyleKeys>('none');
    const [fontType, setFontType] = useState<FontKeys>('vazirmatn');
    const [count, setCount] = useState<number>(6);
    const [favorites, setFavorites] = useState<Nickname[]>([]);
    const [history, setHistory] = useState<Nickname[]>([]);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'generate' | 'favorites' | 'history'>('generate');
    const [undoStack, setUndoStack] = useState<StateSnapshot[]>([]);
    const [redoStack, setRedoStack] = useState<StateSnapshot[]>([]);

    const symbols: Record<SymbolKeys, string[]> = {
        stars: ['✦', '✧', '✩', '★', '☆', '⭐', '✪', '✫', '✬', '✭', '✮', '✯', '💫', '⋆', '✳', '✲', '❋', '❂', '❃', '❉'],
        brackets: ['『', '』', '〖', '〗', '《', '》', '【', '】', '﹙', '﹚', '⟨', '⟩', '❰', '❱', '«', '»', '‹', '›', '「', '」'],
        hearts: ['❤', '❥', '♡', '❣', '💜', '💖', '💗', '💕', '💓', '💞', '🧡', '🤍', '🤎', '🖤', '♥', '💝', '💕', '💘', '💟', '❣️'],
        arrows: ['→', '←', '↑', '↓', '⇒', '⇐', '⇑', '⇓', '➜', '➝', '➞', '➡', '⟹', '⟸', '➚', '➙', '➛', '➴', '➵', '➶'],
        decorative: ['✿', '❀', '✾', '✻', '✼', '❖', '◆', '◇', '◈', '◉', '◎', '●', '○', '◐', '◑', '❋', '✳', '✲', '❃', '❉'],
        none: ['']
    };

    const fontFamilyMap: Record<FontKeys, string> = {
        vazirmatn: 'font-vazirmatn',
        sahel: 'font-sahel',
        samim: 'font-samim',
        lalezar: 'font-lalezar',
        tanha: 'font-tanha',
        shabnam: 'font-shabnam',
        yekanBakh: 'font-yekan-bakh',
        iranSans: 'font-iran-sans',
        iranNastaliq: 'font-iran-nastaliq',
        mitra: 'font-mitra',
        titr: 'font-titr',
        roya: 'font-roya',
        traffic: 'font-traffic',
        nassim: 'font-nassim',
        byekan: 'font-byekan',
        parastoo: 'font-parastoo',
        davat: 'font-davat',
        koodak: 'font-koodak',
        zar: 'font-zar',
        homa: 'font-homa',
    };

    const fontPersianNames: Record<FontKeys, string> = {
        vazirmatn: 'وزیرمتن',
        sahel: 'ساحل',
        samim: 'سمیم',
        lalezar: 'لاله‌زار',
        tanha: 'تنها',
        shabnam: 'شبنم',
        yekanBakh: 'یکان بخ',
        iranSans: 'ایران سنس',
        iranNastaliq: 'ایران نستعلیق',
        mitra: 'میترا',
        titr: 'تیتر',
        roya: 'رویا',
        traffic: 'ترافیک',
        nassim: 'ناسیم',
        byekan: 'بی‌یکان',
        parastoo: 'پرستو',
        davat: 'دعوت',
        koodak: 'کودک',
        zar: 'زر',
        homa: 'هما',
    };

    const fancyTransforms: Array<(s: string) => string> = [
        (s: string) => `✦ ${s} ✦`,
        (s: string) => `『${s}』`,
        (s: string) => `• ${s.split('').join(' ')} •`,
        (s: string) => `${s.split('').reverse().join('')}`,
        (s: string) => `${s} ☾`,
        (s: string) => `_${s}_`,
        (s: string) => `~ ${s} ~`,
    ];

    const styles: Record<StyleKeys, (s: string) => string> = {
        fancy: (s: string) => {
            const fn = fancyTransforms[Math.floor(Math.random() * fancyTransforms.length)];
            return fn(s);
        },
        mono: (s: string) => s.split('').map(c => c + ' ').join('').trim(),
        symbols: (s: string) => {
            const sym = randomFrom(symbols[symbolSet]);
            return `${sym} ${s} ${sym}`.trim();
        },
        smallcaps: (s: string) => toSmallCaps(s),
        spaced: (s: string) => s.split('').join(' '),
        none: (s: string) => s
    };

    function randomFrom<T>(arr: T[]): T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function toSmallCaps(text: string): string {
        const map: Record<string, string> = {
            a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ', j: 'ᴊ',
            k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ',
            u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ'
        };
        return text.split('').map(ch => map[ch.toLowerCase()] || ch).join('');
    }

    function saveStateToStack(): void {
        const snapshot: StateSnapshot = { input, symbolSet, styleType, fontType, count, results };
        setUndoStack(prev => [...prev.slice(-19), snapshot]);
        setRedoStack([]);
    }

    function undo(): void {
        if (undoStack.length === 0) return;
        const currentState: StateSnapshot = { input, symbolSet, styleType, fontType, count, results };
        const previousState = undoStack[undoStack.length - 1];
        setRedoStack(prev => [...prev, currentState]);
        setUndoStack(prev => prev.slice(0, -1));
        setInput(previousState.input);
        setSymbolSet(previousState.symbolSet);
        setStyleType(previousState.styleType);
        setFontType(previousState.fontType);
        setCount(previousState.count);
        setResults(previousState.results);
    }

    function redo(): void {
        if (redoStack.length === 0) return;
        const currentState: StateSnapshot = { input, symbolSet, styleType, fontType, count, results };
        const nextState = redoStack[redoStack.length - 1];
        setUndoStack(prev => [...prev, currentState]);
        setRedoStack(prev => prev.slice(0, -1));
        setInput(nextState.input);
        setSymbolSet(nextState.symbolSet);
        setStyleType(nextState.styleType);
        setFontType(nextState.fontType);
        setCount(nextState.count);
        setResults(nextState.results);
    }

    function generateOnce(base: string): string {
        if (!base || base.trim() === '') return '';
        let s = base.trim();
        if (styleType === 'none') return s;
        if (styleType === 'symbols') return styles.symbols(s);
        if (styleType === 'mono') return styles.mono(s);
        if (styleType === 'smallcaps') return styles.smallcaps(s);
        if (styleType === 'spaced') return styles.spaced(s);
        return styles.fancy(s);
    }

    function generateMany(): void {
        saveStateToStack();
        const base = input || 'نام-برگزیده';
        const out: string[] = [];
        for (let i = 0; i < count; i++) {
            let g = generateOnce(base);
            if (symbolSet !== 'none') {
                const s = randomFrom(symbols[symbolSet]);
                if (Math.random() > 0.5) g = `${s} ${g}`;
                else g = `${g} ${s}`;
            }
            if (out.indexOf(g) === -1) out.push(g);
            else out.push(g + Math.floor(Math.random() * 9));
        }
        setResults(out);

        out.forEach(nickname => {
            const historyItem: Nickname = {
                id: `hist-${Date.now()}-${Math.random()}`,
                text: nickname,
                timestamp: Date.now()
            };
            setHistory(prev => [historyItem, ...prev.slice(0, 49)]);
        });
    }

    function copyToClipboard(text: string, id: string): void {
        navigator.clipboard.writeText(text).then(() => {
            setCopiedId(id);
            setTimeout(() => setCopiedId(null), 2000);
        });
    }

    function copyAll(): void {
        const text = results.join('\n');
        copyToClipboard(text, 'all');
    }

    function addToFavorites(text: string): void {
        const newFav: Nickname = {
            id: `fav-${Date.now()}`,
            text,
            timestamp: Date.now()
        };
        if (!favorites.find(f => f.text === text)) {
            setFavorites([newFav, ...favorites]);
        }
    }

    function removeFavorite(id: string): void {
        setFavorites(favorites.filter(f => f.id !== id));
    }

    function removeHistoryItem(id: string): void {
        setHistory(history.filter(h => h.id !== id));
    }

    function clearHistory(): void {
        setHistory([]);
    }

    function downloadTxt(): void {
        const content = results.join('\n');
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nicknames.txt';
        a.click();
        URL.revokeObjectURL(url);
    }

    const sampleNames = ['مسعود', 'عزیز', 'عابد', 'خالد', 'حامد', 'ذاهد', 'فهیم', 'صمیم', 'تمیم'];

    useKeyboardShortcuts({
        onGenerate: generateMany,
        onUndo: undo,
        onRedo: redo,
        onCopyAll: copyAll,
    });

    return (
        <div className="min-h-screen bg-linear-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-purple-900 dark:to-gray-900 p-4 md:p-8 transition-colors">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex gap-2">
                        <button
                            onClick={undo}
                            disabled={undoStack.length === 0}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            title="برگشت (Ctrl+Z)"
                        >
                            <Undo2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={redo}
                            disabled={redoStack.length === 0}
                            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            title="جلو (Ctrl+Y)"
                        >
                            <Redo2 className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="text-center flex-1">
                        <div className="flex items-center justify-center gap-2 mb-3">
                            <Sparkles className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-purple-600 via-blue-600 to-cyan-600 dark:from-purple-400 dark:via-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                                نام‌سازِ جادویی
                            </h1>
                            <Sparkles className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">تولید نام‌های کاربری با سبک‌های منحصرِ فرد</p>
                    </div>
                    <div className="flex justify-end">
                        <ThemeToggle />
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* Input & Controls */}
                    <div className="lg:col-span-2">
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/40 dark:border-gray-700/40">
                            <div className="space-y-4">
                                {/* Input */}
                                <div>
                                    <label className={`block text-sm font-semibold text-right text-gray-700 dark:text-gray-300 mb-2`}>
                                        نام پایه (فارسی)
                                    </label>
                                    <input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="مثلاً: وحید، علی..."
                                        className={`w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 outline-none transition-all text-right ${fontFamilyMap[fontType]}`}
                                    />
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">Ctrl+Enter برای تولید سریع</p>
                                </div>

                                {/* Quick Random */}
                                <div className="flex gap-2 flex-wrap">
                                    {sampleNames.map((name) => (
                                        <button
                                            key={name}
                                            onClick={() => setInput(name)}
                                            className={`px-3 py-1 text-sm bg-linear-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-purple-700 dark:text-purple-300 rounded-full hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-800 dark:hover:to-blue-800 transition-all font-medium`}
                                        >
                                            {name}
                                        </button>
                                    ))}
                                </div>

                                {/* Controls Grid */}
                                <div className="grid grid-cols-2 gap-3 text-right">
                                    {/* Symbol Dropdown */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">نماد</label>
                                        <select
                                            value={symbolSet}
                                            onChange={(e) => setSymbolSet(e.target.value as SymbolKeys)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:border-purple-500 outline-none text-sm"
                                        >
                                            <option value="none" disabled>انتخاب کن</option>
                                            <option value="stars">ستاره ✦</option>
                                            <option value="brackets">قاب 『』</option>
                                            <option value="hearts">قلب ❤</option>
                                            <option value="arrows">پیکان →</option>
                                            <option value="decorative">تزیینی ✿</option>
                                            <option value="none">بدون</option>
                                        </select>
                                    </div>

                                    {/* Style Dropdown */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">سبک</label>
                                        <select
                                            value={styleType}
                                            onChange={(e) => setStyleType(e.target.value as StyleKeys)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:border-purple-500 outline-none text-sm"
                                        >
                                            <option value="none" disabled>انتخاب کن</option>
                                            <option value="fancy">فانتزی</option>
                                            <option value="symbols">نمادی</option>
                                            <option value="mono">تک‌حروف</option>
                                            <option value="spaced">فاصله‌دار</option>
                                            <option value="none">بدون</option>
                                        </select>
                                    </div>

                                    {/* Font Dropdown */}
                                    <div className="col-span-2">
                                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">فونت</label>
                                        <select
                                            value={fontType}
                                            onChange={(e) => setFontType(e.target.value as FontKeys)}
                                            className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:border-purple-500 outline-none text-sm"
                                        >
                                            <option value="vazirmatn" disabled>انتخاب کن</option>
                                            <option value="vazirmatn">وزیرمتن</option>
                                            <option value="sahel">ساحل</option>
                                            <option value="samim">سمیم</option>
                                            <option value="lalezar">لاله‌زار</option>
                                            <option value="tanha">تنها</option>
                                            <option value="shabnam">شبنم</option>
                                            <option value="yekanBakh">یکان بخ</option>
                                            <option value="iranSans">ایران سنس</option>
                                            <option value="iranNastaliq">ایران نستعلیق</option>
                                            <option value="mitra">میترا</option>
                                            <option value="titr">تیتر</option>
                                            <option value="roya">رویا</option>
                                            <option value="traffic">ترافیک</option>
                                            <option value="nassim">ناسیم</option>
                                            <option value="byekan">بی‌یکان</option>
                                            <option value="parastoo">پرستو</option>
                                            <option value="davat">دعوت</option>
                                            <option value="koodak">کودک</option>
                                            <option value="zar">زر</option>
                                            <option value="homa">هما</option>
                                        </select>
                                    </div>

                                    {/* Count Control */}
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">تعداد</label>
                                        <input
                                            type="number"
                                            value={count}
                                            min={1}
                                            max={20}
                                            onChange={(e) => setCount(Number(e.target.value))}
                                            className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:border-purple-500 outline-none"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <button
                                        onClick={generateMany}
                                        className="flex-1 px-4 py-3 bg-linear-to-r from-purple-600 to-blue-600 dark:from-purple-700 dark:to-blue-700 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-blue-700 dark:hover:from-purple-600 dark:hover:to-blue-600 transition-all shadow-lg flex items-center justify-center gap-2"
                                    >
                                        <Zap className="w-5 h-5" />
                                        تولید کن
                                    </button>
                                    <button
                                        onClick={() => setInput('')}
                                        className="px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Symbol Showcase */}
                    <SymbolShowcase symbols={symbols} />
                </div>

                {/* Results & Favorites & History Tabs */}
                <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-white/40 dark:border-gray-700/40 ">
                    {/* Tab Navigation */}
                    <div className="flex border-b border-gray-200 dark:border-gray-700 flex-wrap flex-row-reverse">
                        <button
                            onClick={() => setActiveTab('generate')}
                            className={`px-6 py-4 font-semibold transition-all ${activeTab === 'generate'
                                ? 'bg-linear-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-purple-700 dark:text-purple-300 border-b-2 border-purple-600'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                                }`}
                        >
                            نتایج تولیدی
                        </button>
                        <button
                            onClick={() => setActiveTab('favorites')}
                            className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 ${activeTab === 'favorites'
                                ? 'bg-linear-to-r from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 text-blue-700 dark:text-blue-300 border-b-2 border-blue-600'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                                }`}
                        >
                            <Heart className="w-5 h-5" />
                            علاقه‌مندی‌ها
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-6 py-4 font-semibold transition-all flex items-center gap-2 ${activeTab === 'history'
                                ? 'bg-linear-to-r from-green-100 to-emerald-100 dark:from-green-900 dark:to-emerald-900 text-green-700 dark:text-green-300 border-b-2 border-green-600'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                                }`}
                        >
                            <Clock className="w-5 h-5" />
                            هیستوری
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {activeTab === 'generate' ? (
                            <>
                                {results.length > 0 ? (
                                    <>
                                        <NicknamePreview
                                            results={results}
                                            copiedId={copiedId}
                                            onCopy={copyToClipboard}
                                            onAddFavorite={addToFavorites}
                                            fontClass={fontFamilyMap[fontType]}
                                        />
                                        <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                            <button
                                                onClick={copyAll}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-xl font-semibold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
                                                title="Ctrl+Shift+C"
                                            >
                                                <Copy className="w-5 h-5" />
                                                کپی همه
                                            </button>
                                            <button
                                                onClick={downloadTxt}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-cyan-600 dark:bg-cyan-700 text-white rounded-xl font-semibold hover:bg-cyan-700 dark:hover:bg-cyan-600 transition-all"
                                            >
                                                <Download className="w-5 h-5" />
                                                دانلود
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-12">
                                        <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-500 dark:text-gray-400 text-lg">نام خود را وارد کنید و کلیک کنید</p>
                                    </div>
                                )}
                            </>
                        ) : activeTab === 'favorites' ? (
                            <FavoritesList
                                favorites={favorites}
                                copiedId={copiedId}
                                onCopy={copyToClipboard}
                                onRemove={removeFavorite}
                                fontClass={fontFamilyMap[fontType]}
                            />
                        ) : (
                            <HistoryPanel
                                history={history}
                                copiedId={copiedId}
                                onCopy={copyToClipboard}
                                onClear={clearHistory}
                                onRemoveItem={removeHistoryItem}
                                fontClass={fontFamilyMap[fontType]}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
