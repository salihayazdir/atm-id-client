import '../styles/globals.css'
import Head from "next/head";
import "tailwindcss/tailwind.css";
import { AuthProvider } from '../components/Context/MemberContext'
import axios from 'axios';
import { getCookie } from 'cookies-next';
import PrivateRoute from '../components/PrivateRoute';

function MyApp({ Component, pageProps }) {
  
  axios.defaults.headers.common['authorization'] = `Bearer ${getCookie('access_token')}`;

  return (
    <>
    <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
    <AuthProvider>
      <PrivateRoute>
        <Component {...pageProps} />
      </PrivateRoute>
    </AuthProvider>
    </>
  )
}

export default MyApp
