import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  sendMessage: (message: string) => {
    return ipcRenderer.invoke('chat:sendMessage', message)
  },
   // Update-related APIs
  onUpdateAvailable: (callback: (info: { version: string }) => void) => {
    ipcRenderer.on('update-available', (_, info) => callback(info))
  },
  onUpdateDownloaded: (callback: (info: { version: string }) => void) => {
    ipcRenderer.on('update-downloaded', (_, info) => callback(info))
  },
  onUpdateProgress: (callback: (progress: { percent: number; transferred: number; total: number }) => void) => {
    ipcRenderer.on('update-progress', (_, progress) => callback(progress))
  },
  removeUpdateListeners: () => {
    ipcRenderer.removeAllListeners('update-available')
    ipcRenderer.removeAllListeners('update-downloaded')
    ipcRenderer.removeAllListeners('update-progress')
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.api = api
}
