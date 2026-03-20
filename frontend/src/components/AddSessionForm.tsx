import { useState } from "react";
import { api } from "../api/client";

interface Props {
  patientId: string;
  onSuccess: () => void;
}

export default function AddSessionForm({ patientId, onSuccess }: Props) {
  const [form, setForm] = useState({
    preWeight:   "",
    postWeight:  "",
    systolicBP:  "",
    diastolicBP: "",
    machineId:   "",
    nurseNotes:  "",
  });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      await api.createSession({
        patientId,
        startTime:   new Date().toISOString(),
        preWeight:   Number(form.preWeight),
        postWeight:  form.postWeight ? Number(form.postWeight) : undefined,
        systolicBP:  Number(form.systolicBP),
        diastolicBP: Number(form.diastolicBP),
        machineId:   form.machineId,
        nurseNotes:  form.nurseNotes,
      });
      onSuccess();
    } catch {
      setError("Failed to create session");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.wrap}>
      <p style={s.formTitle}>New Session</p>

      {/* Weight row */}
      <div style={s.row}>
        <Field name="preWeight"  placeholder="Pre-weight"  label="Pre (kg)"  onChange={handleChange} />
        <Field name="postWeight" placeholder="Post-weight" label="Post (kg)" onChange={handleChange} />
      </div>

      {/* BP row */}
      <div style={s.row}>
        <Field name="systolicBP"  placeholder="120" label="Systolic BP"  onChange={handleChange} />
        <Field name="diastolicBP" placeholder="80"  label="Diastolic BP" onChange={handleChange} />
      </div>

      {/* Machine ID */}
      <Field name="machineId" placeholder="e.g. D-07" label="Machine ID" onChange={handleChange} fullWidth />

      {/* Notes */}
      <div style={s.fieldWrap}>
        <label style={s.label}>Nurse notes</label>
        <textarea
          name="nurseNotes"
          placeholder="Optional observations…"
          onChange={handleChange}
          style={{ ...s.input, height: 72, resize: "vertical" as const }}
        />
      </div>

      {error && <p style={s.errorText}>{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{ ...s.submitBtn, ...(loading ? s.submitBtnDisabled : {}) }}
      >
        {loading ? (
          <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
            <span style={s.btnSpinner} /> Saving…
          </span>
        ) : "Save Session"}
      </button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .session-input:focus {
          outline: none !important;
          border-color: ${p.steel} !important;
          box-shadow: 0 0 0 3px ${p.steel}22 !important;
        }
        .session-input::placeholder { color: ${p.muted}; opacity: 1; }
        .submit-btn:hover:not(:disabled) { background: ${p.steelHover} !important; }
      `}</style>
    </div>
  );
}

/* ── Field helper ── */
function Field({
  name, placeholder, label, onChange, fullWidth,
}: {
  name: string;
  placeholder: string;
  label: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fullWidth?: boolean;
}) {
  return (
    <div style={{ ...s.fieldWrap, ...(fullWidth ? { width: "100%" } : {}) }}>
      <label style={s.label}>{label}</label>
      <input
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        className="session-input"
        style={s.input}
      />
    </div>
  );
}

/* ── Palette ── */
const p = {
  bg:        "#0D1117",
  surface1:  "#161B22",
  surface2:  "#1C2330",
  surface3:  "#2A3441",
  surface4:  "#1E2733",
  fg:        "#E6EDF3",
  muted:     "#7D8FA8",
  steel:     "#58A6FF",
  steelHover:"#79B8FF",
  rose:      "#F85149",
};

/* ── Styles ── */
const s: Record<string, React.CSSProperties> = {
  wrap: {
    marginTop: 4,
    padding: "16px",
    background: p.surface2,
    border: `1px solid ${p.surface3}`,
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    fontFamily: "'IBM Plex Sans', sans-serif",
  },
  formTitle: {
    fontSize: 11, fontWeight: 600,
    letterSpacing: "0.09em", textTransform: "uppercase" as const,
    color: p.muted,
    marginBottom: 2,
  },
  row: { display: "flex", gap: 10 },
  fieldWrap: { display: "flex", flexDirection: "column", gap: 4, flex: 1 },
  label: {
    fontSize: 10, fontWeight: 600,
    letterSpacing: "0.07em", textTransform: "uppercase" as const,
    color: p.muted,
  },
  input: {
    width: "100%",
    padding: "8px 10px",
    background: p.surface1,
    border: `1px solid ${p.surface3}`,
    borderRadius: 8,
    color: p.fg,
    fontSize: 13,
    fontFamily: "'IBM Plex Sans', sans-serif",
    transition: "border-color .15s, box-shadow .15s",
  },
  submitBtn: {
    marginTop: 4,
    padding: "10px 0",
    background: p.steel,
    color: "#000",
    borderRadius: 8,
    fontSize: 13, fontWeight: 700,
    letterSpacing: "0.02em",
    transition: "background .15s",
    width: "100%",
  },
  submitBtnDisabled: { opacity: 0.5, cursor: "not-allowed" },
  errorText: { fontSize: 12, color: p.rose },
  btnSpinner: {
    display: "inline-block",
    width: 13, height: 13,
    border: `2px solid rgba(0,0,0,.3)`,
    borderTop: "2px solid #000",
    borderRadius: "50%",
    animation: "spin .75s linear infinite",
  },
};