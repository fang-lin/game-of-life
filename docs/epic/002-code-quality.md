# Epic-002: 代码质量与现代化重构

- **状态**: Draft
- **创建日期**: 2026-05-04

## 目标

修复已知 bug，消除技术债，将 Class Component 重构为函数组件 + Hooks，补充测试覆盖，提升可访问性。

## 背景

Code review 发现多个问题：Class Component 与 HOC 模式过时、内存泄漏风险、测试覆盖不足（仅 LifeMap）、无障碍访问缺失。App 组件承载 10 个 state 属性和 6 个可选 method reference，prop drilling 严重。

## 范围

### 包含
- Bug 修复（stringifyCoordinate NaN 检查）
- 内存泄漏修复（drag listeners、Toast timeouts）
- App/Canvas 重构为函数组件 + Hooks
- 移除 withRouter HOC
- 引入 React Context 替代 prop drilling
- 补充单元测试（App.functions、Canvas 渲染逻辑）
- 主题颜色提取到 Theme
- 无障碍访问改进（ARIA labels、keyboard navigation）

### 不包含
- 功能性变更（不改变用户可见的行为）
- UI/UX 重设计
- React 19 / styled-components v6 升级

## Stories

| # | Story | 状态 |
|---|-------|------|
| 005 | [修复已知 bug 和内存泄漏](../story/STORY-005-fix-bugs-and-leaks.md) | Todo |
| 006 | [App.functions 单元测试](../story/STORY-006-test-app-functions.md) | Todo |
| 007 | [App 重构为函数组件 + Hooks](../story/STORY-007-refactor-app-to-hooks.md) | Todo |
| 008 | [Canvas 重构为函数组件](../story/STORY-008-refactor-canvas-to-hooks.md) | Todo |
| 009 | [引入 React Context 替代 prop drilling](../story/STORY-009-react-context.md) | Todo |
| 010 | [主题颜色整合与响应式断点修复](../story/STORY-010-theme-consolidation.md) | Todo |
| 011 | [无障碍访问改进](../story/STORY-011-accessibility.md) | Todo |

## 风险与依赖

- STORY-005 (bug fix) 无依赖，可立即开始
- STORY-006 (测试) 无依赖，可立即开始，且为后续重构提供回归保障
- STORY-007 (App 重构) 依赖 STORY-006 的测试覆盖作为回��基线
- STORY-008 (Canvas 重构) 依赖 STORY-007 完成
- STORY-009 (Context) 依赖 STORY-007 和 STORY-008 完成
- STORY-010 和 STORY-011 可独立进行

## 决策

暂无 ADR，如重构过程中产生架构决策再补充。
