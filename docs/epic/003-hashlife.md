# Epic-003: HashLife 算法实现

- **状态**: Done
- **创建日期**: 2026-05-04

## 目标

用 HashLife（基于四叉树的 memoized 算法）替换当前 O(64N) 的 naive evolve 实现，大幅提升大规模 pattern 的演化性能。

## 背景

当前 LifeMap.evolve() 对每个活细胞的每个空邻居重复调用 getNeighborsNum（8×8=64 次 Map 查找/细胞），且大量字符串分配造成 GC 压力。HashLife 通过四叉树递归分治 + canonical node 去重 + result memoization，可将重复子问题的计算降至 O(1) 查表。

## 范围

### 包含
- QuadTree 节点数据结构与 canonical node pool
- HashLife 递归 RESULT 计算（memoized step）
- 替换 LifeMap.evolve，保持现有 API 兼容
- Oracle testing（naive vs HashLife 对比验证）

### 不包含
- Superstep / 时间跳跃 UI（未来 Epic）
- Web Worker 迁移
- 渲染优化

## Stories

| # | Story | 状态 |
|---|-------|------|
| 012 | [QuadTree 节点 + 规范化池](../story/STORY-012-quadtree-nodes.md) | Done |
| 013 | [HashLife 核心算法](../story/STORY-013-hashlife-core.md) | Done |
| 014 | [集成替换 LifeMap](../story/STORY-014-hashlife-integration.md) | Done |

## 风险与依赖

- STORY-012 是 013 的前置
- STORY-013 是 014 的前置
- 现有 26 个 LifeMap 测试 + 30 个 App.functions 测试必须全部通过

## 决策

暂无 ADR，如实现中需要做架构取舍再补充。
