/**
 * Centralised PQC vulnerability classifier.
 * 
 * An algorithm is considered "quantum-vulnerable" if it relies on mathematical
 * problems (integer factorisation, discrete log, elliptic curve DLP) that a
 * cryptographically relevant quantum computer can solve in polynomial time via
 * Shor's algorithm.
 * 
 * Symmetric primitives (AES, ChaCha20) and hash-based MACs are considered
 * quantum-safe at current key lengths (Grover's algorithm only halves the
 * effective security level).
 */

const VULNERABLE_ALGORITHMS = new Set([
  'RSA',
  'SHA1',
  'MD5',
  '3DES',
  'DES',
  'ECDSA',
  'ECDH',
  'DSA',
  'RC4',
  'Blowfish',
]);

/** Known quantum-safe prefixes that must NOT be flagged even if they contain
 *  a vulnerable substring (e.g. ML-DSA contains 'DSA'). */
const SAFE_PREFIXES = ['ML-DSA', 'ML-KEM', 'SLH-DSA', 'XMSS', 'LMS', 'SPHINCS'];

export function isQuantumVulnerable(canonicalName: string | undefined): boolean {
  if (!canonicalName) return false;
  // Explicitly safe PQC algorithms — never flag these
  if (SAFE_PREFIXES.some(prefix => canonicalName.startsWith(prefix))) return false;
  // Direct match
  if (VULNERABLE_ALGORITHMS.has(canonicalName)) return true;
  // Substring match for variants like RSA-2048, ECDSA-P384, etc.
  for (const algo of VULNERABLE_ALGORITHMS) {
    if (canonicalName.includes(algo)) return true;
  }
  return false;
}
