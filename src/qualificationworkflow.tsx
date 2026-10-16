import { useState } from "react";
import "./qualificationworkflow.css";

type TestStatus = "Completed" | "In progress" | "Pending" | "Failed";
type FindingStatus = "Pending" | "Accepted" | "Edited";

const stages = [
  { name: "URS", full: "User Requirements Specification", status: "Approved" },
  { name: "DQ", full: "Design Qualification", status: "Approved" },
  { name: "RTM", full: "Traceability Matrix", status: "Approved" },
  { name: "IQ", full: "Installation Qualification", status: "Approved" },
  { name: "OQ", full: "Operational Qualification", status: "In review" },
  { name: "PQ", full: "Performance Qualification", status: "Not started" },
];

const initialTests = [
  { id: "OQ-001", name: "Temperature uniformity", status: "Completed" as TestStatus, date: "10 Oct 2026" },
  { id: "OQ-002", name: "Pressure accuracy", status: "In progress" as TestStatus, date: "12 Oct 2026" },
  { id: "OQ-003", name: "Cycle time verification", status: "Pending" as TestStatus, date: "—" },
  { id: "OQ-004", name: "Alarm & safety functions", status: "Failed" as TestStatus, date: "09 Oct 2026" },
  { id: "OQ-005", name: "Load performance", status: "Completed" as TestStatus, date: "08 Oct 2026" },
];

const initialFindings = [
  { id: "F-101", description: "Chamber temperature deviation", severity: "Major", status: "Pending" as FindingStatus },
  { id: "F-102", description: "Pressure fluctuation observed", severity: "Minor", status: "Accepted" as FindingStatus },
  { id: "F-103", description: "Door gasket leakage", severity: "Major", status: "Pending" as FindingStatus },
  { id: "F-104", description: "Cycle time variation", severity: "Minor", status: "Edited" as FindingStatus },
  { id: "F-105", description: "Alarm response delay", severity: "Info", status: "Accepted" as FindingStatus },
];

const initialDocuments = [
  { name: "OQ Protocol v2", type: "Protocol", date: "10 Oct 2026", status: "Approved" },
  { name: "OQ Test Results", type: "Report", date: "12 Oct 2026", status: "In review" },
  { name: "Calibration Certificate", type: "Certificate", date: "08 Oct 2026", status: "Approved" },
  { name: "Deviation Report", type: "Report", date: "11 Oct 2026", status: "Pending" },
  { name: "Summary Report", type: "Report", date: "—", status: "Not uploaded" },
];

