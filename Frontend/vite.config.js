import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  
  // ===== PERFORMANCE OPTIMIZATIONS =====
  build: {
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-ui': ['react-icons', 'react-hot-toast', 'react-helmet'],
          'vendor-utils': ['aos', 'slick-carousel', 'react-slick', 'browser-image-compression'],
          
          // Route chunks for better lazy loading
          'shop': ['./src/Shop/Shop.jsx', './src/Shop/SingleProductView.jsx', './src/Shop/Checkout.jsx'],
          'admin': ['./src/Admin/AdminPanel.jsx', './src/Admin/Dashboard.jsx'],
          'home': ['./src/Home/Home.jsx', './src/Home/Hero.jsx', './src/Home/PopularProduct.jsx'],
        }
      }
    },
    // Optimize chunk sizes
    chunkSizeWarningLimit: 1000,
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    },
    // Asset optimization
    assetsInlineLimit: 4096, // Inline small assets
    cssCodeSplit: true, // Split CSS into separate files
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'react-helmet',
      'react-icons',
      'react-hot-toast',
      'aos'
    ]
  }
});

