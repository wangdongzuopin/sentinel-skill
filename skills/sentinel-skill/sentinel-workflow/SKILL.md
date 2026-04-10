---
name: sentinel-workflow
description: Use for engineering discipline around security work — systematic root-cause tracing, verification before claiming success, structured review of fixes, threat-focused design exploration, and coordinating parallel multi-target analysis. Standalone replacement for external workflow plugins. Works in Claude Code, Cursor, Codex, Trae, and similar agents; attach this SKILL.md explicitly when the host does not auto-load skills.
---

# Sentinel Workflow (Standalone)

Sentinel ships **built-in** workflow patterns so you can run full security engagements without installing a separate plugin ecosystem. Follow the sections below instead of delegating to external workflow skills.

**Multi-host:** The procedures below apply in any AI coding agent that can follow structured instructions (Claude Code, Cursor, Codex, Trae, etc.). If your host has no skill auto-discovery, paste or `@`-reference this file at the start of the task.

## When to Invoke

| Situation | Use this section |
|-----------|------------------|
| Bug or vuln behavior is unclear | **Systematic root-cause tracing** |
| About to say "fixed", "done", or "passes" | **Verification before completion** |
| Auditing patches, PRs, or remediation diffs | **Security-focused code review** |
| Designing controls, threat models, or scope | **Design exploration** |
| Many files, services, or targets in one pass | **Parallel multi-target work** |

## Instruction Priority (Sentinel Standalone)

1. **User's explicit instructions** — highest
2. **Sentinel security skills** (`sentinel-audit`, `sentinel-frontend`, `sentinel-pentest`, `sentinel-ctf`, `sentinel-cve`, `sentinel-report`) — for security-specific methodology
3. **This skill (`sentinel-workflow`)** — for debugging, verification, review, and planning hygiene
4. **Default system behavior** — lowest

---

## Systematic Root-Cause Tracing

Use when a vulnerability, crash, or unexpected behavior needs a defensible explanation (audit, CTF pwn, CVE impact on your build, pentest follow-up).

1. **Reproduce** — minimal steps, fixed inputs, one observable symptom.
2. **Hypotheses** — list 2–5 plausible causes (ranked); avoid a single narrative until evidence supports it.
3. **Evidence** — for each hypothesis, what would confirm or falsify it? Gather traces, logs, code paths, versions, configs.
4. **Narrow** — eliminate hypotheses with evidence; document what ruled each out.
5. **Conclude** — state the root cause with citations (file:line, version, config key). If uncertain, say what is unknown and what to measure next.

Do not skip from symptom to "the fix" without steps 2–4 for high-severity or legal-impact findings.

---

## Verification Before Completion

Before claiming remediation works, tests pass, or an engagement is finished:

- Run the **same or stricter** checks you used to find the issue (repro script, PoC, unit/integration path).
- Confirm **negative cases** — the fix does not open a adjacent bug (auth bypass, parser differential, etc.).
- Capture **evidence** (command output, diff summary, screenshot of passing run) in the thread or report.
- If you cannot run commands, **state that explicitly** and list what a human verifier must run.

Never assert "complete" or "secure" on intuition alone.

---

## Security-Focused Code Review

Use after an audit pass, before merge, or when reviewing patches for reported CVEs.

1. **Scope** — what changed? What threat model slice does it touch (auth, parsing, crypto, ACL, SSRF, etc.)?
2. **Invariants** — what must remain true? (e.g. "user A cannot read B's id")
3. **Diff discipline** — check boundary checks, error handling, default-deny, secret handling, logging of sensitive data.
4. **Abuse cases** — attacker-controlled input, race windows, retries, oversized payloads.
5. **Verdict** — approve, request changes, or escalate with concrete file references.

Prefer verifiable comments over generic "looks good."

---

## Design Exploration

Use when choosing mitigations, scoping a engagement, or comparing architectural options.

- State **goals and non-goals**; list **assumptions** explicitly.
- Brainstorm **2+ approaches** with trade-offs (complexity, operability, residual risk).
- Identify **open questions** and what evidence would resolve them.
- Do not lock a design before authorization and scope are clear (especially for pentest).

---

## Parallel Multi-Target Work

When many components need assessment in one session:

- **Partition** targets (e.g. by service, directory, or risk tier); avoid duplicate work across partitions.
- **Single source of truth** — one running list of findings with severity, repro, and owner area.
- **Merge** results into one coherent narrative for `sentinel:sentinel-report` when reporting.

If the runtime supports multiple agents, assign partitions explicitly; otherwise, iterate partitions sequentially but keep the shared finding list.

---

## Integration With Other Sentinel Skills

| After / during | Invoke |
|----------------|--------|
| Root cause confirmed | `sentinel:sentinel-report` for structured write-up |
| Code paths identified | `sentinel:sentinel-audit` or `sentinel:sentinel-frontend` for deeper pattern review |
| CVE relevance unclear | `sentinel:sentinel-cve` for scoring and version context |

Optional: teams that also use the Superpowers plugin may still call those skills; **this skill is sufficient on its own** for Sentinel-only installs.
