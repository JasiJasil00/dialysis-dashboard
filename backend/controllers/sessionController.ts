import { Request, Response } from "express";
import Session from "../models/Session";
import Patient from "../models/Patient";
import { detectAnomalies } from "../services/anomalyService";

// Create session
export const createSession = async (req: Request, res: Response) => {
  try {
    const {
      patientId,
      startTime,
      endTime,
      preWeight,
      postWeight,
      systolicBP,
      diastolicBP,
      machineId,
      nurseNotes
    } = req.body;

    // validation
    if (!patientId || !startTime || !preWeight || !systolicBP || !diastolicBP || !machineId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // fetch patient
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    // calculate duration (if endTime exists)
    let durationMinutes = undefined;
    if (endTime) {
      durationMinutes = Math.floor(
        (new Date(endTime).getTime() - new Date(startTime).getTime()) / (1000 * 60)
      );
    }

    const sessionData: any = {
    preWeight,
    postWeight,
    systolicBP,
    diastolicBP   
    };

    if (durationMinutes !== undefined) {
    sessionData.durationMinutes = durationMinutes;
    }
    
     // detect anomalies
    const anomalies = detectAnomalies(sessionData, patient);



   
    

    // save session
    const session = new Session({
      patientId,
      startTime,
      endTime,
      preWeight,
      postWeight,
      systolicBP,
      diastolicBP,
      durationMinutes,
      machineId,
      nurseNotes,
      anomalies
    });

    await session.save();

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ error: "Failed to create session" });
  }
};

// Get today's schedule
export const getTodaySchedule = async (req: Request, res: Response) => {
  try {
    const { unitId } = req.query;

    // today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // get patients (optionally filter by unit)
    const patients = await Patient.find(
      unitId ? { unitId } : {}
    );

    // get today's sessions
    const sessions = await Session.find({
      startTime: { $gte: startOfDay, $lte: endOfDay }
    });

    // map sessions by patientId
    const sessionMap: any = {};
    sessions.forEach((s) => {
      sessionMap[s.patientId.toString()] = s;
    });

    // build response
    const result = patients.map((p) => {
      const session = sessionMap[p._id.toString()];

      let status = "not_started";

      if (session) {
        if (session.endTime) {
          status = "completed";
        } else {
          status = "in_progress";
        }
      }

      return {
        patient: p,
        session: session || null,
        status,
        anomalies: session?.anomalies || []
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
};