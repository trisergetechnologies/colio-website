import { Inter } from 'next/font/google'
import './globals.css'
import Aoscompo from '@/lib/utils/aos'
import ScrollToTop from './components/scroll-to-top'
import { AuthProvider } from '@/context/AuthContext'
const font = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <AuthProvider>
        <body className={`${font.className}`}>

          <Aoscompo>

            {children}

          </Aoscompo>
          <ScrollToTop />
        </body>
      </AuthProvider>
    </html> 
  )
}
