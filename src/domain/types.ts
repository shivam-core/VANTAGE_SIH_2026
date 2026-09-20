export type Provenance =
  | 'observed-source' | 'observed-certificate'
  | 'declared-manifest' | 'declared-inventory' | 'inferred';
export type Confidence = 'high' | 'medium' | 'low' | 'unknown';
export type AssetKind =
  | 'algorithm' | 'key-metadata' | 'certificate' | 'protocol'
  | 'library' | 'hardware-module' | 'cloud-service' | 'application';
export type Purpose =
  | 'confidentiality' | 'key-establishment' | 'signature'
  | 'authentication' | 'integrity' | 'non-security' | 'unknown';
export type QuantumClass =
  | 'public-key-exposed' | 'symmetric-review' | 'hash-review'
  | 'pqc-candidate' | 'unknown' | 'not-applicable';
export interface Interval { min: number; max: number }
export interface Evidence {
  id: string;
  provenance: Provenance;
  confidence: Confidence;
  collectorId: string;
  collectorVersion: string;
  detectorId: string;
  relativePath?: string;
  symbol?: string;
  startLine?: number;
  endLine?: number;
  safeSummary: string;
  observedAt: string;
  limitations: string[];
}
export interface Asset {
  id: string;
  kind: AssetKind;
  displayName: string;
  canonicalName?: string;
  details: Record<string, unknown>;
  evidenceIds: string[];
}
export interface CryptoUse {
  id: string;
  applicationId: string | null;
  assetId: string;
  purpose: Purpose;
  operation: string | null;
  evidenceIds: string[];
  contextStatus: 'observed' | 'declared' | 'inferred' | 'unknown';
}
export type RelationType =
  | 'uses' | 'depends-on' | 'references-certificate'
  | 'implemented-by' | 'runs-on' | 'protects-data-for';
export interface Relationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationType;
  evidenceIds: string[];
  provenance: Provenance;
  confidence: Confidence;
}
export interface BusinessProfile {
  id: string;
  subjectId: string;
  owner: string | null;
  criticality: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
  sensitivity: 'restricted' | 'confidential' | 'internal' | 'public' | 'unknown';
  dataLifetimeYears: Interval | null;
  dataLifetimeBasis: 'new-records' | 'remaining-life' | 'unknown';
  protectionPathEvidenceIds: string[];
  migrationYears: Interval | null;
  verificationLifetimeYears: Interval | null;
  exposure: 'external' | 'internal' | 'offline' | 'unknown';
  collectionPlausibility: 'plausible' | 'not-established' | 'not-applicable';
  rationale: string;
  suppliedBy: string;
  updatedAt: string;
  revision: number;
}
export interface Scenario {
  id: string;
  revision: number;
  name: string;
  asOf: string;
  quantumHorizonYears: Interval | null;
  assumptionSource: string;
  overrides: Record<string, Partial<BusinessProfile>>;
}
export interface Finding {
  id: string;
  ruleId: string;
  ruleVersion: string;
  subjectId: string;
  category: 'operational' | 'classical-security' | 'quantum-migration' | 'coverage';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info' | 'unassessed';
  title: string;
  explanation: string;
  evidenceIds: string[];
  missingContext: string[];
  recommendationId: string;
}

export interface Coverage {
  discoveredFiles: number;
  eligibleFiles: number;
  analysedFiles: number;
  skippedFiles: number;
  failedFiles: number;
  bytesRead: number;
  supportedDetectors: string[];
  entries: Array<{
    relativePath: string;
    status: 'analysed' | 'skipped' | 'failed';
    reason: string;
  }>;
}

export interface VantageReport {
  schemaVersion: '1.0';
  reportId: string;
  scanId: string;
  scopeId: string;
  startedAt: string;
  finishedAt: string;
  analysisAsOf: string;
  status: 'complete' | 'partial' | 'cancelled';
  origin: 'browser' | 'python-cli' | 'synthetic-demo';
  collectorVersions: Record<string, string>;
  policyVersion: string;
  coverage: Coverage;
  assets: Asset[];
  uses: CryptoUse[];
  evidence: Evidence[];
  relationships: Relationship[];
  warnings: string[];
}

