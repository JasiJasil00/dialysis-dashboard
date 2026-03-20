import { useEffect, useState } from "react";
import { api } from "../api/client";
import type { ScheduleItem } from "../types/index";
import AddSessionForm from "../components/AddSessionForm";

export default function Dashboard() {
  const [data, setData] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showOnlyAnomalies, setShowOnlyAnomalies] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await api.getSchedule();
        setData(res);
      } catch {
        setError("Failed to load");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div style={{ ...s.page, ...s.center }}>
        <div style={s.spinnerRing} />
        <p style={s.dimText}>Loading schedule…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ ...s.page, ...s.center }}>
        <p style={{ color: p.rose, fontSize: 14 }}>{error}</p>
      </div>
    );
  }

  const filtered = showOnlyAnomalies
    ? data.filter((d) => d.anomalies.length > 0)
    : data;

  const anomalyCount = data.filter((d) => d.anomalies.length > 0).length;
  const activeCount  = data.filter((d) => d.status === "in_progress").length;
  const doneCount    = data.filter((d) => d.status === "completed").length;

  return (
    <div style={s.page}>
      <GlobalStyles />

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.logoMark}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="11" stroke={p.steel} strokeWidth="1.5" />
            <path d="M5 12h3l2-4.5 3 9 2-4.5h4" stroke={p.steel} strokeWidth="1.6"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={s.sideRule} />
        {[
          { icon: "⊞", label: "Schedule", active: true },
          { icon: "♡", label: "Patients" },
          { icon: "↗", label: "Reports" },
          { icon: "⚙", label: "Settings" },
        ].map(({ icon, label, active }) => (
          <button key={label} title={label}
            style={{ ...s.navPip, ...(active ? s.navPipActive : {}) }}>
            {icon}
          </button>
        ))}
      </aside>

      {/* ── Content ── */}
      <div style={s.content}>

        {/* Header */}
        <header style={s.header}>
          <div>
            <span style={s.eyebrow}>Nephrology · {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</span>
            <h1 style={s.title}>Dialysis Schedule</h1>
          </div>
          <div style={s.headerActions}>
            {anomalyCount > 0 && (
              <div style={s.alertPill}>
                <span style={s.pulseDot} />
                {anomalyCount} alert{anomalyCount !== 1 ? "s" : ""}
              </div>
            )}
            <label style={s.toggle}>
              <div
                style={{ ...s.track, background: showOnlyAnomalies ? p.rose : p.surface3 }}
                onClick={() => setShowOnlyAnomalies((v) => !v)}
              >
                <div style={{
                  ...s.thumb,
                  transform: showOnlyAnomalies ? "translateX(18px)" : "translateX(2px)",
                }} />
              </div>
              <span style={s.dimText}>Anomalies only</span>
            </label>
          </div>
        </header>

        {/* Stats row */}
        <div style={s.statsRow}>
          {[
            { label: "Total",    value: data.length,   color: p.steel },
            { label: "Active",   value: activeCount,   color: p.amber },
            { label: "Complete", value: doneCount,     color: p.jade },
            { label: "Alerts",   value: anomalyCount,  color: p.rose  },
          ].map(({ label, value, color }) => (
            <div key={label} style={s.statTile}>
              <span style={{ ...s.statNum, color }}>{value}</span>
              <span style={s.statLabel}>{label}</span>
            </div>
          ))}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div style={s.emptyState}>No patients match this filter.</div>
        ) : (
          <div style={s.cardGrid}>
            {filtered.map((item, idx) => {
              const hasAlert   = item.anomalies.length > 0;
              const isExpanded = expandedId === item.patient._id;
              const initials   = item.patient.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2);

              return (
                <article
                  key={item.patient._id}
                  style={{
                    ...s.card,
                    ...(hasAlert ? s.cardAlert : {}),
                    animationDelay: `${idx * 0.06}s`,
                  }}
                >
                  {/* Card top */}
                  <div style={s.cardTop}>
                    <div style={{ ...s.avatar, background: hasAlert ? `${p.rose}22` : `${p.steel}1A` }}>
                      <span style={{ color: hasAlert ? p.rose : p.steel, fontSize: 13, fontWeight: 700 }}>
                        {initials}
                      </span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={s.patientName}>{item.patient.name}</p>
                      <StatusChip status={item.status} />
                    </div>
                    {hasAlert && <span style={{ color: p.rose, fontSize: 16 }}>⚠</span>}
                  </div>

                  {/* Metrics */}
                  {item.session && (
                    <>
                      <div style={s.rule} />
                      <div style={s.metrics}>
                        <Metric label="Pre"  value={item.session.preWeight}      unit="kg"   />
                        <Metric label="Post" value={item.session.postWeight ?? "—"} unit={item.session.postWeight ? "kg" : ""} />
                        <Metric label="BP"   value={`${item.session.systolicBP}/${item.session.diastolicBP}`} unit="mmHg" alert={item.session.systolicBP > 160} />
                        <Metric label="Dur"  value={item.session.durationMinutes ?? "—"} unit={item.session.durationMinutes ? "min" : ""} />
                      </div>
                    </>
                  )}

                  {/* Anomaly tags */}
                  {hasAlert && (
                    <div style={s.tagRow}>
                      {item.anomalies.map((a: string, i: number) => (
                        <span key={i} style={s.anomalyTag}>{a}</span>
                      ))}
                    </div>
                  )}

                  {/* Expand / collapse Add Session */}
                  <button
                    style={{ ...s.addToggle, ...(isExpanded ? s.addToggleOpen : {}) }}
                    onClick={() => setExpandedId(isExpanded ? null : item.patient._id)}
                  >
                    {isExpanded ? "− Close form" : "+ Add session"}
                  </button>

                  {isExpanded && (
                    <div style={s.formWrap}>
                      <AddSessionForm
                        patientId={item.patient._id}
                        onSuccess={() => window.location.reload()}
                      />
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function StatusChip({ status }: { status: string }) {
  const map: Record<string, { bg: string; color: string }> = {
    completed:   { bg: `${p.jade}22`,  color: p.jade  },
    in_progress: { bg: `${p.amber}22`, color: p.amber },
    scheduled:   { bg: `${p.steel}1A`, color: p.steel },
    missed:      { bg: `${p.rose}22`,  color: p.rose  },
  };
  const t = map[status] ?? { bg: p.surface3, color: p.muted };
  const label = status.replace("_", " ");
  return (
    <span style={{ ...s.chip, background: t.bg, color: t.color }}>{label}</span>
  );
}

function Metric({ label, value, unit, alert }: {
  label: string; value: string | number; unit: string; alert?: boolean;
}) {
  return (
    <div style={s.metric}>
      <span style={s.metricLabel}>{label}</span>
      <span style={{ ...s.metricVal, color: alert ? p.rose : p.fg }}>
        {value}
        {unit && <span style={s.metricUnit}> {unit}</span>}
      </span>
    </div>
  );
}

function GlobalStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      @keyframes spin    { to { transform: rotate(360deg); } }
      @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
      @keyframes pulse   { 0%,100% { opacity:1; } 50% { opacity:.35; } }
      article { animation: fadeUp .35s ease both; }
      article:hover { transform: translateY(-2px); box-shadow: 0 12px 40px rgba(0,0,0,.45) !important; transition: transform .2s ease, box-shadow .2s ease; }
      button { cursor: pointer; border: none; background: none; font-family: inherit; }
      ::-webkit-scrollbar { width: 6px; } 
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: ${p.surface3}; border-radius: 3px; }
    `}</style>
  );
}

/* ── Palette ── */
const p = {
  bg:       "#0D1117",   // near-black base
  surface1: "#161B22",   // card background
  surface2: "#1C2330",   // elevated panels
  surface3: "#2A3441",   // borders / inputs
  fg:       "#E6EDF3",   // primary text
  muted:    "#7D8FA8",   // secondary text
  steel:    "#58A6FF",   // primary brand (cool blue)
  jade:     "#3FB950",   // success / completed
  amber:    "#D29922",   // warning / in-progress
  rose:     "#F85149",   // alert / critical
};

/* ── Styles ── */
const s: Record<string, React.CSSProperties> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: p.bg,
    fontFamily: "'IBM Plex Sans', sans-serif",
    color: p.fg,
  },
  center: { alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 },

  /* Sidebar */
  sidebar: {
    width: 60,
    background: p.surface1,
    borderRight: `1px solid ${p.surface3}`,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
    gap: 4,
    flexShrink: 0,
  },
  logoMark: {
    width: 36, height: 36,
    display: "flex", alignItems: "center", justifyContent: "center",
    marginBottom: 6,
  },
  sideRule: { width: 28, height: 1, background: p.surface3, margin: "10px 0" },
  navPip: {
    width: 36, height: 36,
    display: "flex", alignItems: "center", justifyContent: "center",
    borderRadius: 8,
    fontSize: 15,
    color: p.muted,
    transition: "background .15s, color .15s",
  },
  navPipActive: { background: `${p.steel}18`, color: p.steel },

  /* Content */
  content: { flex: 1, padding: "32px 36px", overflowY: "auto" },

  /* Header */
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 28,
  },
  eyebrow: {
    display: "block",
    fontSize: 11, fontWeight: 500,
    letterSpacing: "0.1em", textTransform: "uppercase" as const,
    color: p.muted, marginBottom: 6,
  },
  title: {
    fontFamily: "'Syne', sans-serif",
    fontSize: 30, fontWeight: 700,
    color: p.fg, letterSpacing: "-0.02em",
  },
  headerActions: { display: "flex", alignItems: "center", gap: 16 },
  alertPill: {
    display: "flex", alignItems: "center", gap: 7,
    padding: "6px 14px",
    background: `${p.rose}18`,
    border: `1px solid ${p.rose}44`,
    borderRadius: 20,
    fontSize: 12, fontWeight: 600, color: p.rose,
  },
  pulseDot: {
    width: 7, height: 7, borderRadius: "50%",
    background: p.rose,
    animation: "pulse 1.6s ease infinite",
    display: "inline-block",
  },
  toggle: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
  track: {
    width: 40, height: 22, borderRadius: 11,
    position: "relative", transition: "background .2s", cursor: "pointer",
  },
  thumb: {
    position: "absolute", top: 2,
    width: 18, height: 18, borderRadius: "50%",
    background: p.fg,
    boxShadow: "0 1px 4px rgba(0,0,0,.4)",
    transition: "transform .2s",
  },

  /* Stats */
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: 12,
    marginBottom: 28,
  },
  statTile: {
    background: p.surface1,
    border: `1px solid ${p.surface3}`,
    borderRadius: 12,
    padding: "16px 18px",
    display: "flex", flexDirection: "column", gap: 4,
  },
  statNum: {
    fontSize: 30, fontWeight: 600, lineHeight: 1,
    fontFamily: "'IBM Plex Mono', monospace",
  },
  statLabel: {
    fontSize: 10, fontWeight: 500,
    letterSpacing: "0.08em", textTransform: "uppercase" as const,
    color: p.muted,
  },

  /* Cards */
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
    gap: 14,
  },
  card: {
    background: p.surface1,
    border: `1px solid ${p.surface3}`,
    borderRadius: 14,
    padding: "18px 20px",
    boxShadow: "0 4px 20px rgba(0,0,0,.3)",
    transition: "transform .2s ease, box-shadow .2s ease",
  },
  cardAlert: {
    borderColor: `${p.rose}66`,
    background: `#1A1014`,
  },

  /* Card internals */
  cardTop: { display: "flex", alignItems: "center", gap: 12, marginBottom: 14 },
  avatar: {
    width: 38, height: 38, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
  },
  patientName: {
    fontSize: 15, fontWeight: 600, color: p.fg,
    marginBottom: 4,
    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
  },
  chip: {
    display: "inline-block",
    fontSize: 10, fontWeight: 600,
    padding: "2px 8px", borderRadius: 20,
    letterSpacing: "0.06em", textTransform: "capitalize" as const,
  },
  rule: { height: 1, background: p.surface3, marginBottom: 14 },

  /* Metrics */
  metrics: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px 0",
    marginBottom: 2,
  },
  metric: {
    display: "flex", flexDirection: "column", gap: 2,
    paddingRight: 12,
  },
  metricLabel: {
    fontSize: 9, fontWeight: 600,
    letterSpacing: "0.09em", textTransform: "uppercase" as const,
    color: p.muted,
  },
  metricVal: {
    fontSize: 16, fontWeight: 600,
    fontFamily: "'IBM Plex Mono', monospace",
    color: p.fg,
  },
  metricUnit: {
    fontSize: 10, color: p.muted,
    fontFamily: "'IBM Plex Sans', sans-serif",
  },

  /* Tags */
  tagRow: { display: "flex", flexWrap: "wrap" as const, gap: 6, marginTop: 14 },
  anomalyTag: {
    padding: "3px 10px",
    background: `${p.rose}18`,
    border: `1px solid ${p.rose}44`,
    color: p.rose,
    borderRadius: 6,
    fontSize: 11, fontWeight: 600,
  },

  /* Add session toggle */
  addToggle: {
    marginTop: 14,
    fontSize: 12, fontWeight: 600,
    color: p.steel,
    letterSpacing: "0.02em",
    padding: "6px 0",
    transition: "opacity .15s",
    display: "block",
  },
  addToggleOpen: { color: p.muted },
  formWrap: { marginTop: 8 },

  /* States */
  dimText: { fontSize: 13, color: p.muted },
  spinnerRing: {
    width: 30, height: 30,
    border: `2px solid ${p.surface3}`,
    borderTop: `2px solid ${p.steel}`,
    borderRadius: "50%",
    animation: "spin .75s linear infinite",
  },
  emptyState: {
    textAlign: "center" as const,
    color: p.muted,
    padding: "60px 0",
    fontSize: 14,
  },
};