import { Inter, Dancing_Script } from 'next/font/google'
import './globals.css'
import Aoscompo from '@/lib/utils/aos'
import ScrollToTop from './components/scroll-to-top'
import { AuthProvider } from '@/context/AuthContext'
import { CallProvider } from '@/context/CallContext'
import CallManager from './components/call/CallManager'
import { ChatProvider } from '@/context/ChatContext'
const font = Inter({ subsets: ['latin'] })

export const dancingScript = Dancing_Script({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], // logo flexibility
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <AuthProvider>
        <CallProvider>
          <ChatProvider>
            <body className={`${font.className}`}>

              <Aoscompo>

                {children}
                <CallManager />

              </Aoscompo>
              <ScrollToTop />
            </body>
          </ChatProvider>
        </CallProvider>
      </AuthProvider>
    </html> 
  )
}
