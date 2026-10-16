import { useState } from "react";
import "./App.css";
import QualificationWorkflow from "./qualificationworkflow";
import DocumentLibrary from "./documentlibrary";
import ReviewWorkspace from "./reviewworkspace";
import AuditTrial from "./audittrial";
import Settings from "./settings";
import Reports from "./reports";
type Page =
  | "overview"
  | "equipment"
  | "qualification"
  | "documents"
  | "reviews"
  | "audit"
  | "reports"
  | "settings";

type Asset = {
  id: string;
  name: string;
  category: string;
  site: string;
  stage: string;
  readiness: number;
  risk: string;
  status: string;
  updated: string;
  process: string;
  owner: string;
  manufacturer: string;
  serial: string;
  installed: string;
};

const equipmentData: Asset[] = [
  {
    id: "AC-001",
    name: "Double-Door Autoclave",
    category: "Sterilization",
    site: "Site A",
    stage: "OQ",
    readiness: 72,
    risk: "Medium",
    status: "In review",
    updated: "12 Oct",
    process: "Sterile Processing",
    owner: "QA Team",
    manufacturer: "Getinge",
    serial: "SN-001",
    installed: "14 Mar 2025",
  },
  {
    id: "AC-002",
    name: "Single-Door Autoclave",
    category: "Sterilization",
    site: "Site A",
    stage: "IQ",
    readiness: 48,
    risk: "High",
    status: "In progress",
    updated: "11 Oct",
    process: "Sterile Processing",
    owner: "Engineering",
    manufacturer: "STERIS",
    serial: "SN-002",
    installed: "20 Apr 2025",
  },
  {
    id: "FU-003",
    name: "Filling Unit",
    category: "Filling Equipment",
    site: "Site B",
    stage: "DQ",
    readiness: 35,
    risk: "High",
    status: "Pending",
    updated: "10 Oct",
    process: "Liquid Filling",
    owner: "Production",
    manufacturer: "Sample Manufacturer",
    serial: "SN-003",
    installed: "05 Jun 2025",
  },
  {
    id: "WFI-004",
    name: "Water System",
    category: "Utilities",
    site: "Site B",
    stage: "RTM",
    readiness: 60,
    risk: "Medium",
    status: "In progress",
    updated: "09 Oct",
    process: "Purified Water",
    owner: "Utilities",
    manufacturer: "Sample Manufacturer",
    serial: "SN-004",
    installed: "18 Feb 2025",
  },
];

const documentData = [
  { name: "OQ_Autoclave_v2.pdf", stage: "OQ", size: "2.4 MB", date: "12 Oct" },
  { name: "IQ_Autoclave.pdf", stage: "IQ", size: "1.8 MB", date: "04 Oct" },
  { name: "DQ_Autoclave.pdf", stage: "DQ", size: "1.1 MB", date: "02 Oct" },
  { name: "RTM_Autoclave.pdf", stage: "RTM", size: "0.9 MB", date: "01 Oct" },
  { name: "URS_Autoclave.pdf", stage: "URS", size: "0.6 MB", date: "30 Sep" },
];

