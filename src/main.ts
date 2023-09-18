import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from '@/router';

// import ElementPlus from "element-plus";
// import "element-plus/theme-chalk/index.css";

createApp(App).
    use(router).
    // use(ElementPlus).    // 完整导入很大，所以采用了自动导入 vite.config.ts 里面配置
    mount('#app');
