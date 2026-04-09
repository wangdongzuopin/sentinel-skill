---
name: sentinel-audit
description: Use for source code security audits, code review for vulnerabilities, SAST analysis, dependency scanning, and security architecture review. Invoke when user shares code and asks about security, mentions "audit", "vulnerability", "CVE", "SAST", or asks to find bugs in code.
---

# Sentinel: Code Audit

Security code review is not about finding syntax errors — it's about understanding **what the code trusts and whether that trust is justified**.

**Core principle:** Follow the data. Every vulnerability is a place where untrusted data reaches a sensitive operation without adequate validation.

## Phase 1: Scope & Surface Mapping

Before reading a single line of code:

1. **Confirm authorization** — Who owns this code? Is review authorized?
2. **Identify tech stack** — Language, framework, runtime version
3. **Map entry points** — HTTP endpoints, CLI args, file inputs, IPC, env vars
4. **Map trust boundaries** — What data comes from users? External APIs? Databases?
5. **Load the relevant reference** — See references below

```
Entry points → trust boundaries → sensitive sinks → audit paths between them
```

## Phase 2: Automated Scanning

Run appropriate tools first. Tools find the easy things; your brain finds the subtle things.

**By language:**
```bash
# Python
bandit -r . -ll
safety check
semgrep --config=p/python

# JavaScript / Node
npm audit
semgrep --config=p/javascript
eslint --plugin security .

# Java
semgrep --config=p/java
mvn dependency:check

# PHP
psalm --taint-analysis
semgrep --config=p/php

# Go
gosec ./...
semgrep --config=p/golang

# Generic secrets
gitleaks detect
trufflehog filesystem .
```

Record all findings — do not triage yet. Triage happens in Phase 4.

## Phase 3: Manual Review — The OWASP Path

Walk through these categories in order. Each one has a reference file with language-specific patterns.

### A01 — Broken Access Control
- Are authorization checks on every sensitive route?
- Can a user access another user's resources by changing an ID?
- Are admin functions protected beyond just hiding them in the UI?
- IDOR pattern: `GET /api/invoice/{id}` — does it verify the invoice belongs to the requester?

### A02 — Cryptographic Failures
- Is sensitive data encrypted at rest and in transit?
- Are passwords hashed with bcrypt/argon2/scrypt (not MD5/SHA1)?
- Are secrets hardcoded or in source control?
- Is TLS properly validated or are cert checks disabled?

### A03 — Injection
- SQL: Are queries parameterized or using ORM? Any string concatenation in queries?
- Command: Is `exec()`, `system()`, `subprocess` called with user input?
- LDAP, XPath, NoSQL: Same question — is user input reaching the query engine?
- Template injection: Is user input rendered in a template engine?

### A04 — Insecure Design
- Is rate limiting in place on auth endpoints?
- Are there logical flaws in business workflows (e.g., payment bypass, coupon stacking)?
- Does the system fail securely or does it fail open?

### A05 — Security Misconfiguration
- Debug mode enabled in production?
- Default credentials anywhere?
- Unnecessary features, ports, services enabled?
- Error messages revealing stack traces or internal paths?

### A06 — Vulnerable Components
- Are dependencies up to date?
- Are known-vulnerable versions pinned?
- Cross-reference against CVE database for critical deps

### A07 — Authentication Failures
- Brute force protection on login?
- Session tokens — are they cryptographically random and sufficient length?
- Password reset flows — are tokens time-limited and single-use?
- JWT: Is `alg: none` accepted? Is the signature actually verified?

### A08 — Software & Data Integrity
- Are software updates verified before installation?
- Is CI/CD pipeline secured against injection?
- Are deserialization paths sanitized? (Java: ObjectInputStream, Python: pickle, Ruby: Marshal)

### A09 — Logging & Monitoring Failures
- Are security events (login attempts, access control failures) logged?
- Are logs protected from tampering?
- Are secrets or PII being logged?

### A10 — SSRF
- Is user-supplied URL fetched by the server?
- Are internal IP ranges blocked?
- Is DNS rebinding considered?

## Phase 4: Triage & Severity Rating

Rate each finding using CVSS v3.1 base score:

| Severity | CVSS Score | Definition |
|----------|-----------|------------|
| Critical | 9.0–10.0 | Remote code execution, auth bypass with no conditions |
| High | 7.0–8.9 | Significant data exposure, privilege escalation |
| Medium | 4.0–6.9 | Requires auth or complex conditions |
| Low | 0.1–3.9 | Defense in depth, hardening issues |
| Info | N/A | Best practice violations, no direct security impact |

**For each finding, record:**
- Title (CWE reference if applicable)
- Location (file:line)
- Description of the vulnerability
- Attack scenario (how would an attacker exploit this?)
- Evidence (code snippet)
- Severity + CVSS rationale
- Remediation recommendation

## Phase 5: Verification

Before reporting any finding:
- Can you write a proof-of-concept (even pseudocode)?
- Is this actually reachable from an entry point?
- Is there a defense layer you missed?

False positives waste everyone's time. Verify before reporting.

## References

Load the relevant reference when auditing:
- `references/patterns-php.md` — PHP-specific vulnerability patterns
- `references/patterns-java.md` — Java/Spring/Struts patterns
- `references/patterns-js.md` — Node.js/Express patterns
- `references/patterns-python.md` — Django/Flask/FastAPI patterns

## Integration

- After audit: invoke `sentinel:sentinel-report` to structure findings
- For complex vulnerability root cause: invoke `superpowers:systematic-debugging`
- For reviewing audit diffs: invoke `superpowers:requesting-code-review`
