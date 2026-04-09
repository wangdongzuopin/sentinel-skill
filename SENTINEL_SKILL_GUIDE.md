---
name: sentinel-guide
description: Sentinel 安全技能使用指南 / Sentinel Security Skill Usage Guide
---

# Sentinel 安全技能使用指南 / Sentinel Security Skill Usage Guide

<!-- lang:zh -->
## 中文模式

---

## Sentinel 与 Superpowers 配合使用

**Sentinel 是 Superpowers 的安全技能扩展，不是替代品。**

### 协作关系

```
Superpowers (基础技能框架)
    │
    ├── 开发工作流 / 开发技能
    ├── 代码审查 / Code Review
    ├── 测试驱动开发 / TDD
    ├── 调试技能 / Debugging
    │
    └── Sentinel (安全技能扩展) ← 专注于安全领域
        │
        ├── 代码审计 / Code Audit
        ├── 渗透测试 / Pentest
        ├── CTF 挑战 / CTF Challenges
        ├── CVE 研究 / CVE Research
        ├── 前端安全 / Frontend Security
        └── 报告生成 / Report Generation
```

### Superpowers 配合技能

| Superpowers 技能 | Sentinel 配合场景 |
|------------------|-------------------|
| `superpowers:systematic-debugging` | 漏洞根因分析（追踪 SSRF、注入等漏洞来源） |
| `superpowers:requesting-code-review` | 安全修复代码审查 |
| `superpowers:subagent-driven-development` | 并行化多目标评估（多个 API 端点同时审计） |
| `superpowers:brainstorming` | 安全方案设计前头脑风暴 |
| `superpowers:verification-before-completion` | 漏洞修复验证 |

### 典型工作流

```
1. 发现安全问题
   ↓
2. 使用 superpowers:systematic-debugging 分析根因
   ↓
3. 使用 sentinel:sentinel-audit 进行代码审计
   ↓
4. 使用 sentinel:sentinel-cve 查询 CVE/CVSS
   ↓
5. 使用 superpowers:requesting-code-review 审查修复
   ↓
6. 使用 sentinel:sentinel-report 生成安全报告
```

### 指令优先级

Sentinel 遵循与 Superpowers 相同的优先级链：

1. **用户的明确指令** — 最高优先级
2. **Sentinel 安全技能** — 安全任务时覆盖默认值
3. **Superpowers 技能** — 开发工作流仍适用
4. **系统默认行为** — 最低优先级

<!-- /lang:zh -->

<!-- lang:en -->
## English Mode

---

## Sentinel Integration with Superpowers

**Sentinel is a security skill extension for Superpowers, NOT a replacement.**

### Collaboration Model

```
Superpowers (Base Skill Framework)
    │
    ├── Development Workflow / Skills
    ├── Code Review
    ├── Test-Driven Development
    ├── Debugging Skills
    │
    └── Sentinel (Security Skill Extension) ← Focused on Security
        │
        ├── Code Audit
        ├── Penetration Testing
        ├── CTF Challenges
        ├── CVE Research
        ├── Frontend Security
        └── Report Generation
```

### Superpowers Integration Skills

| Superpowers Skill | Sentinel Use Case |
|-------------------|-------------------|
| `superpowers:systematic-debugging` | Vulnerability root cause analysis (tracing SSRF, injection sources) |
| `superpowers:requesting-code-review` | Security fix code review |
| `superpowers:subagent-driven-development` | Parallel multi-target assessment (audit multiple API endpoints simultaneously) |
| `superpowers:brainstorming` | Security solution design brainstorming |
| `superpowers:verification-before-completion` | Vulnerability fix verification |

### Typical Workflow

```
1. Security issue discovered
   ↓
2. Use superpowers:systematic-debugging to analyze root cause
   ↓
3. Use sentinel:sentinel-audit for code audit
   ↓
4. Use sentinel:sentinel-cve to query CVE/CVSS
   ↓
5. Use superpowers:requesting-code-review to review the fix
   ↓
6. Use sentinel:sentinel-report to generate security report
```

### Instruction Priority

Sentinel follows the same priority chain as Superpowers:

