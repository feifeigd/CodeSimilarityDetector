import { RouteRecordRaw, createRouter, createWebHashHistory, createWebHistory } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "home",
        component: ()=> import(`@/views/Home.vue`),
    },
    {
        path: "/element-plus",
        name: "element-plus",
        component: ()=> import(`@/views/ElementPlus.vue`),
    },
];

const router = createRouter({
    history: createWebHistory(),    // 用createWebHistory模式，router-view 显示不出来；改为 createWebHashHistory 无问题
    routes,
});

export default router;
