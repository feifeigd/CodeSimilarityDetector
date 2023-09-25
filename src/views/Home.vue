<template>
    <div>
        <el-row class="avatar basic">
            <el-col :span="12">
                <div class="sub-title">源文件夹</div>
                <div class="basic--circle" @click="onclick('src')">
                    <div class="block">
                        <el-avatar :size="50" :src="srcData.icon" />
                    </div>
                </div>
                <div>
                    文件夹路径：{{ srcData.dir || "请点击图标选择" }}
                    <el-progress :percentage="srcData.persent"  />
                    <div>文件数： {{ srcData.fileInfo.length }}</div>
                </div>

                <!-- 无限滚动 -->
                <ul class="infinite-list" >
                    <!-- <li v-for="info in srcFiles" :key="info.path" class="infinite-list-item">{{ info.hash }}|{{ info.path }}</li> -->
                    
                    <el-auto-resizer>
                        <template #default="{height, width}">
                            <el-table-v2 :columns="src_columns" :data="srcData.fileInfo" :width="width" :height="height" fixed />
                        </template>
                    </el-auto-resizer>
                </ul>


            </el-col>

            <el-col :span="12">
                <div class="sub-title">目标文件夹</div>
                <div class="basic--square" @click="onclick('dst')">
                    <div class="block">
                        <el-avatar shape="square" :size="50" :src="dstData.icon" />
                    </div>
                </div>
                <div>
                    文件夹路径：{{ dstData.dir || "请点击图标选择"}}
                    <el-progress :percentage="dstData.persent"  />
                    <div>文件数： {{ dstData.fileInfo.length }}</div>
                    <div>相似度： {{ dstData.similarity }}</div>
                </div>

                <!-- 无限滚动 -->
                <ul class="infinite-list" >
                    <!-- <li v-for="info in srcFiles" :key="info.path" class="infinite-list-item">{{ info.hash }}|{{ info.path }}</li> -->
                    
                    <el-auto-resizer>
                        <template #default="{height, width}">
                            <el-table-v2 :columns="dst_columns" :data="dstData.fileInfo" :width="width" :height="height" fixed />
                        </template>
                    </el-auto-resizer>
                </ul>
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
    match: bool
}

class FileData{
    doneCont = 0;
    fileInfo: FileInfo[] = [];
    icon: string;
    dir: string;

    // 未计算hash的 path=>info
    undo_fileInfo: {} = {};
    srcData: FileData;

    constructor(public typ: string){

    }

    get persent(){
        if(this.fileInfo.length < 1)
            return 0;
        const str = (this.doneCont * 100 / this.fileInfo.length).toFixed(2);
        return parseFloat(str);
    }
    get similarity(){
        if(this.fileInfo.length < 1)
            return 0;
        const match_count = this.fileInfo.filter(e=>e.match).length;
        const str = (match_count * 100 / this.fileInfo.length).toFixed(2);
        return parseFloat(str);
    }

    reset(){
        this.doneCont = 0;
        this.fileInfo = [];
    }

    add_file(info, add = true ){
        this.fileInfo.push(info);
        if(add)
            this.undo_fileInfo[info.path] = info;
    }

    update_hash(info){
        let {hash, path} = info;
        let item = this.undo_fileInfo[path];        
        // let item = this.fileInfo.find(element=>element.path == path);
        
        if(item){
            item.hash = hash;
            delete this.undo_fileInfo[path];
        }else{
            this.add_file(info, false);                 
        }

        ++this.doneCont;
        if(this.typ == "dst"){
            (item || info).match = this.srcData.match(hash);
        }
    }

    match(hash: string): bool {
        return this.fileInfo.find(e=>e.hash == hash) != null;
    }
}

@Component
class Home extends Vue{
    sizeList = ['small', '', 'large'] as const;

    srcData = new FileData("src");
    dstData = new FileData("dst");

    src_columns = [
        {
            // key: `${prefix}0`,
            align: "left",
            dataKey: `hash`,
            title: "hash",
            width: 250,
        },
        {
            // key: `${prefix}0`,
            align: "left",
            dataKey: `path`,
            title: "文件路径",
            width: 280,
        },
    ]; 
    
    dst_columns = [
        {
            // key: `${prefix}0`,
            align: "left",
            dataKey: `match`,
            title: "是否相似",
            width: 50,
        },
        {
            // key: `${prefix}0`,
            align: "left",
            dataKey: `hash`,
            title: "hash",
            width: 250,
        },
        {
            // key: `${prefix}0`,
            align: "left",
            dataKey: `path`,
            title: "文件路径",
            width: 280,
        },
    ]; 

    // data = [];

    mounted(){
        this.srcData.icon = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
        this.dstData.icon = 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png';
        // 接收主进程发来的消息
        window.ipc.add_file((event, obj)=>{
            const {typ, hash, path} = obj;
            if(typ == "src"){
                this.srcData.add_file({hash, path, path1: path, });
            }else if(typ == "dst"){
                this.dstData.add_file({hash, path, path1: path, });
            }
        });

        window.ipc.add_file_hash((event, obj)=>{
            const {typ, hash, path} = obj;            
            if(typ == "src"){
                this.srcData.update_hash(obj);
            }else if(typ == "dst"){
                this.dstData.update_hash(obj);
            }
        });

        // this.columns = this.generateColumns(10);
        // this.data = this.generateData(this.columns, 60);
        // console.log(this.columns); 
        this.dstData.srcData = this.srcData;
    }

    async onclick(tpe: string){
        const { canceled, filePaths} = await window.ipc.open_dir(tpe);
        if(!canceled){
            if(tpe == "src"){
                this.srcData.reset();
                this.srcData.dir = filePaths[0];
            }
            else if(tpe == "dst"){
                this.dstData.reset();
                this.dstData.dir = filePaths[0];
            }
        }
    }

    load(){
        // this.count += 3;
    }

    generateColumns(length = 10, prefix = "column-", props?: any){
        const width = 280;
        // return Array.from({ length }).map((_, columnIndex) => ({
        //     ...props,
        //     key: `${prefix}${columnIndex}`,
        //     dataKey: `${prefix}${columnIndex}`,
        //     title: `Column ${columnIndex}`,
        //     width: 150,
        // }));
        return [
            {
                // key: `${prefix}0`,
                align: "left",
                dataKey: `hash`,
                title: "hash",
                width: 250,
            },
            {
                // key: `${prefix}0`,
                align: "left",
                dataKey: `path`,
                title: "文件路径",
                width,
            },
        ];
    }    

    generateData(columns: ReturnType<typeof this.generateColumns>, length = 1, prefix = "row-"){
        return Array.from({ length }).map((_, rowIndex) => {
            return columns.reduce(
                (rowData, column, columnIndex) => {
                    rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}-1234567890`
                    return rowData
                },
                {
                    id: `${prefix}${rowIndex}`,
                    parentId: null,
                }
            )
        });
        // return [];
        return [{
            id: "123",
            hash: "123",
            path: "789",
        }];
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
