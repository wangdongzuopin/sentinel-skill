# Vue.js Vulnerability Patterns

Reference for `sentinel:sentinel-frontend` when auditing Vue.js codebases.

## XSS via v-html

```javascript
// VULNERABLE — user input rendered as raw HTML
<template>
  <div v-html="userContent"></div>
</template>

// userContent = "<img src=x onerror=alert(document.domain)>"  // XSS!

// SAFE — sanitize with DOMPurify
<template>
  <div v-html="sanitized(userContent)"></div>
</template>
<script>
import DOMPurify from 'dompurify';
export default {
  methods: {
    sanitized(content) {
      return DOMPurify.sanitize(content);
    }
  }
}
</script>
```

## Template Injection (SSTI)

```javascript
// VULNERABLE — user input used in template
new Vue({
  template: `<div>${userInput}</div>`  // SSTI!
});

// VULNERABLE — dynamic template compilation
Vue.compile(userControlledTemplate);  // NEVER

// SAFE — never use user input in templates
// Templates should always be static, compiled at build time
```

## Open Redirect via Router

```javascript
// VULNERABLE — push user-controlled URL
this.$router.push(query.redirect);  // could be https://evil.com

// SAFE — whitelist validation
const ALLOWED = ['/', '/dashboard', '/profile'];
if (ALLOWED.includes(path)) {
  this.$router.push(path);
}

// SAFE — use router.replace with validation
if (isSafeRedirect(to.query.redirect)) {
  router.replace(to.query.redirect);
}
```

## Computed Property Injection

```javascript
// VULNERABLE — user input in computed property that renders
computed: {
  displayContent() {
    return this.userInput;  // if rendered with v-html, XSS
  }
}

// SAFE — always sanitize user input before rendering
computed: {
  displayContent() {
    return DOMPurify.sanitize(this.userInput);
  }
}
```

## Watcher Exploitation

```javascript
// VULNERABLE — watch user input and update DOM unsafely
watch: {
  userInput(newVal) {
    this.$refs.output.innerHTML = newVal;  // Direct DOM manipulation bypasses Vue's escaping
  }
}

// SAFE — use Vue's reactive system properly
watch: {
  userInput(newVal) {
    this.safeOutput = newVal;  // Vue auto-escapes in templates
  }
}
```

## Vuex/State Pollution

```javascript
// VULNERABLE — store sensitive data in plain state
const store = new Vuex.Store({
  state: {
    apiToken: localStorage.getItem('token')  // visible in devtools
  }
});

// SAFE — use httpOnly cookies, not localStorage for tokens
// If you must use localStorage, don't put it in Vuex state visible to Redux DevTools
```

## Event Handler Injection

```javascript
// VULNERABLE — user input in event binding
<a :href="userLink" @click="userHandler">Click</a>
// userLink = "javascript:alert(1)"
// userHandler = "alert(document.cookie)"

// SAFE — validate and sanitize all user inputs
computed: {
  safeLink() {
    const url = new URL(this.userLink, window.location.origin);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return '#';
    }
    return this.userLink;
  }
}
```

## Grep Patterns for Vue Audit

```bash
# v-html usage (XSS risk)
grep -rn 'v-html' . --include="*.vue"

# innerHTML manipulation
grep -rn 'innerHTML' . --include="*.js" --include="*.vue"

# Template compilation with user input
grep -rn 'Vue\.compile\|new Function' . --include="*.js"

# Router push with user input
grep -rn '\$router\.push\|router\.push' . --include="*.js" --include="*.vue"

# localStorage/sessionStorage with sensitive data
grep -rn 'localStorage\|sessionStorage' . --include="*.js" --include="*.vue"
```
