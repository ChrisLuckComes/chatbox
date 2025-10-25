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

  // Add user message to chat
  chatStore.addMessageToCurrentTopic(userMessage, 'user')

  // Clear input
  message.value = ''
  isSending.value = true

  try {
    // Send message to main process
    const response = await window.api.sendMessage(userMessage)

    // Parse the response
    let responseData
    try {
      responseData = JSON.parse(response)
    } catch {
      // If response is not JSON, it's an error message
      chatStore.addMessageToCurrentTopic(response, 'ai')
      return
    }

    // Add AI message with typing effect
    const messageId = Date.now()
    chatStore.addMessageToCurrentTopic(responseData.fullResponse, 'ai')

    // Start typing effect
    const { chunks, typingSpeed } = responseData
    let chunkIndex = 0

    const type = () => {
      if (chunkIndex < chunks.length) {
        chatStore.updateMessageDisplayText(messageId, chunks[chunkIndex])
        chunkIndex++
        setTimeout(type, typingSpeed)
      } else {
        // Typing complete
        chatStore.markMessageComplete(messageId)

        // Set chat topic name from AI response if this is a new chat
        // 在接收到第一个 AI 回复时更新主题名称
        if (chatStore.currentChatTopicId) {
          chatStore.setChatTopicNameFromAIResponse(chatStore.currentChatTopicId, responseData.fullResponse)
        }
      }
    }

    // Start typing effect
    setTimeout(type, typingSpeed)
  } catch (error) {
    console.error('Error sending message:', error)
    // Add error message to chat
    chatStore.addMessageToCurrentTopic('Sorry, there was an error processing your request.', 'ai')
  } finally {
    isSending.value = false
    // Focus input for next message
    inputRef.value?.focus()
  }
}
</script>

<style scoped>
/* No scoped styles needed, using Tailwind CSS */
</style>
