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
  getProblemConfig: (contestPath: string, problem: string) => ipcRenderer.invoke('getProblemConfig', contestPath, problem),
  chooseContest: () => ipcRenderer.invoke('chooseContest'),
  updateProblemConfig: (contestPath: string, problem: string, config: object) => ipcRenderer.invoke('updateProblemConfig', contestPath, problem, config),
  getProblemList: (contestPath: string) => ipcRenderer.invoke('getProblemList', contestPath),
  getContestConfig: (contestPath: string) => ipcRenderer.invoke('getContestConfig', contestPath),
})
