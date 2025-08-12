import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    // -------- OPTION 2: Disable auto-open completely --------
    open: false, 

    // -------- OPTION 3: Force Chrome to open at /login --------
    // open: {
    //   app: {
    //     name: 'chrome', // change to 'firefox' if needed
    //     arguments: ['/login']
    //   }
    // }
  }
})
