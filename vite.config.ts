import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import UnoCSS from 'unocss/vite';
import presetUno from '@unocss/preset-uno';

// Vite configuration with UnoCSS for utility-first styling without any .css files
export default defineConfig({
  plugins: [
    UnoCSS({
      presets: [
        presetUno({
          dark: 'class',
        }),
      ],
      theme: {
        colors: {
          brand: {
            50: '#eef2ff',
            100: '#e0e7ff',
            200: '#c7d2fe',
            300: '#a5b4fc',
            400: '#818cf8',
            500: '#6366f1',
            600: '#4f46e5',
            700: '#4338ca',
            800: '#3730a3',
            900: '#312e81',
            950: '#1e1b4b',
          },
          emerald: {
            50: '#ecfdf5',
            500: '#10b981',
            600: '#059669',
          }
        },
      },
    }),
    react(),
  ],
});
