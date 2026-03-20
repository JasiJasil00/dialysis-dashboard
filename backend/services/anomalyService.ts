import { ANOMALY_CONFIG } from "../config/anomalyConfig";
import { IPatient } from "../models/Patient";
import { ISession } from "../models/Session";

// Core anomaly detection function
export const detectAnomalies = (
  session: Partial<ISession>,
  patient: IPatient
): string[] => {
  const anomalies: string[] = [];
  // -------------------------------
  // 1. Weight Gain Check
  // -------------------------------
  // formula: (preWeight - dryWeight) / dryWeight * 100
  if (session.preWeight) {
    const weightGainPercent =
      ((session.preWeight - patient.dryWeight) / patient.dryWeight) * 100;

    if (weightGainPercent > ANOMALY_CONFIG.MAX_WEIGHT_GAIN_PERCENT) {
      anomalies.push(
        `High weight gain (${weightGainPercent.toFixed(2)}%)`
      );
    }
  }

  // -------------------------------
  // 2. Blood Pressure Check
  // -------------------------------
  if (session.systolicBP) {
    if (session.systolicBP > ANOMALY_CONFIG.HIGH_SYSTOLIC_BP) {
      anomalies.push(`High systolic BP (${session.systolicBP})`);
    }
  }

  // -------------------------------
  // 3. Duration Check
  // -------------------------------
  if (session.durationMinutes) {
    if (
      session.durationMinutes < ANOMALY_CONFIG.MIN_DURATION ||
      session.durationMinutes > ANOMALY_CONFIG.MAX_DURATION
    ) {
      anomalies.push(
        `Abnormal duration (${session.durationMinutes} mins)`
      );
    }
  }

  return anomalies;
};