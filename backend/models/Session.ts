import mongoose, { Schema, Document } from "mongoose";

// Interface for TypeScript
export interface ISession extends Document {
  patientId: mongoose.Types.ObjectId;

  // timestamps
  startTime: Date;
  endTime?: Date; // optional → session may be ongoing

  // weights
  preWeight: number;
  postWeight?: number; // optional until session ends

  // vitals
  systolicBP: number;
  diastolicBP: number;

  // session details
  durationMinutes?: number; // can compute OR store
  machineId: string;
  nurseNotes?: string;

  // anomaly results
  anomalies: string[];

  createdAt: Date;
  updatedAt: Date;
}

// Schema
const SessionSchema: Schema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
      index: true // fast lookup per patient
    },

    startTime: {
      type: Date,
      required: true,
      //index: true // used for "today's schedule"
    },

    endTime: {
      type: Date
    },

    preWeight: {
      type: Number,
      required: true,
      min: 0
    },

    postWeight: {
      type: Number,
      min: 0
    },

    systolicBP: {
      type: Number,
      required: true,
      min: 0
    },

    diastolicBP: {
      type: Number,
      required: true,
      min: 0
    },

    durationMinutes: {
      type: Number,
      min: 0
    },

    machineId: {
      type: String,
      required: true
    },

    nurseNotes: {
      type: String,
      trim: true
    },

    anomalies: {
      type: [String],
      default: [] // always return array
    }
  },
  {
    timestamps: true
  }
);

// 🔥 Index for today's queries (IMPORTANT)
SessionSchema.index({ startTime: 1 });

export default mongoose.model<ISession>("Session", SessionSchema);