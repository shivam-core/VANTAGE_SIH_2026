import type { VantageReport } from './types';

export function validateInvariants(report: VantageReport): string[] {
  const errors: string[] = [];
  const assetIds = new Set(report.assets.map(a => a.id));
  const useIds = new Set(report.uses.map(u => u.id));
  const evidenceIds = new Set(report.evidence.map(e => e.id));
  
  if (assetIds.size !== report.assets.length) errors.push('Duplicate asset IDs');
  if (useIds.size !== report.uses.length) errors.push('Duplicate use IDs');
  if (evidenceIds.size !== report.evidence.length) errors.push('Duplicate evidence IDs');

  for (const asset of report.assets) {
    for (const eid of asset.evidenceIds) {
      if (!evidenceIds.has(eid)) errors.push(`Asset ${asset.id} references dangling evidence ${eid}`);
    }
  }

  for (const use of report.uses) {
    if (!assetIds.has(use.assetId)) errors.push(`Use ${use.id} references dangling asset ${use.assetId}`);
    for (const eid of use.evidenceIds) {
      if (!evidenceIds.has(eid)) errors.push(`Use ${use.id} references dangling evidence ${eid}`);
    }
  }

  for (const rel of report.relationships) {
    for (const eid of rel.evidenceIds) {
      if (!evidenceIds.has(eid)) errors.push(`Relationship ${rel.id} references dangling evidence ${eid}`);
    }
  }

  return errors;
}
