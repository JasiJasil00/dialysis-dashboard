import express from "express";
import { createPatient, getPatients } from "../controllers/patientController";

const router = express.Router();

router.post("/", createPatient);
router.get("/", getPatients);

export default router;