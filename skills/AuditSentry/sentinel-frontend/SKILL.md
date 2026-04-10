---

## name: sentinel-frontend
description: Frontend security audit (Vue/React/Angular). When audit findings are final, MUST chain to sentinel-report — read sentinel-report/SKILL.md, ask save folder, Write .md + offline .html.

# Sentinel: Frontend Security

> **Mandatory handoff:** When you **finish** listing frontend findings, you **must** apply `**sentinel-report`** — read `skills/sentinel/sentinel-report/SKILL.md`, **Closing gate**, `**Write`** `.md` + `.html`.

Frontend security has unique challenges: code runs in the user's browser, frameworks abstract away DOM manipulation, and client-side controls are easily bypassed. The same vulnerability classes apply (XSS, injection, CSRF) but the attack surface and defenses look different.

**Core principle:** Client-side security is about defense in depth. Anything enforced only in the browser can be bypassed. Server must always validate.

## React Security

### XSS Prevention

```javascript
// VULNERABLE — dangerouslySetInnerHTML bypasses React's escaping
function MarkdownPreview({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

// VULNERABLE — Render raw HTML from user input
const userInput = "<img src=x onerror=alert(1)>";
return <div dangerouslySetInnerHTML={{ __html: userInput }} />;

// SAFE — Use DOMPurify to sanitize
import DOMPurify from 'dompurify';
return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />;

// SAFE — Use markdown library that sanitizes
import ReactMarkdown from 'react-markdown';
return <ReactMarkdown>{userInput}</ReactMarkdown>;
```

### React Security Checklist

```javascript
// ✅ Always use controlled inputs for forms
const [value, setValue] = useState('');
<input value={value} onChange={e => setValue(e.target.value)} />;

// ✅ Validate and sanitize on client AND server
// Client validation is UX only, not security

// ✅ Use framework's built-in CSRF protection
// React doesn't have built-in CSRF — handle via fetch defaults

// ✅ Set security headers via meta tags or CDN config
// Content-Security-Policy, X-Frame-Options, X-Content-Type-Options
```

### React Router Security

```javascript
// VULNERABLE — Open redirect via query param
const { redirect } = useNavigate();
redirect(userQueryParam);  // user could redirect to evil.com

// SAFE — Validate redirect target
const isAllowed = (url) => ['/dashboard', '/profile'].some(p => url.startsWith(p));
if (isAllowed(redirectParam)) {
  navigate(redirectParam);
}

// VULNERABLE — Path traversal in routing
navigate('../../../etc/passwd');

// SAFE — Always validate routes against an allowlist
const ALLOWED_ROUTES = ['/', '/dashboard', '/profile'];
if (ALLOWED_ROUTES.includes(path)) navigate(path);
```

### State Management Security (Redux/Context)

```javascript
// VULNERABLE — Store sensitive data in plain state
const [token, setToken] = useState(userAuthToken);
// Token visible in Redux DevTools, localStorage if persisted

// SAFE — Use httpOnly cookies for tokens, not client storage
// If you must store: encrypt sensitive data before putting in state

// VULNERABLE — Persist entire state to localStorage
const persistedState = localStorage.getItem('state');
// Any XSS can read this

// SAFE — Don't persist sensitive data, or encrypt before persist
```

## Vue.js Security

### XSS Prevention

```javascript
// VULNERABLE — v-html renders raw HTML
<template>
  <div v-html="userContent"></div>
</template>

// SAFE — Sanitize before rendering
<template>
  <div v-html="sanitizedContent"></div>
</template>
import DOMPurify from 'dompurify';
computed: {
  sanitizedContent() {
    return DOMPurify.sanitize(this.userContent);
  }
}

// VULNERABLE — Template injection in dynamic templates
new Vue({
  template: userControlledTemplate  // NEVER do this
});

// SAFE — Never use user input in Vue templates
```

### Vue Router Security

```javascript
// VULNERABLE — Open redirect
this.$router.push(userInput);  // user could redirect anywhere

// SAFE — Validate against whitelist
const ALLOWED_PATHS = ['/dashboard', '/profile', '/settings'];
if (ALLOWED_PATHS.includes(path)) {
  this.$router.push(path);
}

// Navigation guard — always validate
router.beforeEach((to, from, next) => {
  if (to.query.redirect) {
    const url = new URL(to.query.redirect, window.location.origin);
    if (url.origin !== window.location.origin) {
      return next('/');  // Block cross-origin redirect
    }
  }
  next();
});
```

### Vue Security Checklist

```javascript
// ✅ Use :value not v-bind for form inputs
// ✅ Don't store tokens in localStorage — use httpOnly cookies
// ✅ Sanitize any user-generated HTML with DOMPurify
// ✅ Validate all navigation redirects server-side too
// ✅ Use Vue's built-in sanitize options for rich text editors
```

## Common Client-Side Vulnerabilities

### SSRF (Client-Side)

