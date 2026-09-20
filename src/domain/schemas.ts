import { z } from 'zod';

export const intervalSchema = z.object({
  min: z.number().min(0),
  max: z.number().min(0),
}).refine(data => data.min <= data.max, { message: "min must be <= max" });

export const evidenceSchema = z.object({
  id: z.string(),
  provenance: z.enum(['observed-source', 'observed-certificate', 'declared-manifest', 'declared-inventory', 'inferred']),
  confidence: z.enum(['high', 'medium', 'low', 'unknown']),
  collectorId: z.string(),
  collectorVersion: z.string(),
  detectorId: z.string(),
  relativePath: z.string().optional(),
  symbol: z.string().optional(),
  startLine: z.number().optional(),
  endLine: z.number().optional(),
  safeSummary: z.string().max(240),
  observedAt: z.string().datetime(),
  limitations: z.array(z.string()),
});

export const assetSchema = z.object({
  id: z.string(),
  kind: z.enum(['algorithm', 'key-metadata', 'certificate', 'protocol', 'library', 'hardware-module', 'cloud-service', 'application']),
  displayName: z.string(),
  canonicalName: z.string().optional(),
  details: z.record(z.string(), z.unknown()),
  evidenceIds: z.array(z.string()),
});

export const cryptoUseSchema = z.object({
  id: z.string(),
  applicationId: z.string().nullable(),
  assetId: z.string(),
  purpose: z.enum(['confidentiality', 'key-establishment', 'signature', 'authentication', 'integrity', 'non-security', 'unknown']),
  operation: z.string().nullable(),
  evidenceIds: z.array(z.string()),
  contextStatus: z.enum(['observed', 'declared', 'inferred', 'unknown']),
});

export const relationshipSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  targetId: z.string(),
  type: z.enum(['uses', 'depends-on', 'references-certificate', 'implemented-by', 'runs-on', 'protects-data-for']),
  evidenceIds: z.array(z.string()),
  provenance: z.enum(['observed-source', 'observed-certificate', 'declared-manifest', 'declared-inventory', 'inferred']),
  confidence: z.enum(['high', 'medium', 'low', 'unknown']),
});

export const coverageSchema = z.object({
  discoveredFiles: z.number().int().min(0),
  eligibleFiles: z.number().int().min(0),
  analysedFiles: z.number().int().min(0),
  skippedFiles: z.number().int().min(0),
  failedFiles: z.number().int().min(0),
  bytesRead: z.number().int().min(0),
  supportedDetectors: z.array(z.string()),
  entries: z.array(z.object({
    relativePath: z.string(),
    status: z.enum(['analysed', 'skipped', 'failed']),
    reason: z.string(),
  })),
});

export const vantageReportSchema = z.object({
  schemaVersion: z.literal('1.0'),
  reportId: z.string(),
  scanId: z.string(),
  scopeId: z.string(),
  startedAt: z.string().datetime(),
  finishedAt: z.string().datetime(),
  analysisAsOf: z.string().datetime(),
  status: z.enum(['complete', 'partial', 'cancelled']),
  origin: z.enum(['browser', 'python-cli', 'synthetic-demo']),
  collectorVersions: z.record(z.string(), z.string()),
  policyVersion: z.string(),
  coverage: coverageSchema,
  assets: z.array(assetSchema),
  uses: z.array(cryptoUseSchema),
  evidence: z.array(evidenceSchema),
  relationships: z.array(relationshipSchema),
  warnings: z.array(z.string()),
});
