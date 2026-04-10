---
name: sentinel-audit
description: Source code security audits, SAST, dependency review. When findings are listed or audit ends, MUST chain to sentinel-report — read skills/sentinel/sentinel-report/SKILL.md, ask save folder, Write .md + offline .html. Triggers on audit, vulnerability, security review, 审计.
---

# Sentinel: Code Audit

> **Mandatory handoff:** When you present **final findings** or the user’s audit request is **done**, you **must** in the **same conversation** apply **`sentinel-report`** — open `skills/sentinel/sentinel-report/SKILL.md`, run its **Closing gate**, and **`Write`** `sentinel-security-assessment.md` + `.html`. **Do not** end with chat-only bullet lists.

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

**Horizontal Privilege Escalation (IDOR) — User A accesses User B's resources:**

Check every endpoint that accepts an object identifier (ID, UUID, slug):
```
GET /api/invoice/{id}         — Can user A view user B's invoice?
GET /api/profile/{id}         — Can user A view user B's profile?
POST /api/transfer            — Can user A transfer from someone else's account?
PUT /api/document/{id}       — Can user A edit user B's document?
DELETE /api/resource/{id}     — Can user A delete user B's data?
```

Audit checklist:
- [ ] Does the endpoint verify ownership before returning data?
- [ ] Can you access other users' data by simply changing the ID?
- [ ] Are there sequential/predictable IDs that allow enumeration?
- [ ] Does the API reveal existence of resources (404 vs 403)?

```
# Test IDOR by comparing responses:
# User A accessing own resource: 200 OK + data
# User A accessing User B's resource with same ID: should be 403 Forbidden, NOT 200 OK
```

**Vertical Privilege Escalation — Low-privilege user performs admin actions:**

Check admin-only endpoints and privilege escalation paths:
```
POST /api/admin/users         — Can regular user create admin accounts?
GET /api/admin/audit-log      — Can regular user access admin logs?
PUT /api/roles                — Can user escalate their own privileges?
POST /api/settings            — Can user modify system settings?
```

Audit checklist:
- [ ] Is there role-based access control (RBAC) or attribute-based access control (ABAC)?
- [ ] Are admin routes protected by server-side checks, not just UI hiding?
- [ ] Can privilege be escalated via API parameters (role_id, is_admin)?
- [ ] Does the system properly validate JWT/cookie roles server-side?
- [ ] Is there parameter pollution to bypass checks (e.g., `role=admin&role=user`)?

```
# JWT Privilege Escalation patterns:
# Check if role is in JWT without server-side validation
# Check for "addRole" or "setRole" API that doesn't verify current user is admin
# Check for IDOR in role assignment: PUT /api/users/{id}/role
```

**Access Control Pattern Examples:**

```python
# VULNERABLE — IDOR: no ownership check
def get_invoice(invoice_id):
    return Invoice.objects.get(id=invoice_id)  # Anyone can access any invoice!

# SAFE — verify ownership
def get_invoice(invoice_id):
    return Invoice.objects.get(id=invoice_id, owner=request.user)

# VULNERABLE — Vertical: role from request body
def update_user(request):
    user.role = request.json['role']  # User can set their own role!
    user.save()

# SAFE — only admin can change roles
@require_admin
def update_user_role(request, user_id):
    new_role = request.json['role']
    User.objects.filter(id=user_id).update(role=new_role)
```

```javascript
// VULNERABLE — JWT role not validated server-side
const token = jwt.decode(req.headers.authorization);
if (token.role === 'admin') {  // Client controls role!
    // Perform admin action
}

// SAFE — role from server session, not JWT payload
const user = await getUserFromSession(req);
if (user.role !== 'admin') throw new Forbidden();
```

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

### A11 — Cross-Site Request Forgery (CSRF)

CSRF tricks authenticated users into submitting unintended requests.

Check every state-changing operation (POST, PUT, DELETE):
```
☐ Does every form/action have a CSRF token?
☐ Is the token validated server-side?
☐ Are sensitive actions requiring additional confirmation?
☐ Are CORS headers properly configured?
```

