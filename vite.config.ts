import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";
import electron from "vite-plugin-electron";
import AutoImport from "unplugin-auto-import/vite";
import {ElementPlusResolver} from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import ElementPlus from "unplugin-element-plus/vite";
import {viteObfuscateFile} from "vite-plugin-obfuscator";

// 源码根目录
const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  // base: path.resolve(__dirname, "./dist/"),
  base: "./",
  css: {
    preprocessorOptions: {
      scss: {
        // 覆盖 element 默认样式变量
        additionalData: `@use "@/styles/element/index.scss" as *;`,
      }
    }
  },

  plugins: [
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),

    Components({
      resolvers: [ElementPlusResolver()],
    }),

    // 编译 electron, 每个 entry 编译成一个 js
    // 注释下面，将不会打开 exe，而是只启动web服务器
    // 目前 主进程只是压缩了，没有加密混淆
    electron([{
      entry: "electron/main.ts",  // 主进程
    },{
      entry: "electron/preload.ts", // 预载脚本
    }]),

    // 自动导入 element-plus 插件
    ElementPlus({
      defaultLocale: "zh-cn",
    }),

    // 加密编译出的前端js, 加密会大两倍
    // https://blog.csdn.net/qq_42135780/article/details/130647206
    viteObfuscateFile({}),

    // 编译 vue 源码
    vue(),
  ],
  resolve: {
    alias: {
      "@": pathSrc, // 组件 vue / ts 里用 "@/ooxx" 导入
    }
  }
});

