<template>
  <div class="grow p-4 bg-white">
    <div class="space-y-4">
      <div v-for="message in messages" :key="message.id" class="flex">
        <div
          :class="[
            'max-w-full px-4 py-2 rounded-lg',
            message.sender === 'user' ? 'bg-blue-600 text-white ml-auto' : 'bg-gray-200 text-gray-800 mr-auto'
          ]">
          <p class="text-sm">
            <span v-if="message.isTyping" class="typing-text">{{ message.displayText }}</span>
            <span v-else>{{ message.text }}</span>
            <span v-if="message.isTyping" class="typing-cursor">|</span>
          </p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="messages.length === 0" class="text-center text-gray-500 mt-8">
        <p class="text-lg">No messages yet</p>
        <p class="text-sm">Start a conversation by typing a message below</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useChatStore } from '../store/chat'

const chatStore = useChatStore()

// Get current chat messages with typing state
const messages = computed(() => {
  return chatStore.currentChatMessages.map(message => ({
    ...message,
    isTyping: message.sender === 'ai' && !message.isComplete,
    displayText: message.displayText || '',
    isComplete: message.isComplete || false
  }))
})
</script>

<style scoped>
.typing-text {
  display: inline-block;
}

.typing-cursor {
  display: inline-block;
  width: 8px;
  height: 1em;
  background-color: currentColor;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}
</style>
