---
name: sentinel
description: Short-path entry for the Sentinel security skill bundle — route to audit, pentest, CTF, CVE, report, frontend, workflow. Use when user @ this file or says sentinel / 安全审计 / 渗透报告.
argument-hint: "[subcommand] [topic...]"
metadata:
  author: sentinel-skill
  version: "1.0.0"
---

# Sentinel

**Bundle index:** This file lives at `skills/sentinel/SKILL.md` (same folder as each sub-skill). Load here first for **fast discovery** (`sentinel` ≈ whole package).

<args>$ARGUMENTS</args>

## When to Use

- User `@` mentions **`skills/sentinel/SKILL.md`** or **`sentinel`** alone
- Security code audit, pentest planning, CTF, CVE lookup, vulnerability report, frontend security review
- You need a **routing table** to pick the right sub-skill without typing long paths

## Subcommands → Sub-skills (same directory)

| Subcommand / alias | Skill folder | Role |
|--------------------|--------------|------|
| `using` / *(default)* | `using-sentinel/` | **Main router** — architecture detection, which skill to follow |
| `audit` | `sentinel-audit/` | Source audit, SAST, OWASP |
| `pentest` | `sentinel-pentest/` | Authorized live testing workflow |
| `ctf` | `sentinel-ctf/` | CTF challenges |
| `cve` | `sentinel-cve/` | CVE / CVSS lookup |
| `report` | `sentinel-report/` | Reports + HTML deliverable (ECharts CDN pie + offline CSS fallback) |
| `frontend` | `sentinel-frontend/` | Vue / React / Angular security |
| `workflow` | `sentinel-workflow/` | Root cause, verification, review, parallel work |

Logical ids (elsewhere in docs) look like `sentinel:sentinel-audit` — they map 1:1 to the folder names above.

## References (paths relative to `skills/sentinel/`)

| Topic | File |
|-------|------|
| Entry & routing detail | `using-sentinel/SKILL.md` |
| Audit patterns (PHP, etc.) | `sentinel-audit/references/*.md` |
| Frontend patterns | `sentinel-frontend/references/*.md` |

## Routing

1. **Parse** `$ARGUMENTS` — first word = subcommand (see table); if empty or unknown → **`using-sentinel/SKILL.md`**.
2. **Open** the matching `SKILL.md` under this directory (e.g. `sentinel-audit/SKILL.md`).
3. **Execute** that skill with the **remaining** words as task context.

**Default:** no subcommand ⇒ treat as **`using-sentinel`**.

## Notes

- Repository root may also document this bundle as `sentinel-skill` in prose; on disk the canonical tree is **`skills/sentinel/<name>/SKILL.md`**.
- After **audit / pentest / frontend** finishes, **`sentinel-report`** must run per that skill’s handoff rules.
