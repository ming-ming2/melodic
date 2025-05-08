// src/pages/_app.tsx
import type { AppProps } from 'next/app'
import '@/styles/globals.css'
import { DeviceProvider } from '@/contexts/DeviceContext'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <DeviceProvider>
      <Component {...pageProps} />
    </DeviceProvider>
  )
}
