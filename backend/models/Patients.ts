import mongoose , { Schema , Documents } from "mongoose";

// Interface for TypeScript (strong typing)
export interface IPatient extends Document {
  name: string;
  age: number;
  gender: "male" | "female" | "other";
  dryWeight: number; // IMPORTANT baseline for anomaly detection
  unitId: string; // which dialysis unit patient belongs to
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const PatientSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true // remove extra spaces
    },

    age: {
      type: Number,
      required: true,
      min: 0 // validation: no negative age
    },

    gender: {
      type: String,
      enum: ["male", "female", "other"], // restrict values
      required: true
    },

    dryWeight: {
      type: Number,
      required: true,
      min: 0 // must be positive
    },

    unitId: {
      type: String,
      required: true,
      index: true // improves query for "today's schedule"
    }
  },
  {
    timestamps: true // auto adds createdAt, updatedAt
  }
);

/* ========================
   Model
======================== */

export const Patient = mongoose.model<IPatient>("Patient", PatientSchema);