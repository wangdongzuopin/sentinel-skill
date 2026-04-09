# Sentinel — Security Skills for Claude Code

Sentinel extends [Superpowers](https://github.com/obra/superpowers) with a professional security analysis skill set covering code auditing, penetration testing, CTF challenges, and security report writing.

## Skills

| Skill | Purpose |
|-------|---------|
| `sentinel:using-sentinel` | Entry point — routes to the right skill |
| `sentinel:sentinel-audit` | Source code security audit (OWASP, SAST, manual review) |
| `sentinel:sentinel-pentest` | Penetration testing workflow (recon → exploit → report) |
| `sentinel:sentinel-ctf` | CTF challenge solving (web/pwn/crypto/reverse/forensics) |
| `sentinel:sentinel-report` | Security report and vulnerability disclosure writing |

## Prerequisites

Sentinel is designed to work **alongside Superpowers**, not instead of it. Install Superpowers first:

```bash
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

## Installation

```bash
# Clone this repo into your skills directory
git clone https://github.com/wangdongzuopin/sentinel-skill ~/.claude/sentinel

# Or install via plugin marketplace (when published)
/plugin install sentinel@sentinel-marketplace
```

## Directory Structure

```
sentinel/
├── README.md
└── skills/
    ├── using-sentinel/
    │   └── SKILL.md              # Entry point skill
    ├── sentinel-audit/
    │   ├── SKILL.md              # Code audit methodology
    │   └── references/
    │       ├── patterns-php.md   # PHP vulnerability patterns
    │       ├── patterns-python.md
    │       ├── patterns-js.md
    │       └── patterns-java.md
    ├── sentinel-pentest/
    │   └── SKILL.md              # Pentest methodology
    ├── sentinel-ctf/
    │   └── SKILL.md              # CTF solving guide
    └── sentinel-report/
        └── SKILL.md              # Report templates
```

## Usage

Once installed, skills trigger automatically based on context. You can also invoke explicitly:

```
# Start a code audit
"Please audit this PHP codebase for security vulnerabilities"

# CTF challenge
"I have a CTF web challenge, here's the URL..."

# Pentest engagement
"I'm doing a pentest on example.com (authorized), help me with recon"

# Write a report
"Write up the findings from our audit as a security report"
```

## Integration with Superpowers

Sentinel and Superpowers complement each other:

- `superpowers:systematic-debugging` → trace vulnerability root cause
- `superpowers:requesting-code-review` → review security fixes
- `superpowers:subagent-driven-development` → parallelize multi-target assessments
- `sentinel:sentinel-report` → document everything at the end

## Ethics & Legal

Sentinel skills include mandatory authorization checks for active testing. All penetration testing guidance assumes:

- Written authorization from the system owner
- Clearly defined scope
- Responsible disclosure practices

Skills will not assist with unauthorized access to systems.

## Contributing

Built on the [Superpowers skill framework](https://github.com/obra/superpowers). See `skills/writing-skills/SKILL.md` in the Superpowers repo for the skill authoring guide.