function App() {
  const [page, setPage] = useState<Page>("overview");
  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("All Sites");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [selectedId, setSelectedId] = useState("AC-001");
  const [notice, setNotice] = useState("");

  const navigation: { id: Page; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "◈" },
    { id: "equipment", label: "Equipment", icon: "▣" },
    { id: "qualification", label: "Qualification Workflow", icon: "◎" },
    { id: "documents", label: "Document Library", icon: "▤" },
    { id: "reviews", label: "Review Workspace", icon: "✓" },
    { id: "audit", label: "Audit Trail", icon: "◷" },
    { id: "reports", label: "Reports", icon: "▥" },
    { id: "settings", label: "Settings", icon: "⚙" },
  ];

  const selectedAsset =
    equipmentData.find((asset) => asset.id === selectedId) ??
    equipmentData[0];

  const filteredEquipment = equipmentData.filter((asset) => {
    const matchesSearch =
      `${asset.id} ${asset.name} ${asset.category}`
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesSite =
      siteFilter === "All Sites" || asset.site === siteFilter;

    const matchesStatus =
      statusFilter === "All Statuses" ||
      asset.status === statusFilter;

    return matchesSearch && matchesSite && matchesStatus;
  });

  function renderOverview() {
    return (
      <>
        <div className="welcome-row">
          <div>
            <p className="eyebrow">YOUR QUALIFICATION WORKSPACE</p>
            <h1>Qualification Command Center</h1>
            <p className="page-description">
              Monitor equipment readiness, compliance signals,
              and qualification progress in one place.
            </p>
          </div>
          <div className="date-card">
            <span className="date-icon">▦</span>
            <div>
              <strong>Demo Workspace</strong>
              <small>Illustrative sample data</small>
            </div>
          </div>
        </div>

        <div className="kpi-grid">
          {[
            { title: "Equipment Assets", value: "24", icon: "▣", tone: "pink-card", note: "Across qualification stages" },
            { title: "Fully Qualified", value: "3", icon: "✧", tone: "purple-card", note: "All stages approved" },
            { title: "Awaiting Review", value: "18", icon: "◷", tone: "amber-card", note: "Items awaiting review" },
            { title: "Documents", value: "58", icon: "▤", tone: "blue-card", note: "Illustrative document count" },
          ].map((item) => (
            <div className={`kpi-card ${item.tone}`} key={item.title}>
              <div className="kpi-top">
                <span className="kpi-icon">{item.icon}</span>
                <span className="kpi-trend">DEMO</span>
              </div>
              <p>{item.title}</p>
              <h2>{item.value}</h2>
              <small>{item.note}</small>
            </div>
          ))}
        </div>

        <div className="overview-grid">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">PROGRESS MONITOR</span>
                <h3>Qualification Pipeline</h3>
                <p>Illustrative stage distribution</p>
              </div>
              <span className="soft-badge">6 stages</span>
            </div>

            {[
              { name: "URS", value: 83, color: "rose" },
              { name: "DQ", value: 71, color: "purple" },
              { name: "RTM", value: 58, color: "blue" },
              { name: "IQ", value: 42, color: "amber" },
              { name: "OQ", value: 30, color: "rose" },
              { name: "PQ", value: 22, color: "purple" },
            ].map((stage) => (
              <div className="pipeline-row" key={stage.name}>
                <strong>{stage.name}</strong>
                <div className="progress-track">
                  <div
                    className={`progress-fill ${stage.color}`}
                    style={{ width: `${stage.value}%` }}
                  />
                </div>
                <span>{stage.value}%</span>
              </div>
            ))}
            <p className="panel-footnote">
              Percentages are illustrative UI values.
            </p>
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">PORTFOLIO VIEW</span>
                <h3>Overall Readiness</h3>
                <p>Illustrative qualification status</p>
              </div>
            </div>

            <div className="readiness-content">
              <div className="donut-chart">
                <div className="donut-center">
                  <strong>68%</strong>
                  <span>Ready</span>
                </div>
              </div>
              <div className="legend-list">
                <p><i className="legend-dot rose-dot" />Approved <b>68%</b></p>
                <p><i className="legend-dot amber-dot" />In review <b>7%</b></p>
                <p><i className="legend-dot purple-dot" />Draft <b>3%</b></p>
                <p><i className="legend-dot grey-dot" />Not started <b>22%</b></p>
              </div>
            </div>
          </section>
        </div>
      </>
    );
  }

  function renderEquipment() {
    return (
      <div className="equipment-page">
        <div className="welcome-row">
          <div>
            <p className="eyebrow">ASSET MANAGEMENT / INVENTORY</p>
            <h1>Equipment Intelligence</h1>
            <p className="page-description">
              Explore equipment profiles, qualification readiness, risk and
              supporting documentation.
            </p>
          </div>
          <button
            className="primary-button"
            onClick={() =>
              setNotice("Add Equipment is a UI demonstration using sample data.")
            }
          >
            + Add Equipment
          </button>
        </div>

        <div className="kpi-grid equipment-kpis">
          {[
            { title: "Total Equipment", value: "24", icon: "▦", tone: "pink-card" },
            { title: "Fully Qualified", value: "3", icon: "✦", tone: "purple-card" },
            { title: "Awaiting Review", value: "18", icon: "◷", tone: "amber-card" },
            { title: "High-Risk Assets", value: "2", icon: "⚠", tone: "blue-card" },
          ].map((item) => (
            <div className={`kpi-card ${item.tone}`} key={item.title}>
              <div className="kpi-top">
                <span className="kpi-icon">{item.icon}</span>
                <span className="kpi-trend">DEMO</span>
              </div>
              <p>{item.title}</p>
              <h2>{item.value}</h2>
              <small>Illustrative sample data</small>
            </div>
          ))}
        </div>

        <section className="panel equipment-panel">
          <div className="panel-heading">
            <div>
              <p className="section-kicker">ASSET DIRECTORY</p>
              <h3>Equipment Readiness Matrix</h3>
              <p>Search and select an asset to view its lifecycle.</p>
            </div>
            <span className="soft-badge">
              {filteredEquipment.length} records
            </span>
          </div>

          <div className="equipment-controls">
            <input
              className="search-input"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search ID, equipment or category..."
              aria-label="Search equipment"
            />

            <select
              className="filter-select"
              value={siteFilter}
              onChange={(event) => setSiteFilter(event.target.value)}
              aria-label="Filter by site"
            >
              <option>All Sites</option>
              <option>Site A</option>
              <option>Site B</option>
            </select>

            <select
              className="filter-select"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="Filter by status"
            >
              <option>All Statuses</option>
              <option>In review</option>
              <option>In progress</option>
              <option>Pending</option>
            </select>

            <button
              className="soft-badge"
              onClick={() =>
                setNotice("Export is a visual demo; no file is generated.")
              }
            >
              ↓ Export
            </button>
          </div>

          <div className="table-scroll">
            <table className="equipment-table">
              <thead>
                <tr>
                  <th>Equipment</th>
                  <th>Site / Process</th>
                  <th>Stage</th>
                  <th>Readiness</th>
                  <th>Risk</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {filteredEquipment.map((asset) => (
                  <tr
                    key={asset.id}
                    onClick={() => setSelectedId(asset.id)}
                    className={
                      selectedId === asset.id ? "selected-asset-row" : ""
                    }
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div className="asset-name">
                        <span className="asset-icon">▦</span>
                        <div>
                          <strong>{asset.id}</strong>
                          <small>{asset.name}</small>
                          <small>{asset.category}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong>{asset.site}</strong>
                      <br />
                      <small>{asset.process}</small>
                    </td>
                    <td>
                      <span className="stage-pill stage-iq">{asset.stage}</span>
                    </td>
                    <td>
                      <div className="table-progress">
                        <div className="progress-track">
                          <div
                            className="progress-fill rose"
                            style={{ width: `${asset.readiness}%` }}
                          />
                        </div>
                        <span>{asset.readiness}%</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`risk-pill ${
                          asset.risk === "High" ? "risk-high" : "risk-medium"
                        }`}
                      >
                        {asset.risk}
                      </span>
                    </td>
                    <td><span className="soft-badge">{asset.status}</span></td>
                    <td>{asset.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredEquipment.length === 0 && (
              <p className="panel-footnote">
                No matching equipment found. Try another search or filter.
              </p>
            )}
          </div>
          <p className="panel-footnote">
            Sample records only. Select an equipment row to view its profile.
          </p>
        </section>

        <section className="panel lifecycle-panel">
          <div className="panel-heading lifecycle-heading">
            <div>
              <p className="section-kicker">ASSET JOURNEY / QUALIFICATION TRACKING</p>
              <h3>Equipment Lifecycle Journey</h3>
              <p>
                Track the equipment journey from installation through
                qualification and routine operation.
              </p>
            </div>
            <span className="soft-badge">6 milestones</span>
          </div>

          <div className="lifecycle-layout">
            <div className="lifecycle-asset-card">
              <div className="autoclave-visual" aria-label="Autoclave illustration">
                <div className="autoclave-glow" />
                <div className="autoclave-machine">
                  <div className="machine-top">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="machine-body">
                    <div className="machine-display">
                      <i />
                      <i />
                      <i />
                    </div>
                    <div className="machine-door">
                      <div className="door-window">
                        <div className="door-shelf" />
                        <div className="door-shelf" />
                      </div>
                    </div>
                    <div className="machine-controls">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                  <div className="machine-base">
                    <span />
                    <span />
                  </div>
                  <div className="machine-feet">
                    <i />
                    <i />
                  </div>
                </div>
                <span className="visual-label">STERILIZATION EQUIPMENT</span>
              </div>

              <div className="lifecycle-asset-info">
                <span className="soft-badge">SELECTED EQUIPMENT</span>
                <h3>{selectedAsset.name}</h3>
                <p className="lifecycle-asset-id">{selectedAsset.id}</p>

                <div className="lifecycle-info-row">
                  <span>Manufacturer</span>
                  <strong>{selectedAsset.manufacturer}</strong>
                </div>
                <div className="lifecycle-info-row">
                  <span>Installed</span>
                  <strong>{selectedAsset.installed}</strong>
                </div>
                <div className="lifecycle-info-row">
                  <span>Category</span>
                  <strong>{selectedAsset.category}</strong>
                </div>
                <div className="lifecycle-info-row">
                  <span>Current stage</span>
                  <strong>{selectedAsset.stage}</strong>
                </div>

                <div className="lifecycle-readiness">
                  <div>
                    <span>Readiness</span>
                    <strong>{selectedAsset.readiness}%</strong>
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill rose"
                      style={{ width: `${selectedAsset.readiness}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="lifecycle-timeline">
              <div className="timeline-header">
                <div>
                  <span className="section-kicker">LIFECYCLE TIMELINE</span>
                  <h3>Qualification Milestones</h3>
                </div>
                <span className="timeline-progress-label">01 — 06</span>
              </div>

              {[
                {
                  number: "01",
                  title: "Installation",
                  detail: "Equipment installed and registered",
                  state: "completed",
                  label: "Completed",
                },
                {
                  number: "02",
                  title: "URS Requirements",
                  detail: "User requirements documented",
                  state: "completed",
                  label: "Completed",
                },
                {
                  number: "03",
                  title: "DQ Design Review",
                  detail: "Design reviewed against requirements",
                  state: "completed",
                  label: "Completed",
                },
                {
                  number: "04",
                  title: "RTM Traceability",
                  detail: "Requirements mapped to evidence",
                  state: "completed",
                  label: "Completed",
                },
                {
                  number: "05",
                  title: "IQ / OQ / PQ Qualification",
                  detail: "Installation, operation and performance checks",
                  state: "current",
                  label: "In progress",
                },
                {
                  number: "06",
                  title: "Routine Operation",
                  detail: "Maintenance and periodic review",
                  state: "pending",
                  label: "Planned",
                },
              ].map((milestone) => (
                <div
                  className={`lifecycle-step lifecycle-${milestone.state}`}
                  key={milestone.number}
                >
                  <div className="lifecycle-marker">
                    {milestone.state === "completed" ? "✓" : milestone.number}
                  </div>
                  <div className="lifecycle-step-copy">
                    <strong>{milestone.title}</strong>
                    <p>{milestone.detail}</p>
                  </div>
                  <span className="lifecycle-status">{milestone.label}</span>
                </div>
              ))}

              <div className="lifecycle-disclaimer">
                <span>ⓘ</span>
                <p>
                  Illustrative lifecycle milestones and dates are sample UI
                  content. Actual qualification status and approvals must be
                  verified by authorized personnel.
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="overview-grid equipment-detail-grid">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <p className="section-kicker">SELECTED ASSET PROFILE</p>
                <h3>{selectedAsset.id} · {selectedAsset.name}</h3>
                <p>Equipment information and ownership</p>
              </div>
              <span className="stage-pill stage-oq">{selectedAsset.status}</span>
            </div>

            <div className="asset-facts">
              <div><small>Equipment ID</small><strong>{selectedAsset.id}</strong></div>
              <div><small>Category</small><strong>{selectedAsset.category}</strong></div>
              <div><small>Owner</small><strong>{selectedAsset.owner}</strong></div>
              <div><small>Manufacturer</small><strong>{selectedAsset.manufacturer}</strong></div>
              <div><small>Serial Number</small><strong>{selectedAsset.serial}</strong></div>
              <div><small>Installation Date</small><strong>{selectedAsset.installed}</strong></div>
            </div>

            <div className="detail-actions">
              <button
                className="primary-button"
                onClick={() =>
                  setNotice("Equipment profile uses illustrative sample data.")
                }
              >
                View Asset Details
              </button>
              <span className="soft-badge">UI prototype</span>
            </div>
          </section>
          <div className="equipment-side-stack">
            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="section-kicker">DOCUMENTATION</p>
                  <h3>Linked Documents</h3>
                </div>
                <span className="soft-badge">{documentData.length} files</span>
              </div>

              {documentData.map((doc) => (
                <div className="document-row" key={doc.name}>
                  <span className="document-icon">PDF</span>
                  <div>
                    <strong>{doc.name}</strong>
                    <small>{doc.stage} · {doc.size}</small>
                  </div>
                  <small>{doc.date}</small>
                </div>
              ))}

              <p className="panel-footnote">
                Illustrative filenames only. Documents are not uploaded.
              </p>
            </section>

            <section className="panel">
              <div className="panel-heading">
                <div>
                  <p className="section-kicker">QUALITY SUMMARY</p>
                  <h3>Findings & Activity</h3>
                </div>
              </div>

              <div className="finding-summary">
                <div>
                  <span>Open findings</span>
                  <strong>3</strong>
                </div>
                <div>
                  <span>Stages approved</span>
                  <strong>4 / 6</strong>
                </div>
                <div>
                  <span>Review status</span>
                  <strong>{selectedAsset.status}</strong>
                </div>
              </div>

              {[
                ["Qualification review required", "12 Oct"],
                ["Evidence listed", "10 Oct"],
                ["Equipment owner assigned", "04 Oct"],
              ].map((activity) => (
                <div className="timeline-row" key={activity[0]}>
                  <span className="timeline-dot" />
                  <div><strong>{activity[0]}</strong></div>
                  <small>{activity[1]}</small>
                </div>
              ))}
            </section>
          </div>
        </div>
      </div>
    );
  }

  function renderSupportingPanels() {
    return (
      <>
        <div className="overview-grid supporting-grid">
          <section className="panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">ATTENTION REQUIRED</span>
                <h3>Priority Alerts</h3>
                <p>Illustrative review tasks</p>
              </div>
              <span className="alert-count">03</span>
            </div>

            {[
              {
                title: "OQ protocol review",
                detail: "AC-001 · Autoclave",
                level: "High",
                date: "12 Oct",
              },
              {
                title: "RTM gaps to be closed",
                detail: "FU-003 · Filling Unit",
                level: "Medium",
                date: "15 Oct",
              },
              {
                title: "Missing IQ evidence",
                detail: "WFI-004 · Water System",
                level: "Medium",
                date: "18 Oct",
              },
            ].map((alert) => (
              <div className="alert-row" key={alert.title}>
                <span className="alert-symbol">!</span>
                <div className="alert-copy">
                  <strong>{alert.title}</strong>
                  <small>{alert.detail}</small>
                </div>
                <span
                  className={`risk-pill ${
                    alert.level === "High" ? "risk-high" : "risk-medium"
                  }`}
                >
                  {alert.level}
                </span>
                <small className="alert-date">{alert.date}</small>
              </div>
            ))}
          </section>

          <section className="panel">
            <div className="panel-heading">
              <div>
                <span className="section-kicker">QUALITY INDICATORS</span>
                <h3>Compliance Signals</h3>
                <p>Sample document and review indicators</p>
              </div>
            </div>

            <div className="compliance-item">
              <div className="compliance-icon pink-icon">▤</div>
              <div className="compliance-copy">
                <strong>Document traceability</strong>
                <div className="progress-track">
                  <div className="progress-fill rose" style={{ width: "92%" }} />
                </div>
              </div>
              <strong>92%</strong>
            </div>

            <div className="compliance-item">
              <div className="compliance-icon purple-icon">▤</div>
              <div className="compliance-copy">
                <strong>Evidence completeness</strong>
                <div className="progress-track">
                  <div className="progress-fill purple" style={{ width: "76%" }} />
                </div>
              </div>
              <strong>76%</strong>
            </div>

            <div className="compliance-item">
              <div className="compliance-icon amber-icon">!</div>
              <div className="compliance-copy">
                <strong>Overdue reviews</strong>
                <small>Illustrative outstanding count</small>
              </div>
              <strong className="overdue-number">4</strong>
            </div>
          </section>
        </div>

        <section className="panel activity-panel">
          <div className="panel-heading">
            <div>
              <span className="section-kicker">WORKSPACE TIMELINE</span>
              <h3>Recent Activity</h3>
              <p>Example events for visual demonstration</p>
            </div>
          </div>

          {[
            {
              title: "Review accepted for AC-001",
              detail: "OQ protocol · Reviewer workspace",
              time: "12 Oct 2026",
            },
            {
              title: "Qualification document uploaded",
              detail: "IQ_Machine2.pdf · Document Library",
              time: "11 Oct 2026",
            },
            {
              title: "Draft finding added",
              detail: "FU-003 · Review Workspace",
              time: "09 Oct 2026",
            },
          ].map((activity) => (
            <div className="timeline-row" key={activity.title}>
              <span className="timeline-dot" />
              <div>
                <strong>{activity.title}</strong>
                <p>{activity.detail}</p>
              </div>
              <small>{activity.time}</small>
            </div>
          ))}
        </section>
      </>
    );
  }

  function renderPlaceholder(title: string, description: string) {
    return (
      <section className="panel placeholder-panel">
        <span className="placeholder-icon">✦</span>
        <p className="eyebrow">GXP INTELLIGENCE WORKSPACE</p>
        <h2>{title}</h2>
        <p>{description}</p>
        <span className="soft-badge">UI prototype · Sample data</span>
      </section>
    );
  }
  return (
    <div className="app-shell">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-mark">G</div>
            <div>
              <strong>GxP Intelligence</strong>
              <small>Qualification Platform</small>
            </div>
          </div>

          <p className="nav-caption">WORKSPACE</p>

          <nav className="sidebar-nav">
            {navigation.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${
                  page === item.id ? "selected" : ""
                }`}
                onClick={() => {
                  setPage(item.id);
                  setNotice("");
                }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <span className="workspace-icon">✧</span>
            <strong>Demo Workspace</strong>
            <p>Sample data for UI visualization only.</p>
          </div>
        </aside>

        <main className="main-area">
          <header className="topbar">
            <div className="global-search">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  if (page !== "equipment") setPage("equipment");
                }}
                placeholder="Search equipment, documents, or keywords..."
                aria-label="Search workspace"
              />
            </div>

            <div className="topbar-actions">
              <button
                className="icon-button"
                aria-label="Notifications"
                onClick={() =>
                  setNotice(
                    "You are viewing illustrative sample notifications."
                  )
                }
              >
                ♧
              </button>
              <span className="reviewer-badge">◉ &nbsp; Reviewer</span>
            </div>
          </header>

          <div className="page-content">
            {page === "overview" && (
              <>
                {renderOverview()}
                {renderSupportingPanels()}
              </>
            )}

            {page === "equipment" && renderEquipment()}

            {page === "qualification" && <QualificationWorkflow />}

            {page === "documents" && <DocumentLibrary />}

            {page === "reviews" && <ReviewWorkspace />}

            {page === "audit" && <AuditTrial />}

            {page === "reports" && <Reports />}
            {page === "settings" && <Settings />}

            {notice && (
              <div className="notice-message">
                <span>{notice}</span>
                <button onClick={() => setNotice("")}>Dismiss</button>
              </div>
            )}
          </div>
        </main>
      </div>
    );
}

export default App;