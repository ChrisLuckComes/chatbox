<template>
  <div class="w-64 bg-gray-900 p-4 text-white flex flex-col">
    <h2 class="text-xl font-bold mb-4">Chats</h2>
    <button 
      class="w-full p-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      @click="createNewChat"
    >
      + New Chat
    </button>
    <ul class="grow overflow-y-auto space-y-2">
      <li 
        v-for="topic in chatTopics" 
        :key="topic.id"
        :class="[
          'p-2 cursor-pointer rounded text-sm',
          currentChatTopicId === topic.id ? 'bg-blue-700' : 'hover:bg-gray-700'
        ]"
        @click="selectChatTopic(topic.id)"
      >
        {{ topic.name }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useChatStore } from '../store/chat'

const chatStore = useChatStore()
const newChatName = ref('')

// Get chat topics and current topic from store
const chatTopics = computed(() => chatStore.chatTopics)
const currentChatTopicId = computed(() => chatStore.currentChatTopicId)

function createNewChat(): void {
  const name = newChatName.value.trim() || `Chat ${chatTopics.value.length + 1}`
  chatStore.addChatTopic(name)
  newChatName.value = ''
}

function selectChatTopic(topicId: number): void {
  chatStore.setCurrentChatTopic(topicId)
}
</script>

<style scoped>
/* No scoped styles needed, using Tailwind CSS */
</style>
