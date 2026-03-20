// Centralized configuration for all anomaly thresholds
// Easy to change without touching logic

export const ANOMALY_CONFIG = {
  MAX_WEIGHT_GAIN_PERCENT: 5, // >5% of dry weight is risky
  HIGH_SYSTOLIC_BP: 180, // hypertension danger level
  MIN_DURATION: 180, // 3 hours
  MAX_DURATION: 300 // 5 hours
};