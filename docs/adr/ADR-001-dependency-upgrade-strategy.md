# ADR-001: 依赖升级策略

- **状态**: Accepted
- **日期**: 2026-04-29
- **关联 Story**: STORY-001

## 背景

项目基于 Create React App (react-scripts 5.0.1)，CRA 已停止维护。多个核心依赖存在大版本升级（React 19、react-router-dom v7、styled-components v6、TypeScript 5），需要确定升级范围和节奏。

## 决策

分两阶段升级：

**第一阶段（已完成）**：升级不涉及破坏性 API 变更的包：
- 工具链：commitlint 20、husky 9、semantic-release 25、TypeScript 5.9
- 类型定义：@types/jest 29、@types/node 22、@types/react 18.3
- 测试库：@testing-library/jest-dom 6、user-event 14
- 其他：web-vitals 4

**第二阶段（未来）**：需要架构迁移才能升级的包：
- React 18 → 19：需先脱离 CRA
- react-router-dom 6 → 7：Loader/Action API 变化大
- styled-components 5 → 6：transient props、.attrs 等 API 变化
- react-scripts → Vite：CRA 已 EOL，是所有升级的前置条件

## 备选方案

### 方案 A：全量升级（含 React 19 + Vite 迁移）
- 优点: 一次到位，技术栈最新
- 缺点: 工作量大，Class Component 与 React 19 可能有兼容问题，风险高

### 方案 B：安全范围内分批升级（已选择）
- 优点: 风险可控，验证简单，不阻塞业务
- 缺点: 核心框架仍停留在旧版本

### 方案 C：不升级
- 优点: 零风险
- 缺点: 安全漏洞持续存在，开发体验落后

## 影响

- 第二阶段升级建议以 CRA → Vite 迁移为启动点，这是 React 19 和其他框架升级的前置条件
- 当前 Class Component 写法（App.tsx、Canvas.tsx）应在迁移时一并重构为函数组件 + Hooks
