# ADR-004: DNS Managed on Cloudflare

- **Status:** accepted
- **Date:** 2026-05-04

## Context

The fanglin.me domain DNS has been migrated from Vercel DNS to Cloudflare DNS (managed by the main repo www.fanglin.me). This affects how game-of-life.fanglin.me resolves.

## DNS Configuration

The following CNAME record exists on Cloudflare DNS (managed centrally):

| Type  | Name         | Target               | Proxy |
| ----- | ------------ | -------------------- | ----- |
| CNAME | game-of-life | cname.vercel-dns.com | off   |

- DNS is managed in the Cloudflare Dashboard under fanglin.me zone
- Proxy is off — traffic goes directly to Vercel CDN
- SSL certificates are managed by Vercel (Let's Encrypt)
- Custom domain `game-of-life.fanglin.me` is bound to this Vercel project

## Consequences

- DNS changes for game-of-life.fanglin.me must be made in Cloudflare Dashboard
- Vercel project must have `game-of-life.fanglin.me` as a custom domain
- No action needed in this repo for DNS — it's managed centrally
