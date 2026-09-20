import { parseSource } from '../collectors/ts-source';

export type ScanRequest = {
  type: 'SCAN';
  requestId: string;
  scopeId: string;
  analysisAsOf: string;
  files: Array<{ relativePath: string; text: string }>;
};

export type ScanResponse =
  | { type: 'PROGRESS'; requestId: string; processed: number; total: number }
  | { type: 'RESULT'; requestId: string; report: any }
  | { type: 'ERROR'; requestId: string; code: string; message: string };

self.onmessage = (event: MessageEvent<ScanRequest>) => {
  const req = event.data;
  if (req.type !== 'SCAN') return;

  try {
    let processed = 0;
    const allObservations: any[] = [];
    
    for (const file of req.files) {
      const obs = parseSource(file.text, file.relativePath);
      allObservations.push(...obs.map(o => ({ ...o, relativePath: file.relativePath })));
      
      processed++;
      if (processed % 10 === 0 || processed === req.files.length) {
        self.postMessage({
          type: 'PROGRESS',
          requestId: req.requestId,
          processed,
          total: req.files.length
        } as ScanResponse);
      }
    }

    self.postMessage({
      type: 'RESULT',
      requestId: req.requestId,
      report: { observations: allObservations }
    } as ScanResponse);
  } catch (error: any) {
    self.postMessage({
      type: 'ERROR',
      requestId: req.requestId,
      code: 'PARSE_FAILED',
      message: error.message || 'Unknown error'
    } as ScanResponse);
  }
};
