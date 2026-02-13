# 虚假内容替换清单与生产环境就绪报告

**生成时间**: 2026-02-12
**状态**: ✅ 已处理

本文档记录了代码库中从“演示态”向“生产态”迁移过程中，所有虚假数据、占位符、示例配置的替换情况与验证方式。

## 1. 环境变量与密钥配置

| 类别 | 变量名 | 原值/示例值 | 生产环境要求 | 验证方式 |
| :--- | :--- | :--- | :--- | :--- |
| **API Endpoint** | `VITE_SUPABASE_URL` | `https://your-project.supabase.co` | 真实 Supabase 项目 URL (必须以 https 开头) | `npm run verify-env` |
| **API Key** | `VITE_SUPABASE_ANON_KEY` | `your-anon-key-here` | 真实 Supabase Anon Key (长度 > 20) | `npm run verify-env` |
| **Domain** | `VITE_PRODUCTION_URL` | N/A (新增) | 生产环境域名 (如 `https://trae-lab.com`) | `npm run verify-env` |
| **CORS** | `ALLOWED_ORIGINS` | N/A (默认全放行) | 严格的域名白名单 (如 `https://trae-lab.com`) | `npm run verify-env` |

> **注意**: 请参考项目根目录下的 `.env.example` 文件配置您的真实 `.env` 文件。

## 2. UI 文本与占位符清洗

| 文件路径 | 原内容 (Fake/Placeholder) | 新内容 (Production Ready) | 备注 |
| :--- | :--- | :--- | :--- |
| `src/pages/Auth.tsx` | `placeholder="name@example.com"` | `placeholder="请输入您的邮箱地址"` | 移除 example.com 引用 |
| `src/pages/Auth.tsx` | (注册成功提示) | (保持不变) | 文案已是通用提示，无硬编码假数据 |

## 3. 文档修正

| 文件路径 | 修改点 | 说明 |
| :--- | :--- | :--- |
| `docs/authentication_system.md` | 验证链接示例 | 将 localhost 替换为 `<YOUR_PRODUCTION_DOMAIN>` 占位符，避免误导 |
| `README.md` | (待补充) | 建议添加 CI/CD 徽章与生产部署说明 |

## 4. 自动化校验机制

已在项目中集成以下自动化工具，确保后续提交不会引入新的虚假配置：

1.  **脚本**: `scripts/verify-env.ts`
    *   **功能**: 在构建前检查环境变量的完整性与格式合法性。
    *   **触发**: `npm run verify-env`
2.  **CI 流水线**: `.github/workflows/verify-production.yml`
    *   **功能**: 在每次 Push/PR 时自动运行校验脚本，阻止未配置 Secrets 的代码合入。

## 5. 关于测试数据的特别说明

在 `src/pages/__tests__/Auth.test.tsx` 等测试文件中，**保留**了如下 Mock 数据：
*   `test@example.com`
*   `mockSignIn`, `mockSignUp`
*   `Test User`

**原因**: 单元测试必须运行在隔离环境中，使用真实数据会污染生产环境并导致测试不稳定。这些 Mock 数据是测试工程的最佳实践，**不属于**需要替换的虚假内容。

## 6. 最终验证步骤 (上线前必做)

1.  在 Vercel/生产服务器配置环境变量（参考 `.env.example`）。
2.  运行构建: `npm run build` (会自动触发 `verify-env`)。
3.  检查构建日志，确认无 "❌ Invalid value" 报错。
4.  访问线上站点，确认登录/注册流程不再跳转至 localhost。
