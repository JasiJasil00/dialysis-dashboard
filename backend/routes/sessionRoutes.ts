import express from "express";
import { createSession, getTodaySchedule } from "../controllers/sessionController";

const router = express.Router();

router.post("/", createSession);
router.get("/schedule", getTodaySchedule);

export default router;