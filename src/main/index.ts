import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import axios from 'axios'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

function createWindow(): void {
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

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Chat message handling with typing effect
  ipcMain.handle('chat:sendMessage', async (_event, message: string) => {
    console.log('Received message:', message)

    try {
      // Get API key from environment variable
      const apiKey = process.env.WQ_API_KEY
      if (!apiKey) {
        console.warn('WanQing API key not found in environment variables')
        return 'Error: WanQing API key not configured. Please set WQ_API_KEY environment variable.'
      }

      // Call WanQing StreamLake API
      const response = await axios.post(
        'https://wanqing.streamlakeapi.com/api/gateway/v1/endpoints/chat/completions',
        {
          model: 'ep-ccyc9x-1761235594724146562', // 请替换为实际的模型ID
          stream: false, // 暂时设置为false，简化处理
          messages: [
            {
              role: 'system',
              content: '你是一个 AI 人工智能助手。'
            },
            {
              role: 'user',
              content: message
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )

      // Extract the AI response
      const aiResponse = response.data.choices[0].message.content
      console.log('WanQing AI response received:', aiResponse)

      // Send response character by character for typing effect
      const responseChunks: string[] = []
      for (let i = 0; i < aiResponse.length; i++) {
        responseChunks.push(aiResponse.substring(0, i + 1))
      }

      return JSON.stringify({
        fullResponse: aiResponse,
        chunks: responseChunks,
        typingSpeed: 30 // 毫秒 per character
      })
    } catch (error) {
      console.error('Error calling WanQing API:', error)

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          return 'Error: Invalid API key. Please check your WanQing API key configuration.'
        } else if (error.response?.status === 429) {
          return 'Error: Rate limit exceeded. Please try again later.'
        } else if (error.response?.data?.error?.code === 'insufficient_quota') {
          return 'Error: API quota exceeded. Please check your WanQing account balance.'
        }
      }

      return 'Error: Failed to get response from WanQing AI service. Please try again later.'
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
