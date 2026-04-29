# STORY-001: 依赖升级

- **状态**: Done
- **日期**: 2026-04-29
- **负责人**: Claude + linfang

## 背景

项目依赖长期未更新，多个包存在大版本落后，部分有已知安全漏洞。Node.js 运行环境已升级到 v22，需要同步更新依赖和引擎配置。

## 目标

将可安全升级的依赖更新到最新版本，保持构建和测试正常通过。

## 验收标准

- [x] 安全范围内的依赖升级到最新大版本
- [x] husky v9 配置迁移完成
- [x] `npm test` 26 个测试全部通过
- [x] `npm run build` 构建成功
- [x] engines 字段更新为 node>=22, npm>=10
- [x] 记录暂未升级的包及原因（见 ADR-001）

## 技术方案

分批升级：先升级工具链和类型包（无破坏性），再处理 husky v8→v9 的配置迁移。受 react-scripts (CRA) 限制，React 19、react-router-dom v7、styled-components v6 暂不升级。

详见 [ADR-001](../adr/ADR-001-dependency-upgrade-strategy.md)。

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-04-29 | 完成安全范围依赖升级，husky v9 迁移 |
