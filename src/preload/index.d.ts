import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      sendMessage: (message: string) => Promise<string>
      setApiKey: (apiKey: string) => Promise<{ success: boolean; error?: string }>
      getApiKey: () => Promise<string | null>
      // Update-related APIs
      onUpdateAvailable: (callback: (info: { version: string }) => void) => void
      onUpdateDownloaded: (callback: (info: { version: string }) => void) => void
      onUpdateProgress: (callback: (progress: { percent: number; transferred: number; total: number }) => void) => void
      removeUpdateListeners: () => void
    }
  }
}
