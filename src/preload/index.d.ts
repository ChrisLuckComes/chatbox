import { ElectronAPI } from '@electron-toolkit/preload'

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      sendMessage: (message: string) => Promise<string>
      setApiKey: (apiKey: string) => Promise<{ success: boolean; error?: string }>
      getApiKey: () => Promise<string | null>
    }
  }
}
