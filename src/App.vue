
<template>
  <!-- <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div> -->
  <!-- <HelloWorld msg="Vite + Vue" /> -->

  <!-- Config Provider 被用来提供全局的配置选项，让你的配置能够在全局都能够被访问到。 -->
  <el-config-provider>    
    <div>

      <!-- <RouterLink to="/element-plus">element-plus</RouterLink> -->
      <router-view></router-view>
      
    </div>
  </el-config-provider>

</template>

<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator';

@Component
class App extends Vue{
  mounted(){
    this.$router.push("/"); // createWebHistory 路由模式，需要手动打开首页，不然 router-view 不显示任何内容
  }
}

export default toNative(App);

</script>
<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
