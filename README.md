# Sentinel — Portable Security Skills for AI Agents

<!-- lang:zh -->
Sentinel 是**可独立安装、多宿主可用**的安全分析技能集（Markdown + YAML frontmatter），适用于 **Claude Code、Cursor、OpenAI Codex、Trae** 等能加载项目规则、技能或长上下文的 AI 编程助手。内容涵盖代码审计、渗透测试、CTF、安全报告与 CVE 查询；内置通用工作流技能（调试、验证、评审、规划），**不依赖** Superpowers 插件即可闭环使用。若你已安装 Superpowers，可与 Sentinel 并存、互为补充。
<!-- /lang:zh -->

<!-- lang:en -->
Sentinel is a **standalone, host-portable** security skill set (Markdown + YAML frontmatter) for **Claude Code, Cursor, OpenAI Codex, Trae**, and other agents that support rules, skills, or long-context project docs. It covers auditing, pentesting, CTF work, reporting, and CVE research, with a built-in workflow skill (debugging, verification, review, planning) — **no** Superpowers plugin required. Superpowers may still coexist if you use it.
<!-- /lang:en -->

---

<!-- lang:zh -->
## 多宿主兼容 / Multi-host compatibility
<!-- /lang:zh -->

<!-- lang:en -->
## Multi-host compatibility
<!-- /lang:en -->

<!-- lang:zh -->
- **格式**：每个技能是 `SKILL.md` 文件，含 YAML `name` / `description` 与正文说明；任意客户端只要能把该文件纳入系统提示、规则或知识库即可使用。
- **引用名**：文档中的 `sentinel:skill-name` 表示**逻辑技能 id**（与文件夹名对应）。各产品中的挂载方式不同：可能是插件技能 id、Cursor Rule、Codex skill、或你在对话里 `@` / 粘贴的文件路径——以对应产品文档为准。
- **触发**：支持「按 description 自动匹配技能」的宿主可能自动选用；其它环境请在任务开始时**显式**打开或粘贴相关 `SKILL.md`，或在项目规则中写明「安全类任务先遵循 `skills/sentinel-skill/using-sentinel/SKILL.md`」。
<!-- /lang:zh -->

<!-- lang:en -->
- **Format:** Each skill is a `SKILL.md` with YAML `name` / `description` plus body text. Any client that can load that file into system instructions, rules, or a knowledge bundle can use it.
- **IDs:** `sentinel:skill-name` is a **logical skill id** (matches the folder name). Mapping differs by product (plugin skill, Cursor rule, Codex skill, `@` file, pasted prompt) — follow that product’s docs.
- **Activation:** Hosts with skill discovery may auto-match from `description`. Else **explicitly** open or paste the `SKILL.md`, or point project rules at `skills/sentinel-skill/using-sentinel/SKILL.md` for security tasks.
<!-- /lang:en -->

