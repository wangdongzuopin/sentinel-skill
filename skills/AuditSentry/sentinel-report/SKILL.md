---
name: sentinel-report
description: MANDATORY after sentinel-audit, sentinel-pentest, sentinel-frontend completes. Default write sentinel-security-assessment.md + sentinel-security-assessment.html. MUST ask save folder. HTML has ECharts pie (online, CDN) + CSS-bar fallback (offline). Multi-project tabs show each project vuln count as proportion of total. Triggers on audit complete, report, 报告, HTML deliverable.
---

# Sentinel: Security Report

> **STOP — MANDATORY FOR ALL ASSISTANTS**  
> If you just finished **`sentinel-audit`**, **`sentinel-pentest`**, or **`sentinel-frontend`**, or the user asked for a **security report / 报告 / 审计结果** — treat this skill as **ACTIVE NOW**.  
> **Do not** stop after pasting findings in chat. **Immediately**: (1) run **Closing gate**, (2) **`Write`** both files to the chosen folder.  
> "Invoking this skill" = **following these steps**, not just mentioning the name.

**Core principle:** Every finding needs three things — what it is, why it matters, how to fix it.

---

## Hard rules — do not skip

1. **No "done" without Closing gate + file writes** (unless user said paste-only, no files).
2. **Default deliverable:** `sentinel-security-assessment.md` + `sentinel-security-assessment.html`.  
   **Always ask:** 「**报告保存到哪个文件夹？**」Default: workspace / project root.
3. **Opt-out of HTML** only if user clearly says no HTML; still write `.md`.
4. **Use the `Write` tool** to create files on disk — never substitute a pasted HTML block for an actual file.
5. **No Python / no build step.** Author the full `.html` body yourself.

---

## Closing gate (run before saying 完成)

Unless already answered in this thread:

1. **保存到哪个文件夹？**（必问）Both `.md` and `.html` go to the **same** folder. Default: project root.
2. **是否不要 HTML？** Default: **要生成**。
3. **是否多项目 Tab？** If yes: one HTML, one tab per project + overview tab with ECharts pie showing each project's proportion.

Then **immediately** `Write` both files.

---

## HTML — chart strategy (dual-mode)

### Online (ECharts CDN — default when internet available)

Use **ECharts** via CDN for interactive, professional charts:

```html
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
```

**Chart type: pie / donut (饼图 / 环形图)**

- **Single project:** one pie showing vulnerability count by severity (Critical / High / Medium / Low / Info).
- **Multi-project (overview tab):** one pie where **each slice = one project's total vuln count** and its **proportion of the grand total across all projects**. Label shows `项目名 (N, X%)`. Additional per-project tabs each have their own severity pie.

ECharts init pattern:
```js
const chart = echarts.init(document.getElementById('chart-id'));
chart.setOption({
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  legend: { orient: 'vertical', left: 'left' },
  series: [{
    type: 'pie',
    radius: ['40%', '70%'],   // donut
    data: [
      { value: N, name: 'ProjectA / Critical' },
      // ...
    ],
    emphasis: { itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.5)' } }
  }]
});
```

Colors for severity: Critical `#b42318`, High `#d95c4f`, Medium `#f0ad4e`, Low `#5b8fbf`, Info `#888`.

### Offline fallback (CSS bars — no internet)

When the user is on an intranet / air-gapped, **omit the `<script src>` tag** entirely and replace pie charts with **horizontal CSS bars**:

```html
<style>
.bar-row{display:grid;grid-template-columns:7rem 1fr 2.5rem;gap:.5rem;align-items:center;margin:.3rem 0;font-size:.9rem}
.track{height:.8rem;background:#e8e8e8;border-radius:4px;overflow:hidden}
.track>i{display:block;height:100%}
.c-critical{background:#b42318}.c-high{background:#d95c4f}.c-medium{background:#f0ad4e}
.c-low{background:#5b8fbf}.c-info{background:#888}
.stacked{display:flex;height:1.4rem;border-radius:6px;overflow:hidden;margin:.8rem 0}
.stacked span{display:flex;align-items:center;justify-content:center;color:#fff;font-size:.7rem;padding:0 2px;min-width:0}
</style>

<!-- Horizontal bars — width% = count/total*100 -->
<div class="bar-row"><span>Critical</span><div class="track"><i class="c-critical" style="width:40%"></i></div><span>4</span></div>

<!-- Stacked bar across projects — flex proportional to count -->
<div class="stacked">
  <span class="c-critical" style="flex:12" title="ProjectA 12">A·12</span>
  <span class="c-high"     style="flex:8"  title="ProjectB 8">B·8</span>
</div>
```

### Mode selection by agent

| Situation | Action |
|-----------|--------|
| User said "内网 / 离线 / no internet" | Use CSS bars only; no `<script src>` |
| User said "在线 / can access internet" | Use ECharts CDN |
| Not specified | **Ask once** in Closing gate: 「生成报告的机器能访问外网吗？」 |

Add to Closing gate item **2b**: 「能访问外网（用 ECharts 动态图）还是离线（用静态条形图）？」

---

## HTML structure

