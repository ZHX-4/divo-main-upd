import React, { useEffect } from 'react';
import '../styles/globals.css';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from 'react-query';
import { store } from '../store/store';
import { ThemeProvider } from '../contexts/ThemeContext';
import { SessionProvider } from "next-auth/react"
import { useMousePosition } from '../hooks/useMousePosition'


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function MyApp({ Component, pageProps: { session, ...pageProps } }) {

  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentElement) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <ThemeProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <SessionProvider session={session}>
            <Component {...pageProps} />
          </SessionProvider>
        </QueryClientProvider>
      </Provider>
    </ThemeProvider>
  );
}

export default MyApp;