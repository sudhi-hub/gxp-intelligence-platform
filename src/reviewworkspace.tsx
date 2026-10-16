import { useMemo, useState } from "react";
import "./reviewworkspace.css";

type FindingStatus = "Pending" | "Accepted" | "Rejected";
type FilterType = "All" | FindingStatus;

type Finding = {
  id: string;
  title: string;
  description: string;
  equipment: string;
  category: string;
  severity: string;
  status: FindingStatus;
  document: string;
  page: number;
  reference: string;
  comment: string;
};

const initialFindings: Finding[] = [
  {
    id: "F-101",
    title: "Calibration certificate overdue",
    description:
      "The calibration certificate for the pressure sensor requires verification.",
    equipment: "EQ-001",
    category: "Instrumentation",
    severity: "Major",
    status: "Pending",
    document: "Calibration_Certificate.pdf",
    page: 8,
    reference: "CAL-SOP-004",
    comment: "",
  },
  {
    id: "F-102",
    title: "SOP reference mismatch in OQ report",
    description:
      "The OQ report references SOP-QC-001, but the latest SOP version is SOP-QC-002.",
    equipment: "EQ-002",
    category: "Documentation",
    severity: "Minor",
    status: "Accepted",
    document: "OQ_Machine2_v2.pdf",
    page: 14,
    reference: "SOP-QC-002",
    comment: "SOP reference verified.",
  },
  {
    id: "F-103",
    title: "Incomplete signature on IQ protocol",
    description:
      "The required approval signature is missing from the IQ protocol.",
    equipment: "EQ-003",
    category: "Documentation",
    severity: "Major",
    status: "Pending",
    document: "IQ_Protocol_v1.pdf",
    page: 12,
    reference: "SOP-QC-003",
    comment: "",
  },
  {
    id: "F-104",
    title: "Test result out of specification",
    description:
      "One test result requires comparison against the approved specification.",
    equipment: "EQ-004",
    category: "Testing",
    severity: "Minor",
    status: "Accepted",
    document: "OQ_Test_Results.pdf",
    page: 6,
    reference: "OQ-SPEC-002",
    comment: "Result checked against the specification.",
  },
  {
    id: "F-105",
    title: "Equipment ID mismatch with URS",
    description:
      "The equipment identifier differs between the URS and supporting report.",
    equipment: "EQ-001",
    category: "Documentation",
    severity: "Observation",
    status: "Rejected",
    document: "URS_Machine1.pdf",
    page: 4,
    reference: "URS-001",
    comment: "Finding requires correction.",
  },
  {
    id: "F-106",
    title: "Missing annexure in PQ report",
    description:
      "A referenced annexure is not present in the performance qualification report.",
    equipment: "EQ-006",
    category: "Documentation",
    severity: "Minor",
    status: "Pending",
    document: "PQ_Report.pdf",
    page: 20,
    reference: "PQ-SOP-001",
    comment: "",
  },
];

