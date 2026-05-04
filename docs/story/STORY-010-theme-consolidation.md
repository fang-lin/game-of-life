# STORY-010: 主题颜色整合与响应式断点修复

- **状态**: Todo
- **Epic**: [Epic-002](../epic/002-code-quality.md)
- **日期**: 2026-05-04
- **负责人**:

## 背景

Canvas 绘制颜色硬编码在 `Canvas.functions.tsx` 中（如 `#183A37`、`rgba(0,0,0,.1)`），未纳入 Theme 管理。响应式断点 `desktopL` 和 `desktop` 使用了相同的值。

## 目标

将所有颜色常量收归 Theme，修复响应式断点定义。

## 验收标准

- [ ] Canvas 绘制颜色（grid、cells、hovering cells、dead cells）提取到 Theme 或常量
- [ ] 修复 `App.styles.ts` 中 `desktopL` 断点与 `desktop` 重复的问题
- [ ] 消除样式文件中的 magic numbers（Toast top、Panel pressed offset、Dashboard margin）
- [ ] 视觉效果不变

## 技术方案

在 `Theme.ts` 中定义颜色常量，Canvas.functions 接收颜色参数而非硬编码。修复断点数值。

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | Story 创建 |
