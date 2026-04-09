# Java Vulnerability Patterns

Reference for `sentinel:sentinel-audit` when auditing Java codebases (Spring, Struts, Jakarta EE).

## SQL Injection

```java
// VULNERABLE — string concatenation
String query = "SELECT * FROM users WHERE id = " + userId;
stmt.executeQuery("SELECT * FROM users WHERE name = '" + name + "'");

// SAFE — PreparedStatement
PreparedStatement ps = conn.prepareStatement("SELECT * FROM users WHERE id = ?");
ps.setInt(1, userId);
ResultSet rs = ps.executeQuery();

// SAFE — Spring JDBC
jdbcTemplate.queryForObject(
    "SELECT * FROM users WHERE id = ?",
    new Object[]{userId},
    UserRowMapper.class
);

// SAFE — JPA/Hibernate (use named parameters)
TypedQuery<User> q = em.createQuery("SELECT u FROM User u WHERE u.id = :id", User.class);
q.setParameter("id", userId);

// VULNERABLE — Hibernate HQL injection
session.createQuery("FROM User WHERE name = '" + name + "'");
```

## Insecure Deserialization

```java
// VULNERABLE — Java native deserialization of untrusted data
ObjectInputStream ois = new ObjectInputStream(request.getInputStream());
Object obj = ois.readObject();  // RCE if malicious gadget chain present

// VULNERABLE — XStream without security framework
XStream xstream = new XStream();
Object obj = xstream.fromXML(userInput);

// SAFE — use JSON instead of Java serialization for external data
ObjectMapper mapper = new ObjectMapper();
MyClass obj = mapper.readValue(jsonInput, MyClass.class);

// SAFE — if deserialization is required, use ValidatingObjectInputStream
ValidatingObjectInputStream vois = new ValidatingObjectInputStream(inputStream);
vois.accept(MyExpectedClass.class);  // whitelist
Object obj = vois.readObject();
```

## Path Traversal

```java
// VULNERABLE
String filename = request.getParameter("file");
File file = new File("/var/app/files/" + filename);
Files.readAllBytes(file.toPath());

// SAFE — canonicalize and validate
File baseDir = new File("/var/app/files");
File requestedFile = new File(baseDir, filename);
String canonicalBase = baseDir.getCanonicalPath();
String canonicalFile = requestedFile.getCanonicalPath();

if (!canonicalFile.startsWith(canonicalBase + File.separator)) {
    throw new SecurityException("Path traversal attempt");
}
Files.readAllBytes(requestedFile.toPath());
```

## XXE (XML External Entity)

```java
// VULNERABLE — default XML parser allows external entities
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
DocumentBuilder db = dbf.newDocumentBuilder();
Document doc = db.parse(userXmlInput);  // XXE possible

// SAFE — disable external entities
DocumentBuilderFactory dbf = DocumentBuilderFactory.newInstance();
dbf.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
dbf.setFeature("http://xml.org/sax/features/external-general-entities", false);
dbf.setFeature("http://xml.org/sax/features/external-parameter-entities", false);
dbf.setExpandEntityReferences(false);
DocumentBuilder db = dbf.newDocumentBuilder();

// Also applies to: SAXParser, XMLReader, TransformerFactory, SchemaFactory
```

## SSRF

```java
// VULNERABLE
URL url = new URL(request.getParameter("url"));
HttpURLConnection conn = (HttpURLConnection) url.openConnection();

// SAFE — validate URL
URL url = new URL(userInput);
String host = url.getHost();
List<String> allowedHosts = Arrays.asList("api.example.com", "cdn.example.com");
if (!allowedHosts.contains(host)) {
    throw new SecurityException("Host not allowed: " + host);
}
```

## Expression Language Injection (Spring)

```java
// VULNERABLE — SPEL injection
@Value("#{${userInput}}")
private String value;

ExpressionParser parser = new SpelExpressionParser();
parser.parseExpression(userInput).getValue();  // arbitrary code execution

// SAFE — never evaluate user input as SpEL expression
// Use SimpleEvaluationContext if dynamic evaluation is needed
EvaluationContext context = SimpleEvaluationContext.forReadOnlyDataBinding().build();
parser.parseExpression(FIXED_TEMPLATE).getValue(context, data);
```

## Weak Cryptography

```java
// VULNERABLE
MessageDigest md = MessageDigest.getInstance("MD5");
MessageDigest md = MessageDigest.getInstance("SHA-1");
byte[] hash = md.digest(password.getBytes());

// VULNERABLE — ECB mode
Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");

// SAFE — use bcrypt for passwords
BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
String hash = encoder.encode(password);
encoder.matches(rawPassword, encodedPassword);

// SAFE — AES-GCM for encryption
Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
```

## Hardcoded Credentials

```java
// VULNERABLE
String password = "admin123";
String apiKey = "sk-prod-abc123";
connection = DriverManager.getConnection(url, "root", "password");

// SAFE — externalize to environment or vault
String password = System.getenv("DB_PASSWORD");
String apiKey = System.getenv("API_KEY");
```

## Spring Security Misconfigurations

```java
// VULNERABLE — permissive security config
http.authorizeRequests().antMatchers("/**").permitAll();

// VULNERABLE — CSRF disabled for all
http.csrf().disable();

// VULNERABLE — allowing HTTP (not HTTPS)
// No requiresSecure() configured

// SAFE — defense in depth
http
    .authorizeRequests()
        .antMatchers("/public/**").permitAll()
        .anyRequest().authenticated()
    .and()
    .csrf().csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
    .and()
    .requiresChannel().anyRequest().requiresSecure()
    .and()
    .sessionManagement()
        .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
```

## Grep Patterns for Audit

```bash
# Deserialization
grep -rn 'ObjectInputStream\|readObject\|XStream\|fromXML' . --include="*.java"

# SQL injection candidates
grep -rn 'createQuery\|executeQuery\|createNativeQuery' . --include="*.java" | grep '".*+'

# XXE candidates
grep -rn 'DocumentBuilderFactory\|SAXParserFactory\|XMLReader' . --include="*.java"

# Hardcoded credentials
grep -rni 'password\s*=\s*"[^"]\+"\|secret\s*=\s*"[^"]\+"' . --include="*.java"

# Weak crypto
grep -rn '"MD5"\|"SHA-1"\|"DES"\|"ECB"' . --include="*.java"

# SpEL injection
grep -rn 'parseExpression\|SpelExpressionParser' . --include="*.java"

# Path traversal candidates
grep -rn 'new File\|Paths.get\|Files.read' . --include="*.java" | grep 'getParameter\|request\.'
```
