import exposeContexts from "./helpers/ipc/context-exposer";

exposeContexts();


import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping')
  // 除函数之外，我们也可以暴露变量
})

contextBridge.exposeInMainWorld('judge', {
  getProblemConfig: (filePath: string) => ipcRenderer.invoke('getProblemConfig', filePath),
  chooseContest: () => ipcRenderer.invoke('chooseContest'),
})
