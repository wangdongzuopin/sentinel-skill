# JavaScript / Node.js Vulnerability Patterns

Reference for `sentinel:sentinel-audit` when auditing Node.js, Express, and frontend JS codebases.

## SQL Injection

```javascript
// VULNERABLE — string concatenation
const query = `SELECT * FROM users WHERE id = ${req.params.id}`;
db.query("SELECT * FROM users WHERE name = '" + req.body.name + "'");

// SAFE — parameterized queries
db.query("SELECT * FROM users WHERE id = ?", [req.params.id]);

// SAFE — pg (node-postgres)
client.query("SELECT * FROM users WHERE id = $1", [userId]);

// SAFE — Sequelize ORM (use findOne, not raw with user input)
User.findOne({ where: { id: userId } });

// VULNERABLE — Sequelize raw
sequelize.query(`SELECT * FROM users WHERE id = ${userId}`);
```

## Command Injection

```javascript
// VULNERABLE
const { exec } = require('child_process');
exec('ping ' + req.query.host);
exec(`convert ${filename} output.jpg`);

// VULNERABLE — eval
eval(req.body.code);
new Function(userCode)();

// SAFE — execFile with args array (no shell)
const { execFile } = require('child_process');
execFile('ping', [req.query.host], callback);

// SAFE — validate and sanitize input strictly
const validHost = /^[a-zA-Z0-9.-]+$/.test(host) ? host : null;
```

## Prototype Pollution

```javascript
// VULNERABLE — merge without prototype check
function merge(target, source) {
    for (let key in source) {
        target[key] = source[key];  // __proto__ can be polluted
    }
}

// Attack: {"__proto__": {"admin": true}}

// SAFE — check for prototype keys
function merge(target, source) {
    for (let key in source) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue;
        target[key] = source[key];
    }
}

// Or use Object.assign with Object.create(null) as base
const safe = Object.assign(Object.create(null), userInput);

// Libraries with known prototype pollution issues:
// lodash < 4.17.12, jQuery < 3.4.0, minimist < 1.2.3
```

## Path Traversal

```javascript
// VULNERABLE
const filename = req.query.file;
res.sendFile('/var/app/files/' + filename);
fs.readFile('./uploads/' + req.params.name, ...);

// SAFE — resolve and validate
const path = require('path');
const baseDir = '/var/app/files';
const safePath = path.resolve(baseDir, req.query.file);
if (!safePath.startsWith(baseDir)) {
    return res.status(403).send('Forbidden');
}
res.sendFile(safePath);
```

## XSS (Server-Side Rendering)

```javascript
// VULNERABLE — Express/EJS/Handlebars
res.send('<div>' + req.query.name + '</div>');

// EJS — safe by default with <%=, dangerous with <%-
<%= userInput %>   // safe — HTML encoded
<%- userInput %>   // DANGEROUS — raw HTML

// Handlebars — safe with {{, dangerous with {{{
{{ userInput }}   // safe
{{{ userInput }}} // DANGEROUS

// SAFE — use a library
const escapeHtml = require('escape-html');
res.send('<div>' + escapeHtml(req.query.name) + '</div>');
```

## Insecure JWT

```javascript
// VULNERABLE — alg:none attack
const jwt = require('jsonwebtoken');
jwt.verify(token, secret, { algorithms: ['HS256', 'none'] });  // never allow 'none'

// VULNERABLE — not verifying signature
const decoded = jwt.decode(token);  // decode only, no verification!

// SAFE
const decoded = jwt.verify(token, secret, { algorithms: ['HS256'] });

// VULNERABLE — weak secret
const secret = 'secret';  // brutable
const secret = '123456';

// SAFE
const secret = require('crypto').randomBytes(64).toString('hex');  // strong random
```

## SSRF

```javascript
// VULNERABLE
const axios = require('axios');
const url = req.query.url;
axios.get(url).then(res => ...);

// SAFE — whitelist hosts
const { URL } = require('url');
const ALLOWED_HOSTS = ['api.example.com', 'cdn.example.com'];
const parsed = new URL(req.query.url);
if (!ALLOWED_HOSTS.includes(parsed.hostname)) {
    return res.status(400).send('Invalid URL');
}
```

## NoSQL Injection (MongoDB)

```javascript
// VULNERABLE — object injection
const user = await User.findOne({ username: req.body.username });
// Attack: {"username": {"$gt": ""}}  → matches all users

// SAFE — validate type
const username = req.body.username;
if (typeof username !== 'string') return res.status(400).send('Bad input');
const user = await User.findOne({ username });

// Or use mongoose schema validation which enforces types
```

## ReDoS (Regular Expression DoS)

```javascript
// VULNERABLE — catastrophic backtracking
const emailRegex = /^([a-zA-Z0-9])(([\-.]|[_]+)?([a-zA-Z0-9]+))*(@){1}[a-z0-9]+[.]{1}(([a-z]{2,3})|([a-z]{2,3}[.]{1}[a-z]{2,3}))$/;

// Test with: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa@"  → hangs

// Use simple regex or a well-tested library like validator.js
const validator = require('validator');
validator.isEmail(email);
```

## Dependency Vulnerabilities

```bash
# Check for known vulnerabilities
npm audit
npm audit --audit-level=high  # fail on high+

# Check for outdated packages
npm outdated

# Lock versions
npm ci  # install from package-lock.json exactly
```

## Express Security Checklist

```javascript
// Use helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// Rate limiting on auth endpoints
const rateLimit = require('express-rate-limit');
app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 10 }));

// CORS — don't use wildcard in production
app.use(cors({ origin: 'https://yourapp.com' }));

// Don't expose stack traces
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Internal Server Error' });  // not err.stack
});

// Set secure cookies
res.cookie('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
});
```

## Grep Patterns for Audit

```bash
# Dangerous functions
grep -rn 'eval\|new Function\|child_process\|exec\b' . --include="*.js" --include="*.ts"

# SQL injection candidates
grep -rn 'query\|execute' . --include="*.js" | grep -E '\$\{|\+'

# XSS — raw HTML rendering
grep -rn 'innerHTML\|dangerouslySetInnerHTML\|<%-\|{{{' . --include="*.js" --include="*.jsx" --include="*.ejs"

# Hardcoded secrets
grep -rni 'secret\s*[:=]\s*["\x27]\|password\s*[:=]\s*["\x27]\|apikey\s*[:=]\s*["\x27]' . --include="*.js"

# SSRF candidates
grep -rn 'axios\|fetch\|http\.get\|request(' . --include="*.js" | grep -v 'node_modules'

# JWT issues
grep -rn 'jwt\.decode\|algorithms.*none' . --include="*.js"
```