```javascript
// VULNERABLE — User controls URL being fetched
const response = await fetch(userProvidedUrl);

// SAFE — Only fetch from a predefined list or validate strictly
const ALLOWED_API_PREFIXES = ['/api/', '/static/'];
if (!ALLOWED_API_PREFIXES.some(p => url.startsWith(p))) {
  throw new Error('Invalid URL');
}
fetch(url);
```

### WebSocket Security

```javascript
// VULNERABLE — Accept any WebSocket connection
const ws = new WebSocket(userProvidedUrl);

// SAFE — Validate origin
const ws = new WebSocket(url, [allowedOrigin]);
ws.onopen = (event) => {
  if (event.origin !== expectedOrigin) {
    ws.close();
  }
};
```

### Local Storage Exposure

```javascript
// VULNERABLE — Store sensitive data
localStorage.setItem('authToken', token);
localStorage.setItem('userData', JSON.stringify(user));

// Why vulnerable: Any XSS can read localStorage via
// document.cookie (if not httpOnly) or localStorage.getItem()

// SAFE — Use httpOnly cookies for authentication tokens
// SessionStorage clears on tab close (slightly better for sensitive temp data)

// SAFE — If you must use localStorage: encrypt data
import CryptoJS from 'crypto-js';
localStorage.setItem('data', CryptoJS.AES.encrypt(JSON.stringify(data), key));
```

## Frontend Dependency Security

### npm Audit for Frontend

```bash
# Check for known vulnerabilities
npm audit
npm audit --audit-level=high

# Check for outdated packages with known CVEs
npm outdated

# Use Snyk or Socket.dev for runtime behavior analysis
npx @snyk/cli check

# Webpack audit for bundle vulnerabilities
npx webpack-bundle-analyzer
```

### Common Vulnerable Frontend Dependencies


| Package                         | Vulnerability          | Fix     |
| ------------------------------- | ---------------------- | ------- |
| `jquery < 3.5.0`                | XSS via `$()` selector | Upgrade |
| `lodash < 4.17.12`              | Prototype pollution    | Upgrade |
| `serialize-javascript < 3.1.0`  | XSS via serialization  | Upgrade |
| `vue-template-compiler < 3.0.0` | XSS in templates       | Upgrade |
| `react-dom < 16.4.0`            | Various                | Upgrade |


### Supply Chain Attacks

```bash
# Check for typosquatted packages
# Attackers publish "reacct" vs "react"

# Verify package integrity
npm install --package-lock-only
npm ci  # installs exact versions from lockfile

# Use lockfiles, never package-lock.json
# Audit new packages before install
npx package-check <package-name>
```

## CSP (Content Security Policy)

### Vue/React CSP Configuration

```javascript
// In your server config or meta tags
// Vue/React apps need careful CSP for inline styles and eval

// Strict CSP (requires significant code changes)
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self';
               style-src 'self' 'unsafe-inline';  // may need for styled-components
               img-src 'self' data: https:;
               connect-src 'self' api.example.com;
               font-src 'self';
               frame-ancestors 'none';">

// Report-only mode for testing
<meta http-equiv="Content-Security-Policy-Report-Only"
      content="default-src 'self'; report-uri /csp-violation">
```

### What CSP Protects Against


| CSP Directive            | Protects Against                             |
| ------------------------ | -------------------------------------------- |
| `script-src 'self'`      | Prevents inline script injection             |
| `object-src 'none'`      | Blocks Flash/plugin-based attacks            |
| `frame-ancestors 'none'` | Prevents clickjacking                        |
| `connect-src`            | Limits API calls to trusted sources          |
| `report-uri`             | Detects CSP violations (attacks in progress) |


## Grep Patterns for Frontend Audit

```bash
# XSS candidates
grep -rn 'dangerouslySetInnerHTML\|v-html\|\.html(' . --include="*.js" --include="*.jsx" --include="*.vue"
grep -rn 'innerHTML\s*=' . --include="*.js" --include="*.jsx"

# Prototype pollution
grep -rn 'Object\.assign\|merge\|deepAssign' . --include="*.js" --include="*.jsx"

# localStorage with sensitive data
grep -rn 'localStorage\.setItem\|sessionStorage\.setItem' . --include="*.js" --include="*.jsx"

# Open redirect
grep -rn 'window\.location\|navigate\|redirect\|push\(' . --include="*.js" --include="*.jsx" --include="*.vue"

# Eval/code execution
grep -rn 'eval\|new Function\|\.from\(user' . --include="*.js" --include="*.jsx"

# Hardcoded secrets in frontend
grep -rni 'apiKey\s*=\s*["\x27]\|token\s*=\s*["\x27]\|secret\s*=' . --include="*.js" --include="*.jsx"
```

## Integration

- For React/Vue specific issues: use `sentinel:sentinel-audit` for broader context
- For dependency CVEs: use `sentinel:sentinel-cve` for scoring and prioritization
- After audit: `sentinel:sentinel-report` — **ask save folder**; **default** `.md` + offline HTML; **write** files

