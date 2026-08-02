// frontend-company/src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './AppRoutes';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { Toaster } from 'sonner';
import { ThemeProvider } from './context/ThemeContext';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ThemeProvider>
          <ErrorBoundary>
            <AppRoutes />
            <Toaster
              position="top-right"
              richColors
              closeButton
              expand={false}
              duration={4000}
              visibleToasts={5}
              toastOptions={{
                style: {
                  background: 'var(--bg)',
                  color: 'var(--text-h)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                },
                className: 'font-sans',
              }}
            />
          </ErrorBoundary>
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;