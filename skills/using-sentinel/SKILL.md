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

Read the task and invoke the correct sentinel skill:

| Situation | Skill to invoke |
|-----------|----------------|
| Reviewing source code for vulnerabilities | `sentinel:sentinel-audit` |
| Penetration testing, recon, exploitation | `sentinel:sentinel-pentest` |
| CTF challenge (web/pwn/crypto/reverse/misc) | `sentinel:sentinel-ctf` |
| Writing audit report or vulnerability report | `sentinel:sentinel-report` |

**When in doubt:** Invoke `sentinel:sentinel-audit` — it covers the broadest ground.

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
