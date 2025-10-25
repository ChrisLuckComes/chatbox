import log from 'electron-log'
import * as fs from 'fs'
import * as path from 'path'
import { app } from 'electron'
import Store from 'electron-store'

// 获取默认配置
function getDefaultConfig(): string {
  try {
    // 在生产环境中，配置文件会被复制到 resources 目录
    const configPath = app.isPackaged
      ? path.join(process.resourcesPath, 'app-config.json')
      : path.join(__dirname, '..', '..', '..', 'app-config.default.json')

    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
      if (typeof config.WQ_API_KEY === 'string' && config.WQ_API_KEY) {
        log.info('Loaded API key from config file:', configPath)
        return config.WQ_API_KEY
      }
    }
  } catch (error) {
    log.warn('Failed to load default config:', error)
  }
  return ''
}

// 获取初始API密钥
const defaultApiKey = process.env.WQ_API_KEY || getDefaultConfig()
if (!defaultApiKey) {
  log.warn('No API key found in environment or config file')
}

// 配置存储选项
const storeOptions = {
  name: 'app-config',
  schema: {
    WQ_API_KEY: {
      type: 'string' as const,
      default: defaultApiKey
    }
  }
}

// 创建配置存储实例
const store = new Store(storeOptions)

// 获取API密钥
export function getApiKey(): string | null {
  try {
    // 优先使用环境变量
    if (process.env.WQ_API_KEY) {
      return process.env.WQ_API_KEY
    }

    // 从 electron-store 获取
    const storedKey = store.get('WQ_API_KEY')
    return typeof storedKey === 'string' ? storedKey : null
  } catch (error) {
    log.error('Error getting API key:', error)
    return null
  }
}