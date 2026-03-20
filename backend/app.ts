import express from "express";
import cors from "cors";

import patientRoutes from "./routes/patientRoutes";
import sessionRoutes from "./routes/sessionRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/patients", patientRoutes);
app.use("/sessions", sessionRoutes);

app.get("/", (_req, res) => {
  res.send("API Running...");
});

export default app;