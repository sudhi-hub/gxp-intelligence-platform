import { useState } from "react";
import "./reports.css";

const reportData = [
  { id: "EQ-001", equipment: "Double-Door Autoclave", stage: "PQ", progress: 100, status: "Qualified" },
  { id: "EQ-002", equipment: "Single-Door Autoclave", stage: "OQ", progress: 78, status: "In Progress" },
  { id: "EQ-003", equipment: "Filling Unit", stage: "IQ", progress: 52, status: "In Progress" },
  { id: "EQ-004", equipment: "Water System", stage: "DQ", progress: 30, status: "Pending Review" },
  { id: "EQ-005", equipment: "Pressure Sensor", stage: "OQ", progress: 65, status: "Overdue" },
];

export default function Reports() {
  const [filter, setFilter] = useState("All");
  const [period, setPeriod] = useState("Last 30 days");

  const filtered = reportData.filter((item) =>
    filter === "All" || item.status === filter
  );

  function downloadCSV() {
    const rows = [
      ["Equipment ID", "Equipment", "Stage", "Progress", "Status"],
      ...filtered.map((item) => [
        item.id, item.equipment, item.stage,
        `${item.progress}%`, item.status,
      ]),
    ];

    const csv = rows.map((row) =>
      row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
    ).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "gxp-qualification-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  const qualified = reportData.filter(
    (item) => item.status === "Qualified"
  ).length;
  const inProgress = reportData.filter(
    (item) => item.status === "In Progress"
  ).length;
  const pending = reportData.filter(
    (item) => item.status === "Pending Review"
  ).length;
  const overdue = reportData.filter(
    (item) => item.status === "Overdue"
  ).length;

  return (
    <main className="reports-page">
      <header className="reports-heading">
        <div>
          <span className="reports-eyebrow">GXP INTELLIGENCE</span>
          <h1>Reports &amp; Analytics</h1>
          <p>
            Monitor qualification progress, equipment readiness and
            outstanding compliance actions.
          </p>
        </div>

        <button className="report-export" onClick={downloadCSV}>
          ↓ Export CSV
        </button>
      </header>

      <section className="report-toolbar">
        <div>
          <label htmlFor="report-period">Reporting period</label>
          <select
            id="report-period"
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>All records</option>
          </select>
        </div>
        <span className="report-demo-tag">Illustrative sample data</span>
      </section>

      <section className="report-kpis">
        <article className="report-kpi kpi-purple">
          <span>Total equipment</span>
          <strong>{reportData.length}</strong>
          <small>Equipment records in this report</small>
        </article>
        <article className="report-kpi kpi-pink">
          <span>Qualified</span>
          <strong>{qualified}</strong>
          <small>Completed qualification</small>
        </article>
        <article className="report-kpi kpi-violet">
          <span>In progress</span>
          <strong>{inProgress}</strong>
          <small>Qualification underway</small>
        </article>
        <article className="report-kpi kpi-red">
          <span>Needs attention</span>
          <strong>{pending + overdue}</strong>
          <small>Pending review or overdue</small>
        </article>
      </section>

      <section className="report-chart-grid">
        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <h2>Qualification Pipeline</h2>
              <p>Progress across the six qualification stages</p>
            </div>
          </div>

          {[
            { name: "URS", value: 100, color: "#9333ea" },
            { name: "DQ", value: 85, color: "#c026d3" },
            { name: "RTM", value: 75, color: "#db2777" },
            { name: "IQ", value: 60, color: "#e879a9" },
            { name: "OQ", value: 45, color: "#8b5cf6" },
            { name: "PQ", value: 25, color: "#f472b6" },
          ].map((stage) => (
            <div className="report-bar-row" key={stage.name}>
              <span>{stage.name}</span>
              <div className="report-bar-track">
                <div
                  className="report-bar-fill"
                  style={{
                    width: `${stage.value}%`,
                    background: stage.color,
                  }}
                />
              </div>
              <strong>{stage.value}%</strong>
            </div>
          ))}

          <p className="report-footnote">
            Illustrative stage values. Replace with approved backend data.
          </p>
        </article>

        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <h2>Equipment Readiness</h2>
              <p>Current status distribution</p>
            </div>
          </div>

          <div className="report-status-list">
            <div>
              <span><i className="dot dot-green" /> Qualified</span>
              <strong>{qualified}</strong>
            </div>
            <div>
              <span><i className="dot dot-purple" /> In Progress</span>
              <strong>{inProgress}</strong>
            </div>
            <div>
              <span><i className="dot dot-pink" /> Pending Review</span>
              <strong>{pending}</strong>
            </div>
            <div>
              <span><i className="dot dot-red" /> Overdue</span>
              <strong>{overdue}</strong>
            </div>
          </div>

          <div className="report-readiness-note">
            <strong>{Math.round(qualified / reportData.length * 100)}%</strong>
            <span>of sample equipment is qualified</span>
          </div>
        </article>
      </section>

      <section className="report-panel report-table-panel">
        <div className="report-panel-heading report-table-heading">
          <div>
            <h2>Equipment Qualification Report</h2>
            <p>Review equipment stage, progress and current status</p>
          </div>

          <select
            aria-label="Filter by equipment status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>All</option>
            <option>Qualified</option>
            <option>In Progress</option>
            <option>Pending Review</option>
            <option>Overdue</option>
          </select>
        </div>

        <div className="report-table-wrap">
          <table className="report-table">
            <thead>
              <tr>
                <th>Equipment ID</th>
                <th>Equipment</th>
                <th>Current stage</th>
                <th>Progress</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td><strong>{item.id}</strong></td>
                  <td>{item.equipment}</td>
                  <td><span className="report-stage">{item.stage}</span></td>
                  <td>
                    <div className="report-progress-cell">
                      <div className="report-mini-track">
                        <div style={{ width: `${item.progress}%` }} />
                      </div>
                      <span>{item.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`report-status status-${item.status.toLowerCase().replaceAll(" ", "-")}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5}>No records match this filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <p className="report-disclaimer">
        Demo report only. Counts, dates and stage percentages are illustrative
        and are not validated compliance results.
      </p>
    </main>
  );
}