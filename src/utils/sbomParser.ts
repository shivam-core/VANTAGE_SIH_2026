import type { VantageReport, Asset } from '../domain/types';

export function parseCycloneDxSbom(fileContent: string): VantageReport {
  try {
    const sbom = JSON.parse(fileContent);
    const assets: Asset[] = [];
    
    if (sbom.components && Array.isArray(sbom.components)) {
      sbom.components.forEach((comp: any, index: number) => {
        if (comp.cryptoProperties && comp.cryptoProperties.algorithmProperties) {
          const algoProps = comp.cryptoProperties.algorithmProperties;
          
          assets.push({
            id: `asset-${Date.now()}-${index}`,
            kind: 'algorithm',
            displayName: comp.name || algoProps.name || 'Unknown Algorithm',
            canonicalName: algoProps.name || 'Unknown',
            details: {
              keyLength: algoProps.classicSecurityLevel,
              curve: algoProps.curve,
              mode: algoProps.mode
            },
            evidenceIds: [`ev-${Date.now()}-${index}`]
          });
        }
      });
    }

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
      collectorVersions: { 'sbom-parser': '1.0' },
      policyVersion: '1.0',
      coverage: {
        discoveredFiles: sbom.components ? sbom.components.length : 1,
        eligibleFiles: sbom.components ? sbom.components.length : 1,
        analysedFiles: sbom.components ? sbom.components.length : 1,
        skippedFiles: 0,
        failedFiles: 0,
        bytesRead: fileContent.length,
        supportedDetectors: ['cyclonedx-parser'],
        entries: []
      },
      assets,
      uses: [],
      evidence: assets.map((a) => ({
        id: a.evidenceIds[0],
        provenance: 'declared-manifest',
        confidence: 'high',
        collectorId: 'sbom-parser',
        collectorVersion: '1.0',
        detectorId: 'cyclonedx',
        relativePath: 'sbom.json',
        safeSummary: `Extracted from CycloneDX component`,
        observedAt: new Date().toISOString(),
        limitations: []
      })),
      relationships: [],
      warnings: [],
      totalComponents: sbom.components ? sbom.components.length : 0 // Custom field for UI
    };
  } catch (error) {
    console.error('Failed to parse SBOM', error);
    throw new Error('Invalid SBOM format');
  }
}