function QualificationWorkflow() {
  const [selectedStage, setSelectedStage] = useState("OQ");
  const [tests, setTests] = useState(initialTests);
  const [findings, setFindings] = useState(initialFindings);
  const [documents, setDocuments] = useState(initialDocuments);
  const [showAddFinding, setShowAddFinding] = useState(false);
  const [findingText, setFindingText] = useState("");
  const [notice, setNotice] = useState("");

  const completed = tests.filter((test) => test.status === "Completed").length;
  const inProgress = tests.filter((test) => test.status === "In progress").length;
  const pending = tests.filter((test) => test.status === "Pending").length;
  const failed = tests.filter((test) => test.status === "Failed").length;
  const testCompletion = Math.round((completed / tests.length) * 100);

  function updateTestStatus(id: string, status: TestStatus) {
    setTests((previous) =>
      previous.map((test) =>
        test.id === id
          ? {
              ...test,
              status,
              date: new Date().toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              }),
            }
          : test
      )
    );
    setNotice("Test status updated in this demo.");
  }

  function addFinding() {
    if (!findingText.trim()) {
      setNotice("Please enter a finding description.");
      return;
    }

    setFindings((previous) => [
      ...previous,
      {
        id: `F-${101 + previous.length}`,
        description: findingText.trim(),
        severity: "Minor",
        status: "Pending" as FindingStatus,
      },
    ]);

    setFindingText("");
    setShowAddFinding(false);
    setNotice("Finding added to the demo.");
  }

  function updateFindingStatus(id: string, status: FindingStatus) {
    setFindings((previous) =>
      previous.map((finding) =>
        finding.id === id ? { ...finding, status } : finding
      )
    );
    setNotice("Finding status updated in this demo.");
  }

  function handleDocumentUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    const file = event.target.files?.[0];
    if (!file) return;

    setDocuments((previous) =>
      previous.map((document, i) =>
        i === index
          ? { ...document, name: file.name, status: "Uploaded", date: "Just now" }
          : document
      )
    );

    setNotice(
      `${file.name} selected. This demo does not upload it to a server.`
    );
    event.target.value = "";
  }

  return (
    <div className="qw-page">
      <div className="qw-heading">
        <div>
          <p className="qw-eyebrow">QUALIFICATION MANAGEMENT</p>
          <h1>Qualification Workflow</h1>
          <p>Track, review and manage equipment qualification stages and evidence.</p>
        </div>
        <span className="qw-connection">
          <span className="qw-connection-dot" />
          Demo workspace
        </span>
      </div>

      <section className="qw-card qw-asset-banner">
        <div className="qw-equipment-icon">♨</div>
        <div className="qw-asset-main">
          <span className="qw-eyebrow">SELECTED EQUIPMENT</span>
          <h2>AC-001 · Double-Door Autoclave</h2>
          <div className="qw-asset-meta">
            <div><small>Manufacturer</small><strong>Getinge</strong></div>
            <div><small>Category</small><strong>Sterilization</strong></div>
            <div><small>Serial Number</small><strong>SN-001</strong></div>
            <div><small>Installation Date</small><strong>14 Mar 2025</strong></div>
          </div>
        </div>
        <div className="qw-readiness">
          <span>Overall readiness</span>
          <strong>72%</strong>
          <div className="qw-progress"><span style={{ width: "72%" }} /></div>
        </div>
      </section>

      <section className="qw-card qw-stages-section">
        <div className="qw-section-heading">
          <div>
            <h2>Qualification Stages</h2>
            <p>Choose a stage to view its progress.</p>
          </div>
          <span className="qw-small-badge">4 of 6 stages approved</span>
        </div>

        <div className="qw-stage-grid">
          {stages.map((stage) => (
            <button
              key={stage.name}
              className={`qw-stage ${
                stage.status === "Approved" ? "qw-stage-approved" : ""
              } ${
                stage.status === "In review" ? "qw-stage-current" : ""
              } ${
                selectedStage === stage.name ? "qw-stage-selected" : ""
              }`}
              onClick={() => setSelectedStage(stage.name)}
            >
              <span className="qw-stage-icon">
                {stage.status === "Approved"
                  ? "✓"
                  : stage.status === "In review"
                  ? "◷"
                  : "○"}
              </span>
              <strong>{stage.name}</strong>
              <small>{stage.full}</small>
              <span className="qw-stage-status">{stage.status}</span>
            </button>
          ))}
        </div>
      </section>
      <div className="qw-main-grid">
        <section className="qw-card qw-test-progress">
          <div className="qw-section-heading">
            <div>
              <h2>{selectedStage} Test Progress</h2>
              <p>Illustrative test execution summary</p>
            </div>
          </div>

          <div className="qw-chart-row">
            <div
              className="qw-donut"
              style={{
                background: `conic-gradient(#a855f7 ${testCompletion}%, #eadff4 ${testCompletion}% 100%)`,
              }}
            >
              <div>
                <strong>{testCompletion}%</strong>
                <small>Completed</small>
              </div>
            </div>

            <div className="qw-legend">
              <p><i className="qw-dot qw-green" />{completed} Completed</p>
              <p><i className="qw-dot qw-pink" />{inProgress} In progress</p>
              <p><i className="qw-dot qw-grey" />{pending} Pending</p>
              <p><i className="qw-dot qw-red" />{failed} Failed</p>
            </div>
          </div>

          <p className="qw-note">Test results shown here are local demo data.</p>
        </section>

        <section className="qw-card qw-tests-table">
          <div className="qw-section-heading">
            <div>
              <h2>Test Execution Details</h2>
              <p>Update a test status to see the summary change.</p>
            </div>
          </div>

          <div className="qw-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Test ID</th>
                  <th>Test Name</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tests.map((test) => (
                  <tr key={test.id}>
                    <td>{test.id}</td>
                    <td>{test.name}</td>
                    <td>
                      <select
                        className={`qw-status-select qw-status-${test.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                        value={test.status}
                        onChange={(event) =>
                          updateTestStatus(
                            test.id,
                            event.target.value as TestStatus
                          )
                        }
                        aria-label={`Status for ${test.id}`}
                      >
                        <option>Completed</option>
                        <option>In progress</option>
                        <option>Pending</option>
                        <option>Failed</option>
                      </select>
                    </td>
                    <td>
                      <button
                        className="qw-text-button"
                        onClick={() =>
                          setNotice(`${test.id}: ${test.name} · ${test.date}`)
                        }
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="qw-card qw-assessment">
          <div className="qw-section-heading">
            <div>
              <h2>Assessment Summary</h2>
              <p>Calculated from test status</p>
            </div>
          </div>

          <div className="qw-assessment-number">
            <span>Total Tests</span><strong>{tests.length}</strong>
          </div>
          <div className="qw-assessment-number">
            <span>Completed</span><strong className="qw-text-green">{completed}</strong>
          </div>
          <div className="qw-assessment-number">
            <span>In Progress</span><strong>{inProgress}</strong>
          </div>
          <div className="qw-assessment-number">
            <span>Pending</span><strong>{pending}</strong>
          </div>
          <div className="qw-assessment-number">
            <span>Failed</span><strong className="qw-text-red">{failed}</strong>
          </div>
          <div className="qw-result">
            <span>Overall result</span>
            <strong>
              {failed > 0
                ? "Review required"
                : pending > 0
                ? "In progress"
                : "Ready for review"}
            </strong>
          </div>
        </section>
      </div>

      <div className="qw-bottom-grid">
        <section className="qw-card">
          <div className="qw-section-heading">
            <div>
              <h2>Required Documents</h2>
              <p>Sample qualification evidence</p>
            </div>
          </div>

          <div className="qw-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc, index) => (
                  <tr key={`${doc.name}-${index}`}>
                    <td>{doc.name}</td>
                    <td>{doc.type}</td>
                    <td><span className="qw-document-status">{doc.status}</span></td>
                    <td>
                      {doc.status === "Not uploaded" || doc.status === "Pending" ? (
                        <label className="qw-upload-button">
                          Upload
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xlsx"
                            onChange={(event) => handleDocumentUpload(event, index)}
                            hidden
                          />
                        </label>
                      ) : (
                        <button
                          className="qw-text-button"
                          onClick={() => setNotice(`${doc.name} is sample document data.`)}
                        >
                          View
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="qw-card qw-findings">
          <div className="qw-section-heading">
            <div>
              <h2>Draft Findings for OQ</h2>
              <p>Track and update review findings</p>
            </div>
            <button
              className="qw-primary-button"
              onClick={() => setShowAddFinding((value) => !value)}
            >
              + Add Finding
            </button>
          </div>

          {showAddFinding && (
            <form
              className="qw-add-finding"
              onSubmit={(event) => {
                event.preventDefault();
                addFinding();
              }}
            >
              <input
                value={findingText}
                onChange={(event) => setFindingText(event.target.value)}
                placeholder="Describe the finding..."
                aria-label="Finding description"
              />
              <button type="submit" className="qw-primary-button">Save</button>
            </form>
          )}

          <div className="qw-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Finding</th>
                  <th>Severity</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {findings.map((finding) => (
                  <tr key={finding.id}>
                    <td>{finding.id}</td>
                    <td>{finding.description}</td>
                    <td>
                      <span className={`qw-severity qw-severity-${finding.severity.toLowerCase()}`}>
                        {finding.severity}
                      </span>
                    </td>
                    <td>
                      <select
                        className="qw-finding-select"
                        value={finding.status}
                        onChange={(event) =>
                          updateFindingStatus(
                            finding.id,
                            event.target.value as FindingStatus
                          )
                        }
                        aria-label={`Finding status for ${finding.id}`}
                      >
                        <option>Pending</option>
                        <option>Accepted</option>
                        <option>Edited</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
      {/* Qualification Analytics */}
      <section className="qw-card qw-analytics-section">
        <div className="qw-section-heading">
          <div>
            <p className="qw-eyebrow">PERFORMANCE INSIGHTS</p>
            <h2>Qualification Analytics</h2>
            <p>Monitor stage completion, test outcomes and quality findings.</p>
          </div>
          <span className="qw-small-badge">Demo data</span>
        </div>

        <div className="qw-analytics-grid">
          {/* Qualification Stage Progress */}
          <div className="qw-analytics-card">
            <h2>Qualification Stage Progress</h2>
            <p>Completion across the six qualification stages</p>

            <div className="qw-horizontal-chart">
              {[
                { label: "URS", value: 100 },
                { label: "DQ", value: 100 },
                { label: "RTM", value: 100 },
                { label: "IQ", value: 100 },
                { label: "OQ", value: 40 },
                { label: "PQ", value: 0 },
              ].map((item) => (
                <div className="qw-chart-bar-row" key={item.label}>
                  <span>{item.label}</span>
                  <div className="qw-chart-bar-track">
                    <div
                      className="qw-chart-bar-fill"
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>

          {/* Test Execution Status */}
          <div className="qw-analytics-card">
            <h2>Test Execution Status</h2>
            <p>Distribution of current test results</p>

            <div className="qw-status-chart">
              <div
                className="qw-status-donut"
                style={{
                  background: `conic-gradient(
                    #7138c8 0% ${(completed / Math.max(tests.length, 1)) * 100}%,
                    #d94691 ${(completed / Math.max(tests.length, 1)) * 100}% ${
                      ((completed + inProgress) / Math.max(tests.length, 1)) * 100
                    }%,
                    #c8bfd4 ${
                      ((completed + inProgress) / Math.max(tests.length, 1)) * 100
                    }% ${
                      ((completed + inProgress + pending) / Math.max(tests.length, 1)) * 100
                    }%,
                    #e05265 ${
                      ((completed + inProgress + pending) / Math.max(tests.length, 1)) * 100
                    }% 100%
                  )`,
                }}
              >
                <div>
                  <strong>{tests.length}</strong>
                  <span>Total tests</span>
                </div>
              </div>

              <div className="qw-status-legend">
                <div><i className="qw-legend-complete" />Completed <strong>{completed}</strong></div>
                <div><i className="qw-legend-progress" />In progress <strong>{inProgress}</strong></div>
                <div><i className="qw-legend-pending" />Pending <strong>{pending}</strong></div>
                <div><i className="qw-legend-failed" />Failed <strong>{failed}</strong></div>
              </div>
            </div>
          </div>

          {/* New section: Open Findings & Review Priorities */}
          <div className="qw-analytics-card qw-analytics-wide">
            <div className="qw-section-heading">
              <div>
                <h2>Open Findings &amp; Review Priorities</h2>
                <p>Identify quality issues requiring reviewer attention.</p>
              </div>
              <span className="qw-small-badge">
                {findings.filter((f) => f.status === "Pending").length} pending
              </span>
            </div>

            <div className="qw-priority-summary">
              {[
                {
                  label: "Major",
                  color: "#d9485f",
                  background: "#fff0f2",
                  count: findings.filter((f) => f.severity === "Major").length,
                },
                {
                  label: "Minor",
                  color: "#c73587",
                  background: "#fff0f7",
                  count: findings.filter((f) => f.severity === "Minor").length,
                },
                {
                  label: "Info",
                  color: "#7541c8",
                  background: "#f3edff",
                  count: findings.filter((f) => f.severity === "Info").length,
                },
              ].map((item) => (
                <div
                  className="qw-priority-card"
                  key={item.label}
                  style={{ background: item.background }}
                >
                  <span style={{ color: item.color }}>{item.label} severity</span>
                  <strong style={{ color: item.color }}>{item.count}</strong>
                  <small>Findings</small>
                </div>
              ))}
            </div>

            <div className="qw-priority-list">
              {findings
                .filter((finding) => finding.status === "Pending")
                .sort((a, b) =>
                  a.severity === "Major" && b.severity !== "Major"
                    ? -1
                    : b.severity === "Major" && a.severity !== "Major"
                    ? 1
                    : 0
                )
                .map((finding) => (
                  <div className="qw-priority-item" key={finding.id}>
                    <div
                      className={`qw-priority-icon ${
                        finding.severity === "Major"
                          ? "qw-priority-major"
                          : finding.severity === "Minor"
                          ? "qw-priority-minor"
                          : "qw-priority-info"
                      }`}
                    >
                      !
                    </div>

                    <div className="qw-priority-details">
                      <strong>{finding.id} · {finding.description}</strong>
                      <span>
                        {finding.severity} severity · Awaiting review
                      </span>
                    </div>

                    <span
                      className={`qw-priority-badge ${
                        finding.severity === "Major"
                          ? "qw-badge-major"
                          : finding.severity === "Minor"
                          ? "qw-badge-minor"
                          : "qw-badge-info"
                      }`}
                    >
                      {finding.severity}
                    </span>
                  </div>
                ))}

              {findings.filter((f) => f.status === "Pending").length === 0 && (
                <p className="qw-no-priorities">
                  No pending findings in the current sample data.
                </p>
              )}
            </div>

            <p className="qw-chart-note">
              Illustrative sample data. Authorized personnel must verify
              findings and their disposition against approved quality records.
            </p>
          </div>
        </div>
      </section>

      {notice && (
        <div className="qw-notice" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>Dismiss</button>
        </div>
      )}

      <p className="qw-disclaimer">
        Demo interface only. Changes are held in browser memory and are not
        saved to a backend. Actual qualification approvals must be verified by
        authorized personnel.
      </p>
    </div>
  );
}

export default QualificationWorkflow;