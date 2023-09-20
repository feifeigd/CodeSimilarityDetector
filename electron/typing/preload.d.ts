
// 导出给渲染进程的接口 

export interface IIpc{
    open_dir: (typ: string)=>Promise<Electron.OpenDialogReturnValue>,
}

declare global {
    // 导给前端 window.xx
    interface Window {
        ipc: IIpc
    }
}
