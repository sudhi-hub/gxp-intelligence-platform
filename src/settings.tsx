import { useState } from "react";
import "./settings.css";

type UserRole = "Author" | "Reviewer" | "Approver" | "Admin";

type AppUser = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
};

const initialUsers: AppUser[] = [
  { id: 1, name: "User 1", email: "user1@example.com", role: "Reviewer", active: true },
  { id: 2, name: "User 2", email: "user2@example.com", role: "Author", active: true },
  { id: 3, name: "User 3", email: "user3@example.com", role: "Approver", active: true },
  { id: 4, name: "User 4", email: "user4@example.com", role: "Admin", active: false },
];

const initialStages = [
  { code: "URS", name: "User Requirements Specification", enabled: true },
  { code: "DQ", name: "Design Qualification", enabled: true },
  { code: "RTM", name: "Traceability Matrix", enabled: true },
  { code: "IQ", name: "Installation Qualification", enabled: true },
  { code: "OQ", name: "Operational Qualification", enabled: true },
  { code: "PQ", name: "Performance Qualification", enabled: true },
];

export default function Settings() {
  const [users, setUsers] = useState(initialUsers);
  const [stages, setStages] = useState(initialStages);
  const [search, setSearch] = useState("");
  const [showAddUser, setShowAddUser] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<UserRole>("Author");
  const [versioning, setVersioning] = useState(true);
  const [fileSize, setFileSize] = useState("50 MB");
  const [retention, setRetention] = useState("10 years");
  const [dateFormat, setDateFormat] = useState("DD Mon YYYY");
  const [timeZone, setTimeZone] = useState("(GMT+5:30) IST - India");
  const [sessionTimeout, setSessionTimeout] = useState("30 minutes");
  const [lockout, setLockout] = useState("5 attempts");
  const [notifications, setNotifications] = useState({
    pending: true,
    rejected: true,
    approval: true,
    expiry: true,
  });
  const [notice, setNotice] = useState("");

  const filteredUsers = users.filter((user) =>
    `${user.name} ${user.email} ${user.role}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  function toggleUser(id: number) {
    setUsers((previous) =>
      previous.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  }

  function changeRole(id: number, role: UserRole) {
    setUsers((previous) =>
      previous.map((user) =>
        user.id === id ? { ...user, role } : user
      )
    );
  }

  function addUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!newName.trim() || !newEmail.trim()) {
      setNotice("Enter a name and email address.");
      return;
    }

    if (users.some((user) => user.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      setNotice("A user with this email already exists.");
      return;
    }

    setUsers((previous) => [
      ...previous,
      {
        id: Math.max(0, ...previous.map((user) => user.id)) + 1,
        name: newName.trim(),
        email: newEmail.trim(),
        role: newRole,
        active: true,
      },
    ]);

    setNewName("");
    setNewEmail("");
    setNewRole("Author");
    setShowAddUser(false);
    setNotice("User added to this demo.");
  }

  function toggleStage(code: string) {
    setStages((previous) =>
      previous.map((stage) =>
        stage.code === code
          ? { ...stage, enabled: !stage.enabled }
          : stage
      )
    );
  }

  function saveSettings(section: string) {
    setNotice(
      `${section} settings updated in this demo. Connect an API to save changes permanently.`
    );
  }

  function toggleNotification(key: keyof typeof notifications) {
    setNotifications((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  }

  return (
    <main className="settings-page">
      <header className="settings-heading">
        <div>
          <span className="settings-eyebrow">SYSTEM CONFIGURATION</span>
          <h1>Settings</h1>
          <p>
            Manage users, qualification workflow, document control and
            system preferences.
          </p>
        </div>
        <span className="settings-role-badge">● Administrator workspace</span>
      </header>

      {/* USERS AND ROLES */}
      <section className="st-card st-users-card">
        <div className="st-card-heading">
          <div className="st-heading-icon">♟</div>
          <div>
            <h2>Users &amp; Roles</h2>
            <p>Manage system users and assign responsibilities.</p>
          </div>
          <button
            className="st-primary-button"
            onClick={() => setShowAddUser((value) => !value)}
          >
            + Add User
          </button>
        </div>

        {showAddUser && (
          <form className="st-add-user-form" onSubmit={addUser}>
            <label>
              Full name
              <input
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="Enter full name"
                required
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                value={newEmail}
                onChange={(event) => setNewEmail(event.target.value)}
                placeholder="name@company.com"
                required
              />
            </label>
            <label>
              Role
              <select
                value={newRole}
                onChange={(event) =>
                  setNewRole(event.target.value as UserRole)
                }
              >
                <option>Author</option>
                <option>Reviewer</option>
                <option>Approver</option>
                <option>Admin</option>
              </select>
            </label>
            <button className="st-primary-button" type="submit">
              Create User
            </button>
            <button
              className="st-secondary-button"
              type="button"
              onClick={() => setShowAddUser(false)}
            >
              Cancel
            </button>
          </form>
        )}

        <label className="st-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users by name, email or role..."
          />
        </label>

        <div className="st-table-wrap">
          <table className="st-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="st-user-cell">
                      <span className="st-avatar">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                      <strong>{user.name}</strong>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <select
                      className="st-role-select"
                      value={user.role}
                      onChange={(event) =>
                        changeRole(user.id, event.target.value as UserRole)
                      }
                    >
                      <option>Author</option>
                      <option>Reviewer</option>
                      <option>Approver</option>
                      <option>Admin</option>
                    </select>
                  </td>
                  <td>
                    <button
                      className={`st-switch ${user.active ? "is-on" : ""}`}
                      role="switch"
                      aria-checked={user.active}
                      aria-label={`Toggle ${user.name} account status`}
                      onClick={() => toggleUser(user.id)}
                    >
                      <span />
                    </button>
                    <span className={user.active ? "st-active" : "st-inactive"}>
                      {user.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="st-empty">
                    No matching users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <p className="st-footnote">
          Demo users only. Role changes do not enforce backend permissions.
        </p>
      </section>

      <div className="st-two-column">
        {/* QUALIFICATION WORKFLOW */}
        <section className="st-card">
          <div className="st-card-heading">
            <div className="st-heading-icon">⌘</div>
            <div>
              <h2>Qualification Workflow</h2>
              <p>View and configure qualification stages.</p>
            </div>
          </div>

          <div className="st-stage-sequence">
            {stages.map((stage, index) => (
              <span key={stage.code}>
                <b className={stage.enabled ? "stage-enabled" : "stage-disabled"}>
                  {stage.code}
                </b>
                {index < stages.length - 1 && <i>›</i>}
              </span>
            ))}
          </div>

          <div className="st-stage-list">
            {stages.map((stage) => (
              <div className="st-stage-row" key={stage.code}>
                <div>
                  <strong>{stage.code}</strong>
                  <span>{stage.name}</span>
                </div>
                <button
                  className={`st-switch ${stage.enabled ? "is-on" : ""}`}
                  role="switch"
                  aria-checked={stage.enabled}
                  aria-label={`Toggle ${stage.code} stage`}
                  onClick={() => toggleStage(stage.code)}
                >
                  <span />
                </button>
              </div>
            ))}
          </div>

          <p className="st-footnote">
            Illustrative configuration. Confirm approved workflow rules
            before enabling changes.
          </p>
          <button
            className="st-primary-button st-save-button"
            onClick={() => saveSettings("Workflow")}
          >
            Save Workflow
          </button>
        </section>

        {/* DOCUMENT CONTROL */}
        <section className="st-card">
          <div className="st-card-heading">
            <div className="st-heading-icon">▤</div>
            <div>
              <h2>Document Control</h2>
              <p>Configure document upload and version settings.</p>
            </div>
          </div>

          <div className="st-setting-row">
            <div>
              <strong>Document versioning</strong>
              <small>Enable version control for documents</small>
            </div>
            <button
              className={`st-switch ${versioning ? "is-on" : ""}`}
              role="switch"
              aria-checked={versioning}
              onClick={() => setVersioning((value) => !value)}
              aria-label="Toggle document versioning"
            >
              <span />
            </button>
          </div>

          <label className="st-setting-row">
            <span>
              <strong>Version naming format</strong>
              <small>Format used for document versions</small>
            </span>
            <select defaultValue="v1.0, v1.1, v2.0">
              <option>v1.0, v1.1, v2.0</option>
              <option>1.0, 1.1, 2.0</option>
            </select>
          </label>

          <div className="st-setting-row">
            <div>
              <strong>Allowed file types</strong>
              <small>Accepted upload formats</small>
            </div>
            <span className="st-file-tags">PDF · DOCX · XLSX</span>
          </div>

          <label className="st-setting-row">
            <span>
              <strong>Maximum file size</strong>
              <small>Upload size limit per document</small>
            </span>
            <select
              value={fileSize}
              onChange={(event) => setFileSize(event.target.value)}
            >
              <option>10 MB</option>
              <option>25 MB</option>
              <option>50 MB</option>
              <option>100 MB</option>
            </select>
          </label>

          <label className="st-setting-row">
            <span>
              <strong>Document retention period</strong>
              <small>Retention policy configuration</small>
            </span>
            <select
              value={retention}
              onChange={(event) => setRetention(event.target.value)}
            >
              <option>5 years</option>
              <option>7 years</option>
              <option>10 years</option>
              <option>As per approved policy</option>
            </select>
          </label>

          <button
            className="st-primary-button st-save-button"
            onClick={() => saveSettings("Document control")}
          >
            Save Document Settings
          </button>
        </section>

        {/* NOTIFICATIONS */}
        <section className="st-card">
          <div className="st-card-heading">
            <div className="st-heading-icon">♧</div>
            <div>
              <h2>Notifications &amp; Preferences</h2>
              <p>Manage review alerts and display preferences.</p>
            </div>
          </div>

          {([
            ["pending", "Pending reviews", "Notify when documents need review"],
            ["rejected", "Rejected findings", "Notify when findings are rejected"],
            ["approval", "Stage approvals", "Notify when a stage is approved"],
            ["expiry", "Document expiry", "Notify before documents expire"],
          ] as const).map(([key, title, description]) => (
            <div className="st-setting-row" key={key}>
              <div>
                <strong>{title}</strong>
                <small>{description}</small>
              </div>
              <button
                className={`st-switch ${notifications[key] ? "is-on" : ""}`}
                role="switch"
                aria-checked={notifications[key]}
                aria-label={`Toggle ${title} notifications`}
                onClick={() => toggleNotification(key)}
              >
                <span />
              </button>
            </div>
          ))}

          <label className="st-setting-row">
            <span>
              <strong>Date format</strong>
              <small>Display date preference</small>
            </span>
            <select
              value={dateFormat}
              onChange={(event) => setDateFormat(event.target.value)}
            >
              <option>DD Mon YYYY</option>
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </label>

          <label className="st-setting-row">
            <span>
              <strong>Time zone</strong>
              <small>Local display preference</small>
            </span>
            <select
              value={timeZone}
              onChange={(event) => setTimeZone(event.target.value)}
            >
              <option>(GMT+5:30) IST - India</option>
              <option>(GMT+0:00) UTC</option>
              <option>(GMT-5:00) Eastern Time</option>
            </select>
          </label>

          <button
            className="st-primary-button st-save-button"
            onClick={() => saveSettings("Notification and preference")}
          >
            Save Preferences
          </button>
        </section>

        {/* SECURITY */}
        <section className="st-card">
          <div className="st-card-heading">
            <div className="st-heading-icon">⬡</div>
            <div>
              <h2>Security</h2>
              <p>Basic account and session configuration.</p>
            </div>
          </div>

          <label className="st-setting-row">
            <span>
              <strong>Session timeout</strong>
              <small>Sign out after inactivity</small>
            </span>
            <select
              value={sessionTimeout}
              onChange={(event) => setSessionTimeout(event.target.value)}
            >
              <option>15 minutes</option>
              <option>30 minutes</option>
              <option>60 minutes</option>
            </select>
          </label>

          <label className="st-setting-row">
            <span>
              <strong>Account lockout</strong>
              <small>Failed login attempts</small>
            </span>
            <select
              value={lockout}
              onChange={(event) => setLockout(event.target.value)}
            >
              <option>3 attempts</option>
              <option>5 attempts</option>
              <option>10 attempts</option>
            </select>
          </label>

          <div className="st-security-note">
            <span>ⓘ</span>
            <p>
              These controls are UI preferences only. The backend must enforce
              authentication, access control and session security.
            </p>
          </div>

          <button
            className="st-primary-button st-save-button"
            onClick={() => saveSettings("Security")}
          >
            Save Security Settings
          </button>
        </section>
      </div>

      <footer className="st-disclaimer">
        Demo interface only. Settings are held in browser memory and reset
        when the page reloads. Connect backend APIs and apply approved
        validation and audit requirements before production use.
      </footer>

      {notice && (
        <div className="st-toast" role="status">
          <span>{notice}</span>
          <button onClick={() => setNotice("")}>Dismiss ×</button>
        </div>
      )}
    </main>
  );
}