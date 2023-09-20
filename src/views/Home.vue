<template>
    <div>
        <el-row class="avatar basic">
            <el-col :span="12">
                <div class="sub-title">源文件夹</div>
                <div class="basic--circle" @click="onclick('src')">
                    <div class="block">
                        <el-avatar :size="50" :src="circleUrl" />
                    </div>
                </div>
                <div>
                    文件夹路径：{{ srcDir || "请点击图标选择" }}
                </div>

                <!-- 无限滚动 -->
                <ul class="infinite-list" style="overflow: auto;">
                    <li v-for="info in srcFiles" :key="info.path" class="infinite-list-item">{{ info.hash }}|{{ info.path }}</li>
                </ul>

            </el-col>

            <el-col :span="12">
                <div class="sub-title">目标文件夹</div>
                <div class="basic--square" @click="onclick('dst')">
                    <div class="block">
                        <el-avatar shape="square" :size="50" :src="squareUrl" />
                    </div>
                </div>
                <div>
                    文件夹路径：{{ dstDir || "请点击图标选择"}}
                </div>
            </el-col>
        </el-row>
        <!-- <el-row>
            第二行
        </el-row>
        <el-row>
            第三行
        </el-row> -->
    </div>
</template>



<script lang="ts">
import { Component, Vue, toNative } from 'vue-facing-decorator';

interface FileInfo{
    hash: string
    path: string
}

@Component
class Home extends Vue{
    circleUrl = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png' as const;
    squareUrl = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png' as const;
    sizeList = ['small', '', 'large'] as const;

    srcDir = ""
    dstDir = ""
    srcFiles:FileInfo[] = []
    dstFiles:FileInfo[] = []
    // count = 3;

    async onclick(tpe: string){
        const { canceled, filePaths} = await window.ipc.open_dir(tpe);
        if(!canceled){
            if(tpe == "src"){
                this.srcDir = filePaths[0];
                this.srcFiles = [];
            }
            else if(tpe == "dst"){
                this.dstDir = filePaths[0];
                this.dstFiles = [];
            }
        }
    }

    load(){
        // this.count += 3;
    }
}

export default toNative(Home);

</script>

<style scoped>

.basic{
    text-align: center;
}
.basic .sub-title{
    margin-bottom: 10px;
    font-size: 14px;
    color: var(--el-text-color-secondary);
}

.basic .basic--circle,
.basic .basic--square{
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.basic .block:not(:last-child){
    border-right: 1px solid var(--el-border-color);
}

.basic .block{
    flex: 1;
}
.basic .el-col:not(:last-child){
    border-right: 1px solid var(--el-border-color);
}

.infinite-list{
    height: 800px;
    list-style: none;
}
.infinite-list .infinite-list-item{
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    margin: 5px;
    color: var(--el-color-primart);
}
.infinite-list .infinite-list-item + .list-item{
    margin-top: 10px;
}
</style>
