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
    addChatTopic() {
      const newTopic: ChatTopic = {
        id: Date.now(),
        name: 'New Chat',
        messages: []
      }
      this.chatTopics.push(newTopic)
      this.currentChatTopicId = newTopic.id
    },
    renameChatTopic(id: number, newName: string) {
      const topic = this.chatTopics.find(topic => topic.id === id);
      if (topic) {
        topic.name = newName;
      }
    },
    setChatTopicNameFromAIResponse(chatId: number, aiResponse: string) {
      // 从AI回复中提取对话主题概括
      const topic = this.chatTopics.find(topic => topic.id === chatId);
      const isDefaultName = topic?.name === 'New Chat';
      const hasNoMessages = topic?.messages.length === 2; // 只有一问一答

      if (topic && isDefaultName && hasNoMessages) {
        // 只有当是默认名称且是第一次对话时才设置主题名称
        const summary = aiResponse.length > 20 
          ? aiResponse.substring(0, 20) + '...' 
          : aiResponse;
        topic.name = summary;
      }
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
