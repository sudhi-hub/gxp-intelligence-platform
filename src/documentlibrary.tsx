import { useMemo, useState } from "react";
import "./documentlibrary.css";


type Doc = {
  name: string;
  equipment: string;
  stage: string;
  type: string;
  size: string;
  date: string;
  status: string;
  version: string;
};

const initialDocs: Doc[] = [
  { name: "OQ_Machine1_v2.pdf", equipment: "EQ-001", stage: "OQ", type: "Protocol", size: "2.4 MB", date: "12 Oct 2026", status: "Completed", version: "2.0" },
  { name: "IQ_Machine2.pdf", equipment: "EQ-002", stage: "IQ", type: "Report", size: "1.7 MB", date: "11 Oct 2026", status: "In Review", version: "1.0" },
  { name: "PQ_Machine3.pdf", equipment: "EQ-003", stage: "PQ", type: "Report", size: "3.5 MB", date: "09 Oct 2026", status: "Pending", version: "1.0" },
  { name: "RTM_Machine4.pdf", equipment: "EQ-004", stage: "RTM", type: "Matrix", size: "1.2 MB", date: "08 Oct 2026", status: "Completed", version: "1.0" },
  { name: "DQ_Machine5.pdf", equipment: "EQ-005", stage: "DQ", type: "Protocol", size: "0.9 MB", date: "07 Oct 2026", status: "In Review", version: "1.0" },
  { name: "URS_Machine6.pdf", equipment: "EQ-006", stage: "URS", type: "Specification", size: "0.5 MB", date: "06 Oct 2026", status: "Pending", version: "1.0" },
  { name: "IQ_Machine1.pdf", equipment: "EQ-001", stage: "IQ", type: "Report", size: "1.8 MB", date: "04 Oct 2026", status: "Completed", version: "1.0" },
  { name: "DQ_Machine1.pdf", equipment: "EQ-001", stage: "DQ", type: "Protocol", size: "1.1 MB", date: "02 Oct 2026", status: "Pending", version: "1.0" },
  { name: "URS_Machine1.pdf", equipment: "EQ-001", stage: "URS", type: "Specification", size: "0.6 MB", date: "30 Sep 2026", status: "In Review", version: "1.0" },
];

type Tab = "Preview" | "Details" | "Related Documents" | "Version History";

