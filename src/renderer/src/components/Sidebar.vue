<template>
  <div class="w-64 bg-gray-900 p-4 text-white flex flex-col">
    <h2 class="text-xl font-bold mb-4">Chats</h2>
    <button
      class="w-full p-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      @click="createNewChat">
      + New Chat
    </button>
    <ul class="grow overflow-y-auto space-y-2">
      <li
        v-for="topic in chatTopics"
        :key="topic.id"
        :class="[
          'p-2 cursor-pointer rounded text-sm relative group',
          currentChatTopicId === topic.id ? 'bg-blue-700' : 'hover:bg-gray-700'
        ]"
        @click="selectChatTopic(topic.id)">
        <span class="block truncate pr-6">{{ topic.name }}</span>
        <input
          v-if="editingTopicId === topic.id"
          v-model="editTopicName"
          type="text"
          class="absolute inset-0 p-1 text-sm bg-white text-black rounded border border-blue-500 z-10"
          @click.stop
          @blur="saveEdit"
          @keyup.enter="saveEdit"
          @keyup.escape="cancelEdit" />
        <button
          v-else
          class="absolute right-1 top-1 opacity-0 group-hover:opacity-100 text-xs bg-blue-600 rounded px-1 py-0.5 hover:bg-blue-500"
          @click.stop="startEdit(topic)">
          ✏️
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useChatStore } from '../store/chat'

const chatStore = useChatStore()
const newChatName = ref('')
const editingTopicId = ref<number | null>(null)
const editTopicName = ref('')

// 从存储中获取聊天主题和当前主题
const chatTopics = computed(() => chatStore.chatTopics)
const currentChatTopicId = computed(() => chatStore.currentChatTopicId)

function createNewChat(): void {
  // 使用 "New Chat" 作为默认名称
  chatStore.addChatTopic()
  newChatName.value = ''
  // 确保清除之前的编辑状态
  editingTopicId.value = null
  editTopicName.value = ''
}

function selectChatTopic(topicId: number): void {
  chatStore.setCurrentChatTopic(topicId)
}

function startEdit(topic: { id: number; name: string }): void {
  // 清除旧值后设置新值
  editTopicName.value = ''
  editingTopicId.value = topic.id
  // 使用 nextTick 确保在 DOM 更新后设置值
  nextTick(() => {
    editTopicName.value = topic.name
  })
}

function saveEdit(): void {
  if (editingTopicId.value && editTopicName.value.trim()) {
    chatStore.renameChatTopic(editingTopicId.value, editTopicName.value.trim())
  }
  // 先清空值，再重置 ID
  editTopicName.value = ''
  editingTopicId.value = null
}

function cancelEdit(): void {
  // 先清空值，再重置 ID
  editTopicName.value = ''
  editingTopicId.value = null
}
</script>

<style scoped>
/* No scoped styles needed, using Tailwind CSS */
</style>
