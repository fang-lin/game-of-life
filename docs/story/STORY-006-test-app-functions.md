# STORY-006: App.functions 单元测试

- **状态**: Todo
- **Epic**: [Epic-002](../epic/002-code-quality.md)
- **日期**: 2026-05-04
- **负责人**:

## 背景

`App.functions.ts` 包含 URL 参数解析、坐标转换、cells 编码等纯函数，是后续重构的基础，但目前零测试覆盖。需要在重构前建立回归基线。

## 目标

为 `App.functions.ts` 中所有导出函数编写单元测试，覆盖率 >90%。

## 验收标准

- [ ] `parseParams` / `stringifyParams` 测试覆盖：正常值、边界值、非法值
- [ ] `parseString` 测试覆盖：默认值回退、超范围值
- [ ] `stringifyCoordinate` 测试覆盖：正常数字、NaN、负数
- [ ] `rotateCells` 测试覆盖：90°/180°/270° 旋转
- [ ] `combinePathToURL` 测试覆盖
- [ ] cells 编解码往返测试（encode → decode 一致性）
- [ ] 覆盖率 >90%

## 技术方案

使用 Vitest 编写，放在 `src/__tests__/App.functions.test.ts`。纯函数测试，不需要 DOM 环境。

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | Story 创建 |
