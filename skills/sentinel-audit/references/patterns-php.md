# PHP Vulnerability Patterns

Reference for `sentinel:sentinel-audit` when auditing PHP codebases.

## SQL Injection

```php
// VULNERABLE — string concatenation
$query = "SELECT * FROM users WHERE id = " . $_GET['id'];
$query = "SELECT * FROM users WHERE name = '" . $_POST['name'] . "'";

// SAFE — PDO prepared statements
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$_GET['id']]);

// SAFE — MySQLi prepared statements
$stmt = $mysqli->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $_GET['id']);
$stmt->execute();
```

**Look for:** `mysql_query`, `mysqli_query` with string concat, `$_GET`/`$_POST` directly in query strings.

## Command Injection

```php
// VULNERABLE
exec("ping " . $_GET['host']);
system("convert " . $filename . " output.jpg");
passthru($_POST['cmd']);
shell_exec(`ls ` . $dir);

// SAFE
$escaped = escapeshellarg($_GET['host']);
exec("ping " . $escaped);

// SAFER — avoid shell entirely
// Use PHP native functions instead of shelling out
```

**Look for:** `exec`, `system`, `passthru`, `shell_exec`, backtick operator with user input.

## File Inclusion

```php
// VULNERABLE — LFI / RFI
include($_GET['page'] . '.php');
require($_POST['template']);
include("lang/" . $_COOKIE['lang']);

// SAFE — whitelist approach
$allowed = ['home', 'about', 'contact'];
$page = in_array($_GET['page'], $allowed) ? $_GET['page'] : 'home';
include($page . '.php');
```

**Look for:** `include`, `require`, `include_once`, `require_once` with user-controlled input.

## File Upload

```php
// VULNERABLE — only checks extension client-provided
$ext = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
if ($ext == 'jpg') {
    move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/' . $_FILES['file']['name']);
}

// SAFE — check MIME type, randomize filename, store outside webroot
$finfo = new finfo(FILEINFO_MIME_TYPE);
$mime = $finfo->file($_FILES['file']['tmp_name']);
$allowed_mimes = ['image/jpeg', 'image/png', 'image/gif'];
if (in_array($mime, $allowed_mimes)) {
    $new_name = bin2hex(random_bytes(16)) . '.jpg';
    move_uploaded_file($_FILES['file']['tmp_name'], '/var/uploads/' . $new_name);
}
```

## XSS

```php
// VULNERABLE
echo "Hello " . $_GET['name'];
echo "<div>" . $user->bio . "</div>";

// SAFE
echo "Hello " . htmlspecialchars($_GET['name'], ENT_QUOTES, 'UTF-8');
echo "<div>" . htmlspecialchars($user->bio, ENT_QUOTES, 'UTF-8') . "</div>";
```

**Look for:** `echo`, `print` with `$_GET`, `$_POST`, `$_COOKIE`, `$_SERVER` without `htmlspecialchars`.

## Type Juggling

```php
// VULNERABLE — loose comparison
if ($_POST['password'] == "secret") { ... }
// "0e123" == "0e456" is TRUE (both are 0 in scientific notation)

// MD5 magic hash bypass
// md5("240610708") === "0e462097431906509019562988736854"
// This equals any other "0e..." string with ==

// SAFE — strict comparison
if ($_POST['password'] === "secret") { ... }
// Better: use password_verify() for passwords
```

## Deserialization

```php
// VULNERABLE
$data = unserialize($_COOKIE['data']);
$obj = unserialize(base64_decode($_GET['obj']));

// SAFE — use JSON instead
$data = json_decode($_COOKIE['data'], true);

// If unserialize is required, use allowed_classes
$data = unserialize($input, ['allowed_classes' => false]);
```

## SSRF

```php
// VULNERABLE
$content = file_get_contents($_GET['url']);
$ch = curl_init($_POST['url']);

// SAFE — validate URL scheme and host
$url = $_GET['url'];
$parsed = parse_url($url);
$allowed_hosts = ['api.example.com', 'cdn.example.com'];
if ($parsed['scheme'] !== 'https' || !in_array($parsed['host'], $allowed_hosts)) {
    die('Invalid URL');
}
```

## Open Redirect

```php
// VULNERABLE
header("Location: " . $_GET['redirect']);
header("Location: " . $_POST['next']);

// SAFE — whitelist or validate same-origin
$redirect = $_GET['redirect'];
if (strpos($redirect, '/') === 0 && strpos($redirect, '//') !== 0) {
    header("Location: " . $redirect);  // relative URL only
}
```

## Session Security

```php
// VULNERABLE
session_start();
$_SESSION['user'] = $_POST['username'];  // no authentication

// After login, always regenerate session ID to prevent fixation
session_regenerate_id(true);

// Secure session config (php.ini or runtime)
ini_set('session.cookie_httponly', 1);
ini_set('session.cookie_secure', 1);    // HTTPS only
ini_set('session.cookie_samesite', 'Strict');
ini_set('session.use_strict_mode', 1);
```

## Grep Patterns for Audit

```bash
# Find injection points
grep -rn '\$_GET\|\$_POST\|\$_COOKIE\|\$_REQUEST\|\$_SERVER' . --include="*.php"

# Find dangerous functions
grep -rn 'exec\|system\|passthru\|shell_exec\|eval\|assert' . --include="*.php"

# Find file operations with user input
grep -rn 'include\|require\|file_get_contents\|fopen\|unlink' . --include="*.php"

# Find unserialize
grep -rn 'unserialize' . --include="*.php"

# Find loose comparisons
grep -rn '==[^=]' . --include="*.php"

# Find hardcoded secrets
grep -rni 'password\s*=\s*["\x27][^"\x27]\+["\x27]' . --include="*.php"
```
