<template>
  <div 
    v-if="showUpdateNotification" 
    class="fixed top-4 right-4 z-50 bg-blue-50 text-white p-4 rounded-lg shadow-lg max-w-sm"
  >
    <div class="flex justify-between items-start">
      <div>
        <h3 class="font-bold text-lg">Update Available</h3>
        <p class="text-sm mt-1">Version {{ updateInfo?.version }} is ready to install</p>
        
        <!-- Progress bar when downloading -->
        <div v-if="downloadProgress !== null" class="mt-2">
          <div class="w-full bg-blue-300 rounded-full h-2">
            <div 
              class="bg-white h-2 rounded-full" 
              :style="{ width: downloadProgress.percent + '%' }"
            ></div>
          </div>
          <p class="text-xs mt-1">{{ Math.round(downloadProgress.percent) }}% downloaded</p>
        </div>
      <button 
        @click="closeNotification" 
        class="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
    
    <!-- Action buttons -->
    <div v-if="!isDownloaded && downloadProgress === null" class="mt-3 flex space-x-2">
      <button 
        @click="installUpdate" 
        class="px-3 py-1 bg-white text-blue-500 rounded text-sm hover:bg-gray-100"
      >
        Install Now
      </button>
      <button 
        @click="deferUpdate" 
        class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
      >
        Later
      </button>
    </div>
    
    <div v-else-if="isDownloaded" class="mt-3 flex space-x-2">
      <button 
        @click="restartAndInstall" 
        class="px-3 py-1 bg-white text-blue-500 rounded text-sm hover:bg-gray-10"
      >
        Restart & Install
      </button>
      <button 
        @click="deferUpdate" 
        class="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
      >
        Later
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface UpdateInfo {
  version: string
}

interface DownloadProgress {
  percent: number
  transferred: number
 total: number
}

const showUpdateNotification = ref(false)
const updateInfo = ref<UpdateInfo | null>(null)
const isDownloaded = ref(false)
const downloadProgress = ref<DownloadProgress | null>(null)

const closeNotification = () => {
  showUpdateNotification.value = false
}

const installUpdate = () => {
  // This will trigger the download, which is already happening automatically
  // via autoUpdater.autoDownload = true
  showUpdateNotification.value = false
}

const restartAndInstall = () => {
  if (window.api) {
    // Quit and install the downloaded update
    const { ipcRenderer } = window.electron
    ipcRenderer.invoke('quit-and-install')
  }
  showUpdateNotification.value = false
}

const deferUpdate = () => {
  showUpdateNotification.value = false
}

onMounted(() => {
  if (window.api) {
    // Listen for update available event
    window.api.onUpdateAvailable((info) => {
      updateInfo.value = info
      isDownloaded.value = false
      downloadProgress.value = null
      showUpdateNotification.value = true
    })

    // Listen for update downloaded event
    window.api.onUpdateDownloaded((info) => {
      updateInfo.value = info
      isDownloaded.value = true
      showUpdateNotification.value = true
    })

    // Listen for download progress
    window.api.onUpdateProgress((progress) => {
      downloadProgress.value = progress
    })
  }
})

onUnmounted(() => {
  if (window.api) {
    window.api.removeUpdateListeners()
  }
})
</script>
