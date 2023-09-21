import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

export default function Register(){

    contextBridge.exposeInMainWorld("ipc", {
        // 渲染进程发给主程序
        open_dir: (typ: string)=>ipcRenderer.invoke("open_dir", typ),

        // 主进程发给渲染进程
        add_file_hash: (callback: (event: IpcRendererEvent, ...args: any[]) => void)=>ipcRenderer.on("add_file_hash", callback),
    });
}
