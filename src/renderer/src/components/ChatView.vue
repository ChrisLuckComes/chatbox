<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />
    <div class="flex flex-col flex-1">
      <MessageDisplay />
      <ChatInput />
    </div>
  </div>
</template>

<script setup lang="ts">
import Sidebar from './Sidebar.vue'
import MessageDisplay from './MessageDisplay.vue'
import ChatInput from './ChatInput.vue'
</script>

<style scoped>
/* No scoped styles needed, using Tailwind CSS */
</style>