export default function ReviewWorkspace() {
  const [findings, setFindings] = useState(initialFindings);
  const [selectedId, setSelectedId] = useState("F-103");
  const [filter, setFilter] = useState<FilterType>("All");
  const [search, setSearch] = useState("");
  const [comment, setComment] = useState("");
  const [notice, setNotice] = useState("");

  const selected =
    findings.find((finding) => finding.id === selectedId) ?? findings[0];

  const filteredFindings = useMemo(() => {
    const query = search.toLowerCase();

    return findings.filter((finding) => {
      const matchesFilter =
        filter === "All" || finding.status === filter;

      const matchesSearch = [
        finding.id,
        finding.title,
        finding.equipment,
        finding.document,
      ].some((value) => value.toLowerCase().includes(query));

      return matchesFilter && matchesSearch;
    });
  }, [findings, filter, search]);

  const pendingCount = findings.filter(
    (finding) => finding.status === "Pending"
  ).length;

  const acceptedCount = findings.filter(
    (finding) => finding.status === "Accepted"
  ).length;

  const rejectedCount = findings.filter(
    (finding) => finding.status === "Rejected"
  ).length;

  function updateStatus(status: FindingStatus) {
    if (!selected) return;

    setFindings((previous) =>
      previous.map((finding) =>
        finding.id === selected.id
          ? {
              ...finding,
              status,
              comment: comment.trim() || finding.comment,
            }
          : finding
      )
    );

    setNotice(`${selected.id} marked as ${status}.`);
    setComment("");
  }

  function saveComment() {
    if (!comment.trim() || !selected) {
      setNotice("Enter a comment before saving.");
      return;
    }

    setFindings((previous) =>
      previous.map((finding) =>
        finding.id === selected.id
          ? { ...finding, comment: comment.trim() }
          : finding
      )
    );

    setComment("");
    setNotice(`Comment saved for ${selected.id}.`);
  }

  return (
    <main className="rw-page">
      <header className="rw-header">
        <div>
          <span className="rw-eyebrow">QUALITY ASSURANCE</span>
          <h1>Review Workspace</h1>
          <p>
            Review draft findings, compare source evidence and record decisions.
          </p>
        </div>

        <div className="rw-header-right">
          <span className="rw-role">● Reviewer workspace</span>
          <span className="rw-avatar">U1</span>
        </div>
      </header>

      <label className="rw-search">
        <span>⌕</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search findings, equipment or documents..."
        />
      </label>

      <section className="rw-stats">
        <article className="rw-stat">
          <span className="rw-stat-icon purple">▤</span>
          <div>
            <p>Total findings</p>
            <strong>{findings.length}</strong>
            <small>Across all equipment</small>
          </div>
        </article>

        <article className="rw-stat">
          <span className="rw-stat-icon orange">◷</span>
          <div>
            <p>Pending</p>
            <strong>{pendingCount}</strong>
            <small>Need review</small>
          </div>
        </article>

        <article className="rw-stat">
          <span className="rw-stat-icon green">✓</span>
          <div>
            <p>Accepted</p>
            <strong>{acceptedCount}</strong>
            <small>Accepted findings</small>
          </div>
        </article>

        <article className="rw-stat">
          <span className="rw-stat-icon pink">×</span>
          <div>
            <p>Rejected</p>
            <strong>{rejectedCount}</strong>
            <small>Require rework</small>
          </div>
        </article>
      </section>

      <section className="rw-workspace">
        {/* LEFT: FINDINGS */}
        <article className="rw-card rw-findings">
          <div className="rw-card-heading">
            <div>
              <h2>Draft Findings</h2>
              <p>Select a finding to inspect its evidence.</p>
            </div>
            <span className="rw-count">{filteredFindings.length}</span>
          </div>

          <div className="rw-filters">
            {(["All", "Pending", "Accepted", "Rejected"] as FilterType[]).map(
              (item) => (
                <button
                  key={item}
                  className={filter === item ? "rw-filter active" : "rw-filter"}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              )
            )}
          </div>

          <div className="rw-finding-list">
            {filteredFindings.map((finding) => (
              <button
                key={finding.id}
                className={
                  selectedId === finding.id
                    ? "rw-finding selected"
                    : "rw-finding"
                }
                onClick={() => {
                  setSelectedId(finding.id);
                  setComment("");
                  setNotice("");
                }}
              >
                <span className="rw-file-icon">▤</span>

                <span className="rw-finding-copy">
                  <span className="rw-finding-top">
                    <strong>{finding.id}</strong>
                    <span
                      className={`rw-badge rw-${finding.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {finding.status}
                    </span>
                  </span>

                  <span className="rw-finding-title">{finding.title}</span>
                  <small>
                    {finding.equipment} · {finding.category}
                  </small>
                </span>

                <span className="rw-chevron">›</span>
              </button>
            ))}

            {filteredFindings.length === 0 && (
              <p className="rw-empty">No matching findings.</p>
            )}
          </div>

          <div className="rw-progress-footer">
            <span>Review progress</span>
            <strong>
              {findings.length - pendingCount} / {findings.length}
            </strong>
            <div className="rw-progress-track">
              <span
                style={{
                  width: `${
                    ((findings.length - pendingCount) / findings.length) * 100
                  }%`,
                }}
              />
            </div>
          </div>
        </article>

        {/* MIDDLE: FINDING DETAILS */}
        {selected && (
          <article className="rw-card rw-detail">
            <div className="rw-card-heading">
              <div>
                <span className="rw-eyebrow">SELECTED FINDING</span>
                <h2>{selected.id}</h2>
              </div>

              <span
                className={`rw-badge rw-${selected.status
                  .toLowerCase()
                  .replace(" ", "-")}`}
              >
                {selected.status}
              </span>
            </div>

            <h3 className="rw-detail-title">{selected.title}</h3>

            <div className="rw-metadata">
              <div>
                <small>Equipment ID</small>
                <strong>{selected.equipment}</strong>
              </div>
              <div>
                <small>Category</small>
                <strong>{selected.category}</strong>
              </div>
              <div>
                <small>Severity</small>
                <strong>{selected.severity}</strong>
              </div>
              <div>
                <small>Source page</small>
                <strong>{selected.page}</strong>
              </div>
            </div>

            <div className="rw-section">
              <h3>Finding description</h3>
              <p className="rw-description">{selected.description}</p>
            </div>

            <div className="rw-evidence-reference">
              <span className="rw-reference-icon">PDF</span>
              <div>
                <strong>{selected.document}</strong>
                <small>
                  Page {selected.page} · Ref: {selected.reference}
                </small>
              </div>
              <span className="rw-reference-tag">Linked</span>
            </div>

            <div className="rw-section">
              <h3>Reviewer comments</h3>
              {selected.comment && (
                <div className="rw-existing-comment">
                  <span className="rw-comment-avatar">U1</span>
                  <div>
                    <strong>Previous comment</strong>
                    <p>{selected.comment}</p>
                  </div>
                </div>
              )}

              <textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Add a review comment..."
                rows={3}
                maxLength={500}
              />

              <div className="rw-comment-footer">
                <small>{comment.length}/500 characters</small>
                <button className="rw-save-comment" onClick={saveComment}>
                  Save comment
                </button>
              </div>
            </div>

            <div className="rw-section">
              <h3>Reviewer action</h3>
              <div className="rw-actions">
                <button
                  className="rw-action accept"
                  onClick={() => updateStatus("Accepted")}
                >
                  ✓ Accept
                </button>
                <button
                  className="rw-action edit"
                  onClick={() =>
                    setNotice(
                      "Edit the finding description in your approved workflow."
                    )
                  }
                >
                  ✎ Edit
                </button>
                <button
                  className="rw-action reject"
                  onClick={() => updateStatus("Rejected")}
                >
                  × Reject
                </button>
              </div>
            </div>

            <div className="rw-audit-note">
              <span>ⓘ</span>
              <p>
                This demo updates the page locally. It does not create a
                regulated approval or audit record.
              </p>
            </div>
          </article>
        )}

        {/* RIGHT: SOURCE EVIDENCE */}
        {selected && (
          <aside className="rw-card rw-source">
            <div className="rw-card-heading">
              <div>
                <h2>Source Evidence</h2>
                <p>Document reference and review insights</p>
              </div>
              <span className="rw-page-number">Page {selected.page}</span>
            </div>

            <div className="rw-pdf-toolbar">
              <span>PDF</span>
              <span>{selected.page} / 32</span>
              <span>−</span>
              <strong>100%</strong>
              <span>+</span>
              <span>⛶</span>
            </div>

            <div className="rw-pdf-page">
              <div className="rw-pdf-brand">
                <strong>GxP QUALITY</strong>
                <span>CONTROLLED COPY</span>
              </div>

              <div className="rw-pdf-rule" />

              <h3>Source Document</h3>
              <p className="rw-pdf-subtitle">{selected.document}</p>

              <div className="rw-pdf-section">
                <strong>
                  {selected.page}. {selected.category}
                </strong>
              </div>

              {Array.from({ length: 4 }).map((_, index) => (
                <div className="rw-pdf-lines" key={index}>
                  <span />
                  <span />
                  <span className={index % 2 === 0 ? "short" : "medium"} />
                </div>
              ))}

              <div className="rw-pdf-highlight">
                <strong>Finding reference</strong>
                <p>{selected.description}</p>
              </div>

              {Array.from({ length: 3 }).map((_, index) => (
                <div className="rw-pdf-lines" key={`bottom-${index}`}>
                  <span />
                  <span className="medium" />
                </div>
              ))}

              <div className="rw-pdf-page-footer">
                Illustrative document preview · Page {selected.page}
              </div>
            </div>

            <div className="rw-insights">
              <div className="rw-insights-heading">
                <span className="rw-insights-icon">✦</span>
                <div>
                  <h3>Source Evidence Insights</h3>
                  <p>Context for reviewer verification</p>
                </div>
                <span className="rw-demo-tag">DEMO</span>
              </div>

              <div className="rw-insight-item">
                <span className="rw-insight-icon purple">▤</span>
                <div>
                  <strong>Highlighted evidence</strong>
                  <p>
                    Page {selected.page} · {selected.category}
                  </p>
                  <small>{selected.description}</small>
                </div>
              </div>

              <div className="rw-insight-item">
                <span className="rw-insight-icon orange">↗</span>
                <div>
                  <strong>Requirement reference</strong>
                  <p>{selected.reference}</p>
                  <small>Verify against the approved requirement.</small>
                </div>
              </div>

              <div className="rw-insight-item">
                <span className="rw-insight-icon pink">!</span>
                <div>
                  <strong>Reviewer attention</strong>
                  <p>
                    {selected.status === "Pending"
                      ? "Verification required"
                      : selected.status === "Accepted"
                      ? "Marked accepted in demo"
                      : "Rework indicated in demo"}
                  </p>
                  <small>
                    Confirm the source document before making a final decision.
                  </small>
                </div>
              </div>

              <p className="rw-insights-disclaimer">
                These insights use sample data. No automatic PDF analysis is
                performed.
              </p>
            </div>
          </aside>
        )}
      </section>

      {/* REVIEW HISTORY */}
      <section className="rw-card rw-history">
        <div className="rw-card-heading">
          <div>
            <h2>Review History</h2>
            <p>Current sample status of each finding</p>
          </div>
          <span className="rw-count">{findings.length} records</span>
        </div>

        <div className="rw-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Finding ID</th>
                <th>Equipment</th>
                <th>Finding</th>
                <th>Decision</th>
                <th>Reviewer comment</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((finding) => (
                <tr key={finding.id}>
                  <td>
                    <button
                      className="rw-table-link"
                      onClick={() => {
                        setSelectedId(finding.id);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      {finding.id}
                    </button>
                  </td>
                  <td>{finding.equipment}</td>
                  <td>{finding.title}</td>
                  <td>
                    <span
                      className={`rw-badge rw-${finding.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {finding.status}
                    </span>
                  </td>
                  <td>{finding.comment || "No comment added"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {notice && (
        <div className="rw-toast">
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>Dismiss ×</button>
        </div>
      )}

      <footer className="rw-disclaimer">
        Demo interface only. Review decisions and sample data are not saved
        to a backend. Actual GxP decisions must follow approved procedures.
      </footer>
    </main>
  );
}