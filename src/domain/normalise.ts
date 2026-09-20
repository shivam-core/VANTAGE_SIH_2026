import type { Asset, CryptoUse, Evidence } from './types';
import { generateId } from './identity';

export async function normaliseObservations(
  observations: any[],
  scopeId: string,
  analysisAsOf: string,
  collectorVersion: string
): Promise<{ assets: Asset[], uses: CryptoUse[], evidence: Evidence[] }> {
  const assets: Asset[] = [];
  const uses: CryptoUse[] = [];
  const evidence: Evidence[] = [];

  for (let i = 0; i < observations.length; i++) {
    const obs = observations[i];
    
    // Normalise algorithm (e.g., md5 -> MD5)
    let algorithm = obs.args[0] ? String(obs.args[0]).toUpperCase() : 'UNKNOWN';
    let operation = obs.type;
    let kind: Asset['kind'] = 'algorithm';

    if (obs.type === 'generateKeyPair' || obs.type === 'generateKeyPairSync') {
      algorithm = obs.args[0] ? String(obs.args[0]).toUpperCase() : 'UNKNOWN';
      operation = 'key-generation';
      kind = 'key-metadata';
    }

    const assetId = await generateId(['asset', kind, algorithm, operation]);
    
    let asset = assets.find(a => a.id === assetId);
    if (!asset) {
      asset = {
        id: assetId,
        kind,
        displayName: algorithm,
        canonicalName: algorithm,
        details: { operation },
        evidenceIds: []
      };
      assets.push(asset);
    }

    const evidenceId = await generateId(['evidence', scopeId, obs.relativePath, obs.symbol, obs.startLine, obs.detectorId, i]);
    
    const ev: Evidence = {
      id: evidenceId,
      provenance: 'observed-source',
      confidence: 'high',
      collectorId: 'vantage-browser-ts',
      collectorVersion,
      detectorId: obs.detectorId,
      relativePath: obs.relativePath,
      symbol: obs.symbol,
      startLine: obs.startLine,
      endLine: obs.endLine,
      safeSummary: `${obs.type}(${obs.args.join(', ')})`,
      observedAt: analysisAsOf,
      limitations: []
    };
    evidence.push(ev);
    
    if (!asset.evidenceIds.includes(evidenceId)) {
      asset.evidenceIds.push(evidenceId);
    }

    const useId = await generateId(['use', scopeId, obs.relativePath, obs.symbol, obs.startLine, obs.detectorId, i]);
    
    let purpose: CryptoUse['purpose'] = 'unknown';
    if (obs.type === 'createHash') purpose = 'unknown';
    else if (obs.type === 'createHmac') purpose = 'integrity';
    else if (obs.type === 'createCipheriv') purpose = 'confidentiality';
    else if (obs.type === 'createSign' || obs.type === 'createVerify') purpose = 'signature';
    else if (obs.type === 'publicEncrypt' || obs.type === 'privateDecrypt') purpose = 'confidentiality';
    
    uses.push({
      id: useId,
      applicationId: null,
      assetId: assetId,
      purpose,
      operation,
      evidenceIds: [evidenceId],
      contextStatus: 'observed'
    });
  }

  return { assets, uses, evidence };
}
