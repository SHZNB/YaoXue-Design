# Diagnose and Fix Application Issues Spec

## Why
用户反馈应用当前无法使用（"不能用"），需要进行全面筛查以确定原因并修复。这可能与最近的部署更改（如路由模式切换、环境变量配置）或潜在的构建/运行时错误有关。

## What Changes
- **Configuration Verification**: 检查 `vite.config.ts` 的 `base` 路径配置。
- **Router Setup**: 确认 `App.tsx` 中是否正确使用了 `HashRouter` 以兼容 GitHub Pages。
- **Environment Handling**: 检查 Supabase 客户端初始化逻辑，确保在缺少环境变量时有适当的降级或错误提示，而不是直接崩溃。
- **Dependency Check**: 验证关键依赖是否安装正确。
- **Build Verification**: 运行本地构建以捕获潜在的编译错误。

## Impact
- **Affected Specs**: `deploy-to-github-pages` (configuration might be adjusted).
- **Affected Code**: `src/App.tsx`, `vite.config.ts`, `src/lib/supabase.ts`.

## MODIFIED Requirements
### Requirement: Robust Initialization
系统在初始化时应检查必要的环境变量，并在缺失时提供明确的用户反馈，而不是白屏或无响应。

#### Scenario: Missing Env Vars
- **WHEN** 应用启动且检测到 `VITE_SUPABASE_URL` 或 `KEY` 缺失。
- **THEN** 应用应在控制台输出警告，并可能在 UI 上显示配置错误提示（如果我们决定添加此 UI）。

### Requirement: GitHub Pages Compatibility
应用必须使用 `HashRouter` 和正确的 `base` 路径配置，以确保在 GitHub Pages 子路径下正常加载资源。
