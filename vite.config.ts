import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import electron from "vite-plugin-electron";
import AutoImport from "unplugin-auto-import/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import ElementPlus from "unplugin-element-plus/vite";

// https://vitejs.dev/config/
export default defineConfig({
  // base: path.resolve(__dirname, "./dist/"),
  base: "./",
  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),

    Components({
      resolvers: [ElementPlusResolver()],
    }),

    // 编译 electron, 每个 entry 编译成一个 js
    electron([{
      entry: "electron/main.ts",  // 主进程
    },{
      entry: "electron/preload.ts", // 预载脚本
    }]),

    // 自动导入 element-plus 插件
    ElementPlus({

    }),

    // 编译 vue 源码
    vue(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    }
  }
});

