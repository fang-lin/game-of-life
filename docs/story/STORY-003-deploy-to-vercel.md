# STORY-003: 从 AWS 迁移到 Vercel 部署

- **状态**: In Progress
- **Epic**: [Epic-001](../epic/001-modernize-stack.md)
- **日期**: 2026-05-04
- **负责人**: Claude + linfang

## 背景

当前通过 Terraform + AWS (S3/CloudFront/Route53) 部署，维护成本高。function-plotter 已迁移到 Vercel，需要对齐部署方案。

## 目标

将部署从 AWS 迁移到 Vercel，获得 PR 预览部署能力，简化运维。

## 验收标准

- [x] 删除 Terraform 配置
- [x] GitHub Actions workflow 改为 Vercel 部署（四阶段 pipeline）
- [x] .gitignore 更新（.terraform → .vercel）
- [x] ADR 记录迁移决策
- [x] Vercel 项目初始化 (`vercel link`)
- [x] GitHub repo secrets 配置 (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)
- [x] 旧 AWS secrets 清理
- [x] 自定义域名 game-of-life.fanglin.me 配置到 Vercel
- [ ] 生���部署验证通过
- [ ] ���除 AWS 旧资源 (S3 bucket, CloudFront distribution, Route53 record)

## 技术方案

详见 [ADR-003](../adr/ADR-003-deploy-to-vercel.md)。

## 变更记录

| 日期 | 变更内容 |
|------|---------|
| 2026-05-04 | 删除 Terraform，重写 workflow，创建 ADR-003 |
| 2026-05-04 | Vercel link、secrets 配置、域名添加完成 |
