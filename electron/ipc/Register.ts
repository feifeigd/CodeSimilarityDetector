import { contextBridge, ipcRenderer } from "electron";

export default function Register(){

    contextBridge.exposeInMainWorld("ipc", {
        // 发给主程序
        open_dir: (typ: string)=>ipcRenderer.invoke("open_dir", typ),
    });
}
