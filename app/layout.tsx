import type { Metadata } from 'next'
import { Vazirmatn, Lalezar, IBM_Plex_Sans_Arabic, Cairo, Amiri, Source_Serif_4 as Source_Serif_Pro, Roboto, Open_Sans } from 'next/font/google'
import './globals.css'
import ThemeProvider from '../components/theme-provider'

const _vazirmatn = Vazirmatn({ subsets: ["arabic"], variable: "--font-vazirmatn" });
const _sahel = Cairo({ subsets: ["arabic"], variable: "--font-sahel", weight: ["200", "300", "400", "500", "600", "700"] });
const _samim = Amiri({ subsets: ["arabic"], variable: "--font-samim", weight: ["400", "700"] });
const _lalezar = Lalezar({ subsets: ["arabic"], variable: "--font-lalezar", weight: ["400"] });
const _tanha = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], variable: "--font-tanha", weight: ["400", "500", "600", "700"] });
const _shabnam = Cairo({ subsets: ["arabic"], variable: "--font-shabnam", weight: ["200", "300", "400", "500", "600", "700"] });
const _yekanBakh = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], variable: "--font-yekan-bakh", weight: ["400", "500", "600", "700"] });
const _iranSans = Roboto({ subsets: ["latin"], variable: "--font-iran-sans", weight: ["300", "400", "700"] });
const _iranNastaliq = Lalezar({ subsets: ["arabic"], variable: "--font-iran-nastaliq", weight: ["400"] });
const _mitra = Cairo({ subsets: ["arabic"], variable: "--font-mitra", weight: ["200", "300", "400", "500", "600", "700"] });
const _titr = Lalezar({ subsets: ["arabic"], variable: "--font-titr", weight: ["400"] });
const _roya = Amiri({ subsets: ["arabic"], variable: "--font-roya", weight: ["400", "700"] });
const _traffic = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], variable: "--font-traffic", weight: ["400", "500", "600", "700"] });
const _nassim = Cairo({ subsets: ["arabic"], variable: "--font-nassim", weight: ["200", "300", "400", "500", "600", "700"] });
const _byekan = Roboto({ subsets: ["latin"], variable: "--font-byekan", weight: ["300", "400", "700"] });
const _parastoo = Open_Sans({ subsets: ["latin"], variable: "--font-parastoo", weight: ["300", "400", "600", "700"] });
const _davat = Lalezar({ subsets: ["arabic"], variable: "--font-davat", weight: ["400"] });
const _koodak = Cairo({ subsets: ["arabic"], variable: "--font-koodak", weight: ["200", "300", "400", "500", "600", "700"] });
const _zar = Amiri({ subsets: ["arabic"], variable: "--font-zar", weight: ["400", "700"] });
const _homa = IBM_Plex_Sans_Arabic({ subsets: ["arabic"], variable: "--font-homa", weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: 'نام‌سازِ جادویی | Persian Nickname Generator',
  description: 'تولید نام‌های کاربری با سبک‌های منحصرِ به فرد',
  generator: 'v0.app',
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${_vazirmatn.variable} ${_sahel.variable} ${_samim.variable} ${_lalezar.variable} ${_tanha.variable} ${_shabnam.variable} ${_yekanBakh.variable} ${_iranSans.variable} ${_iranNastaliq.variable} ${_mitra.variable} ${_titr.variable} ${_roya.variable} ${_traffic.variable} ${_nassim.variable} ${_byekan.variable} ${_parastoo.variable} ${_davat.variable} ${_koodak.variable} ${_zar.variable} ${_homa.variable}`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
