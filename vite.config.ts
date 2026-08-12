import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
  ],
  
  server: {
    open: true,
    port: 5173,
  },
  
  build: {
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug'],
        passes: 2,
      },
      format: {
        comments: false,
        beautify: false,
      },
      mangle: {
        toplevel: true,
      },
    } as any, // Type assertion to bypass TypeScript
    cssMinify: true,
    target: 'es2020',
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || 
                id.includes('react-dom') || 
                id.includes('scheduler')) {
              return 'react-core'
            }
            if (id.includes('react-router')) {
              return 'react-router'
            }
            if (id.includes('lodash') || 
                id.includes('moment') || 
                id.includes('d3')) {
              return 'large-deps'
            }
            return 'vendor'
          }
          
          if (id.includes('/src/pages/')) {
            return 'pages'
          }
          if (id.includes('/src/components/')) {
            return 'components'
          }
          if (id.includes('/src/hooks/')) {
            return 'hooks'
          }
        },
      },
    },
  },
  
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})