import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // ✅ Vite plugin for React
import tailwindcss from '@tailwindcss/vite'; // ✅ Tailwind plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
});