1. **User's explicit instructions** — highest priority
2. **Sentinel security skills** — override defaults for security tasks
3. **Superpowers skills** — still apply for development workflow
4. **System default behavior** — lowest priority

<!-- /lang:en -->

---

<!-- lang:zh -->
## 第一步：架构检测 Architecture Detection

使用 `using-sentinel` 技能时，**必须首先检测架构**，再路由到对应技能。

### 检测清单

```
☐ 1. 确定应用类型
  ├── 前端 (Frontend)     → Vue.js / React / Angular
  ├── 后端 (Backend)      → PHP / Python / Node.js / Java / Go / C#
  ├── 移动端 (Mobile)     → Android / iOS
  ├── API (API-only)      → REST / GraphQL / gRPC
  ├── 桌面端 (Desktop)     → Electron / Qt / .NET
  └── 基础设施 (Infra)     → Docker / Kubernetes / Cloud

☐ 2. 确定框架
  ├── PHP: Laravel / Symfony / CodeIgniter
  ├── Python: Django / Flask / FastAPI
  ├── Java: Spring / Struts
  ├── Node.js: Express / Koa / NestJS
  └── Go: Gin / Echo / Fiber

☐ 3. 确定部署环境
  ├── 本地部署 / 云 (AWS/GCP/Azure)
  ├── 容器化 (Docker/Kubernetes)
  └── Serverless
```

### 技能路由表

| 架构 | 技能 | 参考文件 |
|------|------|----------|
| 前端 (Vue/React/Angular) | `sentinel:sentinel-frontend` | `patterns-vue/react/angular.md` |
| 后端 (PHP) | `sentinel:sentinel-audit` | `patterns-php.md` |
| 后端 (Python) | `sentinel:sentinel-audit` | `patterns-python.md` |
| 后端 (Node.js) | `sentinel:sentinel-audit` | `patterns-js.md` |
| 后端 (Java) | `sentinel:sentinel-audit` | `patterns-java.md` |
| API (REST/GraphQL) | `sentinel:sentinel-audit` | + `patterns-idor.md` |
| 全栈 (Full Stack) | `sentinel:sentinel-audit` | + 所有参考文件 |
| 渗透测试 | `sentinel:sentinel-pentest` | — |
| CTF 挑战 | `sentinel:sentinel-ctf` | — |
| 漏洞报告 | `sentinel:sentinel-report` | — |
| CVE 查询 | `sentinel:sentinel-cve` | — |

### 路由流程图

```
用户请求
    ↓
检测架构
    ↓
┌─────────────────────────────────────────┐
│  Vue/React/Angular?                      │ → sentinel:sentinel-frontend
├─────────────────────────────────────────┤
│  PHP/Python/Node/Java?                   │ → sentinel:sentinel-audit
├─────────────────────────────────────────┤
│  REST/GraphQL API?                       │ → sentinel:sentinel-audit
├─────────────────────────────────────────┤
│  移动端 Mobile?                          │ → sentinel:sentinel-audit
├─────────────────────────────────────────┤
│  授权渗透测试 Live Pentest?              │ → sentinel:sentinel-pentest
├─────────────────────────────────────────┤
│  CTF 挑战?                              │ → sentinel:sentinel-ctf
└─────────────────────────────────────────┘
    ↓
不确定时 → sentinel:sentinel-audit (覆盖最广)
```

---

## 第二步：执行安全审计 Security Audit

### OWASP Top 10+ 漏洞检查清单

