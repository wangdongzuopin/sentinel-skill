# Sentinel — Security Skills for Claude Code

<!-- lang:zh -->
Sentinel 是 [Superpowers](https://github.com/obra/superpowers) 的安全技能扩展，提供专业的安全分析技能集，涵盖代码审计、渗透测试、CTF 挑战和安全报告撰写。

Sentinel 是 [Superpowers](https://github.com/obra/superpowers) 的安全技能扩展，提供专业的安全分析技能集，涵盖代码审计、渗透测试、CTF 挑战和安全报告撰写。
<!-- /lang:zh -->

<!-- lang:en -->
Sentinel extends [Superpowers](https://github.com/obra/superpowers) with a professional security analysis skill set covering code auditing, penetration testing, CTF challenges, and security report writing.
<!-- /lang:en -->

---

<!-- lang:zh -->
## 技能列表 / Skills
<!-- /lang:zh -->

<!-- lang:en -->
## Skills
<!-- /lang:en -->

| Skill | 用途 / Purpose |
|-------|----------------|
| `sentinel:using-sentinel` | 入口技能，路由到正确的技能 / Entry point — routes to the right skill |
| `sentinel:sentinel-audit` | 源代码安全审计 (OWASP, SAST) / Source code security audit |
| `sentinel:sentinel-pentest` | 渗透测试工作流 / Penetration testing workflow |
| `sentinel:sentinel-ctf` | CTF 挑战解题 / CTF challenge solving |
| `sentinel:sentinel-report` | 安全报告撰写 / Security report writing |
| `sentinel:sentinel-cve` | CVE 查询、CVSS 评分 / CVE lookup, CVSS scoring |
| `sentinel:sentinel-frontend` | 前端安全 (Vue/React/Angular) / Frontend security |

---

<!-- lang:zh -->
## 漏洞覆盖 / Vulnerability Coverage

<!-- /lang:zh -->

<!-- lang:en -->
## Vulnerability Coverage
<!-- /lang:en -->

<!-- lang:zh -->
审计技能覆盖以下漏洞类型 (OWASP Top 10 + 扩展)：
<!-- /lang:zh -->

<!-- lang:en -->
The audit skill covers these vulnerability types (OWASP Top 10 + extended):
<!-- /lang:en -->

| 类别 / Category | 示例 / Examples |
|-----------------|-----------------|
| **A01 — 访问控制 / Access Control** | IDOR、水平越权、垂直越权、权限绕过 |
| **A02 — 密码学失败 / Cryptographic Failures** | 弱加密、硬编码密钥、TLS 问题 |
| **A03 — 注入 / Injection** | SQL、命令、LDAP、XPath、NoSQL、模板注入 |
| **A04 — 不安全设计 / Insecure Design** | 业务逻辑缺陷、竞争条件 (TOCTOU) |
| **A05 — 安全配置错误 / Security Misconfiguration** | Debug 模式、默认凭证、信息泄露 |
| **A06 — 危险组件 / Vulnerable Components** | 依赖漏洞、过期库、typosquatting |
| **A07 — 认证失败 / Auth Failures** | 暴力破解、会话 fixation、JWT 漏洞 |
| **A08 — 数据完整性 / Data Integrity** | 不安全反序列化、CI/CD 注入 |
| **A09 — 日志监控失败 / Logging Failures** | 缺少安全日志、PII 泄露 |
| **A10 — SSRF** | 服务端请求伪造、内网探测 |
| **A11 — CSRF** | 跨站请求伪造、Token 验证 |
| **A12 — 点击劫持 / Clickjacking** | Frame busting、X-Frame-Options |
| **A13 — 会话安全 / Session Security** | Session fixation、Timeout、Cookie flags |
| **A14 — 资源消耗 / Resource Consumption** | 无限制上传、无 Rate limiting |
| **A15 — OAuth/SSO** | redirect_uri 绕过、state 参数 CSRF |
| **A16 — WebSocket** | WS 认证缺失、授权检查 |
| **A17 — CORS 错误配置 / CORS Misconfiguration** | Wildcard + Credentials |
| **A18 — GraphQL** | Introspection 滥用、批量查询 DoS |
| **A19 — 竞争条件 / Race Conditions** | 双重提现、优惠券复用 |
| **A20 — 子域名接管 / Subdomain Takeover** | 悬空 DNS、过期云服务 |
| **前端 XSS** | Vue v-html、React dangerouslySetInnerHTML |
| **供应链 / Supply Chain** | 恶意包、依赖混淆 |

---

<!-- lang:zh -->
## 前置要求 / Prerequisites
<!-- /lang:zh -->

<!-- lang:en -->
## Prerequisites
<!-- /lang:en -->

<!-- lang:zh -->
Sentinel 旨在与 Superpowers **配合使用**，而非替代它。请先安装 Superpowers：
<!-- /lang:zh -->

<!-- lang:en -->
Sentinel is designed to work **alongside Superpowers**, not instead of it. Install Superpowers first:
<!-- /lang:en -->

```bash
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

---

<!-- lang:zh -->
## 安装 / Installation
<!-- /lang:zh -->

<!-- lang:en -->
## Installation
<!-- /lang:en -->

```bash
# 克隆到 skills 目录 / Clone into skills directory
git clone https://github.com/wangdongzuopin/sentinel-skill ~/.claude/sentinel

# 或通过插件市场安装 (发布后) / Or via plugin marketplace (when published)
/plugin install sentinel@sentinel-marketplace
```

---

<!-- lang:zh -->
## 目录结构 / Directory Structure
<!-- /lang:zh -->

<!-- lang:en -->
## Directory Structure
<!-- /lang:en -->

```
sentinel/
├── README.md
└── skills/
    ├── using-sentinel/
    │   └── SKILL.md              # 入口技能 / Entry point
    ├── sentinel-audit/
    │   ├── SKILL.md              # 审计方法论 / Audit methodology
    │   └── references/
    │       ├── patterns-php.md
    │       ├── patterns-python.md
    │       ├── patterns-js.md
    │       ├── patterns-java.md
    │       ├── patterns-vue.md
    │       ├── patterns-react.md
    │       ├── patterns-angular.md
    │       └── patterns-idor.md
    ├── sentinel-pentest/
    │   └── SKILL.md              # 渗透测试 / Pentest methodology
    ├── sentinel-ctf/
    │   └── SKILL.md              # CTF 挑战 / CTF challenges
    ├── sentinel-report/
    │   └── SKILL.md              # 报告模板 / Report templates
    ├── sentinel-cve/
    │   └── SKILL.md              # CVE 查询 / CVE lookup
    └── sentinel-frontend/
        ├── SKILL.md              # 前端安全 / Frontend security
        └── references/
            ├── patterns-vue.md
            ├── patterns-react.md
            └── patterns-angular.md
```

---

<!-- lang:zh -->
## 使用方法 / Usage
<!-- /lang:zh -->

<!-- lang:en -->
## Usage
<!-- /lang:en -->

<!-- lang:zh -->
安装后，技能会根据上下文自动触发。也可以显式调用：
<!-- /lang:zh -->

<!-- lang:en -->
Once installed, skills trigger automatically based on context. You can also invoke explicitly:
<!-- /lang:en -->

```
# 开始代码审计 / Start a code audit
"Please audit this PHP codebase for security vulnerabilities"

# CTF 挑战 / CTF challenge
"I have a CTF web challenge, here's the URL..."

# 渗透测试 / Pentest engagement
"I'm doing a pentest on example.com (authorized), help me with recon"

# 撰写报告 / Write a report
"Write up the findings from our audit as a security report"
```

---

<!-- lang:zh -->
## 使用流程：技能选择工作流 / How to Use: Skill Selection Workflow
<!-- /lang:zh -->

<!-- lang:en -->
## How to Use: Skill Selection Workflow
<!-- /lang:en -->

<!-- lang:zh -->
**重要：必须首先检测架构，然后路由到对应技能。**
<!-- /lang:zh -->

<!-- lang:en -->
**IMPORTANT: Always detect architecture FIRST, then route to the appropriate skill.**
<!-- /lang:en -->

### Step 1: 检测架构 / Detect Architecture

```
☐ 1. 确定应用类型 / Determine Application Type
  ├── 前端 / Frontend     → Vue.js / React / Angular
  ├── 后端 / Backend      → PHP / Python / Node.js / Java / Go / C#
  ├── 移动端 / Mobile     → Android / iOS
  ├── API / API-only     → REST / GraphQL / gRPC
  ├── 桌面端 / Desktop    → Electron / Qt / .NET
  └── 基础设施 / Infra    → Docker / Kubernetes / Cloud

☐ 2. 确定框架 / Determine Framework
  ├── PHP: Laravel / Symfony / CodeIgniter
  ├── Python: Django / Flask / FastAPI
  ├── Java: Spring / Struts
  ├── Node.js: Express / Koa / NestJS
  └── Go: Gin / Echo / Fiber

☐ 3. 确定部署环境 / Determine Deployment
  ├── 本地/云 / On-premise / Cloud (AWS/GCP/Azure)
  ├── 容器化 / Containerized (Docker/Kubernetes)
  └── Serverless
```

### Step 2: 基于架构路由 / Route Based on Architecture

| 架构 / Architecture | 技能 / Skill | 参考文件 / Reference Files |
|---------------------|--------------|---------------------------|
| 前端 (Vue/React/Angular) | `sentinel:sentinel-frontend` | `patterns-vue/react/angular.md` |
| 后端 PHP | `sentinel:sentinel-audit` | `patterns-php.md` |
| 后端 Python | `sentinel:sentinel-audit` | `patterns-python.md` |
| 后端 Node.js | `sentinel:sentinel-audit` | `patterns-js.md` |
| 后端 Java | `sentinel:sentinel-audit` | `patterns-java.md` |
| API (REST/GraphQL) | `sentinel:sentinel-audit` | + `patterns-idor.md` |
| 全栈 / Full Stack | `sentinel:sentinel-audit` | + 所有参考 / + all refs |
| 移动端 / Mobile | `sentinel:sentinel-audit` | (添加移动端参考 / add mobile refs) |
| 渗透测试 / Pentest | `sentinel:sentinel-pentest` | — |
| CTF 挑战 / CTF | `sentinel:sentinel-ctf` | — |
| 报告 / Report | `sentinel:sentinel-report` | — |
| CVE 查询 / CVE | `sentinel:sentinel-cve` | — |

<!-- lang:zh -->
**不确定时：** 优先使用 `sentinel:sentinel-audit` — 覆盖范围最广。
<!-- /lang:zh -->

<!-- lang:en -->
**When in doubt:** Invoke `sentinel:sentinel-audit` first — it covers the broadest ground.
<!-- /lang:en -->

### 路由流程图 / Skill Routing Flowchart

```
用户请求 / User Request
    ↓
检测架构 / Detect Architecture
    ↓
┌─────────────────────────────────────────┐
│  Vue.js / React / Angular?              │ → sentinel:sentinel-frontend
├─────────────────────────────────────────┤
│  PHP / Python / Node.js / Java?        │ → sentinel:sentinel-audit
├─────────────────────────────────────────┤
│  REST / GraphQL API?                    │ → sentinel:sentinel-audit
├─────────────────────────────────────────┤
│  Mobile (Android / iOS)?                │ → sentinel:sentinel-audit
├─────────────────────────────────────────┤
│  授权渗透测试 / Authorized Pentest?       │ → sentinel:sentinel-pentest
├─────────────────────────────────────────┤
│  CTF 挑战 / CTF Challenge?              │ → sentinel:sentinel-ctf
├─────────────────────────────────────────┤
│  CVE 查询 / CVE Lookup?                 │ → sentinel:sentinel-cve
├─────────────────────────────────────────┤
│  报告 / Write Report?                   │ → sentinel:sentinel-report
└─────────────────────────────────────────┘
    ↓
不确定时 → sentinel:sentinel-audit
```

---

<!-- lang:zh -->
## 与 Superpowers 集成 / Integration with Superpowers
<!-- /lang:zh -->

<!-- lang:en -->
## Integration with Superpowers
<!-- /lang:en -->

<!-- lang:zh -->
**Sentinel 是 Superpowers 的安全扩展，不是替代品。**
<!-- /lang:zh -->

<!-- lang:en -->
**Sentinel is a security extension for Superpowers, NOT a replacement.**
<!-- /lang:en -->

### 协作模型 / Collaboration Model

```
Superpowers (基础框架 / Base Framework)
    │
    ├── 开发工作流 / Development Workflow
    ├── 代码审查 / Code Review
    ├── 测试驱动开发 / TDD
    ├── 调试 / Debugging
    │
    └── Sentinel (安全扩展 / Security Extension) ← 专注安全 / Focused on Security
        ├── 代码审计 / Code Audit
        ├── 渗透测试 / Penetration Testing
        ├── CTF 挑战 / CTF Challenges
        └── 报告生成 / Report Generation
```

### 配合技能 / Superpowers Integration Skills

| Superpowers 技能 / Skill | Sentinel 配合场景 / Use Case |
|-------------------------|------------------------------|
| `superpowers:systematic-debugging` | 漏洞根因分析 / Trace vulnerability root cause |
| `superpowers:requesting-code-review` | 安全修复审查 / Review security fixes |
| `superpowers:subagent-driven-development` | 并行多目标评估 / Parallel assessments |
| `superpowers:brainstorming` | 安全方案设计 / Security design |
| `superpowers:verification-before-completion` | 漏洞修复验证 / Verify fixes |

### 典型安全工作流 / Typical Security Workflow

```
1. 发现安全问题 / Security issue discovered
   ↓
2. superpowers:systematic-debugging → 分析根因 / analyze root cause
   ↓
3. sentinel:sentinel-audit → 代码审计 / code audit
   ↓
4. sentinel:sentinel-cve → CVE/CVSS 查询 / CVE/CVSS lookup
   ↓
5. superpowers:requesting-code-review → 审查修复 / review the fix
   ↓
6. sentinel:sentinel-report → 生成报告 / generate report
```

### 指令优先级 / Instruction Priority

<!-- lang:zh -->
Sentinel 遵循与 Superpowers 相同的优先级链：
<!-- /lang:zh -->

<!-- lang:en -->
Sentinel follows the same priority chain as Superpowers:
<!-- /lang:en -->

1. **用户的明确指令 / User's explicit instructions** — 最高优先级 / highest priority
2. **Sentinel 安全技能 / Sentinel security skills** — 安全任务时覆盖 / override for security tasks
3. **Superpowers 技能 / Superpowers skills** — 开发工作流仍适用 / still apply for workflow
4. **系统默认行为 / System default** — 最低优先级 / lowest priority

---

<!-- lang:zh -->
## 伦理与法律 / Ethics & Legal
<!-- /lang:zh -->

<!-- lang:en -->
## Ethics & Legal
<!-- /lang:en -->

<!-- lang:zh -->
Sentinel 技能包含强制授权检查。渗透测试指导假设：
<!-- /lang:zh -->

<!-- lang:en -->
Sentinel skills include mandatory authorization checks. All penetration testing guidance assumes:
<!-- /lang:en -->

- 系统所有者提供的书面授权 / Written authorization from system owner
- 明确界定的测试范围 / Clearly defined scope
- 负责任的披露实践 / Responsible disclosure practices

<!-- lang:zh -->
Sentinel 不会协助未授权的系统访问。
<!-- /lang:zh -->

<!-- lang:en -->
Skills will not assist with unauthorized access to systems.
<!-- /lang:en -->

---

<!-- lang:zh -->
## 贡献 / Contributing
<!-- /lang:zh -->

<!-- lang:en -->
## Contributing
<!-- /lang:en -->

<!-- lang:zh -->
基于 [Superpowers 技能框架](https://github.com/obra/superpowers)。技能编写指南见 Superpowers 仓库的 `skills/writing-skills/SKILL.md`。
<!-- /lang:zh -->

<!-- lang:en -->
Built on the [Superpowers skill framework](https://github.com/obra/superpowers). See `skills/writing-skills/SKILL.md` in the Superpowers repo for the skill authoring guide.
<!-- /lang:en -->
