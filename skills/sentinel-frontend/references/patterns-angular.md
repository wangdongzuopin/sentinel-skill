# Angular Vulnerability Patterns

Reference for `sentinel:sentinel-frontend` when auditing Angular codebases.

## Angular Security Model

Angular provides built-in protection against XSS by escaping values in templates by default. However, vulnerabilities can still occur through:

- `bypassSecurityTrust*` methods
- Dynamic template construction
- Server-side rendering misconfigurations
- Third-party library usage

## Cross-Site Scripting (XSS)

### Template Escaping (Safe by Default)

```typescript
// SAFE — Angular auto-escapes in templates
@Component({
  template: `<div>{{ userContent }}</div>`
})
// If userContent = "<script>alert(1)</script>", Angular renders it as text

// VULNERABLE — Using bypassSecurityTrust
@Component({
  template: `<div [innerHTML]="userContent"></div>`
})
// userContent must be sanitized first!

// SAFE — Sanitize before binding
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

getSafeContent(content: string) {
  return this.sanitizer.bypassSecurityTrustHtml(content);
}

// Then in template: <div [innerHTML]="getSafeContent(userContent)"></div>
```

### bypassSecurityTrust Methods (Danger Zone)

```typescript
// DANGEROUS — Never use with user input
bypassSecurityTrustHtml(value: string): SafeHtml
bypassSecurityTrustStyle(value: string): SafeStyle
bypassSecurityTrustScript(value: string): SafeScript
bypassSecurityTrustUrl(value: string): SafeUrl
bypassSecurityTrustResourceUrl(value: string): SafeResourceUrl

// VULNERABLE EXAMPLE
constructor(private sanitizer: DomSanitizer) {}

processInput(userInput: string) {
  // NEVER do this with user input
  return this.sanitizer.bypassSecurityTrustHtml(userInput);
}
```

### URL Sanitization

```typescript
// VULNERABLE — javascript: protocol
<a [href]="userUrl">Link</a>
// userUrl = "javascript:alert(1)"

// SAFE — Angular sanitizes http/https by default, blocks javascript:
// But if using bypassSecurityTrustUrl, you must validate

validateUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return url.startsWith('/');
  }
}
```

## Open Redirect

```typescript
// VULNERABLE — User-controlled redirect
constructor(private router: Router) {}

navigate(redirectUrl: string) {
  this.router.navigateByUrl(redirectUrl);  // Could redirect to external site
}

// SAFE — Validate redirect target
canNavigateTo(url: string): boolean {
  // Only allow relative paths
  if (url.startsWith('/') && !url.startsWith('//')) {
    return true;
  }
  // Only allow same-origin absolute paths
  try {
    const target = new URL(url, window.location.origin);
    return target.origin === window.location.origin;
  } catch {
    return false;
  }
}

navigate(redirectUrl: string) {
  if (this.canNavigateTo(redirectUrl)) {
    this.router.navigateByUrl(redirectUrl);
  }
}
```

## Server-Side Rendering (SSR) Security

### Angular Universal Security

```typescript
// VULNERABLE — SSR without proper sanitization
// Any XSS in SSR context is critical — affects SEO and initial render

// SAFE — Use transfer state to hydrate only safe data
// Configure Content-Security-Policy in server.ts
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

### HTTP Requests

```typescript
// VULNERABLE — Trust user input in HTTP calls
this.http.get(userProvidedUrl);  // SSRF possible

// SAFE — Validate URLs before fetching
const ALLOWED_API_PREFIXES = ['/api/', '/assets/'];
if (!ALLOWED_API_PREFIXES.some(p => userUrl.startsWith(p))) {
  throw new Error('Invalid URL');
}
```

## Cross-Site Request Forgery (CSRF)

### Angular HTTP CSRF

```typescript
// Configure CSRF token for HttpClient
// Server should set Cookie with CSRF token, client reads and sends as header

// app.module.ts
HttpClientModule.withConfig({
  cookieValues: {
    withCredentials: true
  }
});

// Then implement CSRF interceptor
@Injectable()
export class CsrfInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Read CSRF token from cookie and add to header
    const csrfToken = this.cookieService.get('CSRF_TOKEN');
    if (csrfToken) {
      const modifiedReq = req.clone({
        headers: req.headers.set('X-CSRF-TOKEN', csrfToken)
      });
      return next.handle(modifiedReq);
    }
    return next.handle(req);
  }
}
```

## Dependency Security

```bash
# Audit Angular dependencies
npm audit
npx npm-check-updates -t angular

# Check for known Angular-specific vulnerabilities
# Angular versions < 12.2.0 have prototype pollution via $any()
```

## Template Injection (SSTI) in Dynamic Templates

```typescript
// VULNERABLE — Never compile user templates
import { Compiler } from '@angular/compiler';
compiler.compileTemplateSync(userControlledTemplate);  // SSTI!

// SAFE — Never use user input in Angular templates
// All templates should be static, validated at build time
```

## Security Checklist for Angular

```typescript
// ✅ Use async pipe or proper sanitization for all user content
// ✅ Validate all navigation targets
// ✅ Configure HttpClient with CSRF protection
// ✅ Set security headers (CSP, X-Frame-Options) on server
// ✅ Keep Angular updated — each version patches security issues
// ✅ Audit third-party libraries before adding to package.json
// ✅ Never use bypassSecurityTrust* with user input
```

## Grep Patterns for Angular Audit

```bash
# bypassSecurityTrust usage (potential XSS)
grep -rn 'bypassSecurityTrust' . --include="*.ts"

# innerHTML assignments
grep -rn '\.innerHTML\|innerHTML\s*=' . --include="*.ts" --include="*.html"

# Dynamic template compilation
grep -rn 'compileTemplate\|@Component.*template' . --include="*.ts"

# Navigation with user input
grep -rn 'navigateByUrl\|router\.navigate' . --include="*.ts"

# HTTP requests with user URLs
grep -rn 'http\.get.*user\|http\.post.*user' . --include="*.ts"

# HTTP requests with user URLs
grep -rn 'new URL(' . --include="*.ts" --include="*.html"
```
