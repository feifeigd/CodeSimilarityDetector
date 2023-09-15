
import { app, BrowserWindow } from "electron";

function createWindow(){
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
    });

    mainWindow.loadFile("dist/index.html");
    mainWindow.webContents.openDevTools();
}

app.whenReady().then(()=>{
    createWindow();
});