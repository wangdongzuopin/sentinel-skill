---
name: sentinel-cve
description: Use when user mentions CVE, CVSS, vulnerability lookup, exploit research, CVE database search, or asks about a specific vulnerability severity and mitigation. Invoke when user shares a CVE ID, asks how to assess vulnerability severity, or needs to find known exploits for a component.
---

# Sentinel: CVE Research & Vulnerability Assessment

CVE (Common Vulnerabilities and Exposures) and CVSS (Common Vulnerability Scoring System) are the standard language for communicating vulnerability severity. Getting this right matters — it determines prioritization and response time.

**Core principle:** Never assess a vulnerability by name alone. Always look up the actual CVE record and apply context from your specific environment.

## Step 1: Find the CVE Record

### Primary Sources

| Source | URL | Best For |
|--------|-----|----------|
| **NVD (National Vulnerability Database)** | https://nvd.nist.gov/vuln/detail/CVE-YYYY-NNNNN | Official US govt source, CVSS scores |
| **MITRE CVE** | https://www.cve.org/CVERecord?id=CVE-YYYY-NNNNN | Community canonical source |
| **VulnDB** | https://vulndatabergunter.com | Commercial, often more up-to-date |
| **CISA KEV** | https://www.cisa.gov/known-exploited-vulnerabilities-catalog | Actively exploited in the wild |

### Quick Search Commands

```bash
# Search by CVE ID
curl -s "https://services.nvd.nist.gov/rest/json/cves/2.0?cveId=CVE-YYYY-NNNNN"

# Search by keyword/product
curl -s "https://services.nvd.nist.gov/rest/json/cves/2.0?keywordSearch=apache+log4j"

# GitHub Advisory Database
gh advisory search CVE-YYYY-NNNNN
gh advisory search --ecosystem npm --package express
```

### AI-Assisted Lookup

Use `superpowers:superpowers:systematic-debugging` to trace whether the vulnerability actually affects your specific version/configuration before escalating.

## Step 2: Understand CVSS Scoring

### CVSS v3.1 Base Score Ranges

| Severity | Score | Response Time |
|----------|-------|----------------|
| **Critical** | 9.0–10.0 | 24–48 hours |
| **High** | 7.0–8.9 | 1–2 weeks |
| **Medium** | 4.0–6.9 | 1 month |
| **Low** | 0.1–3.9 | Best effort |
| **None** | 0.0 | Informational |

### CVSS Vector String

Example: `CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H`

| Component | Values | Meaning |
|-----------|--------|---------|
| AV | N, A, L, P | Attack Vector (Network, Adjacent, Local, Physical) |
| AC | L, H | Attack Complexity (Low, High) |
| PR | N, L, H | Privileges Required (None, Low, High) |
| UI | N, R | User Interaction (None, Required) |
| S | U, C | Scope (Unchanged, Changed) |
| C, I, A | H, L, N | Impact (Confidentiality, Integrity, Availability) |

### Interpreting the Vector

```bash
# Critical — Network reachable, no privileges, no user interaction
CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H = 9.8

# High but requires privileges
CVSS:3.1/AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:H = 7.8

# Medium — requires user interaction (phishing)
CVSS:3.1/AV:N/AC:L/PR:N/UI:R/S:U/C:H/I:H/A:H = 8.1
```

### Context Matters

A CVSS 9.8 might be:
- **Critical in your context** if: exposed to internet, no compensating controls
- **Medium in your context** if: behind VPN, WAF blocking exploit, compensating controls in place

**Compensating controls that lower effective severity:**
- Network segmentation (VPC, firewall rules)
- WAF/IPS signatures blocking exploitation
- Authentication requirements beyond default
- Rate limiting on vulnerable endpoint

## Step 3: Find Exploits

### Exploit Databases

```bash
# Search Exploit-DB (Kali: searchsploit)
searchsploit "CVE-YYYY-NNNNN"
searchsploit -m 1234  # copy exploit to current dir

# PacketStorm
https://packetstormsecurity.com/search/?q=CVE-YYYY-NNNNN

# Metasploit modules
msfconsole -q -x "search CVE-YYYY-NNNNN; exit"

# GitHub POC search
gh search code "CVE-YYYY-NNNNN" --language python --limit 10
gh search code "CVE-YYYY-NNNNN" --owner rapid7 --limit 5
```

### Rapid7 PoC Database
```bash
# Search by CVE
curl -s "https://raw.githubusercontent.com/rapid7/vulnrepo/master/data/exploits.json" | jq '.[] | select(.cve[] | contains("CVE-YYYY-NNNNN"))'
```

### Evaluating PoC Quality

| Quality | Indicator |
|---------|-----------|
| **Verified Working** | Metasploit module, confirmed by vendor |
| **Unverified PoC** | GitHub POC, may not work as-is |
| **Theoretical** | Paper/slides describe attack concept |
| **FUD (Fake)** | No code, screenshots only |

## Step 4: Determine Your Exposure

### Questions to Ask

```
☐ What is the affected product/component and exact version?
☐ Is the vulnerable component directly exposed to attackers?
☐ Does a working exploit exist in the wild?
☐ Are there compensating controls in place?
☐ What would an attacker gain (RCE? Data? DoS?)?
☐ What is the blast radius if exploited?
```

### Exposure Decision Tree

```
Is the vulnerable component internet-facing?
├─ YES → Is there a working PoC/exploit?
│   ├─ YES → CRITICAL — remediate immediately
│   └─ NO  → HIGH — prioritize, monitor for exploit development
└─ NO  → Is it in your internal network?
    ├─ YES → Is there a path from internet to this component?
    │   ├─ YES → Treat as internet-facing
    │   └─ NO  → MEDIUM — remediate in patch cycle
    └─ NO  → LOW — remediate in normal maintenance
```

## Step 5: Remediation Research

### Finding Fixes

```bash
# GitHub Security Advisories
gh advisory view CVE-YYYY-NNNNN --repo owner/repo

# Vendor security bulletins
# Search: "[Vendor] security advisory [CVE-YYYY-NNNNN]"

# Red Hat
curl -s "https://access.redhat.com/security/cve/CVE-YYYY-NNNNN"

# Ubuntu
curl -s "https://ubuntu.com/security/CVE-YYYY-NNNNN"

# AWS
# Check AWS Personal Health Dashboard
# Search: "[AWS Service] CVE-YYYY-NNNNN"
```

### Fix Priority

| Priority | Criteria |
|----------|----------|
| **Emergency Patch** | Critical, internet-facing, working exploit |
| **Standard Patch** | High/Medium, no immediate exploit |
| **Accept Risk with Controls** | Low severity OR compensating controls strong |
| **Remediate | No fix available, must implement compensating controls |

## Common Mistakes

| Mistake | Reality |
|---------|---------|
| **Trusting CVE severity as absolute** | Context can raise or lower effective severity by multiple levels |
| **Treating "no PoC" as "safe"** | PoC often appears within days of CVE publication |
| **Ignoring CVSS vector details** | AV:N/PR:N/UI:N is far more dangerous than AV:L/PR:H/UI:R |
| **Applying severity to wrong version** | Check exact affected versions — patch may already be available |

## Integration

- After finding a vulnerability: `sentinel:sentinel-report` for vulnerability disclosure
- For exploit development verification: `superpowers:systematic-debugging`
- For code-level fix confirmation: `sentinel:sentinel-audit`
