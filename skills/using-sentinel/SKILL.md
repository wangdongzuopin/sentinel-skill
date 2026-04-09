---
name: using-sentinel
description: Use when starting any security task — code audit, penetration testing, CTF challenge, or vulnerability research. Establishes which sentinel sub-skill to invoke and sets the security analysis mindset. Always invoke before any security-related response.
---

# Using Sentinel

Sentinel extends Superpowers with security-focused skills. It follows the same philosophy: **if a security skill might apply, invoke it. No exceptions.**

## Instruction Priority

Sentinel inherits Superpowers' priority chain:

1. **User's explicit instructions** — highest priority
2. **Sentinel skills** — override defaults for security tasks
3. **Superpowers skills** — still apply for development workflow
4. **Default system behavior** — lowest priority

## Skill Selection

**Step 1: Detect Architecture/Technology Stack FIRST**

Before invoking any skill, identify what you're working with:

```
☐ What is the application type?
  ├── Web (Frontend)     → Vue.js / React / Angular
  ├── Web (Backend)      → PHP / Python / Node.js / Java / Go / C#
  ├── Mobile             → Android (Kotlin/Java) / iOS (Swift/ObjC)
  ├── API-only           → REST / GraphQL / gRPC
  ├── Desktop            → Electron / Qt / .NET
  └── Infrastructure     → Docker / Kubernetes / Cloud configs

☐ What is the framework (if any)?
  ├── PHP: Laravel / Symfony / CodeIgniter / WordPress
  ├── Python: Django / Flask / FastAPI
  ├── Java: Spring / Struts / Jakarta EE
  ├── Node.js: Express / Koa / NestJS / Next.js
  └── Go: Gin / Echo / Fiber

☐ What is the deployment environment?
  ├── On-premise / Cloud (AWS/GCP/Azure)
  ├── Containerized (Docker/Kubernetes)
  └── Serverless
```

**Step 2: Route Based on Architecture**

| Architecture Detected | Primary Skill | Reference Files |
|-----------------------|---------------|-----------------|
| **Frontend (Vue/React/Angular)** | `sentinel:sentinel-frontend` | `patterns-vue.md`, `patterns-react.md`, `patterns-angular.md` |
| **Backend (PHP)** | `sentinel:sentinel-audit` | `patterns-php.md` |
| **Backend (Python)** | `sentinel:sentinel-audit` | `patterns-python.md` |
| **Backend (Node.js)** | `sentinel:sentinel-audit` | `patterns-js.md` |
| **Backend (Java)** | `sentinel:sentinel-audit` | `patterns-java.md` |
| **API (REST/GraphQL)** | `sentinel:sentinel-audit` | + IDOR patterns |
| **Full Stack** | `sentinel:sentinel-audit` | + frontend + backend refs |
| **Live System (authorized)** | `sentinel:sentinel-pentest` | — |
| **CTF Challenge** | `sentinel:sentinel-ctf` | — |
| **Report Writing** | `sentinel:sentinel-report` | — |

**Skill Routing Flow:**

```dot
digraph sentinel_routing {
    "User Request" -> "Detect Architecture"
    "Detect Architecture" -> "Frontend?" [label="Vue/React/Angular?"]
    "Detect Architecture" -> "Backend?" [label="PHP/Python/Node/Java?"]
    "Detect Architecture" -> "API?" [label="REST/GraphQL?"]
    "Detect Architecture" -> "Mobile?" [label="Android/iOS?"]
    "Frontend?" -> "sentinel:sentinel-frontend"
    "Backend?" -> "sentinel:sentinel-audit"
    "API?" -> "sentinel:sentinel-audit"
    "Mobile?" -> "sentinel:sentinel-audit" [label=" (add mobile refs)"]
}
```

**When in doubt:** Invoke `sentinel:sentinel-audit` first — it covers the broadest ground and includes cross-site/framework patterns.

## Core Security Mindset

Before invoking any sentinel skill, adopt this posture:

- **Think like an attacker.** What would a malicious actor target first?
- **Trust nothing.** Every input, every boundary, every assumption is suspect.
- **Evidence over intuition.** Document what you find, not what you feel.
- **Scope matters.** Never exceed authorized scope. Confirm before acting.

## Integration with Superpowers

Sentinel works alongside Superpowers, not instead of it:

- Use `superpowers:systematic-debugging` when tracing a vulnerability's root cause
- Use `superpowers:requesting-code-review` after completing an audit pass
- Use `superpowers:subagent-driven-development` to parallelize multi-target assessments
- Use `sentinel:sentinel-report` at the end of any engagement

## Red Flags

Stop and re-read the appropriate skill if you catch yourself:
- Guessing at vulnerabilities without evidence
- Skipping scope confirmation before active testing
- Reporting a finding without a verified reproduction path
- Mixing exploit development with authorized scope
