import { Provider } from '@/components/ui/provider'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './components/AuthProvider'
import App from './App'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <App />
          {/* React Query Devtools (only in development) */}
          {
            // eslint-disable-next-line no-undef
            process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />
          }
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  </Provider>,
)
