import { defineStore } from 'pinia'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
}

interface ChatTopic {
  id: number
  name: string
  messages: Message[]
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    chatTopics: [] as ChatTopic[],
    currentChatTopicId: null as number | null
  }),
  getters: {
    currentChatMessages: (state) => {
      const topic = state.chatTopics.find(topic => topic.id === state.currentChatTopicId);
      return topic ? topic.messages : [];
    },
  },
  actions: {
    addChatTopic(name: string) {
      const newTopic: ChatTopic = {
        id: Date.now(),
        name,
        messages: [],
      };
      this.chatTopics.push(newTopic);
      this.currentChatTopicId = newTopic.id;
    },
    addMessageToCurrentTopic(text: string, sender: 'user' | 'ai') {
      if (this.currentChatTopicId) {
        const topic = this.chatTopics.find(topic => topic.id === this.currentChatTopicId);
        if (topic) {
          topic.messages.push({ id: Date.now(), text, sender });
        }
      }
    },
    setCurrentChatTopic(id: number) {
      this.currentChatTopicId = id;
    },
  },
})
