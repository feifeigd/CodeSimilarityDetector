
import { app, BrowserWindow } from "electron";
import { Application } from "./Application";
import path from "path";

// 来强制沙盒化所有渲染器
// 全局启用沙盒
// app.enableSandbox();    // 必须在 ready 事件之前调用

function createWindow(){
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        
        webPreferences: {
            // devTools: true,
            preload: path.join(__dirname, "preload.js"),
        }
    });

    // win.loadFile("dist/index.html");
    console.log(process.env.NODE_ENV, process.env['VITE_DEV_SERVER_URL'])
    // 新增判断当前环境
    if (process.env.NODE_ENV !== 'development') {
        win.loadFile(path.join(__dirname, "dist/index.html"));  // 
    } else {
        win.loadURL(`${process.env['VITE_DEV_SERVER_URL']}`); // yarn run dev 开发模式，http 热更新
        win.webContents.openDevTools();
    }
}

function onReady(){

}
// app.whenReady().then(createWindow);
const _ = new Application(app, createWindow, onReady);
