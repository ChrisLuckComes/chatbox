import { ipcMain } from 'electron'
import axios from 'axios'
import log from 'electron-log'
import { getApiKey } from '../store'

// Configure electron-log
log.transports.file.level = 'info'
log.transports.console.level = 'info'

// Chat message handling with typing effect
ipcMain.handle('chat:sendMessage', async (_event, message: string) => {
  log.info('Received message request:', { messageLength: message.length })

  try {
    // Get API key from environment variable or config file
    const apiKey = getApiKey()
    if (!apiKey) {
      log.warn('WanQing API key not found in environment variables or config file')
      return 'Error: WanQing API key not configured. Please set WQ_API_KEY environment variable or create a config.json file in the application directory.'
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
    log.info('WanQing AI response received', { responseLength: aiResponse.length })
    log.debug('Response content:', aiResponse)

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
    log.error('Error calling WanQing API:', error)

    if (axios.isAxiosError(error)) {
      const errorDetails = {
        status: error.response?.status,
        code: error.response?.data?.error?.code,
        message: error.message,
        url: error.config?.url
      }
      log.error('API Error Details:', errorDetails)
      
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
