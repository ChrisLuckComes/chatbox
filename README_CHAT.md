# ChatBox 聊天应用

一个基于 Electron + Vue 3 + TypeScript 的桌面聊天应用，集成了 OpenAI API。

## 功能特性

- 🎨 现代化的用户界面，使用 Tailwind CSS
- 💬 实时聊天功能，支持多轮对话
- 📝 聊天主题管理，可以创建和切换不同的聊天会话
- 🤖 集成 快手 KAT-Coder-Air V1 免费模型
- 🔄 响应式设计，支持不同屏幕尺寸
- 🚀 Electron 桌面应用，跨平台支持

## 技术栈

- **前端**: Vue 3 + TypeScript + Pinia + Tailwind CSS
- **桌面框架**: Electron + Electron-Vite
- **后端通信**: Electron IPC
- **AI 服务**: 快手 KAT-Coder-Air V1 API
- **HTTP 客户端**: Axios

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 万青 StreamLake API 密钥

在项目根目录创建 `.env` 文件并添加你的万青API密钥：

```env
WQ_API_KEY=your-api-key-here
```

> **重要**: 应用会自动加载 `.env` 文件中的环境变量。确保 `.env` 文件位于项目根目录。

### 3. 开发模式运行

```bash
npm run dev
```

### 4. 构建应用

```bash
npm run build
```

### 5. 打包应用

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

```bash
# Windows
npm run build:win

# macOS
npm run build:mac

# Linux
npm run build:linux
```

## 项目结构

```
src/
├── main/           # Electron 主进程
├── preload/        # 预加载脚本
└── renderer/       # Vue 前端应用
    ├── components/ # Vue 组件
    ├── store/      # Pinia 状态管理
    └── assets/     # 静态资源
```

## 主要组件

- **ChatView**: 主聊天界面容器
- **MessageDisplay**: 消息显示区域
- **ChatInput**: 消息输入框和发送按钮
- **Sidebar**: 聊天主题列表和管理
- **ChatStore**: 聊天状态管理 (Pinia)

## API 集成

应用使用 快手的 `KAT-Coder-Air-V1` 免费模型，支持：

- 智能对话回复
- 上下文理解
- 自然语言生成
- 代码生成和编程辅助

错误处理包括：
- 无效 API 密钥
- 配额超限
- 网络错误
- 速率限制

## 开发说明

### 添加新的 AI 服务

1. 在 `src/main/index.ts` 中修改 `chat:sendMessage` 处理器
2. 更新错误处理逻辑
3. 如需添加新配置，更新环境变量文档

### 自定义样式

- Tailwind CSS 配置: `tailwind.config.js`
- 全局样式: `src/renderer/src/assets/main.css`
- 组件样式使用 Tailwind 实用类

### 状态管理扩展

ChatStore 使用 Pinia，可以轻松扩展：

```typescript
// 添加新状态
state: () => ({
  // 现有状态...
  newFeature: false
})

// 添加新动作
actions: {
  // 现有动作...
  toggleNewFeature() {
    this.newFeature = !this.newFeature
  }
}
```

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！
