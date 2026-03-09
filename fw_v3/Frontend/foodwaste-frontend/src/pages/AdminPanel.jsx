import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  isAdmin, isSuperAdmin, SUPER_ADMIN_EMAIL,
  getAllRequests, approveRequest, rejectRequest,
  getApprovedAdmins, revokeAdmin, ensureSuperAdmin,
  requestAdminAccess, getRequestStatus,
} from "../utils/adminUtils";
import apiService from "../services/apiService";

/* ══════════════════════════════════════
   MAIN ADMIN PANEL
══════════════════════════════════════ */
export default function AdminPanel() {
  const navigate  = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [accessOk, setAccessOk]       = useState(false);
  const [tab, setTab]                 = useState("donations");

  const [donations, setDonations]   = useState([]);
  const [sortBy, setSortBy]         = useState("date_desc");
  const [filterType, setFilterType] = useState("All");
  const [search, setSearch]         = useState("");
  const [requests, setRequests]     = useState([]);
  const [admins, setAdmins]         = useState([]);
  const [actionMsg, setActionMsg]   = useState("");

  useEffect(() => {
    ensureSuperAdmin();
    const stored = localStorage.getItem("fw_user");
    if (!stored) { navigate("/"); return; }
    const u = JSON.parse(stored);
    setCurrentUser(u);
    if (isAdmin(u.email)) {
      setAccessOk(true);
      loadAll();
    }
  }, []);

  function loadAll() {
    // Fetch donations from backend API instead of localStorage
    apiService.getAllFoods()
      .then(foods => {
        setDonations(foods || []);
      })
      .catch(error => {
        console.error("Error loading foods:", error);
        setDonations([]);
      });
    
    setRequests(getAllRequests());
    setAdmins(getApprovedAdmins());
  }

  const sorted = [...donations]
    .filter(d => filterType === "All" || d.type === filterType)
    .filter(d =>
      search === "" ||
      d.donorName?.toLowerCase().includes(search.toLowerCase()) ||
      d.foodName?.toLowerCase().includes(search.toLowerCase()) ||
      d.location?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "qty_desc") return b.quantity - a.quantity;
      if (sortBy === "qty_asc")  return a.quantity - b.quantity;
      if (sortBy === "date_asc") return new Date(a.createdAt) - new Date(b.createdAt);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  const totalServings = donations.reduce((s, d) => s + Number(d.quantity || 0), 0);
  const uniqueDonors  = [...new Set(donations.map(d => d.donorName))].length;
  const pendingCount  = requests.filter(r => r.status === "pending").length;

  function flash(msg) { setActionMsg(msg); setTimeout(() => setActionMsg(""), 3500); }

  function handleApprove(reqId) { approveRequest(reqId); loadAll(); flash("✅ Approved! User now has admin access."); }
  function handleReject(reqId)  { rejectRequest(reqId);  loadAll(); flash("❌ Request rejected."); }
  function handleRevoke(email)  {
    if (window.confirm("Revoke admin access for " + email + "?")) {
      revokeAdmin(email); loadAll(); flash("🚫 Admin access revoked.");
    }
  }

  if (!currentUser) return null;
  if (!accessOk) return <AccessDeniedScreen user={currentUser} navigate={navigate} />;

  return (
    <div className="admin-bg">
      <div className="home-orb home-orb1" />
      <div className="home-orb home-orb2" />

      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-leaf">🛡️</span>
          <span className="nav-title">Admin Dashboard</span>
        </div>
        <div className="nav-right">
          <span className="nav-user" style={{ color: "#fb923c" }}>
            {isSuperAdmin(currentUser.email) ? "👑 Super Admin" : "🛡️ Admin"} · {currentUser.name}
          </span>
          <button className="nav-signout" onClick={() => navigate("/home")}>← Home</button>
        </div>
      </nav>

      <div className="admin-content">

        {/* Summary */}
        <div className="admin-summary">
          {[
            ["📦","Total Donations", donations.length, "#a3e635"],
            ["🍽️","Total Servings",  totalServings,    "#2dd4bf"],
            ["👥","Unique Donors",   uniqueDonors,     "#fb923c"],
            ["📍","Locations", [...new Set(donations.map(d => d.location))].length, "#a855f7"],
          ].map(([icon, label, val, color]) => (
            <div className="admin-stat" key={label} style={{ "--accent": color }}>
              <div className="admin-stat-icon">{icon}</div>
              <div className="admin-stat-val" style={{ color }}>{val}</div>
              <div className="admin-stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button className={`admin-tab ${tab === "donations" ? "active" : ""}`} onClick={() => setTab("donations")}>
            🍱 Donations
          </button>
          {isSuperAdmin(currentUser.email) && <>
            <button className={`admin-tab ${tab === "requests" ? "active" : ""}`} onClick={() => setTab("requests")}>
              📩 Admin Requests {pendingCount > 0 && <span className="tab-badge">{pendingCount}</span>}
            </button>
            <button className={`admin-tab ${tab === "admins" ? "active" : ""}`} onClick={() => setTab("admins")}>
              👑 Manage Admins
            </button>
          </>}
        </div>

        {actionMsg && <div className="action-msg-banner">{actionMsg}</div>}

        {/* DONATIONS TAB */}
        {tab === "donations" && <>
          <div className="admin-controls">
            <input className="admin-search" placeholder="🔍  Search donor, food, location…"
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="admin-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="All">All Types</option>
              <option value="Veg">🥦 Veg</option>
              <option value="Non-Veg">🍗 Non-Veg</option>
              <option value="Both">🍱 Both</option>
            </select>
            <select className="admin-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
              <option value="date_desc">🕒 Newest First</option>
              <option value="date_asc">🕒 Oldest First</option>
              <option value="qty_desc">📦 Qty: High → Low</option>
              <option value="qty_asc">📦 Qty: Low → High</option>
            </select>
          </div>

          {sorted.length === 0 ? (
            <div className="admin-empty">
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>📭</div>
              <p>No donations found.</p>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>#</th><th>Donor</th><th>Food Item</th><th>Type</th>
                    <th className="sortable-th" onClick={() => setSortBy(s => s === "qty_desc" ? "qty_asc" : "qty_desc")}>
                      Servings {sortBy === "qty_desc" ? "↓" : sortBy === "qty_asc" ? "↑" : "↕"}
                    </th>
                    <th>Location</th>
                    <th className="sortable-th" onClick={() => setSortBy(s => s === "date_desc" ? "date_asc" : "date_desc")}>
                      Date {sortBy === "date_desc" ? "↓" : sortBy === "date_asc" ? "↑" : "↕"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((d, i) => (
                    <tr key={d._id || d.id} className="admin-row" style={{ animationDelay: `${i * 0.03}s` }}>
                      <td className="admin-num">{i + 1}</td>
                      <td>
                        <div className="admin-donor">
                          <div className="admin-avatar">{(d.donorName || "A")[0].toUpperCase()}</div>
                          <div>
                            <div className="admin-donor-name">{d.donorName || "Anonymous Donor"}</div>
                            <div className="admin-donor-id">ID: {(d.donorId || d._id)?.slice?.(-6) || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="admin-food">{d.foodName}</td>
                      <td>
                        <span className={`admin-type-badge type-${d.type?.toLowerCase().replace("-","")}`}>
                          {d.type === "Veg" ? "🥦" : d.type === "Non-Veg" ? "🍗" : "🍱"} {d.type}
                        </span>
                      </td>
                      <td className="admin-qty">{Number(d.quantity).toLocaleString()}</td>
                      <td className="admin-loc">📍 {d.location}</td>
                      <td className="admin-date">
                        {d.createdAt ? new Date(d.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p style={{ textAlign:"center", color:"rgba(255,255,255,0.2)", fontSize:"0.72rem", marginTop:"1.5rem" }}>
            Showing {sorted.length} of {donations.length} records
          </p>
        </>}

        {/* REQUESTS TAB */}
        {tab === "requests" && isSuperAdmin(currentUser.email) && (
          <div className="requests-section">
            <div className="requests-header">
              <h3 className="requests-title">📩 Admin Access Requests</h3>
              <p className="requests-sub">Review users who want admin access to FoodBridge.</p>
            </div>
            {requests.length === 0 ? (
              <div className="admin-empty"><div style={{ fontSize:"2.5rem" }}>📬</div><p style={{marginTop:"0.5rem"}}>No requests yet.</p></div>
            ) : (
              <div className="requests-list">
                {[...requests].reverse().map(req => (
                  <div key={req.id} className={`request-card status-${req.status}`}>
                    <div className="request-card-left">
                      <div className="req-avatar">{(req.name || "?")[0].toUpperCase()}</div>
                      <div>
                        <div className="req-name">{req.name}</div>
                        <div className="req-email">{req.email}</div>
                        <div className="req-time">Requested: {new Date(req.requestedAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit" })}</div>
                        {req.approvedAt && <div className="req-time" style={{color:"#a3e635"}}>Approved: {new Date(req.approvedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>}
                        {req.rejectedAt && <div className="req-time" style={{color:"#f87171"}}>Rejected: {new Date(req.rejectedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>}
                      </div>
                    </div>
                    <div className="request-card-right">
                      <span className={`req-status-badge badge-${req.status}`}>
                        {req.status === "pending" ? "⏳ Pending" : req.status === "approved" ? "✅ Approved" : "❌ Rejected"}
                      </span>
                      {req.status === "pending" && (
                        <div className="req-actions">
                          <button className="req-btn approve" onClick={() => handleApprove(req.id)}>✓ Approve</button>
                          <button className="req-btn reject"  onClick={() => handleReject(req.id)}>✗ Reject</button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MANAGE ADMINS TAB */}
        {tab === "admins" && isSuperAdmin(currentUser.email) && (
          <div className="requests-section">
            <div className="requests-header">
              <h3 className="requests-title">👑 Approved Admins</h3>
              <p className="requests-sub">All users with admin access. You can revoke access at any time.</p>
            </div>
            <div className="requests-list">
              {admins.map(a => (
                <div key={a.email} className="request-card status-approved">
                  <div className="request-card-left">
                    <div className="req-avatar" style={{ background: a.role === "super" ? "linear-gradient(135deg,#fb923c,#f59e0b)" : "linear-gradient(135deg,#a3e635,#2dd4bf)" }}>
                      {(a.name || "?")[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="req-name">{a.name} {a.role === "super" && <span className="super-crown">👑</span>}</div>
                      <div className="req-email">{a.email}</div>
                      <div className="req-time">Admin since: {a.approvedAt ? new Date(a.approvedAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"}) : "—"}</div>
                    </div>
                  </div>
                  <div className="request-card-right">
                    {a.role === "super"
                      ? <span className="req-status-badge badge-approved">👑 Owner</span>
                      : <button className="req-btn reject" onClick={() => handleRevoke(a.email)}>🚫 Revoke</button>
                    }
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/* ═════════════════════════════════════════
   ACCESS DENIED / REQUEST SCREEN
═════════════════════════════════════════ */
function AccessDeniedScreen({ user, navigate }) {
  const [reqStatus, setReqStatus] = useState(() => getRequestStatus(user.email));
  const [requesting, setRequesting] = useState(false);

  function handleRequest() {
    setRequesting(true);
    setTimeout(() => {
      requestAdminAccess(user);
      setReqStatus(getRequestStatus(user.email));
      setRequesting(false);
    }, 800);
  }

  const statusMap = {
    pending:  { icon: "⏳", color: "#fde047", title: "Request Pending",   msg: `Your request has been sent to the super admin (${SUPER_ADMIN_EMAIL}). You'll get access once they approve it.` },
    approved: { icon: "✅", color: "#a3e635", title: "You're an Admin!",  msg: "Your request was approved! Refresh the page to enter the admin panel." },
    rejected: { icon: "❌", color: "#f87171", title: "Request Rejected",  msg: `Your request was rejected. Contact ${SUPER_ADMIN_EMAIL} for more information.` },
  };

  const info = reqStatus ? statusMap[reqStatus.status] : null;

  return (
    <div className="auth-bg">
      <div className="auth-orb orb1" />
      <div className="auth-orb orb2" />
      <div className="auth-card fade-up" style={{ maxWidth: 460 }}>

        {!info ? (
          <>
            <div className="auth-icon-wrap" style={{ background: "rgba(248,113,113,0.1)", color: "#f87171" }}>
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="auth-title">Admin Access Required</h1>
            <p className="auth-sub">
              You're logged in as <strong style={{ color:"#a3e635" }}>{user.name}</strong>, but don't have admin privileges yet.
            </p>

            <div className="access-info-box">
              <div className="access-info-row">
                <span>👑 Super Admin</span>
                <span style={{ color:"#fb923c", fontSize:"0.8rem" }}>{SUPER_ADMIN_EMAIL}</span>
              </div>
              <p style={{ fontSize:"0.78rem", color:"rgba(255,255,255,0.4)", marginTop:"0.6rem", lineHeight:1.6 }}>
                Send a request below. <strong style={{ color:"white" }}>{SUPER_ADMIN_EMAIL}</strong> will review and approve or reject it.
              </p>
            </div>

            <button className="btn-primary" style={{ background:"linear-gradient(135deg,#fb923c,#f59e0b)" }}
              onClick={handleRequest} disabled={requesting}>
              {requesting
                ? <span className="btn-loading"><span className="spinner" /> Sending…</span>
                : "📩 Request Admin Access"}
            </button>
            <p className="auth-switch" style={{ marginTop:"1rem" }}>
              <button className="link-btn" onClick={() => navigate("/home")}>← Back to Home</button>
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize:"3.5rem", textAlign:"center", marginBottom:"0.5rem" }}>{info.icon}</div>
            <h1 className="auth-title" style={{ color: info.color }}>{info.title}</h1>
            <p className="auth-sub" style={{ lineHeight:1.7 }}>{info.msg}</p>

            {reqStatus.status === "approved" && (
              <button className="btn-primary" style={{ background:"linear-gradient(135deg,#a3e635,#2dd4bf)", color:"#0a0f0d" }}
                onClick={() => window.location.reload()}>
                🔄 Refresh & Enter Panel
              </button>
            )}
            {reqStatus.status === "pending" && (
              <div className="pending-info">
                <div className="pending-dot-row">
                  <span className="pending-dot" />
                  <span className="pending-dot" style={{ animationDelay:"0.25s" }} />
                  <span className="pending-dot" style={{ animationDelay:"0.5s" }} />
                </div>
                <p style={{ fontSize:"0.76rem", color:"rgba(255,255,255,0.3)", marginTop:"0.75rem" }}>
                  Awaiting approval from {SUPER_ADMIN_EMAIL}
                </p>
              </div>
            )}
            <p className="auth-switch" style={{ marginTop:"1.25rem" }}>
              <button className="link-btn" onClick={() => navigate("/home")}>← Back to Home</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
