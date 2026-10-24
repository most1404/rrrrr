import { QualityGrade, ScanResult } from '../model/types';

export class QualityEvaluator {
  static evaluate(r: ScanResult): QualityGrade {
    if (!r.healthy || r.loss > 0.1 || r.passRate < 0.5) return 'F';
    const ping = r.avgLatencyMs;
    const speed = r.throughputMbps;
    const stable = r.passRate >= 0.9;

    if (ping < 80 && speed > 20 && stable) return 'S';
    if (ping < 120 && speed > 10 && stable) return 'A';
    if (ping < 180 && speed > 3) return 'B';
    return 'C';
  }

  static isGoodForGaming(r: ScanResult): boolean {
    return r.healthy && r.avgLatencyMs < 100 && r.jitterMs < 20 && r.loss === 0;
  }

  static isGoodForStreaming(r: ScanResult): boolean {
    return r.healthy && r.throughputMbps > 15;
  }

  static isStable(r: ScanResult): boolean {
    return r.healthy && r.loss === 0 && r.jitterMs < 30;
  }
}
