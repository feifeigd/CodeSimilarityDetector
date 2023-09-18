
import { app, BrowserWindow, dialog, Tray } from "electron";
import { Application } from "./Application";
import path from "path";

// 来强制沙盒化所有渲染器
// 全局启用沙盒
// app.enableSandbox();    // 必须在 ready 事件之前调用

let traypath: string;

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
    const NODE_ENV = process.env.NODE_ENV;
    console.log(NODE_ENV, process.env['VITE_DEV_SERVER_URL'])
    // 新增判断当前环境
    if (NODE_ENV !== 'development') {
        win.loadFile(path.join(__dirname, "../dist/index.html"));  // file://
        traypath = path.join(__dirname, "vite.svg");
    } else {
        win.loadURL(`${process.env['VITE_DEV_SERVER_URL']}`); // yarn run dev 开发模式，http 热更新
        
        // traypath = path.join(process.env["INIT_CMD"] || "", "public/vite.svg");
        traypath = path.join(__dirname, "../public/vite.svg");
        win.webContents.openDevTools();
    }
    console.log(traypath)
    closeWin(win);
    // createtray();
}

function onReady(){

}
// app.whenReady().then(createWindow);
const _ = new Application(app, createWindow, onReady);

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

function createtray(){
    const tray = new Tray(traypath);
    tray.setToolTip("hehe");
    tray.on("click", ()=>{

    });
}