import { useState } from "react";

const initialDocs = {
  bank: [
    {
      id: "b1",
      name: "HDFC Bank Statement",
      period: "Apr 2025 – Mar 2026",
      size: "2.1 MB",
      accessGranted: false,
      lastAccessed: null,
      requests: [{ by: "Income Tax Dept.", date: "12 May 2026", status: "pending" }],
    },
    {
      id: "b2",
      name: "SBI Savings Account",
      period: "Jan – Mar 2026",
      size: "890 KB",
      accessGranted: true,
      lastAccessed: "28 Apr 2026",
      requests: [],
    },
    {
      id: "b3",
      name: "Fixed Deposit Certificate",
      period: "FY 2025–26",
      size: "340 KB",
      accessGranted: false,
      lastAccessed: null,
      requests: [],
    },
  ],
  govt: [
    {
      id: "g1",
      name: "Aadhaar Card",
      issuer: "UIDAI",
      size: "1.2 MB",
      accessGranted: false,
      lastAccessed: null,
      requests: [{ by: "Mumbai Municipal Corp.", date: "20 May 2026", status: "pending" }],
    },
    {
      id: "g2",
      name: "PAN Card",
      issuer: "Income Tax Dept.",
      size: "560 KB",
      accessGranted: true,
      lastAccessed: "15 May 2026",
      requests: [],
    },
    {
      id: "g3",
      name: "Passport",
      issuer: "Ministry of External Affairs",
      size: "3.8 MB",
      accessGranted: false,
      lastAccessed: null,
      requests: [],
    },
    {
      id: "g4",
      name: "Voter ID",
      issuer: "Election Commission of India",
      size: "720 KB",
      accessGranted: false,
      lastAccessed: null,
      requests: [{ by: "State Election Office", date: "02 May 2026", status: "pending" }],
    },
  ],
};

const tabs = [
  { id: "bank", label: "Bank Statements" },
  { id: "govt", label: "Gov. Documents" },
  { id: "activity", label: "Access Log" },
];

function AccessToggle({ granted, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "6px 14px",
        borderRadius: "999px",
        border: `1.5px solid ${granted ? "#22c55e" : "#e2e8f0"}`,
        background: granted ? "#f0fdf4" : "#f8fafc",
        color: granted ? "#16a34a" : "#94a3b8",
        fontSize: "12px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.2s",
        fontFamily: "inherit",
        letterSpacing: "0.04em",
      }}
    >
      <span style={{
        width: 8, height: 8, borderRadius: "50%",
        background: granted ? "#22c55e" : "#cbd5e1",
        display: "inline-block",
      }} />
      {granted ? "ACCESS OPEN" : "ACCESS CLOSED"}
    </button>
  );
}

