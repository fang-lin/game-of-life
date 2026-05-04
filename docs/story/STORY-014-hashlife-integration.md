# STORY-014: 集成替换 LifeMap

- **状态**: Done
- **Epic**: [Epic-003](../epic/003-hashlife.md)
- **日期**: 2026-05-04
- **负责人**: Claude + linfang

## 背景

HashLife 核心算法完成后，需要替换 LifeMap 的 evolve 实现，保持现有 API 兼容（addCell、getCells、evolve、deadList、bornList、toggleCells、reset 等）。

## 目标

用 HashLife 替换 LifeMap 内部实现，对外 API 不变，现有 26 个 LifeMap 测试全部通过。

## 验收标准

- [x] LifeMap.evolve() 内部使用 HashLife 进行演化
- [x] 现有 26 个 LifeMap 测试全部通过
- [x] deadList / bornList 仍然可用（渲染 dead cells 需要）
- [x] addCell / removeCell / toggleCells / getCells / reset API 不变
- [x] lint + build 通过
- [x] 大 pattern（Spacefiller2）性能可感知提升

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | Story 创建 |
| 2026-05-04 | LifeMap.evolve() 使用 HashLife，86 tests all passing |
