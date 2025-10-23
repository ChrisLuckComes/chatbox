import { defineStore } from 'pinia'

interface Message {
  id: number
  text: string
  sender: 'user' | 'ai'
  displayText?: string
  isComplete?: boolean
}

interface ChatTopic {
  id: number
  name: string
  messages: Message[]
}

export const useChatStore = defineStore('chat', {
  state: () => ({
    chatTopics: [
      {
        id: 1,
        name: 'New Chat',
        messages: []
      }
    ] as ChatTopic[],
    currentChatTopicId: 1 as number | null
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
          const message = { 
            id: Date.now(), 
            text, 
            sender,
            displayText: sender === 'ai' ? '' : text,
            isComplete: sender === 'user'
          }
          topic.messages.push(message);
        }
      }
    },
    updateMessageDisplayText(messageId: number, displayText: string) {
      if (this.currentChatTopicId) {
        const topic = this.chatTopics.find(topic => topic.id === this.currentChatTopicId);
        if (topic) {
          const message = topic.messages.find(msg => msg.id === messageId);
          if (message) {
            message.displayText = displayText;
          }
        }
      }
    },
    markMessageComplete(messageId: number) {
      if (this.currentChatTopicId) {
        const topic = this.chatTopics.find(topic => topic.id === this.currentChatTopicId);
        if (topic) {
          const message = topic.messages.find(msg => msg.id === messageId);
          if (message) {
            message.isComplete = true;
          }
        }
      }
    },
    setCurrentChatTopic(id: number) {
      this.currentChatTopicId = id;
    },
  },
})
