import { detectAnomalies } from "../src/services/anomalyService";

test("detects high BP", () => {
  const session: any = {
    preWeight: 70,
    systolicBP: 190,
    durationMinutes: 200
  };

  const patient: any = {
    dryWeight: 65
  };

  const result = detectAnomalies(session, patient);

  expect(result).toContain("High systolic BP (190)");
});