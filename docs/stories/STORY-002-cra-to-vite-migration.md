# STORY-002: CRA 迁移到 Vite

- **状态**: In Progress
- **日期**: 2026-04-29
- **负责人**: Claude + linfang

## 背景

Create React App (react-scripts) 已停止维护，是 React 19、styled-components v6 等升级的阻塞项。需要迁移到现代构建工具。

## 目标

将构建工具从 CRA (react-scripts) 迁移到 Vite，保持现有功能完全不变。

## 验收标准

- [ ] 移除 react-scripts 依赖
- [ ] Vite 配置完成，dev server 和 build 正常工作
- [ ] 所有测试通过（迁移到 Vitest）
- [ ] ESLint 配置独立（不再依赖 react-app preset）
- [ ] HashRouter 路由正常
- [ ] 生产构建产物正常
- [ ] ADR 记录迁移决策

## 技术方案

详见 [ADR-002](../adr/ADR-002-cra-to-vite-migration.md)。

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-04-29 | Story 创建，开始迁移 |
