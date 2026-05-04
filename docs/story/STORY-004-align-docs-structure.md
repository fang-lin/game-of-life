# STORY-004: 对齐文档体系

- **状态**: Done
- **Epic**: [Epic-001](../epic/001-modernize-stack.md)
- **日期**: 2026-05-04
- **负责人**: Claude + linfang

## 背景

game-of-life 只有 `adr/` 和 `stories/` 两个文档目录，缺少 Epic、Spike、Runbook 等文档类型，模板分散在各目录的 TEMPLATE.md 中。function-plotter 已建立完整的文档体系，需要对齐。

## 目标

将文档结构与 function-plotter 对齐，建立统一的模板和目录规范。

## 验收标准

- [x] 创建 `docs/README.md` 文档体系说明
- [x] 创建 `docs/_templates/` 统一模板目录 (adr, epic, story, spike, runbook)
- [x] 创建 `docs/epic/`, `docs/spike/`, `docs/runbook/` 目录
- [x] `docs/stories/` 重命名为 `docs/story/`
- [x] 移除旧的内联 TEMPLATE.md
- [x] 创建 Epic-001 串联现有 Stories
- [x] 现有 Stories 添加 Epic 关联字段
- [x] STORY-002 状态更新为 Done

## 技术方案

参考 function-plotter 的 `docs/` 结构，保持中文风格与现有文档一致。

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | 文档体系对齐完成 |
