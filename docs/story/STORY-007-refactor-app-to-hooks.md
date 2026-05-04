# STORY-007: App 重构为函数组件 + Hooks

- **状态**: Todo
- **Epic**: [Epic-002](../epic/002-code-quality.md)
- **日期**: 2026-05-04
- **负责人**:

## 背景

App.tsx 是 Class Component，使用 withRouter HOC（含 `any` 类型）、10 个 state 属性、6 个可选 private method reference。���是项目最大的技术债。

## 目标

将 App 重构为函数组件，使用 React Hooks（useState、useEffect、useCallback、useRef），移除 withRouter HOC。

## 验收标准

- [ ] App 改为函数组件
- [ ] 移除 `withRouter` HOC，直接使用 `useNavigate`、`useParams`
- [ ] 移除所有 `any` 类型
- [ ] State 按关注点拆分为多个 `useState`
- [ ] 事件监听器使用 `useEffect` + cleanup
- [ ] drag listeners 泄漏问题在重构中彻底解决
- [ ] 所有现有功能不变
- [ ] 现有测试通过

## 技术方案

1. 提取自定义 hooks：`useWindowResize`、`useDrag`、`useKeyboard`
2. 将 `withRouter` 替换为 `useNavigate` + `useParams`
3. 用 `useRef` 替代 private method references
4. 用 `useCallback` 稳定回调函数引用

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | Story 创建 |
