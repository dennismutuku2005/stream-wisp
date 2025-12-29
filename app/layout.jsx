import { Analytics } from "@vercel/analytics/next"
import { Josefin_Sans, Inter } from "next/font/google"
import "./globals.css"
//want to add metadata now
export const metadata = {
  title: "BidhaaMart | Your Number One Online Plug",
  description: "Your trusted online plug for quality gadgets and essentials. Best deals, fast delivery, real plug energy.",
  openGraph: {
    images: ["/webimages/og-image.png"],
  },
  themeColor: "#e1f77e",
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

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${josefinSans.variable} ${inter.variable}`}>
      <head>
        <link rel="icon" href="/favicon.png" />
        <meta name="theme-color" content="#e1f77e" />
        <meta name="msapplication-TileColor" content="#e1f77e" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}