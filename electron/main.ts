
import { app, BrowserWindow, dialog, ipcMain, MessageBoxOptions, Tray } from "electron";
import { Application } from "./Application";
import path from "path";
import log  from "electron-log";
import {format} from 'node:url';
import fs from "fs";
import { hashFile } from "./utils/FileHash";

// 来强制沙盒化所有渲染器
// 全局启用沙盒
// app.enableSandbox();    // 必须在 ready 事件之前调用

let traypath: string;

function createWindow(): BrowserWindow{
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        
        webPreferences: {
            // devTools: true,
            preload: path.join(__dirname, "preload.js"),    // 脚本注入渲染进程，相对 main.js 目录 dist-electron
        }
    });
    win.webContents.on("render-process-gone", (e, details)=>{
        const options: MessageBoxOptions = {
            message: "这个进程已经崩溃",
        };
        function recordCrash(arg: any){
            return new Promise(resolve => {
                log.info(arg);
                resolve(null);
            })
        }
        recordCrash(details).then(()=>{
            dialog.showMessageBox(options).then(({response})=>{
                console.log(response);
                if(response === 0)reloadWindow();
                else app.quit();
            }).catch(e=>{
                console.log("err", e);
            });

        });
    });

    // win.loadFile("dist/index.html");
    const NODE_ENV = process.env.NODE_ENV;
    console.log(NODE_ENV, process.env['VITE_DEV_SERVER_URL'])
    // 新增判断当前环境
    if (NODE_ENV !== 'development') {   // 产品模式
        win.loadFile(path.join(__dirname, "../dist/index.html"));  // file://
        // win.loadURL(format({
        //     pathname: path.join(__dirname, "../dist/index.html"),   // 渲染进程的入口点
        //     protocol: "file:",
        //     slashes: true,
        // }));

        traypath = path.join(__dirname, "vite.svg");
        
        win.webContents.openDevTools(); // 产品模式 不用开这个
    } else {
        win.loadURL(`${process.env['VITE_DEV_SERVER_URL']}`); // yarn run dev 开发模式，http 热更新
        
        // traypath = path.join(process.env["INIT_CMD"] || "", "public/vite.svg");
        traypath = path.join(__dirname, "../public/vite.svg");
        win.webContents.openDevTools();
    }
    console.log(traypath)
    closeWin(win);
    // createtray();    
    return win;
}

function reloadWindow(){
    app.relaunch();
    app.exit(0);
}

function onReady(){

}

// app.whenReady().then(createWindow);
const a = new Application(createWindow, onReady);

registerIpc();


// 关闭前确认
function closeWin(win: BrowserWindow){
    return ;
    win.on("close", (e)=>{
        e.preventDefault();
        dialog.showMessageBox({
            type: "info",
            title: "Information",
            cancelId: 2, 
            defaultId: 0,
            message: "确定要关闭吗？",
            buttons: [
                "最小化", "最小化至托盘", "直接退出", 
            ]
        }).then(result => {
            switch(result.response){
            case 0:
                e.preventDefault();
                win.minimize();
                break;
                case 1:
                    win.hide();
                    win.setSkipTaskbar(true);
                    break;
                    case 2:
                        app.exit();
                        break;
            }
        }).catch(err=>{
            console.log(err);
        })
    });
}

// function createtray(){
//     const tray = new Tray(traypath);
//     tray.setToolTip("hehe");
//     tray.on("click", ()=>{

//     });
// }

// 导出给前端调用
function registerIpc(){
    ipcMain.handle("open_dir", handleFileOPen);
}

async function handleFileOPen(_: any, typ: string){
    const ret = await dialog.showOpenDialog({properties: ['openDirectory']});
    const { canceled, filePaths } = ret;
    if(!canceled){
        CalcHash(filePaths[0], typ, filePaths[0]);
    }
    return ret;
}

// 遍历目录
function Walk(dir: string, doFile: (filepath: string)=>void ){
    fs.readdir(dir, (err, list)=>{
        if(err){
            console.error(err);
            return;
        }
        // console.log(dir,list)
        list.map(node=>{
            const filepath = path.join(dir, node);
            fs.stat(filepath, (err, desc)=>{
                if(err){
                    console.error(err);
                    return;
                }

                if(desc.isDirectory()){
                    Walk(filepath, doFile);
                }else if(desc.isFile()){
                    doFile(filepath);
                }
            })
        })
    });
}

function CalcHash(root: string, typ: string, dir: string){
    const doFile = (filepath: string)=>{
        // 计算文件hash
        const relative_path = path.relative(root, filepath);
        a.MainWindow?.webContents.send("add_file", {typ, path: relative_path, });
        hashFile(filepath, "MD5").then(hash=>{
            console.log(hash, relative_path, );
            // 发给前端
            a.MainWindow?.webContents.send("add_file_hash", {typ, hash,  path: relative_path, });
        }).catch(err=>console.error("catch error:", err));
    };
    Walk(dir, doFile);
}
