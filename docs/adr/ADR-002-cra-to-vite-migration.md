# ADR-002: CRA 迁移到 Vite

- **状态**: Accepted
- **日期**: 2026-04-29
- **关联 Story**: STORY-002

## 背景

react-scripts (CRA) 已停止维护，锁定了 webpack 4/5、Babel、Jest 等旧版工具链，阻塞 React 19 和 TypeScript 5+ 的完整利用。需要选择替代构建工具。

## 决策

迁移到 Vite + Vitest。

- 构建工具：Vite（基于 esbuild + Rollup）
- 测试框架：Vitest（替代 Jest，API 兼容）
- ESLint：独立配置（移除 react-app preset）

## 备选方案

### 方案 A：Vite（已选择）
- 优点: 极快的 HMR，原生 ESM，社区活跃，配置简洁
- 缺点: 需要调整部分 CRA 约定（环境变量前缀 VITE_ 等）

### 方案 B：Next.js
- 优点: SSR/SSG 能力，文件路由
- 缺点: 过重，本项目是纯 SPA + HashRouter，不需要 SSR

### 方案 C：Rsbuild
- 优点: webpack 生态兼容，迁移成本低
- 缺点: 社区较小

## 影响

- 环境变量前缀从 `REACT_APP_` 改为 `VITE_`
- `public/index.html` 移至项目根目录
- Jest 测试迁移到 Vitest（API 基本兼容）
- ESLint 配置独立维护
