# IDOR & Privilege Escalation Patterns

Reference for `sentinel:sentinel-audit` when checking for Broken Access Control, IDOR, and privilege escalation vulnerabilities.

## IDOR (Insecure Direct Object Reference)

IDOR occurs when an application exposes a direct reference to an internal object (database key, file, user ID) and doesn't verify the caller's authorization.

### Horizontal IDOR Patterns

**URL Parameter IDOR:**
```python
# VULNERABLE
@app.route('/invoice/<int:invoice_id>')
def get_invoice(invoice_id):
    return Invoice.query.get(invoice_id)  # No ownership check!

# SAFE
@app.route('/invoice/<int:invoice_id>')
def get_invoice(invoice_id):
    invoice = Invoice.query.filter_by(id=invoice_id, user_id=current_user.id).first()
    if not invoice:
        abort(403)
    return invoice
```

```javascript
// VULNERABLE — React
const Invoice = ({ match }) => {
  const invoice = fetch(`/api/invoice/${match.params.id}`);  // No ownership check!
  return <div>{invoice.data}</div>;
};
```

**JSON Body IDOR:**
```
POST /api/transfer
{ "from_account": 12345, "to_account": 67890, "amount": 1000 }

# User should only be able to transfer from their own account
# Server must verify from_account belongs to authenticated user
```

**Cookie-Based IDOR:**
```php
// VULNERABLE
$query = "SELECT * FROM documents WHERE id = " . $_COOKIE['last_viewed'];
// User could modify last_viewed cookie to access other documents
```

**GraphQL IDOR:**
```graphql
# VULNERABLE — No ownership check
query {
  user(id: "123") {  # User controls the id parameter
    private_data
  }
}

# SAFE — Query current user's data only
query {
  me {
    private_data  # Server determines user from session/token
  }
}
```

### IDOR in File Operations

```python
# VULNERABLE — Path traversal + IDOR
@app.route('/download')
def download():
    filename = request.args.get('file')
    return send_from_directory('/var/app/uploads', filename)

# SAFE — Validate file ownership
@app.route('/download')
def download():
    file_id = request.args.get('id')
    file = File.query.filter_by(id=file_id, owner_id=current_user.id).first()
    if not file:
        abort(403)
    return send_from_directory('/var/app/uploads', file.path)
```

### IDOR Enumeration

IDOR often allows enumeration of resources:

```python
# VULNERABLE — Sequential IDs allow enumeration
GET /api/users/1
GET /api/users/2
GET /api/users/3
# → Attacker can enumerate all users

# SAFE — Use UUIDs or opaque identifiers
GET /api/users/550e8400-e29b-41d4-a716-446655440000
# Not enumerable

# SAFE — Return 403 for resources user doesn't own
# Even if resource doesn't exist, return same error to prevent enumeration
GET /api/users/99999 → 403 Forbidden (not 404)
```

### IDOR Grep Patterns

```bash
# Direct object reference in URLs
grep -rn 'request\.args\.get\|request\.params\|req\.param' . --include="*.py" --include="*.js"

# Missing authorization decorators
grep -rn '@app\.route\|@router\|@api' . --include="*.py" | grep -v 'auth\|permission\|authorize'

# Object retrieval without filter
grep -rn '\.get\(.*id\)\|\.find\(.*id\)' . --include="*.py" --include="*.js"
```

## Vertical Privilege Escalation

### Role Confusion

```python
# VULNERABLE — Role passed in request body
@app.route('/promote', methods=['POST'])
def promote():
    user_id = request.json['user_id']
    new_role = request.json['role']  # User controls their own role!
    User.query.get(user_id).role = new_role

# SAFE — Only admin can promote, role determined server-side
@app.route('/promote', methods=['POST'])
@require_admin
def promote():
    user_id = request.json['user_id']
    new_role = request.json['role']
    User.query.get(user_id).role = new_role
```

### JWT Privilege Escalation

```javascript
// VULNERABLE — Role embedded in JWT, not validated server-side
const decoded = jwt.decode(token);
if (decoded.role === 'admin') {
  deleteUser(userId);  // Client can forge JWT!
}

// SAFE — Role validated server-side from database/session
const user = await getUserFromDatabase(token.userId);
if (user.role !== 'admin') throw new Forbidden();
```

```java
// VULNERABLE — Trusts JWT role claim
SecurityContextHolder.getContext().getAuthentication();
Claims claims = Jwts.parser().setSigningKey(key).parseClaimsJws(token).getBody();
String role = claims.get("role", String.class);  // Attacker can set role:admin in JWT!

// SAFE — Look up user role from database, not JWT
User user = userRepository.findById(extractUserId(token));
boolean isAdmin = user.hasRole("ADMIN");
```

### Parameter Pollution for Privilege Escalation

```python
# VULNERABLE — Last role wins, admin check only on one param
POST /api/users/123/update
role=admin&role=user  # If admin check passes but 'user' is saved
```

### Function-Level Authorization

```java
// VULNERABLE — Admin function with no annotation
public void deleteUser(Long userId) {  // Anyone can call this!
    userRepository.delete(userId);
}

// SAFE — Explicit authorization
@PreAuthorize("hasRole('ADMIN')")
public void deleteUser(Long userId) {
    userRepository.delete(userId);
}
```

### IDOR in Role Assignment

```python
# VULNERABLE — User can escalate own privileges via IDOR
PUT /api/users/123
{ "role": "admin" }  # User 123 can modify their own role to admin

# SAFE — Users cannot modify their own role
@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    if user_id == current_user.id:
        # Cannot change own role
        if 'role' in request.json:
            abort(403)
    # Proceed with update
```

### Privilege Escalation via API Batching

```graphql
# VULNERABLE — Batch requests bypass individual checks
query {
  user1: user(id: 1) { email }
  user2: user(id: 2) { email }
  adminData: adminPanel { secrets }  # If user has access to query, they get admin data
}
```

### Privilege Escalation Grep Patterns

```bash
# Role/permission checks
grep -rn 'role\|admin\|permission\|authorize' . --include="*.py" --include="*.js" | grep -v 'test\|mock'

# JWT without server-side validation
grep -rn 'jwt\.decode\|token\.role\|claims\[' . --include="*.py" --include="*.js"

# Missing @PreAuthorize/@Secure annotations
grep -rn 'public.*(delete|update|create|modify).*(' . --include="*.java"

# Client-controlled role parameters
grep -rn 'request\.\(json\|body\|form\)\[.*role\|request\.\(json\|body\|form\)\[.*admin' . --include="*.py" --include="*.js"
```

## Mass Assignment

```python
# VULNERABLE — User can set any field
@app.route('/profile', methods=['PUT'])
def update_profile():
    user = User.query.get(current_user.id)
    user.update(request.json)  # Attacker can set is_admin=True

# SAFE — Explicit field list
@app.route('/profile', methods=['PUT'])
def update_profile():
    allowed = ['name', 'bio', 'avatar_url']
    data = {k: v for k, v in request.json.items() if k in allowed}
    User.query.filter_by(id=current_user.id).update(data)
```

```javascript
// VULNERABLE — MongoDB mass assignment
User.findByIdAndUpdate(req.user.id, req.body);  // req.body could include { role: 'admin' }

// SAFE — explicit fields
User.findByIdAndUpdate(req.user.id, {
  $set: {
    name: req.body.name,
    bio: req.body.bio
  }
}, { runValidators: true });
```
