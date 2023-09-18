<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="auto" style="background-color: #646cff;">
                左侧
            </el-aside>
            <el-container>
                <el-header style="background-color: #42b983;">
                    头部
                </el-header>
                <el-main style="background-color: aqua">
                    右侧
                    <el-button>这是个按钮</el-button>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<style scoped>
.common-layout{
    display: flex;
    min-height: 97vh;
    flex: 1;
}

</style>
