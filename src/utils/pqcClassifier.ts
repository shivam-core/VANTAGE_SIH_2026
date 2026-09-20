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

export function isQuantumVulnerable(canonicalName: string | undefined): boolean {
  if (!canonicalName) return false;
  // Direct match
  if (VULNERABLE_ALGORITHMS.has(canonicalName)) return true;
  // Substring match for variants like RSA-2048, ECDSA-P384, etc.
  for (const algo of VULNERABLE_ALGORITHMS) {
    if (canonicalName.includes(algo)) return true;
  }
  return false;
}
