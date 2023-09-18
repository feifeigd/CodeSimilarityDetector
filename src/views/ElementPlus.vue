<template>
    element-plus 的一些组件示例
    <div class="flex">        
        <el-row class="md-4">
            默认图标
            <el-button type="primary">Default</el-button>
            <el-button type="success">Success</el-button>
            <el-button type="info">info</el-button>
            <el-button type="warning">warning</el-button>
            <el-button type="danger">danger</el-button>
        </el-row>
        <el-row class="md-4">
            文字图标
            <el-button plain>plain</el-button>
            <el-button type="primary" plain>Default</el-button>
            <el-button type="success" plain>Success</el-button>
            <el-button type="info" plain>info</el-button>
            <el-button type="warning" plain>warning</el-button>
            <el-button type="danger" plain>danger</el-button>
        </el-row>
        <el-row class="md-4">
            圆角按钮
            <el-button round>round</el-button>
            <el-button type="primary" round>Default</el-button>
            <el-button type="success" round>Success</el-button>
            <el-button type="info" round>info</el-button>
            <el-button type="warning" round>warning</el-button>
            <el-button type="danger" round>danger</el-button>
        </el-row>
        <el-row class="md-4">
            圆形/椭圆文字图标按钮
            <el-button :icon="Search" circle>可以没有文字</el-button>
            <el-button type="primary" :icon="Edit" circle>Default</el-button>
            <el-button type="success" :icon="Check" circle>Success</el-button>
            <el-button type="info" :icon="Message" circle>info</el-button>
            <el-button type="warning" :icon="Star" circle>warning</el-button>
            <el-button type="danger" :icon="Delete" circle>danger</el-button>
        </el-row>
    </div>
</template>

<script lang="ts" setup>
    import { Check, Delete, Edit, Message, Search, Star, } from "@element-plus/icons-vue";
</script>
