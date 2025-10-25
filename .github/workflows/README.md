# GitHub Actions 自动构建说明

## 自动构建流程

当你推送代码到 main 分支或创建新的标签（tag）时，GitHub Actions 会自动触发构建流程。

### 触发条件

1. 推送到 main 分支
2. 创建新的版本标签（格式：v*，例如 v1.0.0）
3. 创建 Pull Request 到 main 分支

### 构建内容

自动构建会同时在以下环境进行：
- Windows
- macOS
- Linux

### 发布流程

1. **普通提交**
   - 代码推送到 main 分支会触发构建
   - 构建产物会作为 artifacts 保存

2. **版本发布**
   - 创建新的标签（例如 v1.0.0）会触发发布流程
   - 自动创建 GitHub Release
   - 自动上传所有平台的安装包

## 如何发布新版本

1. 更新版本号
   ```bash
   npm version patch  # 小版本更新
   # 或
   npm version minor  # 功能版本更新
   # 或
   npm version major  # 主版本更新
   ```

2. 推送代码和标签
   ```bash
   git push && git push --tags
   ```

## 环境变量设置

在 GitHub 仓库的 Settings -> Secrets and variables -> Actions 中设置以下密钥：

- `WQ_API_KEY`: 万青 API 密钥（必需）
- `GITHUB_TOKEN`: GitHub 令牌（自动提供，无需手动设置）

## 如何获取构建包

构建完成后，可以通过以下两种方式获取打包程序：

1. **从 Actions 页面下载**
   - 进入仓库的 "Actions" 页面
   - 点击最新的构建记录
   - 在页面底部的 "Artifacts" 部分下载：
     - `windows-artifacts`: Windows 安装包（.exe）
     - `macos-artifacts`: macOS 安装包（.dmg）
     - `linux-artifacts`: Linux 安装包（.AppImage, .deb）

2. **从 Releases 页面下载**（仅适用于版本发布）
   - 进入仓库的 "Releases" 页面
   - 选择对应的版本
   - 下载对应平台的安装包

## 注意事项

- 确保在推送代码前已经设置好所有必需的 secrets
- 版本标签必须以 "v" 开头（例如 v1.0.0）
- Actions 构建产物会保存 90 天
- Release 版本的构建包会永久保存