| 宿主 / Host | 常见接入方式 / Typical wiring (check vendor docs) |
|-------------|---------------------------------------------------|
| **Claude Code** | 插件 / 全局或项目 `skills` 目录；历史路径示例见下方安装节 |
| **Cursor** | 项目 `.cursor/rules/`、`AGENTS.md`、或 Cursor Skills（视版本而定） |
| **Codex CLI / 兼容环境** | `~/.codex/skills`、项目 `.codex`、`.agents/skills` 等 |
| **Trae** | 按 Trae 官方说明绑定自定义指令、工作区规则或知识库；将本仓库 `skills/sentinel-skill/` 作为可读文档导入 |
| **其它 IDE / 助手** | 将所需 `SKILL.md` 复制到该工具要求的目录，或在自定义提示中引用仓库路径 |

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
| `sentinel:sentinel-workflow` | 内置工作流：根因分析、完成前验证、安全向代码评审、方案探索、多目标并行 / Built-in workflow — root cause, verification, review, design, parallel work |
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
**无硬性依赖。** 将本仓库（或其中的 `skills/sentinel-skill/`）接入你所用 AI 客户端的规则/技能/知识库路径即可（见下方安装）。可选：若你希望同时使用 [Superpowers](https://github.com/obra/superpowers) 的其它开发类技能，可自行安装；Sentinel 不依赖其存在。
<!-- /lang:zh -->

<!-- lang:en -->
**No hard dependency.** Wire this repo (or its `skills/sentinel-skill/` tree) into your client’s rules/skills/knowledge path (see Installation). **Optional:** add [Superpowers](https://github.com/obra/superpowers) for extra dev-oriented skills; Sentinel does not require it.
<!-- /lang:en -->

---

<!-- lang:zh -->
## 安装 / Installation
<!-- /lang:zh -->

<!-- lang:en -->
## Installation
<!-- /lang:en -->

```bash
# 通用：克隆后，八个技能位于 skills/sentinel-skill/<skill-name>/
# Generic: after clone, the eight skills live under skills/sentinel-skill/<skill-name>/
git clone https://github.com/wangdongzuopin/sentinel-skill
```

<!-- lang:zh -->
**按宿主接入（示例，以各产品最新文档为准）：**
<!-- /lang:zh -->

<!-- lang:en -->
**Per-host wiring (examples — follow each product’s current docs):**
<!-- /lang:en -->

| 宿主 / Host | 示例 / Example |
|-------------|----------------|
| **Claude Code** | 将 `skills/sentinel-skill/` 拷入或链接到项目的 `.claude/skills/sentinel-skill/`（每个技能为子目录 + `SKILL.md`）；或使用插件市场 `/plugin install sentinel@sentinel-marketplace`（若已发布） |
| **Cursor** | 使用根目录 `AGENTS.md`；或将 `skills/sentinel-skill/` 下各技能纳入 `.cursor/rules` / Skills（按 Cursor 版本配置） |
| **Codex** | 将 `skills/sentinel-skill/*` 同步到 `~/.codex/skills` 或项目 `.codex` 约定路径（保持 `sentinel-skill/<name>/SKILL.md` 或按该工具要求扁平化） |
| **Trae / 其它** | 导入本仓库，使助手能读取 `skills/sentinel-skill/**/*.md` |

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
├── AGENTS.md                 # 多宿主项目级入口提示 / Project entry hint for Cursor & similar
└── skills/
    └── sentinel-skill/       # 8 个技能统一在此目录下 / All eight skills live here
        ├── using-sentinel/
        │   └── SKILL.md              # 入口技能 / Entry point
        ├── sentinel-workflow/
        │   └── SKILL.md              # 内置工作流 / Built-in workflow
        ├── sentinel-audit/
        │   ├── SKILL.md              # 审计方法论 / Audit methodology
        │   └── references/
        │       ├── patterns-php.md
        │       ├── patterns-python.md
        │       ├── patterns-js.md
        │       ├── patterns-java.md
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
在支持技能发现与描述的宿主上，技能**可能**按上下文自动匹配；在 Cursor、Trae 等环境更稳妥的做法是：**显式**引用对应 `SKILL.md` 或在规则中固定入口（见 `AGENTS.md`）。自然语言示例：
<!-- /lang:zh -->

<!-- lang:en -->
On hosts with skill discovery, skills **may** auto-match from `description`. For Cursor, Trae, and similar clients, prefer **explicit** references to the right `SKILL.md` or a fixed entry in project rules (see `AGENTS.md`). Example prompts:
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
| 根因分析、完成前验证、修复评审、多目标并行 / Root cause, verify, review fixes, parallel work | `sentinel:sentinel-workflow` | — |

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
├─────────────────────────────────────────┤
│  根因 / 验证 / 评审 / 多目标并行?           │ → sentinel:sentinel-workflow
└─────────────────────────────────────────┘
    ↓
不确定时 → sentinel:sentinel-audit
```

---

<!-- lang:zh -->
## 内置工作流与典型闭环 / Built-in workflow & typical loop
<!-- /lang:zh -->

<!-- lang:en -->
## Built-in workflow & typical loop
<!-- /lang:en -->

<!-- lang:zh -->
`sentinel:sentinel-workflow` 提供与常见 agent 工作流包**对等的能力**：系统化根因追踪、完成前验证、面向安全的代码评审、威胁向设计探索、多目标并行分析。无需再引用外部 `superpowers:*` 技能名即可完成同类任务。
<!-- /lang:zh -->

<!-- lang:en -->
`sentinel:sentinel-workflow` provides **parity** with common agent workflow packs: systematic root-cause tracing, verification before completion, security-oriented code review, threat-focused design exploration, and parallel multi-target analysis — without requiring external `superpowers:*` skill names.
<!-- /lang:en -->

### 能力对照 / Capability mapping (conceptual)

| 常见外部工作流意图 / Typical external intent | Sentinel 内置 / In Sentinel |
|---------------------------------------------|---------------------------|
| Systematic debugging | `sentinel-workflow` → Systematic root-cause tracing |
| Verification before completion | `sentinel-workflow` → Verification before completion |
| Requesting code review | `sentinel-workflow` → Security-focused code review |
| Brainstorming / design | `sentinel-workflow` → Design exploration |
| Subagent / parallel work | `sentinel-workflow` → Parallel multi-target work |

### 典型安全工作流 / Typical security workflow (standalone)

```
1. 发现安全问题 / Security issue discovered
   ↓
2. sentinel:sentinel-workflow → 分析根因 / analyze root cause
   ↓
3. sentinel:sentinel-audit → 代码审计 / code audit
   ↓
4. sentinel:sentinel-cve → CVE/CVSS 查询 / CVE/CVSS lookup
   ↓
5. sentinel:sentinel-workflow → 审查修复 / review the fix
   ↓
6. sentinel:sentinel-report → 生成报告 / generate report
```

### 指令优先级 / Instruction priority

1. **用户的明确指令 / User's explicit instructions** — 最高 / highest
2. **Sentinel 安全技能 / Sentinel security skills** — 安全方法论 / security methodology
3. **`sentinel-workflow`** — 调试、验证、评审、规划 / debugging, verification, review, planning
4. **系统默认行为 / System default** — 最低 / lowest

### 可选：与 Superpowers 并存 / Optional: coexisting with Superpowers

若环境已加载 Superpowers，可继续使用其技能；与 `sentinel-workflow` **同类任务择一即可**，避免重复指令链。

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
技能文件格式遵循各 AI 助手常见的「带 YAML 头的 Markdown 技能」约定（与 Claude Code、Codex、Cursor 等生态中流行的写法兼容）。编写新技能时可参考社区文档（例如 [Superpowers 的 skill 编写说明](https://github.com/obra/superpowers)）作为风格参考，**非运行时依赖**。
<!-- /lang:zh -->

<!-- lang:en -->
Skill files follow the common **Markdown + YAML frontmatter** pattern used across Claude Code, Codex, Cursor-style skill/rule ecosystems. For authoring style references, see community guides such as [Superpowers `writing-skills`](https://github.com/obra/superpowers) — **not** a runtime dependency.
<!-- /lang:en -->
