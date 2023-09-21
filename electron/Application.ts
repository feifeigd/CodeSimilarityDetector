
import{app, BrowserWindow, IpcMainEvent, ipcMain} from "electron";

export class Application{
    
    private main_window: BrowserWindow | null = null;

    constructor(private createWindow: ()=>BrowserWindow, private OnReady?: ()=>void){
        
        const promise = app.whenReady().then(()=> this. main_window = createWindow());
        if(OnReady)promise.then(this.OnReady);
        
        app.on("activate", ()=>{
            console.log("激活窗口");
            if(BrowserWindow.getAllWindows().length === 0){
                this.main_window = createWindow();
                console.log("activate: ", this.main_window);
            }
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

    get MainWindow(){
        return this.main_window;
    }
}