```python
# VULNERABLE — No CSRF protection
@app.route('/transfer', methods=['POST'])
def transfer():
    amount = request.form['amount']
    # Transfer money — no CSRF check!

# SAFE — with Flask-WTF or manual token
@app.route('/transfer', methods=['POST'])
def transfer():
    if request.form['csrf_token'] != session.get('csrf_token'):
        abort(403)
    # Validate and process
```

```javascript
// VULNERABLE — No CSRF for API calls
fetch('/api/delete-account', {
  method: 'POST',
  body: JSON.stringify({ confirm: true })
  // No CSRF token!
});

// SAFE — include CSRF token in header
fetch('/api/delete-account', {
  method: 'POST',
  headers: {
    'X-CSRF-Token': getCsrfToken(),
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ confirm: true })
});
```

### A12 — Clickjacking

Attackers overlay invisible iframes to trick users into clicking unintended actions.

Check if sensitive pages have proper frame protection:
```
☐ Does the site set X-Frame-Options or Content-Security-Policy: frame-ancestors?
☐ Are sensitive actions (login, payment, settings) protected?
☐ Is there a CSP frame-ancestors directive?
```

```html
<!-- VULNERABLE — Page can be framed -->
<!-- No X-Frame-Options or CSP frame-ancestors -->

<!-- SAFE -->
<meta http-equiv="X-Frame-Options" content="DENY">
<!-- OR CSP -->
<meta http-equiv="Content-Security-Policy" content="frame-ancestors 'none';">
<!-- OR in headers -->
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'self'
```

### A13 — Session Security

Session fixation, hijacking, and timeout issues.

```
☐ Does session ID regenerate after login (session fixation prevention)?
☐ Are sessions expired after inactivity?
☐ Are cookies set with httpOnly, secure, sameSite flags?
☐ Is session ID in URL? (session fixation risk)
```

```python
# VULNERABLE — Session fixation
@app.route('/login', methods=['POST'])
def login():
    user = authenticate(request.form)
    session['user_id'] = user.id  # Session ID not regenerated!
    # Attacker could set session cookie before login

# SAFE — Regenerate session ID after login
@app.route('/login', methods=['POST'])
def login():
    user = authenticate(request.form)
    session.clear()  # Invalidate old session
    session['user_id'] = user.id

# VULNERABLE — Missing cookie flags
response.set_cookie('session', token)
# Should be:
response.set_cookie('session', token, httponly=True, secure=True, samesite='Strict')
```

```javascript
// VULNERABLE — No session timeout
// Session stays active forever

// SAFE — implement session expiration
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
if (Date.now() - lastActivity > SESSION_TIMEOUT) {
  logout();
}
```

### A14 — Unrestricted Resource Consumption

API or application doesn't limit resource usage, allowing DoS or cost amplification.

```
☐ Is there rate limiting on API endpoints?
☐ Are file upload sizes limited?
☐ Is there pagination without limits?
☐ Are expensive operations (regex, crypto) cached or limited?
☐ Can attackers trigger unlimited webhook calls?
```

```python
# VULNERABLE — No rate limiting
@app.route('/api/search')
def search():
    query = request.args.get('q')
    return slow_search(query)  # No limit on requests

# SAFE — Rate limiting
from flask_limiter import Limiter
limiter = Limiter(app, key_func=get_remote_address)

@app.route('/api/search')
@limiter.limit("100/minute")
def search():
    query = request.args.get('q')
    return slow_search(query)
```

```javascript
// VULNERABLE — No file size limit
const upload = multer({ dest: '/uploads' });  // unlimited!

// SAFE — Strict file size and type limits
const upload = multer({
  dest: '/uploads',
  limits: { fileSize: 5 * 1024 * 1024, files: 1 }  // 5MB max
});
```

### A15 — OAuth 2.0 / SSO Security

OAuth and SSO implementations have unique attack surfaces.

```
☐ Is redirect_uri strictly validated (exact match, not prefix)?
☐ Is the authorization code single-use?
☐ Is state parameter validated to prevent CSRF?
☐ Are access tokens stored securely?
☐ Is PKCE used for public clients?
☐ Can authorization codes be leaked via referrer?
```

