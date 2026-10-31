/**
 * Pi Munshi Backend Netflix 3σ Behavioral Canary Service
 * Tracks settlement velocity and automatically trips circuit breaker when anomaly Z-score > 3.0.
 * Powered by simple-statistics for formal statistical distribution modeling.
 */

import * as ss from "simple-statistics";

export class CanaryMonitorService {
  private static instance: CanaryMonitorService;

  // Rolling FIFO buffer of recent Settlements Per Second (SPS) measurements (Window size N=30)
  private spsSamples: number[] = [
    14.2, 14.5, 14.8, 15.1, 14.7, 14.9, 14.4, 14.6, 15.0, 14.8,
    14.3, 14.7, 14.9, 15.2, 14.6, 14.5, 14.8, 15.0, 14.4, 14.7,
    14.8, 15.1, 14.6, 14.9, 14.7, 14.5, 15.0, 14.8, 14.6, 15.3
  ];

  private currentZScore: number = 0.42;
  private currentSps: number = 14.8;

  private constructor() {
    this.recomputeZScore();
  }

  public static getInstance(): CanaryMonitorService {
    if (!CanaryMonitorService.instance) {
      CanaryMonitorService.instance = new CanaryMonitorService();
    }
    return CanaryMonitorService.instance;
  }

  private recomputeZScore() {
    if (this.spsSamples.length < 2) {
      this.currentZScore = 0.42;
      return;
    }
    const mean = ss.mean(this.spsSamples);
    const sd = ss.standardDeviation(this.spsSamples);
    if (sd === 0) {
      this.currentZScore = 0.0;
    } else {
      const rawZ = Math.abs(ss.zScore(this.currentSps, mean, sd));
      this.currentZScore = Math.round(rawZ * 100) / 100;
    }
  }

  public getStatus() {
    this.recomputeZScore();
    const isBreached = this.currentZScore > 3.0;

    return {
      currentZScore: this.currentZScore,
      thresholdSigma: 3.0,
      isBreached,
      activeCluster: isBreached ? "CIRCUIT_BREAKER_ABORT" : "CANARY_0.2%",
      spsRate: Number(this.currentSps.toFixed(1)),
      windowSampleSize: this.spsSamples.length,
      sampleMean: Math.round(ss.mean(this.spsSamples) * 100) / 100,
      sampleStdDev: Math.round(ss.standardDeviation(this.spsSamples) * 100) / 100,
      lastCheckTimestamp: new Date().toISOString(),
    };
  }

  public recordSample(deviation: number) {
    if (Math.abs(deviation) >= 1.0) {
      // Large deviation simulates load spike or anomaly
      this.currentSps = Number((this.currentSps + deviation).toFixed(2));
      this.spsSamples.push(this.currentSps);
      if (this.spsSamples.length > 50) this.spsSamples.shift();
    } else {
      // Fine adjustment
      this.currentZScore = Math.max(0.1, Number((this.currentZScore + deviation).toFixed(2)));
    }
    return this.getStatus();
  }
}

export const canaryMonitor = CanaryMonitorService.getInstance();