export default function DocumentLibrary() {
  const [docs, setDocs] = useState(initialDocs);
  const [selectedName, setSelectedName] = useState(initialDocs[0].name);
  const [search, setSearch] = useState("");
  const [equipmentFilter, setEquipmentFilter] = useState("All Equipment");
  const [stageFilter, setStageFilter] = useState("All Stages");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [tab, setTab] = useState<Tab>("Preview");
  const [notice, setNotice] = useState("");
  const [tags, setTags] = useState(["#OQ", "#Machine1", "#Qualification", "#Protocol"]);
  const [showTagInput, setShowTagInput] = useState(false);
  const [tagInput, setTagInput] = useState("");

  const selected = docs.find((doc) => doc.name === selectedName) ?? docs[0];

  const filteredDocs = useMemo(() => docs.filter((doc) => {
    const text = `${doc.name} ${doc.equipment} ${doc.stage} ${doc.type}`.toLowerCase();
    return text.includes(search.toLowerCase()) &&
      (equipmentFilter === "All Equipment" || doc.equipment === equipmentFilter) &&
      (stageFilter === "All Stages" || doc.stage === stageFilter) &&
      (typeFilter === "All Types" || doc.type === typeFilter);
  }), [docs, search, equipmentFilter, stageFilter, typeFilter]);

  const approvedCount = docs.filter((d) => d.status === "Completed").length;
  const reviewCount = docs.filter((d) => d.status === "In Review").length;
  const pendingCount = docs.filter((d) => d.status === "Pending").length;

  function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    const pdfs = Array.from(files).filter((file) => file.type === "application/pdf");
    if (!pdfs.length) {
      setNotice("Please select PDF files only.");
      return;
    }
    const added: Doc[] = pdfs.map((file) => ({
      name: file.name,
      equipment: "EQ-001",
      stage: "OQ",
      type: "Report",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      date: "Just now",
      status: "Pending",
      version: "1.0",
    }));
    setDocs((previous) => [...added, ...previous]);
    setSelectedName(added[0].name);
    setNotice(`${added.length} PDF file(s) added to this local demo.`);
  }

  function addTag() {
    const clean = tagInput.trim().replace(/^#/, "");
    if (clean && !tags.includes(`#${clean}`)) setTags((previous) => [...previous, `#${clean}`]);
    setTagInput("");
    setShowTagInput(false);
  }

  function downloadSelected() {
    if (!selected) return;
    const content = `GxP Quality - Document Library\n\nFile: ${selected.name}\nEquipment: ${selected.equipment}\nStage: ${selected.stage}\nType: ${selected.type}\nStatus: ${selected.status}\nVersion: ${selected.version}\n\nDemo metadata only.`;
    const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selected.name.replace(/\.pdf$/i, "")}-metadata.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setNotice("Downloaded a text summary of the selected document. The original PDF is not stored by this demo.");
  }

  return (
    <main className="dl-page">
      <header className="dl-header">
        <div className="dl-title-icon">▤</div>
        <div className="dl-heading-copy">
          <span className="dl-eyebrow">QUALITY DOCUMENT CONTROL</span>
          <h1>Document Library</h1>
          <p>Organize, inspect and track qualification evidence.</p>
        </div>
        <div className="dl-header-tools">
          <span className="dl-role">● Reviewer workspace</span>
          <span className="dl-avatar">U1</span>
        </div>
      </header>

      <section className="dl-stats">
        <article className="dl-stat dl-stat-purple">
          <span className="dl-stat-icon">▤</span>
          <div><p>Total documents</p><strong>{docs.length}</strong><small>Across all equipment</small></div>
          <span className="dl-stat-mark">↗</span>
        </article>
        <article className="dl-stat dl-stat-green">
          <span className="dl-stat-icon">✓</span>
          <div><p>Completed</p><strong>{approvedCount}</strong><small>Ready for reference</small></div>
          <span className="dl-stat-mark">✓</span>
        </article>
        <article className="dl-stat dl-stat-orange">
          <span className="dl-stat-icon">◷</span>
          <div><p>In review</p><strong>{reviewCount}</strong><small>Awaiting reviewer check</small></div>
          <span className="dl-stat-mark">◷</span>
        </article>
        <article className="dl-stat dl-stat-pink">
          <span className="dl-stat-icon">!</span>
          <div><p>Pending</p><strong>{pendingCount}</strong><small>Needs follow-up</small></div>
          <span className="dl-stat-mark">⌁</span>
        </article>
      </section>

      <section className="dl-upload-panel">
        <label className="dl-dropzone">
          <input type="file" accept="application/pdf,.pdf" multiple onChange={(event) => {
            uploadFiles(event.target.files);
            event.target.value = "";
          }} />
          <span className="dl-upload-icon">↑</span>
          <span className="dl-drop-copy">
            <strong>Drop PDF files or browse</strong>
            <small>Attach qualification evidence to an equipment record.</small>
          </span>
          <span className="dl-browse">Browse files</span>
        </label>
        <div className="dl-upload-filter">
          <label>Equipment
            <select value={equipmentFilter} onChange={(e) => setEquipmentFilter(e.target.value)}>
              <option>All Equipment</option>
              {Array.from(new Set(docs.map((d) => d.equipment))).map((id) => <option key={id}>{id}</option>)}
            </select>
          </label>
          <label>Qualification stage
            <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)}>
              <option>All Stages</option>
              {["URS", "DQ", "RTM", "IQ", "OQ", "PQ"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label>Document type
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
              <option>All Types</option>
              {Array.from(new Set(docs.map((d) => d.type))).map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
        </div>
      </section>
      <section className="dl-workspace">
        <article className="dl-library-card">
          <div className="dl-card-heading">
            <div>
              <span className="dl-section-icon">▤</span>
              <div><h2>Uploaded Documents</h2><p>{filteredDocs.length} matching files</p></div>
            </div>
            <span className="dl-live-badge">LOCAL DEMO</span>
          </div>

          <div className="dl-search-row">
            <label className="dl-search">
              <span>⌕</span>
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, equipment or stage..." />
            </label>
            <button className="dl-clear" onClick={() => {
              setSearch("");
              setEquipmentFilter("All Equipment");
              setStageFilter("All Stages");
              setTypeFilter("All Types");
            }}>Reset filters</button>
          </div>

          <div className="dl-table-wrap">
            <table className="dl-table">
              <thead>
                <tr><th>Document</th><th>Equipment</th><th>Stage</th><th>Size</th><th>Uploaded</th><th>Status</th></tr>
              </thead>
              <tbody>
                {filteredDocs.map((doc) => (
                  <tr key={`${doc.name}-${doc.equipment}`} className={selectedName === doc.name ? "dl-row-selected" : ""} onClick={() => {
                    setSelectedName(doc.name);
                    setTab("Preview");
                  }}>
                    <td><div className="dl-file-cell"><span className="dl-pdf-icon">PDF</span><span>{doc.name}</span></div></td>
                    <td>{doc.equipment}</td>
                    <td><span className={`dl-stage dl-stage-${doc.stage.toLowerCase()}`}>{doc.stage}</span></td>
                    <td>{doc.size}</td>
                    <td>{doc.date}</td>
                    <td><span className={`dl-status dl-status-${doc.status.toLowerCase().replace(" ", "-")}`}>{doc.status}</span></td>
                  </tr>
                ))}
                {filteredDocs.length === 0 && <tr><td colSpan={6} className="dl-empty">No documents match these filters.</td></tr>}
              </tbody>
            </table>
          </div>

          <div className="dl-table-footer">
            <span>Showing {filteredDocs.length} of {docs.length} files</span>
            <span>Click a row to inspect its details <b>→</b></span>
          </div>
        </article>

        {selected && <aside className="dl-preview-card">
          <div className="dl-preview-heading">
            <div><span className="dl-preview-eye">◉</span><div><h2>Document Preview</h2><p>Selected evidence file</p></div></div>
            <span className={`dl-status dl-status-${selected.status.toLowerCase().replace(" ", "-")}`}>{selected.status}</span>
          </div>

          <div className="dl-selected-file">
            <span className="dl-large-pdf">PDF</span>
            <div><strong>{selected.name}</strong><small>{selected.type} · Version {selected.version}</small></div>
          </div>

          <div className="dl-tabs">
            {(["Preview", "Details", "Related Documents", "Version History"] as Tab[]).map((item) => (
              <button key={item} className={tab === item ? "dl-tab-active" : ""} onClick={() => setTab(item)}>{item}</button>
            ))}
          </div>

          {tab === "Preview" && <div className="dl-document-viewer">
            <div className="dl-viewer-toolbar"><span>▤ &nbsp; PDF DOCUMENT</span><span>Page 1 of 1</span><span>100%</span></div>
            <div className="dl-paper">
              <div className="dl-paper-brand"><span>GxP QUALITY</span><span>CONTROLLED COPY</span></div>
              <div className="dl-paper-line dl-paper-line-title" />
              <div className="dl-paper-subtitle">QUALIFICATION DOCUMENT</div>
              <div className="dl-paper-rule" />
              <div className="dl-paper-meta"><span>Equipment ID</span><b>{selected.equipment}</b></div>
              <div className="dl-paper-meta"><span>Qualification Stage</span><b>{selected.stage}</b></div>
              <div className="dl-paper-meta"><span>Document Type</span><b>{selected.type}</b></div>
              <div className="dl-paper-rule" />
              <div className="dl-paper-line" /><div className="dl-paper-line short" />
              <div className="dl-paper-highlight">Document evidence preview placeholder</div>
              <div className="dl-paper-line" /><div className="dl-paper-line medium" /><div className="dl-paper-line" /><div className="dl-paper-line short" />
              <p>Illustrative preview only. Original PDF content is not embedded.</p>
            </div>
          </div>}

          {tab === "Details" && <div className="dl-tab-content">
            <h3>Document information</h3>
            <p>File name <strong>{selected.name}</strong></p>
            <p>Equipment <strong>{selected.equipment}</strong></p>
            <p>Qualification stage <strong>{selected.stage}</strong></p>
            <p>Document type <strong>{selected.type}</strong></p>
            <p>Uploaded date <strong>{selected.date}</strong></p>
            <p>File size <strong>{selected.size}</strong></p>
            <p>Version <strong>{selected.version}</strong></p>
            <p>Status <strong>{selected.status}</strong></p>
          </div>}

          {tab === "Related Documents" && <div className="dl-tab-content">
            <h3>Related equipment documents</h3>
            {docs.filter((d) => d.equipment === selected.equipment && d.name !== selected.name).map((doc) => (
              <button className="dl-related-row" key={doc.name} onClick={() => {
                setSelectedName(doc.name);
                setTab("Preview");
              }}>
                <span className="dl-pdf-icon">PDF</span>
                <span><strong>{doc.name}</strong><small>{doc.stage} · {doc.size}</small></span>
                <b>→</b>
              </button>
            ))}
            {docs.filter((d) => d.equipment === selected.equipment && d.name !== selected.name).length === 0 && <p>No other files are linked to this equipment yet.</p>}
          </div>}

          {tab === "Version History" && <div className="dl-tab-content">
            <h3>Version history</h3>
            <div className="dl-version-row"><span className="dl-version-dot" /><div><strong>Version {selected.version}</strong><p>{selected.date} · Current version</p><small>{selected.status}</small></div><span className="dl-current-version">Current</span></div>
            <div className="dl-version-note">Version history is illustrative. Previous PDF versions are not stored in this demo.</div>
          </div>}

          <div className="dl-tag-section">
            <div className="dl-tag-heading"><h3>Document tags</h3><button onClick={() => setShowTagInput((v) => !v)}>+ Add tag</button></div>
            <div className="dl-tags">{tags.map((tag) => <button key={tag} onClick={() => setTags((previous) => previous.filter((t) => t !== tag))}>{tag} <span>×</span></button>)}</div>
            {showTagInput && <form className="dl-tag-form" onSubmit={(e) => { e.preventDefault(); addTag(); }}>
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="Enter tag name" autoFocus />
              <button type="submit">Add</button>
            </form>}
          </div>

          <div className="dl-preview-actions">
            <button className="dl-primary-action" onClick={() => setNotice("The original PDF viewer requires a real stored PDF file.")}>↗ Open PDF</button>
            <button className="dl-secondary-action" onClick={downloadSelected}>↓ Export details</button>
          </div>
        </aside>}
      </section>

      <footer className="dl-disclaimer">
        <span>ⓘ</span>
        <p>Demo interface only. Files, tags and statuses are held in browser memory. No backend storage or real document approval is connected. Verify qualification evidence with authorized personnel.</p>
      </footer>

      {notice && <div className="dl-toast"><span>{notice}</span><button onClick={() => setNotice("")}>Dismiss ×</button></div>}
    </main>
  );
}