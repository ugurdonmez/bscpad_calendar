import { NextUIProvider } from '@nextui-org/react';

import '../styles/globals.css'
import 'react-big-calendar/lib/css/react-big-calendar.css'

function MyApp({ Component, pageProps }) {
  return (
    <NextUIProvider>
      <Component {...pageProps}/>
    </NextUIProvider>
  );
}


export default MyApp
