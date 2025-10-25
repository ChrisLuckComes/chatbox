<template>
  <div class="flex p-4 bg-gray-100 border-t border-gray-300">
    <input
      ref="inputRef"
      v-model="message"
      type="text"
      placeholder="Type your message..."
      class="grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      @keyup.enter="sendMessage" />
    <button
      :disabled="isSending"
      class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="sendMessage">
      {{ isSending ? 'Sending...' : 'Send' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useChatStore } from '../store/chat'

const chatStore = useChatStore()
const message = ref('')
const isSending = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

async function sendMessage() {
  if (!message.value.trim() || isSending.value) return

  const userMessage = message.value.trim()

  // 添加用户消息到聊天
  chatStore.addMessageToCurrentTopic(userMessage, 'user')

  // 清空输入框
  message.value = ''
  isSending.value = true

  try {
    // 发送消息到主进程
    const response = await window.api.sendMessage(userMessage)

    // 解析响应
    let responseData
    try {
      responseData = JSON.parse(response)
    } catch {
      // 如果响应不是JSON格式，则是错误消息
      chatStore.addMessageToCurrentTopic(response, 'ai')
      return
    }

    // 添加AI消息并显示打字效果
    const messageId = Date.now()
    chatStore.addMessageToCurrentTopic(responseData.fullResponse, 'ai')

    // 开始打字效果
    const { chunks, typingSpeed } = responseData
    let chunkIndex = 0

    const type = () => {
      if (chunkIndex < chunks.length) {
        chatStore.updateMessageDisplayText(messageId, chunks[chunkIndex])
        chunkIndex++
        setTimeout(type, typingSpeed)
      } else {
        // 打字完成
        chatStore.markMessageComplete(messageId)

        // 设置聊天主题名称从AI响应（如果是新聊天）
        // 在接收到第一个 AI 回复时更新主题名称
        if (chatStore.currentChatTopicId) {
          chatStore.setChatTopicNameFromAIResponse(chatStore.currentChatTopicId, responseData.fullResponse)
        }
      }
    }

    // 开始打字效果
    setTimeout(type, typingSpeed)
  } catch (error) {
    console.error('发送消息时出错:', error)
    // 添加错误消息到聊天
    chatStore.addMessageToCurrentTopic('抱歉，处理您的请求时出现错误。', 'ai')
  } finally {
    isSending.value = false
    // 为下一条消息聚焦输入框
    inputRef.value?.focus()
  }
}
</script>

<style scoped>
/* No scoped styles needed, using Tailwind CSS */
</style>
