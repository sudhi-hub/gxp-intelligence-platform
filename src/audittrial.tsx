import { useMemo, useState } from "react";
import "./audittrial.css";

type AuditEvent = {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  action: string;
  object: string;
  details: string;
  equipment: string;
  document?: string;
  previousStatus?: string;
  newStatus?: string;
  comment?: string;
};

const initialEvents: AuditEvent[] = [
  {
    id: "AT-2026-1042",
    timestamp: "13 Oct 2026 10:42",
    user: "User 1",
    role: "Reviewer",
    action: "Accepted",
    object: "F-102 / EQ-001",
    details: "Finding accepted with no changes",
    equipment: "EQ-001",
    previousStatus: "Pending",
    newStatus: "Accepted",
    document: "Calibration_Certificate.pdf",
    comment: "No additional comments.",
  },
  {
    id: "AT-2026-1041",
    timestamp: "13 Oct 2026 10:38",
    user: "User 2",
    role: "Author",
    action: "Commented",
    object: "F-103",
    details: "Review comment added",
    equipment: "EQ-003",
    comment: "Please verify the source evidence.",
  },
  {
    id: "AT-2026-1040",
    timestamp: "13 Oct 2026 09:54",
    user: "User 1",
    role: "Author",
    action: "Uploaded",
    object: "IQ_Machine1.pdf",
    details: "Document uploaded (Version 2.0)",
    equipment: "EQ-001",
    document: "IQ_Machine1.pdf",
  },
  {
    id: "AT-2026-1039",
    timestamp: "12 Oct 2026 17:20",
    user: "User 3",
    role: "Reviewer",
    action: "Edited",
    object: "F-098 / EQ-004",
    details: "Draft finding description updated",
    equipment: "EQ-004",
  },
  {
    id: "AT-2026-1038",
    timestamp: "12 Oct 2026 16:05",
    user: "User 1",
    role: "Approver",
    action: "Rejected",
    object: "F-091 / EQ-005",
    details: "Evidence not on the cited page",
    equipment: "EQ-005",
    previousStatus: "Pending",
    newStatus: "Rejected",
    comment: "Evidence needs to be checked again.",
  },
  {
    id: "AT-2026-1037",
    timestamp: "12 Oct 2026 14:30",
    user: "User 2",
    role: "Author",
    action: "Status Changed",
    object: "EQ-001",
    details: "Equipment status changed to In Review",
    equipment: "EQ-001",
    previousStatus: "Pending",
    newStatus: "In Review",
  },
  {
    id: "AT-2026-1036",
    timestamp: "12 Oct 2026 11:02",
    user: "User 4",
    role: "Admin",
    action: "Edited",
    object: "User: User 3",
    details: "Author changed to Reviewer",
    equipment: "All equipment",
  },
  {
    id: "AT-2026-1035",
    timestamp: "11 Oct 2026 15:48",
    user: "User 2",
    role: "Author",
    action: "Uploaded",
    object: "IQ_Protocol_v1.pdf",
    details: "New version of IQ protocol",
    equipment: "EQ-002",
    document: "IQ_Protocol_v1.pdf",
  },
  {
    id: "AT-2026-1034",
    timestamp: "11 Oct 2026 16:12",
    user: "User 1",
    role: "Reviewer",
    action: "Accepted",
    object: "F-087 / EQ-003",
    details: "Finding accepted",
    equipment: "EQ-003",
    previousStatus: "Pending",
    newStatus: "Accepted",
  },
  {
    id: "AT-2026-1033",
    timestamp: "10 Oct 2026 16:40",
    user: "User 3",
    role: "Approver",
    action: "Accepted",
    object: "F-084 / EQ-003",
    details: "Finding accepted",
    equipment: "EQ-003",
    previousStatus: "Pending",
    newStatus: "Accepted",
  },
  {
    id: "AT-2026-1032",
    timestamp: "10 Oct 2026 09:05",
    user: "User 4",
    role: "Admin",
    action: "Login",
    object: "System",
    details: "Session started",
    equipment: "All equipment",
  },
  {
    id: "AT-2026-1031",
    timestamp: "09 Oct 2026 14:20",
    user: "User 2",
    role: "Author",
    action: "Uploaded",
    object: "OQ_Machine2.pdf",
    details: "Qualification document uploaded",
    equipment: "EQ-002",
    document: "OQ_Machine2.pdf",
  },
];

