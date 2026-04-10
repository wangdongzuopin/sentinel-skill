---
name: sentinel-report
description: Use when writing security audit reports, penetration test reports, vulnerability disclosures, or CTF writeups. Invoke after completing any security assessment or when user asks to document findings, write a report, or create a vulnerability disclosure.
---

# Sentinel: Security Report

A security report is only as useful as its ability to drive action. A finding that can't be understood can't be fixed.

**Core principle:** Every finding needs three things — what it is, why it matters, how to fix it.

## Report Types

| Type | Use When |
|------|---------|
| **Audit Report** | Code review / SAST engagement complete |
| **Pentest Report** | Active testing engagement complete |
| **Vulnerability Disclosure** | Responsible disclosure to a vendor |
| **CTF Writeup** | Documenting CTF challenge solution |

---

## Audit / Pentest Report Structure

Use this template. Every section is required.

~~~markdown
# Security Assessment Report
**Target:** [System/Application name]
**Assessment Type:** [Code Audit / Penetration Test / Both]
**Date:** [YYYY-MM-DD]
**Assessor:** [Name or handle]
**Authorization:** [Reference to written authorization]

---

## Executive Summary

[2-4 sentences for a non-technical audience.
What was tested? What was the overall risk posture?
What is the single most important thing to fix?]

**Overall Risk Rating:** [Critical / High / Medium / Low]

### Finding Summary

| Severity | Count |
|----------|-------|
| Critical | N |
| High | N |
| Medium | N |
| Low | N |
| Informational | N |

---

## Scope & Methodology

**In Scope:**
- [List of systems, IP ranges, domains tested]

**Out of Scope:**
- [Explicitly excluded systems]

**Testing Period:** [Start date] to [End date]

**Methodology:** [OWASP Testing Guide / PTES / Custom]

**Tools Used:** [List major tools]

---

## Findings

### [SEVERITY] FIND-001: [Title]

**Severity:** Critical / High / Medium / Low / Informational
**CWE:** CWE-XXX ([name])
**CVSS Score:** X.X (AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H)
**Location:** [File:line, URL, or system component]

**Description:**
[What is the vulnerability? What is the root cause?]

**Impact:**
[What could an attacker do specifically?]

**Evidence:**
[Paste relevant code snippet, request/response, or command output.
Redact sensitive production data.]

**Reproduction Steps:**
1. [Specific enough that a developer can reproduce it]
2.
3.

**Recommendation:**
[Specific, actionable fix with code example where possible.]

Before (vulnerable):
  query = "SELECT * FROM users WHERE id = " + user_id

After (fixed):
  query = "SELECT * FROM users WHERE id = ?"
  cursor.execute(query, (user_id,))

**References:**
- [OWASP link, CVE, CWE, or relevant documentation]

---

## Positive Findings

[What was done well? 2-5 things the team is doing right.]

---

## Recommendations Summary

**Immediate (fix within 48 hours):**
- FIND-001: [Title] — [one-line fix description]

**Short-term (fix within 2 weeks):**
- FIND-002: [Title]

**Medium-term (fix within 90 days):**
- FIND-003: [Title]

---

## Appendix

### A. Tools & Versions
[Full tool list with versions]

### B. Raw Scan Output
[Attach or link to automated scan results]
~~~

---

## Vulnerability Disclosure Format

~~~markdown
**Vulnerability Report**

Product: [Name and version]
Reporter: [Your name/handle]
Date: [YYYY-MM-DD]
Severity: [Critical/High/Medium/Low]

## Summary
[One paragraph — what is the vulnerability and its impact?]

## Technical Details
[Detailed description of the vulnerability]

## Reproduction Steps
1.
2.
3.

## Proof of Concept
[Minimal PoC that demonstrates impact without causing harm]

## Impact
[What can an attacker do?]

## Suggested Fix
[Your recommendation]

## Timeline
- [Date]: Vulnerability discovered
- [Date]: Report submitted
- [Date]: Vendor acknowledged
- [Date]: Fix released / Disclosure date
~~~

---

## CTF Writeup Format

~~~markdown
# [Challenge Name] — [CTF Name] [Year]

**Category:** Web / Pwn / Crypto / Reverse / Forensics / Misc
**Points:** XXX
**Difficulty:** Easy / Medium / Hard

## Challenge Description
[Paste the original challenge description]

## Initial Analysis
[What did you observe first? What tools did you use?]

## Solution

### Step 1: [Title]
[What you did and why]

### Step 2: [Title]
[Continue for each major step]

## Exploit / Solution Code
[Full working code]

## Flag
flag{...}

## Lessons Learned
[What technique or concept did this challenge teach?]
~~~

---

## Severity Rating Guide

Rate each finding using CVSS v3.1:

| Severity | CVSS Score | Example |
|----------|-----------|---------|
| Critical | 9.0–10.0 | Unauthenticated RCE |
| High | 7.0–8.9 | Auth bypass, SQLi with data access |
| Medium | 4.0–6.9 | Stored XSS, IDOR requiring auth |
| Low | 0.1–3.9 | Missing security headers |
| Info | N/A | Best practice recommendations |

## Writing Quality Checklist

Before finalizing any report:

- Every finding has a reproduction step that a developer can follow
- No finding says "could lead to" — say what specifically happens
- Every Critical/High has a code-level or config-level fix recommendation
- Executive Summary contains no jargon
- Evidence is present for every finding
- Sensitive data is redacted from evidence

## Integration

- After `sentinel:sentinel-audit` or `sentinel:sentinel-pentest` — use this skill
- For structured output: consider generating as Markdown, then convert to PDF/DOCX
