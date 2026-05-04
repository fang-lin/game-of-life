# STORY-009: 引入 React Context 替代 prop drilling

- **状态**: Cancelled
- **Epic**: [Epic-002](../epic/002-code-quality.md)
- **日期**: 2026-05-04
- **负责人**:

## 背景

当前 App 组件将 state 和回调通过 props 逐层传递给 Dashboard → Panel/Header/Footer、Canvas 等子组件。Props 数量多且层级深。

## 目标

引入 React Context 管理共享状态（game state、callbacks），减少 prop drilling。

## 验收标准

- [ ] 创建 GameContext 管理游戏状态（playState、evolutionIndex、cellsCount、origin 等）
- [ ] 创建 GameDispatchContext 管理操作回调（play、pause、reset、next 等）
- [ ] Dashboard、Panel、Header、Footer 从 Context 消费状态，不再通过 props
- [ ] Canvas 从 Context 获取必要状态
- [ ] Props 接口大幅简化
- [ ] 所有现有功能不变

## 技术方案

依赖 STORY-007 和 STORY-008 完成。使用 `useContext` + `useReducer` 模式，将状态和 dispatch 分离为两个 Context，避免不必要的 re-render。

## 备注

取消原因：重构后 prop drilling 只有一层（App → Panel/Dashboard/Toast），引入 Context 反而增加复杂度，不值得。

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | Story 创建 |
| 2026-05-04 | 评估后取消 |
