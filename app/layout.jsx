import { Analytics } from "@vercel/analytics/next"
import { Josefin_Sans, Inter,Nunito } from "next/font/google"
import "./globals.css"

export const metadata = {
  title: "Stream-Mikrotik | Network Monitoring Made Simple",
  description:
    "Stream-Mikrotik is a clean, modern network monitoring tool for MikroTik routers. Track traffic, streams, and performance in real time.",
  openGraph: {
    images: ["/webimages/og-image.png"],
  },
  themeColor: "#25D366",
}

const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-josefin",
  weight: ["400", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const nunito = Nunito({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
  weight: ["400", "600", "700"],
})    

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${josefinSans.variable} ${inter.variable} ${nunito.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" />
        <meta name="theme-color" content="#25D366" />
        <meta name="msapplication-TileColor" content="#25D366" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