### Single project

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Security Assessment</title>
  <style>/* layout: .wrap max-width 56rem; article.report styles; bar styles if offline */</style>
</head>
<body>
<div class="wrap">
  <h1>Security Assessment Report</h1>
  <p class="meta">Generated · YYYY-MM-DD</p>

  <!-- Chart area -->
  <div id="chart-severity" style="width:100%;height:320px"></div>
  <!-- or CSS bars if offline -->

  <!-- Full report -->
  <article class="report">
    <!-- report HTML body -->
  </article>
</div>
<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script>
  echarts.init(document.getElementById('chart-severity')).setOption({ /* severity pie */ });
</script>
</body>
</html>
```

### Multi-project (tabs + overview pie)

```html
<!-- Tabs -->
<div class="tabs">
  <button class="tab-btn active" data-tab="tab-overview">总览</button>
  <button class="tab-btn" data-tab="tab-proj-0">ProjectA</button>
  <!-- one button per project -->
</div>

<!-- Overview tab: pie where each slice = one project's total / grand total -->
<div id="tab-overview" class="tab-panel active">
  <div id="chart-overview" style="width:100%;height:360px"></div>
  <table><!-- project × severity × total summary --></table>
</div>

<!-- Per-project tabs: severity pie + report article -->
<div id="tab-proj-0" class="tab-panel">
  <div id="chart-proj-0" style="width:100%;height:300px"></div>
  <article class="report"><!-- ProjectA full report --></article>
</div>

<script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
<script>
// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn =>
  btn.addEventListener('click', function() {
    document.querySelectorAll('.tab-btn,.tab-panel').forEach(el => el.classList.remove('active'));
    this.classList.add('active');
    document.getElementById(this.dataset.tab).classList.add('active');
  })
);

// Overview pie — each slice = project proportion of grand total
const grand = 35; // sum of all projects
echarts.init(document.getElementById('chart-overview')).setOption({
  title: { text: '各项目漏洞占比', left: 'center' },
  tooltip: { trigger: 'item', formatter: '{b}: {c} 个 ({d}%)' },
  legend: { bottom: 0 },
  series: [{
    type: 'pie', radius: ['35%','65%'],
    data: [
      { value: 12, name: 'ProjectA' },
      { value: 15, name: 'ProjectB' },
      { value: 8,  name: 'ProjectC' }
    ]
  }]
});

// Per-project severity pies
echarts.init(document.getElementById('chart-proj-0')).setOption({
  title: { text: 'ProjectA 漏洞严重级别', left: 'center' },
  tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
  series: [{
    type: 'pie', radius: ['35%','65%'],
    data: [
      { value: 3, name: 'Critical', itemStyle:{ color:'#b42318' } },
      { value: 5, name: 'High',     itemStyle:{ color:'#d95c4f' } },
      { value: 4, name: 'Medium',   itemStyle:{ color:'#f0ad4e' } }
    ]
  }]
});
</script>
```

---

## Markdown report template

~~~markdown
# Security Assessment Report
**Target:** [System/Application name]
**Assessment Type:** [Code Audit / Pentest / Both]
**Date:** [YYYY-MM-DD]
**Assessor:** [Name or handle]
**Authorization:** [Reference to written authorization]

---

## Executive Summary

[2–4 sentences for a non-technical audience.]

**Overall Risk Rating:** Critical / High / Medium / Low

### Finding Summary

| Severity      | Count |
|---------------|-------|
| Critical      | N     |
| High          | N     |
| Medium        | N     |
| Low           | N     |
| Informational | N     |

---

## Scope & Methodology

**In Scope:** …
**Out of Scope:** …
**Testing Period:** [Start] to [End]
**Methodology:** [OWASP Testing Guide / PTES / Custom]

---

## Findings

### [SEVERITY] FIND-001: [Title]

**Severity:** …  **CWE:** CWE-XXX  **CVSS:** X.X
**Location:** [file:line or URL]

**Description:** …

**Impact:** …

**Evidence:**
```
[request/response or code snippet]
```

**Reproduction Steps:**
1. …

**Recommendation:** …

---

## Recommendations Summary

**Immediate (≤48 h):** …
**Short-term (≤2 weeks):** …
**Medium-term (≤90 days):** …

---

## Appendix

### A. Tools & Versions
### B. Raw Scan Output
~~~

---

## Severity reference (CVSS v3.1)

| Severity | CVSS | Example |
|----------|------|---------|
| Critical | 9.0–10.0 | Unauthenticated RCE |
| High | 7.0–8.9 | Auth bypass, SQLi |
| Medium | 4.0–6.9 | Stored XSS, IDOR |
| Low | 0.1–3.9 | Missing headers |
| Info | N/A | Best practice |

---

## Writing checklist

- Closing gate done; **chart mode asked** (ECharts CDN or offline CSS)
- Files **written** with `Write` tool to chosen folder
- Finding Summary table filled — these numbers feed the charts
- Every finding has repro steps and evidence
- Sensitive data redacted

---

## Integration

- Chained **automatically** after `sentinel-audit` / `sentinel-pentest` / `sentinel-frontend`
- PDF/DOCX: request separately if needed
