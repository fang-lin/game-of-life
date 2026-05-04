# STORY-005: 修复已知 bug 和内存泄漏

- **状态**: Done
- **Epic**: [Epic-002](../epic/002-code-quality.md)
- **日期**: 2026-05-04
- **负责人**:

## 背景

Code review 发现一个逻辑 bug 和多处内存泄漏风险，需要优先修复。

## 目标

修复所有已知 bug 和内存泄漏，不改变功能行为。

## 验收标准

- [x] 修复 `App.functions.ts:119` — `Number.isNaN(stringifyCoordinate)` 改为 `Number.isNaN(n)`
- [x] 修复 `App.tsx` drag listener 泄漏 — 在 `componentWillUnmount` 中清理 `onDragging` 和 `onDragEnd`
- [x] 修复 `Toast.tsx` — `setTimeout` 添加 cleanup（useEffect return）
- [x] 修复 `App.tsx:136` — 移除 `as unknown as KeyboardEvent` 双重转型，使用正确的事件类型
- [x] 现有测试通过

## 技术方案

纯 bug fix，逐个修复，每个修复独立验证。

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | Story 创建 |
| 2026-05-04 | Bug fixes and memory leak cleanup complete |
