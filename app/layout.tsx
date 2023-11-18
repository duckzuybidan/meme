
import type { Metadata } from 'next'
import Topbar from '@/components/Nav/Topbar'
import './globals.css'
// @refresh reset
import { ModalProvider } from '@/lib/contexts/ModalContext'
import Modals from '@/components/Modal/Index'
import ReduxProvider from '@/lib/redux/ReduxProvider'
import { Toaster }  from 'react-hot-toast'



export const metadata: Metadata = {
  title: 'Meme Store',
  description: 'DuckZuybidan',
  icons: [
    { rel: 'icon', url: '/logo.svg' },
  ],
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" toastOptions={{duration: 1500}}/>
        <ReduxProvider>
        <ModalProvider>
        <Topbar/>
        <Modals/>
        <main className='mb-[100px]'>
          {children}
        </main>
        </ModalProvider>
        </ReduxProvider>
      </body>
    </html>
  )
}
