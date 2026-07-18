// frontend-company/src/App.tsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import { AppRoutes } from './AppRoutes';
import { ErrorBoundary } from './components/common/ErrorBoundary';
// ✅ Import Toaster from sonner
import { Toaster } from 'sonner';
import './styles/globals.css';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
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
                background: 'white',
                color: '#1a1a1a',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
              },
              className: 'font-sans',
            }}
          />
        </ErrorBoundary>
      </BrowserRouter>
    </Provider>
  );
};

export default App;