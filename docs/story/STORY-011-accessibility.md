# STORY-011: 无障碍访问改进

- **状态**: Todo
- **Epic**: [Epic-002](../epic/002-code-quality.md)
- **日期**: 2026-05-04
- **负责人**:

## 背景

Code review 发现严重的无障碍问题：图标按钮无 ARIA labels、Canvas 无替代文本、无键盘导航支持、部分颜色对比度不足。

## 目标

达到 WCAG 2.1 AA 级别的基本合规。

## 验收标准

- [ ] 所有图标按钮添加 `aria-label`（Panel 中的 play/pause/stop/next/edit/share/zoom 等）
- [ ] Canvas 元素添加 `role="img"` 和 `aria-label`
- [ ] Toast 通知添加 `role="alert"` 或 `aria-live="polite"`
- [ ] 所有交互元素可通过键盘 Tab 导航
- [ ] 添加 focus 样式（visible focus ring）
- [ ] Header 使用语义化 HTML 结构
- [ ] 颜色对比度检查并修复不达标项

## 技术方案

逐个组件添加 ARIA 属性。键盘导航通过 tabindex 和 onKeyDown 实现。用 axe-core 或 Lighthouse 做最终验证。

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | Story 创建 |