```python
# VULNERABLE — Loose redirect_uri validation
@app.route('/callback')
def callback():
    redirect_uri = request.args.get('redirect_uri')
    if redirect_uri.startswith('https://app.com/'):  # Prefix match can be bypassed!
        return redirect(redirect_uri + '/evil')

# SAFE — Exact match validation
ALLOWED_REDIRECTS = ['https://app.com/dashboard', 'https://app.com/callback']
@app.route('/callback')
def callback():
    redirect_uri = request.args.get('redirect_uri')
    if redirect_uri not in ALLOWED_REDIRECTS:
        abort(400)
    return redirect(redirect_uri)
```

```javascript
// VULNERABLE — No state parameter (CSRF on OAuth flow)
const authUrl = `https://auth.example.com/authorize?client_id=...`;
// Attacker can initiate auth and bind victim's session to attacker's account

// SAFE — Validate state parameter
const state = crypto.randomBytes(32).toString('hex');
session.oauthState = state;
const authUrl = `https://auth.example.com/authorize?client_id=...&state=${state}`;
// On callback, verify state matches
```

### A16 — WebSocket Security

WebSocket connections lack traditional HTTP security mechanisms.

```
☐ Is WebSocket authentication done properly (not just in first message)?
☐ Are sensitive WebSocket endpoints protected by authorization?
☐ Is there input validation on WebSocket messages?
☐ Can WebSocket be used to bypass CORS?
☐ Is TLS used (wss://) in production?
```

```javascript
// VULNERABLE — No authentication on WebSocket
const ws = new WebSocket('wss://api.example.com/ws');
ws.onmessage = (event) => { handleMessage(event.data); };

// SAFE — Authenticate via token in connection
const ws = new WebSocket('wss://api.example.com/ws?token=' + getAuthToken());
// Server validates token on connection, not just in messages

// VULNERABLE — No authorization on WebSocket messages
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.action === 'delete') {
    deleteItem(msg.id);  // No permission check!
  }
};

// SAFE — Authorize each action
ws.onmessage = (event) => {
  const msg = JSON.parse(event.data);
  if (msg.action === 'delete' && hasPermission('delete', msg.resource)) {
    deleteItem(msg.id);
  }
};
```

### A17 — CORS Misconfiguration

Overly permissive CORS allows cross-origin attacks.

```
☐ Is Access-Control-Allow-Origin set to '*' for sensitive endpoints?
☐ Is Access-Control-Allow-Credentials: true with wildcard origin?
☐ Are sensitive headers exposed via CORS?
☐ Is OPTIONS preflight properly validated?
☐ Are origins validated server-side, not just trusted blindly?
```

```python
# VULNERABLE — Wildcard with credentials
@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response

# VULNERABLE — Trusts all origins
@app.after_request
def add_cors(response):
    response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin')
    return response  # Any origin can access!

# SAFE — Explicit allowed origins
ALLOWED_ORIGINS = ['https://app.example.com', 'https://admin.example.com']
@app.after_request
def add_cors(response):
    origin = request.headers.get('Origin')
    if origin in ALLOWED_ORIGINS:
        response.headers['Access-Control-Allow-Origin'] = origin
        response.headers['Access-Control-Allow-Credentials'] = 'true'
    return response
```

### A18 — GraphQL Security

GraphQL has unique attack surfaces beyond REST.

```
☐ Is introspection disabled or restricted in production?
☐ Are batch queries rate limited (mass query)?
☐ Are expensive queries blocked (query depth/complexity)?
☐ Is authorization checked at resolver level, not just schema?
☐ Are directives properly secured?
☐ Is alias滥用 prevented?
```

```graphql
# VULNERABLE — No depth limiting
query {
  user(id: "1") {
    posts {
      comments {
        author {
          posts {
            comments { ... }  # Infinite recursion possible!
          }
        }
      }
    }
  }
}

# SAFE — Use depth limiting and complexity analysis
# In graphql-java:
MaxQueryDepthInstrumentation maxDepth = new MaxQueryDepthInstrumentation(10);
```

```python
# VULNERABLE — Missing field-level authorization
def resolve_user_info(root, info):
    # Any authenticated user can query any user's info!
    return User.objects.get(id=root.id)

# SAFE — Check authorization per field
def resolve_user_info(root, info):
    if info.context.user.id != root.id and not info.context.user.is_admin:
        raise PermissionError()
    return User.objects.get(id=root.id)
