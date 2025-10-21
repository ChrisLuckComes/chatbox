<template>
  <div class="w-64 bg-gray-900 p-4 text-white flex flex-col">
    <h2 class="text-xl font-bold mb-4">Chats</h2>
    <button class="w-full p-2 mb-4 bg-blue-600 text-white rounded hover:bg-blue-700">+ New Chat</button>
    <ul class="grow overflow-y-auto">
      <li class="p-2 cursor-pointer hover:bg-gray-700 rounded">Chat 1</li>
      <li class="p-2 cursor-pointer hover:bg-gray-700 rounded">Chat 2</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
// Logic for managing chat topics will go here
</script>

<style scoped>
/* No scoped styles needed, using Tailwind CSS */
</style>
