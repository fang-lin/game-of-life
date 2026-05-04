# STORY-013: HashLife 核心算法

- **状态**: Done
- **Epic**: [Epic-003](../epic/003-hashlife.md)
- **日期**: 2026-05-04
- **负责人**: Claude + linfang

## 背景

HashLife 的核心是递归计算 node.result()：对 level-n 节点，返回其中心区域经过 2^(n-2) 步演化后的 level-(n-1) 节点。通过 memoization，重复子问题直接查表。

## 目标

实现 HashLife 的 step/result 计算，包括 level-2 base case 和递归 case。

## 验收标准

- [x] level-2 base case：4×4 → 2×2，用 naive 规则计算
- [x] 递归 result：拆分为 9 个子问题 → 组合中心结果
- [x] result memoization：缓存在 Node 上
- [x] step(n) 支持：演化 n 步（通过 padding + 递归 result）
- [x] Oracle testing：与 naive 算法逐代对比
- [x] 已知 pattern 测试：Block 静止、Blinker 周期 2、Glider 位移

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | Story 创建 |
| 2026-05-04 | HashLife step/stepOne with memoization, 30 tests passing |
