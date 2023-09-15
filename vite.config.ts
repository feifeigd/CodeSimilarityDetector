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
    // 编译 electron, 每个 entry 编译成一个 js
    electron([{
      entry: "electron/main.ts",  // 主进程
    },{
      entry: "electron/preload.ts", // 预载脚本
    }]),
  ],
});
