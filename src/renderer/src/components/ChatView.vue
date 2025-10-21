<template>
  <div class="flex h-screen max-w-3xl mx-auto my-8 bg-white rounded-lg shadow-xl overflow-hidden">
    <Sidebar />
    <div class="flex flex-col grow">
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
