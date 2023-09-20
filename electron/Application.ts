
import{app, BrowserWindow, IpcMainEvent, ipcMain} from "electron";

export class Application{
    
    constructor(private createWindow: ()=>void, private OnReady?: ()=>void){
        
        const promise = app.whenReady().then(this.createWindow);
        if(OnReady)promise.then(this.OnReady);
        
        app.on("activate", ()=>{
            if(BrowserWindow.getAllWindows().length === 0)
                this.createWindow();
        });

        app.on("window-all-closed", ()=>{
            if(process.platform !== "darwin"){
                app.quit();
            }
        });
        
        ipcMain.on("set-title", (event: IpcMainEvent, title)=>{
            const webContents = event.sender;
            const win = BrowserWindow.fromWebContents(webContents);
            win?.setTitle(title);
        });
    }    
}
