import { Inter, Dancing_Script } from 'next/font/google'
import './globals.css'
import Aoscompo from '@/lib/utils/aos'
import ScrollToTop from './components/scroll-to-top'
import { AuthProvider } from '@/context/AuthContext'
import { CallProvider } from '@/context/CallContext'
import CallManager from './components/call/CallManager'
import { ChatProvider } from '@/context/ChatContext'
import Script from 'next/script'   // 👈 ADD THIS

const font = Inter({ subsets: ['latin'] })

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      
      <head>
        {/* Google Tag */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MMP5LBSGSP"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MMP5LBSGSP');
          `}
        </Script>
      </head>

      <body className={`${font.className}`}>
        <AuthProvider>
          <CallProvider>
            <ChatProvider>
              <Aoscompo>
                {children}
                <CallManager />
              </Aoscompo>
              <ScrollToTop />
            </ChatProvider>
          </CallProvider>
        </AuthProvider>
      </body>

    </html>
  )
}