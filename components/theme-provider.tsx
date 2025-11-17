'use client'
import React, { useEffect, useState } from 'react'
import { Analytics } from '@vercel/analytics/next'

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const saved = localStorage.getItem('theme') as 'light' | 'dark' | null
        const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        const initialTheme = saved || preferred
        setTheme(initialTheme)
        document.documentElement.classList.toggle('dark', initialTheme === 'dark')
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        localStorage.setItem('theme', newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }

    if (!mounted) return <>{children}</>

    return (
        <div data-theme-provider data-theme-toggle={toggleTheme} data-theme={theme}>
            {children}
            <Analytics />
        </div>
    )
}
