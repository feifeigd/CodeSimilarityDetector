import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";

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
    history: createWebHistory(),
    routes,
});

export default router;