// *** CHANGED: added onDelete prop ***
function DocCard({ doc, onToggle, onApprove, onDeny, onDelete }) {
  const pendingReqs = doc.requests.filter(r => r.status === "pending");

  return (
    <div style={{
      background: "#fff",
      borderRadius: "16px",
      // *** CHANGED: red left border for user-uploaded docs ***
      border: doc.userUploaded ? "1.5px solid #fca5a5" : "1.5px solid #f1f5f9",
      padding: "20px 22px",
      display: "flex",
      flexDirection: "column",
      gap: "14px",
      boxShadow: "0 1px 6px rgba(15,23,42,0.05)",
    }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 700, color: "#0f172a", fontSize: "15px" }}>{doc.name}</div>
          <div style={{ color: "#94a3b8", fontSize: "12px", marginTop: 2 }}>
            {doc.period || doc.issuer} · {doc.size}
          </div>
        </div>
        {/* *** CHANGED: added delete button alongside toggle *** */}
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <AccessToggle granted={doc.accessGranted} onToggle={onToggle} />
          <button
            onClick={onDelete}
            title="Delete document"
            style={{
              padding: "6px 12px", borderRadius: "8px",
              border: "1.5px solid #fca5a5", background: "#fff1f2",
              color: "#dc2626", fontSize: "12px", fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Last accessed */}
      {doc.lastAccessed && (
        <div style={{
          fontSize: "12px", color: "#64748b",
          background: "#f8fafc", borderRadius: "8px",
          padding: "6px 10px",
        }}>
          Last accessed: {doc.lastAccessed}
        </div>
      )}

      {/* Pending requests */}
      {pendingReqs.length > 0 && (
        <div style={{
          borderRadius: "10px",
          border: "1.5px solid #fde68a",
          background: "#fffbeb",
          padding: "12px 14px",
        }}>
          {pendingReqs.map((req, i) => (
            <div key={i}>
              <div style={{ fontSize: "12px", color: "#92400e", fontWeight: 600, marginBottom: 8 }}>
                Access Request — {req.by}
              </div>
              <div style={{ fontSize: "11px", color: "#a16207", marginBottom: 10 }}>
                Requested on {req.date}
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => onApprove(req)} style={btnStyle("#16a34a", "#f0fdf4", "#bbf7d0")}>
                  Approve
                </button>
                <button onClick={() => onDeny(req)} style={btnStyle("#dc2626", "#fff1f2", "#fecaca")}>
                  Deny
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function btnStyle(color, bg, border) {
  return {
    padding: "5px 14px", borderRadius: "8px",
    border: `1.5px solid ${border}`, background: bg,
    color, fontSize: "12px", fontWeight: 700,
    cursor: "pointer", fontFamily: "inherit",
  };
}

function ActivityLog({ docs }) {
  const allEvents = [];
  Object.entries(docs).forEach(([, list]) => {
    list.forEach(doc => {
      if (doc.lastAccessed) {
        allEvents.push({ doc: doc.name, action: "Accessed", date: doc.lastAccessed, color: "#3b82f6" });
      }
      doc.requests.forEach(r => {
        allEvents.push({
          doc: doc.name,
          action: r.status === "pending" ? `Request by ${r.by}` : `${r.status} — ${r.by}`,
          date: r.date,
          color: r.status === "pending" ? "#f59e0b" : r.status === "approved" ? "#22c55e" : "#ef4444",
        });
      });
    });
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {allEvents.length === 0 ? (
        <div style={{ textAlign: "center", color: "#94a3b8", padding: "40px 0", fontSize: "14px" }}>
          No activity yet.
        </div>
      ) : allEvents.map((e, i) => (
        <div key={i} style={{
          background: "#fff", borderRadius: "12px",
          border: "1.5px solid #f1f5f9",
          padding: "14px 18px",
          display: "flex", alignItems: "center", gap: "14px",
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: "14px", color: "#0f172a" }}>{e.doc}</div>
            <div style={{ fontSize: "12px", color: e.color, marginTop: 2, fontWeight: 600 }}>{e.action}</div>
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>{e.date}</div>
        </div>
      ))}
    </div>
  );
}

export default function CivicVault() {
  const [activeTab, setActiveTab] = useState("bank");
  const [docs, setDocs] = useState(initialDocs);
  const [toast, setToast] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  // *** CHANGED: upload modal state ***
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForm, setUploadForm] = useState({ name: "", meta: "", size: "" });

  const showToast = (msg, color = "#22c55e") => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 3000);
  };

  const emergencyStop = () => {
    setDocs(prev => {
      const updated = {};
      Object.entries(prev).forEach(([section, list]) => {
        updated[section] = list.map(d => ({ ...d, accessGranted: false }));
      });
      return updated;
    });
    setShowWarning(false);
    showToast("All access revoked — Emergency Stop activated", "#dc2626");
  };

  const toggleAccess = (section, id) => {
    const doc = docs[section].find(d => d.id === id);
    setDocs(prev => ({
      ...prev,
      [section]: prev[section].map(d =>
        d.id === id ? { ...d, accessGranted: !d.accessGranted } : d
      ),
    }));
    showToast(
      doc.accessGranted ? `Access revoked for ${doc.name}` : `Access granted for ${doc.name}`,
      doc.accessGranted ? "#ef4444" : "#22c55e"
    );
  };

  // *** CHANGED: upload a new document into current tab ***
  const uploadDoc = () => {
    if (!uploadForm.name.trim()) return;
    const newDoc = {
      id: `u-${Date.now()}`,
      name: uploadForm.name.trim(),
      [activeTab === "bank" ? "period" : "issuer"]: uploadForm.meta.trim() || "—",
      size: uploadForm.size.trim() || "—",
      accessGranted: false,
      lastAccessed: null,
      requests: [],
      userUploaded: true,
    };
    setDocs(prev => ({ ...prev, [activeTab]: [...prev[activeTab], newDoc] }));
    setUploadForm({ name: "", meta: "", size: "" });
    setShowUpload(false);
    showToast(`"${newDoc.name}" uploaded successfully`);
  };

  // *** CHANGED: delete a document by id from current section ***
  const deleteDoc = (section, id) => {
    const doc = docs[section].find(d => d.id === id);
    setDocs(prev => ({ ...prev, [section]: prev[section].filter(d => d.id !== id) }));
    showToast(`"${doc.name}" deleted`, "#64748b");
  };

  const handleRequest = (section, docId, req, approved) => {
    setDocs(prev => ({
      ...prev,
      [section]: prev[section].map(d =>
        d.id === docId
          ? {
              ...d,
              accessGranted: approved ? true : d.accessGranted,
              requests: d.requests.map(r =>
                r === req ? { ...r, status: approved ? "approved" : "denied" } : r
              ),
            }
          : d
      ),
    }));
    showToast(approved ? `Request approved` : `Request denied`, approved ? "#22c55e" : "#ef4444");
  };

  const totalDocs = Object.values(docs).flat().length;
  const openDocs = Object.values(docs).flat().filter(d => d.accessGranted).length;
  const pendingCount = Object.values(docs).flat().flatMap(d => d.requests).filter(r => r.status === "pending").length;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
    }}>
      {/* *** CHANGED: Upload Modal *** */}
      {showUpload && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 2000,
          background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.15s ease",
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px",
            padding: "32px 28px", maxWidth: 400, width: "90%",
            boxShadow: "0 24px 60px rgba(15,23,42,0.2)",
          }}>
            <div style={{ fontWeight: 800, fontSize: "17px", color: "#0f172a", marginBottom: 4 }}>
              Upload Document
            </div>
            <div style={{ fontSize: "12px", color: "#94a3b8", marginBottom: 20 }}>
              Adding to: <strong>{activeTab === "bank" ? "Bank Statements" : "Gov. Documents"}</strong>
            </div>
            {[
              { label: "Document Name *", key: "name", placeholder: "e.g. ICICI Bank Statement" },
              { label: activeTab === "bank" ? "Period" : "Issuer", key: "meta", placeholder: activeTab === "bank" ? "e.g. Jan – Mar 2026" : "e.g. UIDAI" },
              { label: "File Size", key: "size", placeholder: "e.g. 1.2 MB" },
            ].map(field => (
              <div key={field.key} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: "12px", fontWeight: 600, color: "#475569", marginBottom: 5 }}>{field.label}</div>
                <input
                  value={uploadForm[field.key]}
                  onChange={e => setUploadForm(f => ({ ...f, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  style={{
                    width: "100%", padding: "9px 12px",
                    borderRadius: "10px", border: "1.5px solid #e2e8f0",
                    fontSize: "13px", fontFamily: "inherit",
                    outline: "none", color: "#0f172a",
                    boxSizing: "border-box",
                  }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
              <button
                onClick={() => { setShowUpload(false); setUploadForm({ name: "", meta: "", size: "" }); }}
                style={{
                  flex: 1, padding: "11px", borderRadius: "10px",
                  border: "1.5px solid #e2e8f0", background: "#f8fafc",
                  color: "#64748b", fontWeight: 600, fontSize: "13px",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={uploadDoc}
                style={{
                  flex: 1, padding: "11px", borderRadius: "10px",
                  border: "none", background: "#0f172a",
                  color: "#fff", fontWeight: 700, fontSize: "13px",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal */}
      {showWarning && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 2000,
          background: "rgba(15,23,42,0.6)",
          display: "flex", alignItems: "center", justifyContent: "center",
          backdropFilter: "blur(4px)",
          animation: "fadeIn 0.15s ease",
        }}>
          <div style={{
            background: "#fff", borderRadius: "20px",
            padding: "32px 28px", maxWidth: 380, width: "90%",
            boxShadow: "0 24px 60px rgba(15,23,42,0.2)",
            textAlign: "center",
          }}>
            <div style={{ fontWeight: 800, fontSize: "18px", color: "#dc2626", marginBottom: 8 }}>
              Emergency Stop
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, marginBottom: 24 }}>
              This will <strong>immediately revoke all access</strong> to every document across all sections.
              Any active government or third-party sessions will be terminated.
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowWarning(false)}
                style={{
                  flex: 1, padding: "11px", borderRadius: "10px",
                  border: "1.5px solid #e2e8f0", background: "#f8fafc",
                  color: "#64748b", fontWeight: 600, fontSize: "13px",
                  cursor: "pointer", fontFamily: "inherit",
                }}
              >
                Cancel
              </button>
              <button
                onClick={emergencyStop}
                style={{
                  flex: 1, padding: "11px", borderRadius: "10px",
                  border: "none", background: "#dc2626",
                  color: "#fff", fontWeight: 700, fontSize: "13px",
                  cursor: "pointer", fontFamily: "inherit",
                  boxShadow: "0 4px 14px rgba(220,38,38,0.35)",
                }}
              >
                Revoke All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 1000,
          background: toast.color, color: "#fff",
          padding: "10px 20px", borderRadius: "10px",
          fontSize: "13px", fontWeight: 600,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          animation: "fadeIn 0.2s ease",
        }}>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{
        background: "#fff",
        borderBottom: "1.5px solid #f1f5f9",
        padding: "0 24px",
      }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 0 16px",
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: "18px", color: "#0f172a", letterSpacing: "-0.03em" }}>
                CivicVault
              </div>
              <div style={{ fontSize: "11px", color: "#94a3b8", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                Your Data, Your Control
              </div>
            </div>

            {/* Stats pills + Emergency Stop */}
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <StatPill label="Total" value={totalDocs} color="#64748b" />
              <StatPill label="Open" value={openDocs} color="#22c55e" />
              {pendingCount > 0 && <StatPill label="Requests" value={pendingCount} color="#f59e0b" />}
              <button
                onClick={() => setShowWarning(true)}
                style={{
                  padding: "6px 14px", borderRadius: "999px",
                  border: "1.5px solid #fca5a5",
                  background: "#fff1f2", color: "#dc2626",
                  fontSize: "12px", fontWeight: 700,
                  cursor: "pointer", fontFamily: "inherit",
                  letterSpacing: "0.03em",
                }}
              >
                Emergency Stop
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 2 }}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "10px 16px",
                  background: "none",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "2.5px solid #0f172a" : "2.5px solid transparent",
                  color: activeTab === tab.id ? "#0f172a" : "#94a3b8",
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: "13px",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "color 0.15s",
                  marginBottom: "-1px",
                }}
              >
                {tab.label}
                {tab.id !== "activity" && (
                  <span style={{
                    background: activeTab === tab.id ? "#0f172a" : "#f1f5f9",
                    color: activeTab === tab.id ? "#fff" : "#64748b",
                    borderRadius: "999px", padding: "1px 7px",
                    fontSize: "11px", fontWeight: 700,
                  }}>
                    {docs[tab.id]?.length ?? ""}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "24px" }}>
        {activeTab === "activity" ? (
          <ActivityLog docs={docs} />
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {docs[activeTab].map(doc => (
              <DocCard
                key={doc.id}
                doc={doc}
                onToggle={() => toggleAccess(activeTab, doc.id)}
                onApprove={(req) => handleRequest(activeTab, doc.id, req, true)}
                onDeny={(req) => handleRequest(activeTab, doc.id, req, false)}
                // *** CHANGED: wire delete handler ***
                onDelete={() => deleteDoc(activeTab, doc.id)}
              />
            ))}
            {/* *** CHANGED: button now opens upload modal *** */}
            <button
              onClick={() => setShowUpload(true)}
              style={{
              background: "none",
              border: "1.5px dashed #cbd5e1",
              borderRadius: "16px",
              padding: "20px",
              color: "#94a3b8",
              fontSize: "14px",
              cursor: "pointer",
              fontFamily: "inherit",
              display: "flex", alignItems: "center",
              justifyContent: "center", gap: 8,
            }}>
              + Upload New Document
            </button>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button:hover { opacity: 0.85; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  );
}

function StatPill({ label, value, color }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      background: "#f8fafc", border: "1.5px solid #f1f5f9",
      borderRadius: "999px", padding: "4px 12px",
      fontSize: "12px", fontWeight: 600,
    }}>
      <span style={{ color }}>{value}</span>
      <span style={{ color: "#94a3b8" }}>{label}</span>
    </div>
  );
}