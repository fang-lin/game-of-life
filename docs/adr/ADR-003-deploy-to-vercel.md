# ADR-003: 从 AWS 迁移到 Vercel 部署

- **状态**: Accepted
- **日期**: 2026-05-04
- **关联 Story**: STORY-003

## 背景

当前部署通过 Terraform 管理 AWS 基础设施（S3 + CloudFront + Route53），配置复杂，且需要维护 AWS credentials。function-plotter 已成功迁移到 Vercel，验证了可行性。

## 备选方案

### 方案 A：Vercel（已选择）
- 优点: 零基础设施维护，内置 PR 预览部署，与 GitHub Actions 集成简单，function-plotter 已有成熟模板
- 缺点: 依赖第三方平台，免费额度有限制

### 方案 B：保持 AWS + Terraform
- 优点: 完全控制基础设施，无平台依赖
- 缺点: 维护成本高，无 PR 预览部署，需管理 AWS secrets

### 方案 C：GitHub Pages
- 优点: 免费，配置简单
- 缺点: 自定义域名 HTTPS 支持有限，无预览部署

## 决策

迁移到 Vercel。删除 Terraform 配置，GitHub Actions workflow 改为四阶段：lint-and-test → deploy-preview (PR) → deploy-production (master) → release。

## 影响

- 删除 `terraform/` 目录和相关 `.gitignore` 条目
- GitHub repo secrets 从 AWS credentials 改为 Vercel tokens (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
- semantic-release 独立为单独 job，在部署成功后才执行
- PR 获得预览部署能力
