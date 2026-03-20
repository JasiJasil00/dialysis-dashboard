const BASE_URL = "http://localhost:5000";

export const api = {
  getPatients: async () => {
    const res = await fetch(`${BASE_URL}/patients`);
    return res.json();
  },

  getSchedule: async () => {
    const res = await fetch(`${BASE_URL}/sessions/schedule`);
    return res.json();
  },

  createSession: async (data: any) => {
    const res = await fetch(`${BASE_URL}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};