<template>
  <div class="flex flex-col min-h-screen bg-blue text-gray-800">
    <UpdateNotification />
    <ChatView />
  </div>
</template>

<script setup lang="ts">
import ChatView from './components/ChatView.vue'
import UpdateNotification from './components/UpdateNotification.vue'
</script>