```

```javascript
// VULNERABLE — Batching enables brute force
// With 10 attempts per query instead of 1:
query { login(username: "admin", password: "pass1") }
query { login(username: "admin", password: "pass2") }
// ... 100 passwords in one request

// SAFE — Rate limit by username, not by request
```

### A19 — Race Conditions (TOCTOU)

Concurrent requests can exploit time-of-check-time-of-use vulnerabilities.

```
☐ Can two simultaneous requests bypass a check?
☐ Is there double-spending/withdrawal possible?
☐ Can coupon be applied multiple times?
☐ Can seat be booked twice?
☐ Are financial operations atomic?
```

```python
# VULNERABLE — Race condition in balance check
@app.route('/transfer', methods=['POST'])
def transfer():
    balance = get_balance(current_user)
    amount = request.json['amount']
    if balance >= amount:  # Check
        sleep(0.1)  # Attacker sends multiple requests here
        do_transfer(current_user, amount)  # Use
        return {'success': True}
    return {'error': 'Insufficient funds'}

# SAFE — Use database transaction with row locking
from sqlalchemy import select
@app.route('/transfer', methods=['POST'])
def transfer():
    with db.transaction():
        balance = db.execute(
            select(balance).where(user_id=current_user.id).with_for_update()
        ).scalar()
        amount = request.json['amount']
        if balance >= amount:
            do_transfer(current_user, amount)
            return {'success': True}
    return {'error': 'Insufficient funds'}
```

```javascript
// VULNERABLE — Coupon code reuse
async function applyCoupon(code) {
  const coupon = await getCoupon(code);
  if (!coupon.used) {
    await setCouponUsed(code);  // Another request can also pass this check
    await applyDiscount(coupon.discount);
  }
}

// SAFE — Atomic coupon redemption
async function applyCoupon(code) {
  const result = await db.query(
    'UPDATE coupons SET used=true WHERE code=$1 AND used=false RETURNING *',
    [code]
  );
  if (result.rows.length === 0) throw new Error('Coupon already used');
  await applyDiscount(result.rows[0].discount);
}
```

### A20 — Subdomain Takeover

Abandoned subdomains pointing to external services can be claimed.

```
☐ Are there dangling DNS records (CNAME to deleted services)?
☐ Do expired Cloudflare/Heroku/GitHub Pages point to your domain?
☐ Are there S3 buckets that were deleted but DNS still points there?
☐ Is there a vulnerability history check for acquired subdomains?
```

```bash
# Recon for subdomain takeover
# Check for common dangling patterns
# CNAME to: *.herokuapp.com, *.github.io, *.azurewebsites.net, *.aws.amazon.com
# CNAME to defunct services

# Use subfinder + curl to detect
subfinder -d target.com -o subs.txt
for sub in $(cat subs.txt); do
  cname=$(dig +short CNAME $sub)
  if echo $cname | grep -qE 'heroku|github|azure|amazonaws'; then
    echo "$sub -> $cname (potential takeover)"
  fi
done
```

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

## Phase 6: Report handoff (MANDATORY — sentinel-report)

**Do not skip.** After Phase 5, you **must**:

1. **Read** `skills/sentinel/sentinel-report/SKILL.md` (same repo / skill bundle).
2. **Execute** its **Closing gate** (ask **which folder** to save; default `.md` + offline `.html`).
3. **`Write`** both files to disk — **not** optional “if user asks”.

If the workspace path differs, use the path where this Sentinel bundle lives. If you cannot read files, still **ask** the closing-gate questions and **Write** the report using the template in `sentinel-report`.

## References

Load the relevant reference when auditing:
- `references/patterns-php.md` — PHP-specific vulnerability patterns
- `references/patterns-java.md` — Java/Spring/Struts patterns
- `references/patterns-js.md` — Node.js/Express patterns
- `references/patterns-python.md` — Django/Flask/FastAPI patterns

## Integration

- After audit: follow `sentinel:sentinel-report` — **ask which folder** to save into; **default** `.md` + offline HTML there; opt-out of HTML only if user says so; **write** files to disk
- For complex vulnerability root cause: invoke `sentinel:sentinel-workflow` (systematic root-cause tracing)
- For reviewing audit diffs: invoke `sentinel:sentinel-workflow` (security-focused code review)
