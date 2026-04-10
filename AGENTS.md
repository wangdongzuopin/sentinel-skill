# Sentinel — security skills for this workspace

This repository is a **portable** skill bundle. **Quick path:** `skills/sentinel/SKILL.md` (`name: sentinel`) — bundle index & subcommand routing. Each capability lives in `skills/sentinel/<name>/SKILL.md` with YAML frontmatter.

## How agents should use it

1. **Fastest entry:** read `skills/sentinel/SKILL.md`, then open the sub-skill folder from its routing table (default sub-skill: `using-sentinel`).
2. **After audit/pentest/frontend audit:** **always** open `skills/sentinel/sentinel-report/SKILL.md` and **write** `sentinel-security-assessment.md` + `.html` (ask folder first). Do not end with chat-only findings.
3. **General engineering hygiene around security:** use `skills/sentinel/sentinel-workflow/SKILL.md` for root-cause tracing, verification before claiming “done”, structured review of fixes, and parallel multi-target analysis.
4. **Logical skill ids** in docs look like `sentinel:sentinel-audit` — map them to however your host names rules, skills, or copied prompts.

## Host notes

- **Claude Code:** copy or symlink `skills/sentinel/` into `.claude/skills/` (or follow your version’s skill layout docs).
- **Cursor / Codex / Trae / others:** import this repo or attach the relevant `SKILL.md` files per the product’s rules, skills, or knowledge-base docs.

All Sentinel content is host-agnostic Markdown; wiring is the only product-specific part.