| 编号 | 漏洞类型 | 检查要点 |
|------|----------|----------|
| A01 | **访问控制** | IDOR、水平越权、垂直越权、权限绕过 |
| A02 | **密码学失败** | 硬编码密钥、弱加密、MD5/SHA1 |
| A03 | **注入** | SQL、命令、LDAP、XPath、NoSQL、模板注入 |
| A04 | **不安全设计** | 业务逻辑缺陷、竞争条件(TOCTOU) |
| A05 | **安全配置错误** | Debug模式、默认凭证、信息泄露 |
| A06 | **危险组件** | 依赖漏洞、过期库、 typosquatting |
| A07 | **认证失败** | 暴力破解、会话 fixation、JWT 漏洞 |
| A08 | **数据完整性** | 不安全反序列化、CI/CD 注入 |
| A09 | **日志监控失败** | 缺少安全事件日志、PII 泄露 |
| A10 | **SSRF** | 服务端请求伪造、内网探测 |
| A11 | **CSRF** | 跨站请求伪造、Token 验证 |
| A12 | **点击劫持** | Frame busting、X-Frame-Options |
| A13 | **会话安全** | Session fixation、Timeout、Cookie flags |
| A14 | **资源消耗** | 无限制上传、无 Rate limiting |
| A15 | **OAuth/SSO** | redirect_uri 绕过、state 参数 CSRF |
| A16 | **WebSocket** | WS 认证缺失、授权检查缺失 |
| A17 | **CORS 错误配置** | Wildcard + Credentials |
| A18 | **GraphQL** | Introspection 滥用、批量查询 DoS |
| A19 | **竞争条件** | 双重提现、优惠券复用 |
| A20 | **子域名接管** | 悬空 DNS、过期云服务 |

### 前端框架特殊检查

| 框架 | 漏洞模式 |
|------|----------|
| Vue.js | `v-html`、模板注入、SSTI |
| React | `dangerouslySetInnerHTML`、URL handling XSS |
| Angular | `bypassSecurityTrust*`、SSR XSS |

---

## 第三步：漏洞扫描示例

### 示例 1: Vue.js 组件

```vue
<!-- aa.vue -->
<template>
    <div class="aa">
      <slot></slot>
    </div>
</template>
<script>
export default {
  name: 'aa'
}
</script>
```

**扫描结果**:

| 检查项 | 状态 | 说明 |
|--------|------|------|
| XSS | ✅ 通过 | 无用户输入渲染 |
| v-html 滥用 | ✅ 通过 | 未使用 |
| 内联样式/脚本 | ✅ 通过 | 无 |
| 敏感数据暴露 | ✅ 通过 | 无硬编码密钥 |

**结论**: `aa.vue` 是简单组件，无安全漏洞。

### 示例 2: Node.js API (test-vuln.js)

**检测结果**: Node.js + Express → `sentinel:sentinel-audit` + `patterns-js.md`

**发现的漏洞**:

| 严重度 | 行号 | 漏洞类型 | 代码片段 |
|--------|------|----------|----------|
| Critical | L12 | SQL注入 | `"SELECT * FROM users WHERE id = " + userId` |
| Critical | L49 | 命令注入 | `exec('ping -c 3 ' + host)` |
| High | L27 | IDOR | `db.query('SELECT * FROM invoices WHERE id = ?')` |
| High | L33 | 垂直越权 | `User.update({ id: userId, role: newRole })` |
| High | L60 | SSRF | `axios.get(url)` |
| Medium | L22 | XSS | `res.send('<div>' + name + '</div>')` |
| Medium | L53 | CORS错误 | `Access-Control-Allow-Origin: *` |
| Low | L44-45 | 硬编码密钥 | `API_KEY = 'sk_live_1234567890abcdef'` |

---

## 第四步：输出安全报告

审计完成后，使用 `sentinel:sentinel-report` 生成报告。

### 报告模板

```markdown
# 安全审计报告
**目标**: [系统/应用名称]
**类型**: 代码审计 / 渗透测试
**日期**: YYYY-MM-DD

## 执行摘要
[2-4句话描述测试范围和整体风险]

## 漏洞汇总

| 严重度 | 数量 |
|--------|------|
| Critical | N |
| High | N |
| Medium | N |
| Low | N |

## 详细发现

### [SEVERITY] FIND-001: [漏洞名称]
- **CWE**: CWE-XXX
- **CVSS**: X.X
- **位置**: [文件:行号]
- **描述**: [漏洞说明]
- **影响**: [攻击后果]
- **修复**: [修复方案]
```

---

<!-- lang:en -->
## English Mode

---

## Step 1: Architecture Detection

When using `using-sentinel` skill, you **MUST detect architecture first**, then route to the appropriate skill.

### Detection Checklist

