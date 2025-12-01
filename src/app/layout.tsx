import { Inter } from 'next/font/google'
import './globals.css'
import Aoscompo from '@/lib/utils/aos'
import ScrollToTop from './components/scroll-to-top'
import { AuthProvider } from '@/context/AuthContext'
import { CallProvider } from '@/context/CallContext'
import CallManager from './components/call/CallManager'
const font = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <AuthProvider>
        <CallProvider>
        <body className={`${font.className}`}>

          <Aoscompo>

            {children}
            <CallManager />

          </Aoscompo>
          <ScrollToTop />
        </body>
        </CallProvider>
      </AuthProvider>
    </html> 
  )
}
