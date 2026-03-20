export interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  dryWeight: number;
  unitId: string;
}

export interface Session {
  preWeight: number;
  postWeight?: number;
  systolicBP: number;
  diastolicBP: number;
  durationMinutes?: number;
  anomalies: string[];
}

export interface ScheduleItem {
  patient: Patient;
  session: Session | null;
  status: "not_started" | "in_progress" | "completed";
  anomalies: string[];
}