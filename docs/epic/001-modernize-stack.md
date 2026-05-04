# Epic-001: 技术栈现代化

- **状态**: In Progress
- **创建日期**: 2026-04-29

## 目标

将 game-of-life 从 CRA 时代的技术栈升级到现代标准，提升开发体验和构建性能，为后续功能开发奠定基础。

## 背景

项目基于 Create React App (react-scripts)，CRA 已停止维护，锁定了旧版工具链，阻塞 React 19、TypeScript 5+ 等升级。多个核心依赖存在大版本落后。

## 范围

### 包含
- 依赖安全升级（工具链、类型包）
- 构建工具迁移 (CRA → Vite)
- 测试框架迁移 (Jest → Vitest)
- CI 流水线升级 (Node 22, Actions v4)
- 部署迁移 (AWS/Terraform → Vercel)

### 不包含
- 功能性变更（不改变用户可见的行为）
- UI/UX 重设计
- React 19 升级（待后续 Epic）

## Stories

| # | Story | 状态 |
|---|-------|------|
| 001 | [依赖升级](../story/STORY-001-dependency-upgrade.md) | Done |
| 002 | [CRA 迁移到 Vite](../story/STORY-002-cra-to-vite-migration.md) | Done |
| 003 | [从 AWS 迁移到 Vercel 部署](../story/STORY-003-deploy-to-vercel.md) | In Progress |

## 风险与依赖

- CRA → Vite 迁移是后续所有升级的前置条件
- Class Component (App.tsx, Canvas.tsx) 应在后续迁移时重构为函数组件 + Hooks

## 决策

- [ADR-001: 依赖升级策略](../adr/ADR-001-dependency-upgrade-strategy.md)
- [ADR-002: CRA 迁移到 Vite](../adr/ADR-002-cra-to-vite-migration.md)
- [ADR-003: 从 AWS 迁移到 Vercel 部署](../adr/ADR-003-deploy-to-vercel.md)
