# React Vulnerability Patterns

Reference for `sentinel:sentinel-frontend` when auditing React codebases.

## dangerouslySetInnerHTML XSS

```javascript
// VULNERABLE — raw HTML from any source
function RenderContent({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: content }} />;
}

// Attack: content = "<img src=x onerror=alert(1)>"

// SAFE — sanitize first
import DOMPurify from 'dompurify';

function RenderContent({ content }) {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(content) }} />;
}

// SAFE — use react-markdown (auto-sanitizes)
import ReactMarkdown from 'react-markdown';
function RenderContent({ content }) {
  return <ReactMarkdown>{content}</ReactMarkdown>;
}
```

## URL Handling XSS

```javascript
// VULNERABLE — user-controlled href
<a href={userUrl}>Link</a>
// userUrl = "javascript:alert(1)"

// SAFE — validate URL scheme
const safeUrl = (url) => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol) ? url : '#';
  } catch {
    return '#';
  }
};
<a href={safeUrl(userUrl)}>Link</a>
```

## JSON Injection via props.children

```javascript
// VULNERABLE — render children from untrusted source
<Wrapper>
  {userJsonData.map(item => <div>{item}</div>)}
</Wrapper>

// SAFE — validate and sanitize data structure
const safeItems = Array.isArray(userJsonData)
  ? userJsonData.filter(item => typeof item === 'string').map(s => s.slice(0, 200))
  : [];
```

## React Router Open Redirect

```javascript
// VULNERABLE — navigate to user-controlled path
const navigate = useNavigate();
navigate(redirectParam);  // could redirect to https://evil.com

// SAFE — validate redirect target
const isLocalPath = (path) => {
  try {
    const url = new URL(path, window.location.origin);
    return url.origin === window.location.origin && path.startsWith('/');
  } catch {
    return path.startsWith('/');
  }
};
if (isLocalPath(redirectParam)) {
  navigate(redirectParam);
}
```

## State Exposure via Redux DevTools

```javascript
// VULNERABLE — store sensitive data in Redux state
const initialState = {
  user: {
    token: localStorage.getItem('authToken'),  // visible in Redux DevTools
    ssn: userData.ssn,  // sensitive PII in state
  }
};

// SAFE — keep sensitive data in httpOnly cookies, not state
// If you must store sensitive data:
// 1. Encrypt before putting in state
// 2. Don't persist entire state to localStorage
```

## Serialization Vulnerabilities

```javascript
// VULNERABLE — deserialize untrusted data
const data = JSON.parse(userInput);
// Also applies to:
import yaml from 'js-yaml';
const data = yaml.load(userInput);  // arbitrary code execution in older versions

// SAFE — use strict JSON.parse only
// For YAML: use yaml.safeLoad (if using js-yaml >= 4.1.0)
```

## useEffect Injection

```javascript
// VULNERABLE — dynamic code in useEffect
useEffect(() => {
  // userCode could be "alert(1)" — never do this
  eval(userCode);
}, [userCode]);

// VULNERABLE — dynamic script loading
useEffect(() => {
  const script = document.createElement('script');
  script.src = userScriptUrl;  // could load malicious code
  document.body.appendChild(script);
}, [userScriptUrl]);

// SAFE — only load scripts from trusted CDNs, validated paths
// Prefer bundling dependencies at build time
```

## React Helmet Security Headers

```javascript
// Missing security headers in SSR apps
// Configure in your server or index.html:

// ❌ Missing
<title>My App</title>

// ✅ Has security headers
<head>
  <meta http-equiv="Content-Security-Policy" content="script-src 'self'" />
  <meta http-equiv="X-Frame-Options" content="DENY" />
  <meta http-equiv="X-Content-Type-Options" content="nosniff" />
</head>
```

## Grep Patterns for React Audit

```bash
# dangerouslySetInnerHTML usage
grep -rn 'dangerouslySetInnerHTML' . --include="*.jsx" --include="*.tsx"

# innerHTML assignment
grep -rn '\.innerHTML\s*=' . --include="*.jsx" --include="*.tsx"

# eval and dynamic code execution
grep -rn 'eval\|new Function\|setTimeout.*user\|setInterval.*user' . --include="*.jsx" --include="*.tsx"

# URL handling in href/src
grep -rn 'href=\{.*user\|src=\{.*user' . --include="*.jsx" --include="*.tsx"

# Script injection via dangerouslySetInnerHTML
grep -rn '<script\|javascript:' . --include="*.jsx" --include="*.tsx"

# Sensitive data in localStorage
grep -rn 'localStorage\.setItem.*token\|localStorage\.setItem.*password' . --include="*.jsx" --include="*.tsx"
```