export default function AuditTrail() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedId, setSelectedId] = useState(initialEvents[0].id);
  const [dateRange, setDateRange] = useState("Last 7 days");
  const [userFilter, setUserFilter] = useState("All users");
  const [actionFilter, setActionFilter] = useState("All actions");
  const [equipmentFilter, setEquipmentFilter] =
    useState("All equipment");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState("");

  const selected =
    events.find((event) => event.id === selectedId) ?? events[0];

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const text =
        `${event.id} ${event.user} ${event.action} ${event.object} ${event.details} ${event.equipment}`
          .toLowerCase();

      const matchesSearch = text.includes(search.toLowerCase());
      const matchesUser =
        userFilter === "All users" || event.user === userFilter;
      const matchesAction =
        actionFilter === "All actions" ||
        event.action === actionFilter;
      const matchesEquipment =
        equipmentFilter === "All equipment" ||
        event.equipment === equipmentFilter;

      const eventDate = new Date(
        `${event.timestamp.replace(
          /^(\d{1,2}) Oct (\d{4})/,
          "$2-10-$1"
        ).replace(
          /(\d{4})-(\d{2})-(\d{2})/,
          "$1-$2-$3"
        )}`
      );

      const matchesDate =
        dateRange !== "Today" ||
        event.timestamp.startsWith("13 Oct 2026");

      return (
        matchesSearch &&
        matchesUser &&
        matchesAction &&
        matchesEquipment &&
        (dateRange === "All time" ||
          dateRange === "Last 7 days" ||
          matchesDate ||
          Number.isNaN(eventDate.getTime()))
      );
    });
  }, [
    events,
    search,
    userFilter,
    actionFilter,
    equipmentFilter,
    dateRange,
  ]);

  const pageSize = 10;
  const totalPages = Math.max(
    1,
    Math.ceil(filteredEvents.length / pageSize)
  );

  const currentPage = Math.min(page, totalPages);
  const visibleEvents = filteredEvents.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const reviewerActions = events.filter((event) =>
    ["Accepted", "Rejected", "Edited", "Commented"].includes(
      event.action
    )
  ).length;

  const documentChanges = events.filter((event) =>
    ["Uploaded", "Edited", "Status Changed"].includes(
      event.action
    )
  ).length;

  const flaggedEvents = events.filter(
    (event) => event.action === "Rejected"
  ).length;

  function resetFilters() {
    setSearch("");
    setDateRange("Last 7 days");
    setUserFilter("All users");
    setActionFilter("All actions");
    setEquipmentFilter("All equipment");
    setPage(1);
  }

  function exportCsv() {
    const header = [
      "Event ID",
      "Timestamp",
      "User",
      "Role",
      "Action",
      "Object",
      "Details",
      "Equipment",
    ];

    const rows = filteredEvents.map((event) => [
      event.id,
      event.timestamp,
      event.user,
      event.role,
      event.action,
      event.object,
      event.details,
      event.equipment,
    ]);

    const csv = [header, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "gxp-audit-trail.csv";
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Audit event list exported to CSV.");
  }

  function recordDemoAction(action: string) {
    if (!selected) return;

    const nextStatus =
      action === "Accepted"
        ? "Accepted"
        : action === "Rejected"
          ? "Rejected"
          : selected.newStatus ?? "In Review";

    const updated: AuditEvent = {
      ...selected,
      id: `AT-DEMO-${Date.now()}`,
      timestamp: "Just now",
      action,
      details: `Demo event: ${action.toLowerCase()} action recorded locally`,
      previousStatus: selected.newStatus ?? "Pending",
      newStatus: nextStatus,
      comment: "Demo action recorded in browser memory only.",
    };

    setEvents((previous) => [updated, ...previous]);
    setSelectedId(updated.id);
    setPage(1);
    setNotice(`${action} demo event added to the audit list.`);
  }
  return (
    <main className="at-page">
      <header className="at-header">
        <div>
          <span className="at-eyebrow">COMPLIANCE & TRACEABILITY</span>
          <h1>Audit Trail</h1>
          <p>View recorded actions and reviewer decisions.</p>
        </div>

        <div className="at-header-actions">
          <label className="at-global-search">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search events, users, equipment..."
            />
          </label>

          <span className="at-role">Reviewer workspace</span>

          <button className="at-export" onClick={exportCsv}>
            ↓ Export CSV
          </button>
        </div>
      </header>

      <section className="at-stats">
        <article className="at-stat">
          <span className="at-stat-icon at-purple-icon">▤</span>
          <div>
            <p>Total Events</p>
            <strong>{events.length}</strong>
            <small>Recorded demo events</small>
          </div>
        </article>

        <article className="at-stat">
          <span className="at-stat-icon at-pink-icon">♙</span>
          <div>
            <p>Reviewer Actions</p>
            <strong>{reviewerActions}</strong>
            <small>Accepted, rejected or edited</small>
          </div>
        </article>

        <article className="at-stat">
          <span className="at-stat-icon at-blue-icon">▣</span>
          <div>
            <p>Document Changes</p>
            <strong>{documentChanges}</strong>
            <small>Uploads, edits and versions</small>
          </div>
        </article>

        <article className="at-stat">
          <span className="at-stat-icon at-orange-icon">⚑</span>
          <div>
            <p>Flagged Events</p>
            <strong>{flaggedEvents}</strong>
            <small>Rejected demo actions</small>
          </div>
        </article>
      </section>

      <section className="at-filters">
        <label>
          <span>Date range</span>
          <select
            value={dateRange}
            onChange={(event) => {
              setDateRange(event.target.value);
              setPage(1);
            }}
          >
            <option>Last 7 days</option>
            <option>Today</option>
            <option>All time</option>
          </select>
        </label>

        <label>
          <span>User</span>
          <select
            value={userFilter}
            onChange={(event) => {
              setUserFilter(event.target.value);
              setPage(1);
            }}
          >
            <option>All users</option>
            {Array.from(new Set(events.map((event) => event.user)))
              .filter((user) => user !== "All users")
              .map((user) => (
                <option key={user}>{user}</option>
              ))}
          </select>
        </label>

        <label>
          <span>Action</span>
          <select
            value={actionFilter}
            onChange={(event) => {
              setActionFilter(event.target.value);
              setPage(1);
            }}
          >
            <option>All actions</option>
            {Array.from(new Set(events.map((event) => event.action))).map(
              (action) => (
                <option key={action}>{action}</option>
              )
            )}
          </select>
        </label>

        <label>
          <span>Equipment</span>
          <select
            value={equipmentFilter}
            onChange={(event) => {
              setEquipmentFilter(event.target.value);
              setPage(1);
            }}
          >
            <option>All equipment</option>
            {Array.from(
              new Set(events.map((event) => event.equipment))
            )
              .filter((equipment) => equipment !== "All equipment")
              .map((equipment) => (
                <option key={equipment}>{equipment}</option>
              ))}
          </select>
        </label>

        <button className="at-reset" onClick={resetFilters}>
          ↻ Reset
        </button>
      </section>

      <section className="at-main-grid">
        <article className="at-table-card">
          <div className="at-card-heading">
            <div>
              <h2>Audit Events</h2>
              <p>{filteredEvents.length} matching events</p>
            </div>
            <span className="at-readonly">DEMO LOG</span>
          </div>

          <div className="at-table-scroll">
            <table className="at-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Role</th>
                  <th>Action</th>
                  <th>Object</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {visibleEvents.map((event) => (
                  <tr
                    key={event.id}
                    className={
                      selectedId === event.id ? "at-row-selected" : ""
                    }
                    onClick={() => setSelectedId(event.id)}
                  >
                    <td>{event.timestamp}</td>
                    <td><strong>{event.user}</strong></td>
                    <td>{event.role}</td>
                    <td>
                      <span
                        className={`at-action at-action-${event.action
                          .toLowerCase()
                          .replace(/\s+/g, "-")}`}
                      >
                        {event.action}
                      </span>
                    </td>
                    <td>{event.object}</td>
                    <td>
                      <div className="at-detail-cell">
                        <span>{event.details}</span>
                        <b>›</b>
                      </div>
                    </td>
                  </tr>
                ))}

                {visibleEvents.length === 0 && (
                  <tr>
                    <td colSpan={6} className="at-empty">
                      No audit events match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="at-pagination">
            <span>
              Showing{" "}
              {filteredEvents.length === 0
                ? 0
                : (currentPage - 1) * pageSize + 1}
              –
              {Math.min(currentPage * pageSize, filteredEvents.length)} of{" "}
              {filteredEvents.length}
            </span>

            <div>
              <button
                disabled={currentPage <= 1}
                onClick={() => setPage((value) => value - 1)}
              >
                ‹
              </button>
              <span className="at-page-number">
                {currentPage} / {totalPages}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setPage((value) => value + 1)}
              >
                ›
              </button>
            </div>
          </div>
        </article>

        {selected && (
          <aside className="at-detail-card">
            <div className="at-detail-heading">
              <span className="at-detail-icon">▤</span>
              <div>
                <h2>Audit Event Details</h2>
                <p>Selected activity record</p>
              </div>
            </div>

            <div className="at-detail-fields">
              <div><span>Event ID</span><strong>{selected.id}</strong></div>
              <div><span>Timestamp</span><strong>{selected.timestamp}</strong></div>
              <div><span>User</span><strong>{selected.user}</strong></div>
              <div><span>Role</span><strong>{selected.role}</strong></div>
              <div>
                <span>Action</span>
                <strong>
                  <span className="at-action at-action-neutral">
                    {selected.action}
                  </span>
                </strong>
              </div>
              <div><span>Object</span><strong>{selected.object}</strong></div>
              <div><span>Equipment</span><strong>{selected.equipment}</strong></div>
              <div><span>Details</span><strong>{selected.details}</strong></div>
            </div>

            {(selected.previousStatus || selected.newStatus) && (
              <section className="at-change-box">
                <h3>↻ Change Summary</h3>
                <div className="at-status-comparison">
                  <div className="at-old-status">
                    <small>Previous status</small>
                    <strong>{selected.previousStatus ?? "Not recorded"}</strong>
                  </div>
                  <span className="at-change-arrow">→</span>
                  <div className="at-new-status">
                    <small>New status</small>
                    <strong>{selected.newStatus ?? "Not recorded"}</strong>
                  </div>
                </div>
              </section>
            )}

            <section className="at-related-box">
              <h3>▧ Related Document</h3>
              {selected.document ? (
                <div className="at-related-document">
                  <span className="at-pdf-icon">PDF</span>
                  <div>
                    <strong>{selected.document}</strong>
                    <small>
                      {selected.equipment} · Illustrative reference
                    </small>
                  </div>
                  <span className="at-document-tag">Linked</span>
                </div>
              ) : (
                <p className="at-muted">
                  No document is linked to this event.
                </p>
              )}
            </section>

            <section className="at-comment-box">
              <h3>♧ Reviewer Comment</h3>
              <p>
                {selected.comment ?? "No additional comments were recorded."}
              </p>
            </section>

            <div className="at-demo-actions">
              <span>Demo actions</span>
              <div>
                <button onClick={() => recordDemoAction("Accepted")}>
                  ✓ Accept
                </button>
                <button onClick={() => recordDemoAction("Rejected")}>
                  ✕ Reject
                </button>
              </div>
              <small>
                These actions add sample events in browser memory only.
                They do not create a regulated audit record.
              </small>
            </div>
          </aside>
        )}
      </section>

      <footer className="at-disclaimer">
        <span>ⓘ</span>
        <p>
          Illustrative demo data only. Events and actions are held in browser
          memory and are not saved to a backend. This is not a validated
          electronic audit trail.
        </p>
      </footer>

      {notice && (
        <div className="at-toast">
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>Dismiss ×</button>
        </div>
      )}
    </main>
  );
}