
// 导出给渲染进程的接口 

export interface IIpc{
    open_dir: (typ: string)=>Promise<Electron.OpenDialogReturnValue>,
    
    add_file: (callback: (event: IpcRendererEvent, ...args: any[]) => void)=>Promise<void>,
    add_file_hash: (callback: (event: IpcRendererEvent, ...args: any[]) => void)=>Promise<void>,
}

declare global {
    // 导给前端 window.xx
    interface Window {
        ipc: IIpc
    }
}
