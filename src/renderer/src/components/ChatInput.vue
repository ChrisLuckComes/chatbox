<template>
  <div class="flex p-4 bg-gray-100 border-t border-gray-300">
    <input
      type="text"
      placeholder="Type your message..."
      class="grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
    />
    <button
      class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      Send
    </button>
  </div>
</template>

<script setup lang="ts">
// Logic for sending messages will go here
</script>

<style scoped>
/* No scoped styles needed, using Tailwind CSS */
</style>
