# STORY-012: QuadTree 节点 + 规范化池

- **状态**: Done
- **Epic**: [Epic-003](../epic/003-hashlife.md)
- **日期**: 2026-05-04
- **负责人**: Claude + linfang

## 背景

HashLife 的基础是 canonical quadtree node：每个节点由 (nw, ne, sw, se) 四个子节点唯一确定，通过 hash consing 保证结构共享和去重。

## 目标

实现 QuadTree Node 类和 canonical node pool，为 HashLife 核心算法提供数据结构基础。

## 验收标准

- [x] Node 类：level、population、nw/ne/sw/se 子节点、id
- [x] Leaf node（level 0）：表示单个 cell（alive/dead）
- [x] Canonical pool：相同 (nw, ne, sw, se) 只创建一个 Node 实例
- [x] Node.create() 工厂方法，自动去重
- [x] emptyTree(level) 快速构建空树
- [x] setBit / getBit：在树中读写单个 cell
- [x] 单元测试覆盖

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | Story 创建 |
| 2026-05-04 | QuadTree Node, NodePool, getBit/setBit/expand/collectCells 完成 |
