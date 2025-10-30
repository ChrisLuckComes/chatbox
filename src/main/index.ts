import { app, shell, BrowserWindow, globalShortcut } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import dotenv from 'dotenv'
import log from 'electron-log'

// Configure electron-log
log.initialize({ preload: true })
log.transports.file.resolvePathFn = () => join(app.getPath('userData'), 'logs/main.log')
log.info('Application starting...')

// Import chat, update, and IPC handlers
import './handlers/chatHandler'
import { checkForUpdates, setupUpdateHandlers } from './handlers/updateHandler'
import { setupIpcHandlers } from './handlers/ipcHandler'

// Load environment variables from .env file
dotenv.config()

// Set the application version in the log
log.info(`Application version: ${app.getVersion()}`)

// Setup update handlers
setupUpdateHandlers()

// Setup IPC handlers
setupIpcHandlers()

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  // Register Ctrl+F12 global shortcut to toggle DevTools in both development and production
  globalShortcut.register('CommandOrControl+F12', () => {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      const mainWindow = windows[0]
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools()
      } else {
        mainWindow.webContents.openDevTools()
      }
    }
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  // Check for updates after app is ready (only in production)
  setTimeout(() => {
    checkForUpdates()
  }, 3000) // Delay update check to avoid interfering with app startup
})

const createWindow = (): void => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Open links in the default browser
  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Unregister all global shortcuts when the app is about to quit
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})
