# Sentinel — security skills for this workspace

This repository is a **portable** skill bundle: each capability lives in `skills/sentinel-skill/<name>/SKILL.md` with YAML frontmatter (`name`, `description`) and procedural guidance. There are **eight** skills under `skills/sentinel-skill/`.

## How agents should use it

1. **Start here for routing:** read and follow `skills/sentinel-skill/using-sentinel/SKILL.md` before deep security work (audit, pentest, CTF, CVE, reporting).
2. **General engineering hygiene around security:** use `skills/sentinel-skill/sentinel-workflow/SKILL.md` for root-cause tracing, verification before claiming “done”, structured review of fixes, and parallel multi-target analysis.
3. **Logical skill ids** in docs look like `sentinel:sentinel-audit` — map them to however your host names rules, skills, or copied prompts.

## Host notes

- **Claude Code:** copy or symlink `skills/sentinel-skill/` into `.claude/skills/sentinel-skill/` (or follow your version’s skill layout docs).
- **Cursor / Codex / Trae / others:** import this repo or attach the relevant `SKILL.md` files per the product’s rules, skills, or knowledge-base docs.

All Sentinel content is host-agnostic Markdown; wiring is the only product-specific part.