```
☐ 1. Determine Application Type
  ├── Frontend     → Vue.js / React / Angular
  ├── Backend      → PHP / Python / Node.js / Java / Go / C#
  ├── Mobile       → Android / iOS
  ├── API-only     → REST / GraphQL / gRPC
  ├── Desktop      → Electron / Qt / .NET
  └── Infrastructure → Docker / Kubernetes / Cloud

☐ 2. Determine Framework
  ├── PHP: Laravel / Symfony / CodeIgniter
  ├── Python: Django / Flask / FastAPI
  ├── Java: Spring / Struts
  ├── Node.js: Express / Koa / NestJS
  └── Go: Gin / Echo / Fiber

☐ 3. Determine Deployment
  ├── On-premise / Cloud (AWS/GCP/Azure)
  ├── Containerized (Docker/Kubernetes)
  └── Serverless
```

### Skill Routing Table

| Architecture | Skill | Reference Files |
|--------------|-------|-----------------|
| Frontend (Vue/React/Angular) | `sentinel:sentinel-frontend` | `patterns-vue/react/angular.md` |
| Backend (PHP) | `sentinel:sentinel-audit` | `patterns-php.md` |
| Backend (Python) | `sentinel:sentinel-audit` | `patterns-python.md` |
| Backend (Node.js) | `sentinel:sentinel-audit` | `patterns-js.md` |
| Backend (Java) | `sentinel:sentinel-audit` | `patterns-java.md` |
| API (REST/GraphQL) | `sentinel:sentinel-audit` | + `patterns-idor.md` |
| Full Stack | `sentinel:sentinel-audit` | + all references |
| Live Pentest | `sentinel:sentinel-pentest` | — |
| CTF Challenge | `sentinel:sentinel-ctf` | — |
| Report Writing | `sentinel:sentinel-report` | — |
| CVE Lookup | `sentinel:sentinel-cve` | — |

### Routing Flowchart

```
User Request
    ↓
Detect Architecture
    ↓
┌─────────────────────────────────────────┐
│  Vue/React/Angular?                     │ → sentinel:sentinel-frontend
├─────────────────────────────────────────┤
│  PHP/Python/Node/Java?                  │ → sentinel:sentinel-audit
├─────────────────────────────────────────┤
│  REST/GraphQL API?                      │ → sentinel:sentinel-audit
├─────────────────────────────────────────┤
│  Mobile?                                 │ → sentinel:sentinel-audit
├─────────────────────────────────────────┤
│  Authorized Pentest?                    │ → sentinel:sentinel-pentest
├─────────────────────────────────────────┤
│  CTF Challenge?                         │ → sentinel:sentinel-ctf
└─────────────────────────────────────────┘
    ↓
When in doubt → sentinel:sentinel-audit (broadest coverage)
```

---

## Step 2: Security Audit Execution

### OWASP Top 10+ Vulnerability Checklist

| ID | Vulnerability | Key Checks |
|----|---------------|------------|
| A01 | **Access Control** | IDOR, horizontal/vertical privilege escalation |
| A02 | **Cryptographic Failures** | Hardcoded secrets, weak crypto, MD5/SHA1 |
| A03 | **Injection** | SQL, Command, LDAP, XPath, NoSQL, Template |
| A04 | **Insecure Design** | Business logic flaws, race conditions (TOCTOU) |
| A05 | **Security Misconfiguration** | Debug mode, default credentials, info disclosure |
| A06 | **Vulnerable Components** | Dependency CVEs, outdated libs, typosquatting |
| A07 | **Auth Failures** | Brute force, session fixation, JWT vulnerabilities |
| A08 | **Data Integrity** | Unsafe deserialization, CI/CD injection |
| A09 | **Logging & Monitoring** | Missing security logs, PII in logs |
| A10 | **SSRF** | Server-side request forgery, internal probing |
| A11 | **CSRF** | Cross-site request forgery, token validation |
| A12 | **Clickjacking** | Frame busting, X-Frame-Options |
| A13 | **Session Security** | Session fixation, timeout, cookie flags |
| A14 | **Resource Consumption** | Unrestricted upload, no rate limiting |
| A15 | **OAuth/SSO** | redirect_uri bypass, state parameter CSRF |
| A16 | **WebSocket** | Missing WS auth, authorization bypass |
| A17 | **CORS Misconfiguration** | Wildcard + Credentials |
| A18 | **GraphQL** | Introspection abuse, batch query DoS |
| A19 | **Race Conditions** | Double-spend, coupon reuse |
| A20 | **Subdomain Takeover** | Dangling DNS, expired cloud services |

