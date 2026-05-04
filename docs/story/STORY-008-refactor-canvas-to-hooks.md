# STORY-008: Canvas 重构为函数组件

- **状态**: Todo
- **Epic**: [Epic-002](../epic/002-code-quality.md)
- **日期**: 2026-05-04
- **负责人**:

## 背景

Canvas.tsx 是 Class Component，通过 `LifeMapHooks` 接口将内部方法暴露给父组件 App，这种反模式导致父子组件高度耦合。

## 目标

将 Canvas 重构为函数组件，用 `useImperativeHandle` + `forwardRef` 或更好的模式替代 LifeMapHooks 回调。

## 验收标准

- [ ] Canvas 改为函数组件
- [ ] 移除 `LifeMapHooks` 接口和 `setLifeMapHooks` 回调
- [ ] LifeMap 实例管理改用 `useRef`
- [ ] `requestAnimationFrame` 动画循环使用 `useEffect` + cleanup
- [ ] `shouldLayoutCanvas` 逻辑用 `useEffect` 依赖数组替代
- [ ] hoveringCells 管理改用 `useState` 或 `useRef`
- [ ] 所有现有功能不变

## 技术方案

依赖 STORY-007 完成。Canvas 内部状态用 hooks 管理，对外暴露 API 可用 `useImperativeHandle` 或将 LifeMap 提升到 Context。

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | Story 创建 |
