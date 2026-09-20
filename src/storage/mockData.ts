import type { VantageReport, Asset, CryptoUse, Evidence } from '../domain/types';

export function generateMockReport(): VantageReport {
  const assets: Asset[] = [
    {
      id: 'asset-1',
      kind: 'algorithm',
      displayName: 'RSA-2048',
      canonicalName: 'RSA',
      details: { keyLength: 2048 },
      evidenceIds: ['ev-1']
    },
    {
      id: 'asset-2',
      kind: 'algorithm',
      displayName: 'SHA-1',
      canonicalName: 'SHA1',
      details: {},
      evidenceIds: ['ev-2']
    },
    {
      id: 'asset-3',
      kind: 'algorithm',
      displayName: 'AES-256-GCM',
      canonicalName: 'AES',
      details: { keyLength: 256, mode: 'GCM' },
      evidenceIds: ['ev-3']
    }
  ];

  const evidence: Evidence[] = [
    {
      id: 'ev-1',
      provenance: 'observed-source',
      confidence: 'high',
      collectorId: 'source-scanner',
      collectorVersion: '1.0',
      detectorId: 'regex-detector',
      relativePath: 'src/crypto/auth.ts',
      startLine: 45,
      endLine: 45,
      safeSummary: 'Detected RSA-2048 key generation',
      observedAt: new Date().toISOString(),
      limitations: []
    },
    {
      id: 'ev-2',
      provenance: 'observed-source',
      confidence: 'high',
      collectorId: 'source-scanner',
      collectorVersion: '1.0',
      detectorId: 'regex-detector',
      relativePath: 'src/utils/hash.ts',
      startLine: 12,
      endLine: 15,
      safeSummary: 'Detected SHA-1 usage for hashing',
      observedAt: new Date().toISOString(),
      limitations: []
    },
    {
      id: 'ev-3',
      provenance: 'declared-manifest',
      confidence: 'medium',
      collectorId: 'pom-parser',
      collectorVersion: '1.0',
      detectorId: 'dependency-analyzer',
      relativePath: 'pom.xml',
      safeSummary: 'Found bouncycastle dependency',
      observedAt: new Date().toISOString(),
      limitations: []
    }
  ];

  const uses: CryptoUse[] = [
    {
      id: 'use-1',
      applicationId: null,
      assetId: 'asset-1',
      purpose: 'signature',
      operation: 'sign',
      evidenceIds: ['ev-1'],
      contextStatus: 'observed'
    },
    {
      id: 'use-2',
      applicationId: null,
      assetId: 'asset-2',
      purpose: 'integrity',
      operation: 'hash',
      evidenceIds: ['ev-2'],
      contextStatus: 'observed'
    }
  ];

  return {
    schemaVersion: '1.0',
    reportId: `report-${Date.now()}`,
    scanId: `scan-${Date.now()}`,
    scopeId: 'workspace-default',
    startedAt: new Date(Date.now() - 15000).toISOString(),
    finishedAt: new Date().toISOString(),
    analysisAsOf: new Date().toISOString(),
    status: 'complete',
    origin: 'browser',
    collectorVersions: { 'source-scanner': '1.0' },
    policyVersion: '1.0',
    coverage: {
      discoveredFiles: 1450,
      eligibleFiles: 1200,
      analysedFiles: 1200,
      skippedFiles: 0,
      failedFiles: 0,
      bytesRead: 4502010,
      supportedDetectors: ['regex-detector'],
      entries: []
    },
    assets,
    uses,
    evidence,
    relationships: [],
    warnings: []
  };
}
