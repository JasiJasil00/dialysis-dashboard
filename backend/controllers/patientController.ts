import { Request, Response } from "express";
import Patient from "../models/Patient";

// Create new patient
export const createPatient = async (req: Request, res: Response) => {
  try {
    const { name, age, gender, dryWeight, unitId } = req.body;

    // basic validation
    if (!name || !age || !gender || !dryWeight || !unitId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const patient = new Patient({
      name,
      age,
      gender,
      dryWeight,
      unitId
    });

    await patient.save();

    res.status(201).json(patient);
  } catch (error) {
    res.status(500).json({ error: "Failed to create patient" });
  }
};

// Get all patients
export const getPatients = async (_req: Request, res: Response) => {
  try {
    const patients = await Patient.find();
    res.json(patients);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch patients" });
  }
};