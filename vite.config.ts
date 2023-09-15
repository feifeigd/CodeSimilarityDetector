import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import electron from "vite-plugin-electron";

// https://vitejs.dev/config/
export default defineConfig({
  // base: path.resolve(__dirname, "./dist/"),
  base: "./",
  plugins: [
    // 编译 vue 源码
    vue(),
    // 编译 electron
    electron({
      entry: "electron/main.ts",
    })
  ],
})