### Frontend Framework Specific Checks

| Framework | Vulnerability Patterns |
|-----------|------------------------|
| Vue.js | `v-html`, template injection, SSTI |
| React | `dangerouslySetInnerHTML`, URL handling XSS |
| Angular | `bypassSecurityTrust*`, SSR XSS |

---

## Step 3: Vulnerability Scan Examples

### Example 1: Vue.js Component

```vue
<!-- aa.vue -->
<template>
    <div class="aa">
      <slot></slot>
    </div>
</template>
<script>
export default {
  name: 'aa'
}
</script>
```

**Scan Result**:

| Check | Status | Notes |
|-------|--------|-------|
| XSS | ✅ Pass | No user input rendering |
| v-html abuse | ✅ Pass | Not used |
| Inline styles/scripts | ✅ Pass | None |
| Sensitive data exposure | ✅ Pass | No hardcoded secrets |

**Conclusion**: `aa.vue` is a simple component with no security vulnerabilities.

### Example 2: Node.js API (test-vuln.js)

**Detection**: Node.js + Express → `sentinel:sentinel-audit` + `patterns-js.md`

**Findings**:

| Severity | Line | Type | Code |
|----------|------|------|------|
| Critical | L12 | SQL Injection | `"SELECT * FROM users WHERE id = " + userId` |
| Critical | L49 | Command Injection | `exec('ping -c 3 ' + host)` |
| High | L27 | IDOR | `db.query('SELECT * FROM invoices WHERE id = ?')` |
| High | L33 | Vertical Privilege | `User.update({ id: userId, role: newRole })` |
| High | L60 | SSRF | `axios.get(url)` |
| Medium | L22 | XSS | `res.send('<div>' + name + '</div>')` |
| Medium | L53 | CORS Misconfig | `Access-Control-Allow-Origin: *` |
| Low | L44-45 | Hardcoded Secrets | `API_KEY = 'sk_live_1234567890abcdef'` |

---

## Step 4: Generate Security Report

After audit, use `sentinel:sentinel-report` to generate the report.

### Report Template

```markdown
# Security Assessment Report
**Target**: [System/Application Name]
**Type**: Code Audit / Penetration Test
**Date**: YYYY-MM-DD

## Executive Summary
[2-4 sentences describing scope and overall risk]

## Finding Summary

| Severity | Count |
|----------|-------|
| Critical | N |
| High | N |
| Medium | N |
| Low | N |

## Detailed Findings

### [SEVERITY] FIND-001: [Vulnerability Name]
- **CWE**: CWE-XXX
- **CVSS**: X.X
- **Location**: [File:Line]
- **Description**: [What it is]
- **Impact**: [Attack consequences]
- **Remediation**: [Fix recommendation]
```

<!-- /lang:en -->

---

## 技能文件清单 / Skill Files

```
skills/
├── using-sentinel/           # 入口技能 / Entry point
├── sentinel-audit/           # 代码审计 / Code audit
│   └── references/
│       ├── patterns-php.md
│       ├── patterns-python.md
│       ├── patterns-js.md
│       ├── patterns-java.md
│       ├── patterns-vue.md
│       ├── patterns-react.md
│       ├── patterns-angular.md
│       └── patterns-idor.md
├── sentinel-pentest/         # 渗透测试 / Penetration testing
├── sentinel-ctf/             # CTF 挑战 / CTF challenges
├── sentinel-report/          # 报告生成 / Report generation
├── sentinel-cve/            # CVE 查询 / CVE lookup
└── sentinel-frontend/        # 前端安全 / Frontend security
    └── references/
        ├── patterns-vue.md
        ├── patterns-react.md
        └── patterns-angular.md
```
