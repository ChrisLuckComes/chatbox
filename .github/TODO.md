# Todo 列表

#### 前端 (Renderer Process: `src/renderer`)

1.  **UI 组件搭建**
    *   [x] 创建一个聊天主视图组件，用于整合聊天界面。
    *   [x] 创建一个消息显示组件，用于展示用户和 AI 的对话消息。
    *   [x] 创建一个输入框组件，包含文本输入区域和发送按钮。
    *   [x] 创建一个侧边栏或顶部区域，用于显示和创建新的聊天主题。
    *   [x] 在 `App.vue` 中将这些组件组合起来，完成整体页面布局。

2.  **状态管理**
    *   [ ] 管理当前对话的消息列表（例如，使用 `ref` 或 `reactive`）。
    *   [ ] 管理聊天主题列表以及当前选中的主题。

3.  **与后端 (Main Process) 通信**
    *   [ ] 在用户点击发送按钮时，调用通过 Preload 脚本暴露的后端 API，将用户输入的内容发送出去。
    *   [ ] 接收后端返回的 AI 回复，并更新到消息列表中。

#### 后端 (Main Process: `src/main` & Preload: `src/preload`)

1.  **设置 IPC 通信**
    *   [ ] 在 `src/main/index.ts` 中，使用 `ipcMain.handle` 注册一个新的通道（例如 `'chat:sendMessage'`) 来接收前端发送的消息。
    *   [ ] 在 `src/preload/index.ts` 中，更新 `api` 对象，添加一个 `sendMessage` 函数，该函数内部使用 `ipcRenderer.invoke('chat:sendMessage', ...)` 来调用主进程。
    *   [ ] (如果存在) 更新 `src/preload/index.d.ts` 文件，为新的 `sendMessage` 函数添加 TypeScript 类型定义，以便在前端获得类型提示。

2.  **调用外部 AI 模型**
    *   [ ] 在 `ipcMain.handle` 的回调函数中，编写调用外部 AI 服务 API 的逻辑。您可能需要安装一个 HTTP 客户端库，如 `axios`。
    *   [ ] 安全地处理 AI 服务的 API 密钥（建议使用环境变量，避免硬编码）。
    *   [ ] 解析 AI 服务返回的数据。

3.  **返回结果给前端**
    *   [ ] 将从 AI 模型获取的答案作为 `ipcMain.handle` 的返回值，这样前端的 `invoke` 调用就能收到结果。
