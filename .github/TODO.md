# Todo 列表

#### 前端 (Renderer Process: `src/renderer`)

1.  **UI 组件搭建**
    *   [x] 创建一个聊天主视图组件，用于整合聊天界面。
    *   [x] 创建一个消息显示组件，用于展示用户和 AI 的对话消息。
    *   [x] 创建一个输入框组件，包含文本输入区域和发送按钮。
    *   [x] 创建一个侧边栏或顶部区域，用于显示和创建新的聊天主题。
    *   [x] 在 `App.vue` 中将这些组件组合起来，完成整体页面布局。

2.  **状态管理**
    *   [x] 管理当前对话的消息列表（例如，使用 `ref` 或 `reactive`）。
    *   [x] 管理聊天主题列表以及当前选中的主题。

3.  **与后端 (Main Process) 通信**
    *   [x] 在用户点击发送按钮时，调用通过 Preload 脚本暴露的后端 API，将用户输入的内容发送出去。
    *   [x] 接收后端返回的 AI 回复，并更新到消息列表中。

#### 后端 (Main Process: `src/main` & Preload: `src/preload`)

1.  **设置 IPC 通信**
    *   [x] 在 `src/main/handlers/chatHandler.ts` 中，使用 `ipcMain.handle` 注册了一个新的通道（`'chat:sendMessage'`）来接收前端发送的消息。
    *   [x] 在 `src/preload/index.ts` 中，更新 `api` 对象，添加了一个 `sendMessage` 函数，该函数内部使用 `ipcRenderer.invoke('chat:sendMessage', ...)` 来调用主进程。
    *   [x] 更新 `src/preload/index.d.ts` 文件，为新的 `sendMessage` 函数添加了 TypeScript 类型定义，以便在前端获得类型提示。

2.  **调用外部 AI 模型**
    *   [x] 在 `ipcMain.handle` 的回调函数中，编写了调用外部 AI 服务 API 的逻辑。安装并使用了 `axios` HTTP 客户端库。
    *   [x] 安全地处理 AI 服务的 API 密钥（使用环境变量 `WQ_API_KEY`，避免硬编码）。
    *   [x] 解析 AI 服务返回的数据。

3.  **返回结果给前端**
    *   [x] 将从 AI 模型获取的答案作为 `ipcMain.handle` 的返回值，这样前端的 `invoke` 调用就能收到结果。

#### 额外功能实现

4.  **打字机效果**
    *   [x] 实现了真正的逐字符打字机效果，AI回复逐字显示
    *   [x] 添加了闪烁光标动画效果
    *   [x] 实现了打字完成后的状态管理

5.  **界面优化**
    *   [x] 调整为全屏布局，移除固定宽度限制
    *   [x] 移除了纵向滚动条，提供更流畅的视觉体验
    *   [x] 优化了消息框的响应式宽度

6.  **代码架构优化**
    *   [x] 将 `chat:sendMessage` 处理函数独立到 `src/main/handlers/chatHandler.ts` 文件
    *   [x] 简化了 `src/main/index.ts`，移除了重复代码
    *   [x] 实现了模块化的代码结构，便于维护


#### 迭代功能

7. **Chats主题功能**
    *   [x] 对话主题可以重命名 - 点击✏️按钮可编辑主题名称
    *   [x] 模型有返回之后，设置chat名称为概括对话主题 - AI回复完成后自动设置

8. **版本更新**
    *   [x] 当有新的github release版本时，可提示版本更新
