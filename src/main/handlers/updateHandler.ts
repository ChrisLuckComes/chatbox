import { BrowserWindow, dialog } from 'electron'
import { autoUpdater } from 'electron-updater'
import log from 'electron-log'
import { is } from '@electron-toolkit/utils'

// Configure autoUpdater
autoUpdater.logger = log
autoUpdater.autoDownload = true
autoUpdater.autoInstallOnAppQuit = false

// Check for updates on startup (only in production)
export const checkForUpdates = (): void => {
  if (is.dev) {
    log.info('Skipping update check in development mode')
    return
  }

  log.info('Checking for updates...')
  autoUpdater.checkForUpdates()
}

// Manually check for updates
export const manualCheckForUpdates = (): void => {
  if (is.dev) {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Check',
      message: 'Update check is disabled in development mode'
    })
    return
  }

  log.info('Manual update check initiated...')
  autoUpdater.checkForUpdates()
}

// Handle update events
export const setupUpdateHandlers = (): void => {
  autoUpdater.on('update-available', info => {
    log.info(`Update available: ${info.version}`)
    // Send update notification to renderer process
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      windows[0].webContents.send('update-available', info)
    }

    // Show update notification to user
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: `A new version (${info.version}) is available. Downloading in the background...`,
      buttons: ['OK']
    })
  })

  autoUpdater.on('update-not-available', () => {
    log.info('No updates available')
    dialog.showMessageBox({
      type: 'info',
      title: 'No Updates',
      message: 'You are using the latest version.',
      buttons: ['OK']
    })
  })

  autoUpdater.on('update-downloaded', info => {
    log.info(`Update downloaded: ${info.version}`)
    // Send update downloaded notification to renderer process
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      windows[0].webContents.send('update-downloaded', info)
    }

    // Ask user if they want to restart and install the update
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message: `Update to version ${info.version} has been downloaded. Restart and install now?`,
        buttons: ['Restart Now', 'Later']
      })
      .then(result => {
        if (result.response === 0) {
          // User clicked "Restart Now"
          autoUpdater.quitAndInstall()
        }
      })
  })

  autoUpdater.on('error', error => {
    log.error('Update error:', error)
    dialog.showMessageBox({
      type: 'error',
      title: 'Update Error',
      message: `An error occurred during the update: ${error.message}`,
      buttons: ['OK']
    })
  })

  autoUpdater.on('download-progress', progress => {
    log.info(`Download progress: ${progress.percent}%`)
    // Send progress to renderer if needed
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      windows[0].webContents.send('update-progress', progress)
    }
  })
}
