import {AppProps} from 'next/app'
import { Header } from '../components/Header'
import '../styles/global.scss' 
import { SessionProvider } from "next-auth/react" 
import { PayPalScriptProvider } from '@paypal/react-paypal-js'


const initialOptions = {
   "client-id":"AZpnP_-jllbcpBGZXVDhhwTTD9F1mlr9cSArJtL4-Zm9RK6zqzFScn2fdIIHbFELZBGTiPZuhMDlJ0iO",
    currency:"BRL",
    intent:"capture"
}

export default function App({
   Component,
    pageProps: {session, ...pageProps},
   }:AppProps) {
  return (
    <>
     <SessionProvider session={session}>
        <PayPalScriptProvider options={initialOptions}>
          <Header />
            <Component {...pageProps} />
        </PayPalScriptProvider>
      </SessionProvider>
      
    </>
  )
}
