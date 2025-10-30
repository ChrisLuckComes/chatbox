import { ipcMain, app } from 'electron'
import { autoUpdater } from 'electron-updater'

export const setupIpcHandlers = (): void => {
  // Handle quit and install request from renderer
  ipcMain.handle('quit-and-install', () => {
    setImmediate(() => {
      app.quit()
      autoUpdater.quitAndInstall()
    })
  })
}
