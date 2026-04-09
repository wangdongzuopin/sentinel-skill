# Python Vulnerability Patterns

Reference for `sentinel:sentinel-audit` when auditing Python codebases (Django, Flask, FastAPI).

## SQL Injection

```python
# VULNERABLE — string formatting
cursor.execute("SELECT * FROM users WHERE id = %s" % user_id)
cursor.execute(f"SELECT * FROM users WHERE name = '{name}'")
cursor.execute("SELECT * FROM users WHERE id = " + str(user_id))

# SAFE — parameterized queries
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
cursor.execute("SELECT * FROM users WHERE name = ?", (name,))

# Django ORM — safe by default
User.objects.filter(id=user_id)

# VULNERABLE Django raw query
User.objects.raw(f"SELECT * FROM users WHERE id = {user_id}")

# SAFE Django raw query
User.objects.raw("SELECT * FROM users WHERE id = %s", [user_id])
```

## Command Injection

```python
# VULNERABLE
import os, subprocess
os.system("ping " + host)
subprocess.call("ls " + directory, shell=True)
os.popen(f"convert {filename} output.jpg")

# SAFE — list form, no shell=True
subprocess.run(["ping", host], capture_output=True)
subprocess.run(["ls", directory])

# SAFE — use Python stdlib instead of shell
import pathlib
pathlib.Path(directory).iterdir()
```

**Look for:** `os.system`, `subprocess.*` with `shell=True` and user input, `eval`, `exec`.

## Insecure Deserialization

```python
# VULNERABLE — pickle executes arbitrary code on load
import pickle
data = pickle.loads(request.data)
obj = pickle.loads(base64.b64decode(cookie))

# VULNERABLE — yaml.load without Loader
import yaml
data = yaml.load(user_input)  # allows arbitrary Python objects

# SAFE
data = yaml.safe_load(user_input)
# Or use JSON instead of pickle/yaml for untrusted data
import json
data = json.loads(user_input)
```

## SSTI (Server-Side Template Injection)

```python
# VULNERABLE — Flask/Jinja2
from flask import render_template_string
@app.route('/hello')
def hello():
    name = request.args.get('name')
    return render_template_string(f"Hello {name}!")  # SSTI!

# SAFE — use render_template with a file, never render_template_string with user input
return render_template('hello.html', name=name)

# VULNERABLE — Mako, Tornado, etc.
Template(user_input).render()
```

## Path Traversal

```python
# VULNERABLE
filename = request.args.get('file')
with open(f"/var/app/files/{filename}") as f:
    return f.read()

# SAFE — resolve and validate
import os
base_dir = "/var/app/files"
filename = request.args.get('file')
full_path = os.path.realpath(os.path.join(base_dir, filename))
if not full_path.startswith(base_dir):
    abort(403)
with open(full_path) as f:
    return f.read()
```

## SSRF

```python
# VULNERABLE
import requests
url = request.args.get('url')
resp = requests.get(url)

# SAFE — validate scheme and host
from urllib.parse import urlparse
ALLOWED_HOSTS = {'api.example.com', 'cdn.example.com'}
parsed = urlparse(url)
if parsed.scheme not in ('http', 'https') or parsed.hostname not in ALLOWED_HOSTS:
    abort(400)
resp = requests.get(url)
```

## Weak Cryptography

```python
# VULNERABLE — MD5/SHA1 for passwords
import hashlib
hashed = hashlib.md5(password.encode()).hexdigest()
hashed = hashlib.sha1(password.encode()).hexdigest()

# SAFE — bcrypt or argon2
import bcrypt
hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
# Verify:
bcrypt.checkpw(password.encode(), hashed)

# Or use Django's built-in (argon2 preferred)
from django.contrib.auth.hashers import make_password, check_password
```

## Hardcoded Secrets

```python
# VULNERABLE
SECRET_KEY = "mysecretkey123"
DATABASE_PASSWORD = "admin123"
API_KEY = "sk-prod-abc123"

# SAFE — environment variables
import os
SECRET_KEY = os.environ['SECRET_KEY']
DATABASE_PASSWORD = os.environ['DB_PASSWORD']

# Or use python-dotenv / django-environ for .env files
```

## Django-Specific

```python
# VULNERABLE — CSRF exempt on sensitive endpoint
@csrf_exempt
@require_POST
def transfer_money(request): ...

# VULNERABLE — DEBUG=True in production
DEBUG = True  # Never in production

# VULNERABLE — Overly permissive CORS
CORS_ALLOW_ALL_ORIGINS = True

# VULNERABLE — Missing security middleware
# Ensure these are in MIDDLEWARE:
# 'django.middleware.security.SecurityMiddleware'
# 'django.middleware.csrf.CsrfViewMiddleware'

# VULNERABLE — SQL injection via extra()/RawSQL()
User.objects.extra(where=[f"name = '{user_input}'"])
```

## Flask-Specific

```python
# VULNERABLE — debug mode exposes Werkzeug console
app.run(debug=True)  # Never in production

# VULNERABLE — weak secret key
app.secret_key = "dev"

# VULNERABLE — open redirect
return redirect(request.args.get('next'))

# SAFE — validate redirect target
from urllib.parse import urlparse, urljoin
def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and ref_url.netloc == test_url.netloc
```

## Grep Patterns for Audit

```bash
# Dangerous functions
grep -rn 'eval\|exec\|pickle\|subprocess.*shell=True' . --include="*.py"

# SQL injection candidates
grep -rn 'execute\|raw\|RawSQL' . --include="*.py" | grep -v '#'

# Hardcoded secrets
grep -rni 'password\s*=\s*["\x27]\|secret\s*=\s*["\x27]\|api_key\s*=\s*["\x27]' . --include="*.py"

# SSRF candidates
grep -rn 'requests.get\|requests.post\|urllib.request' . --include="*.py"

# Template injection candidates
grep -rn 'render_template_string\|Template(' . --include="*.py"

# Weak crypto
grep -rn 'md5\|sha1\|hashlib' . --include="*.py"
```
