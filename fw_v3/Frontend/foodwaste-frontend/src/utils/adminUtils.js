/* ═══════════════════════════════════════════════
   ADMIN UTILITY — FoodBridge
   Super-admin: bhoomika7444@gmail.com
   All admin state lives in localStorage so it
   works without a backend.
   ═══════════════════════════════════════════════ */

export const SUPER_ADMIN_EMAIL = "bhoomika7444@gmail.com";

/* Keys */
const ADMIN_LIST_KEY    = "fw_admins";       // approved admins []
const REQUESTS_KEY      = "fw_admin_reqs";   // pending requests []

/* ── helpers ── */
function getAdmins() {
  return JSON.parse(localStorage.getItem(ADMIN_LIST_KEY) || "[]");
}
function saveAdmins(list) {
  localStorage.setItem(ADMIN_LIST_KEY, JSON.stringify(list));
}
function getRequests() {
  return JSON.parse(localStorage.getItem(REQUESTS_KEY) || "[]");
}
function saveRequests(list) {
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(list));
}

/* ── Ensure super-admin is always in list ── */
export function ensureSuperAdmin() {
  const admins = getAdmins();
  if (!admins.find(a => a.email === SUPER_ADMIN_EMAIL)) {
    admins.push({
      email: SUPER_ADMIN_EMAIL,
      name: "Bhoomika",
      approvedAt: new Date().toISOString(),
      role: "super",
    });
    saveAdmins(admins);
  }
}

/* ── Check if an email has admin access ── */
export function isAdmin(email) {
  if (!email) return false;
  ensureSuperAdmin();
  return getAdmins().some(a => a.email === email.toLowerCase());
}

export function isSuperAdmin(email) {
  return email?.toLowerCase() === SUPER_ADMIN_EMAIL;
}

/* ── Request admin access ── */
export function requestAdminAccess(user) {
  // user = { id, name, email }
  const reqs = getRequests();
  const admins = getAdmins();

  // Already admin?
  if (admins.find(a => a.email === user.email.toLowerCase())) return { status: "already_admin" };
  // Already requested?
  const existing = reqs.find(r => r.email === user.email.toLowerCase());
  if (existing) return { status: "already_requested", request: existing };

  const req = {
    id: Date.now().toString(),
    email: user.email.toLowerCase(),
    name: user.name,
    userId: user.id,
    requestedAt: new Date().toISOString(),
    status: "pending",   // pending | approved | rejected
  };
  reqs.push(req);
  saveRequests(reqs);
  return { status: "requested", request: req };
}

/* ── Get request status for a user ── */
export function getRequestStatus(email) {
  if (!email) return null;
  const reqs = getRequests();
  return reqs.find(r => r.email === email.toLowerCase()) || null;
}

/* ── Super-admin: get all pending requests ── */
export function getPendingRequests() {
  return getRequests().filter(r => r.status === "pending");
}

export function getAllRequests() {
  return getRequests();
}

/* ── Super-admin: approve a request ── */
export function approveRequest(reqId) {
  const reqs = getRequests();
  const idx  = reqs.findIndex(r => r.id === reqId);
  if (idx === -1) return false;

  reqs[idx].status     = "approved";
  reqs[idx].approvedAt = new Date().toISOString();
  saveRequests(reqs);

  const admins = getAdmins();
  if (!admins.find(a => a.email === reqs[idx].email)) {
    admins.push({
      email:      reqs[idx].email,
      name:       reqs[idx].name,
      approvedAt: reqs[idx].approvedAt,
      role:       "admin",
    });
    saveAdmins(admins);
  }
  return true;
}

/* ── Super-admin: reject a request ── */
export function rejectRequest(reqId) {
  const reqs = getRequests();
  const idx  = reqs.findIndex(r => r.id === reqId);
  if (idx === -1) return false;
  reqs[idx].status     = "rejected";
  reqs[idx].rejectedAt = new Date().toISOString();
  saveRequests(reqs);
  return true;
}

/* ── Super-admin: revoke an admin ── */
export function revokeAdmin(email) {
  if (email.toLowerCase() === SUPER_ADMIN_EMAIL) return false; // can't revoke super
  saveAdmins(getAdmins().filter(a => a.email !== email.toLowerCase()));
  // Also mark their request as rejected
  const reqs = getRequests();
  const idx  = reqs.findIndex(r => r.email === email.toLowerCase());
  if (idx !== -1) { reqs[idx].status = "rejected"; saveRequests(reqs); }
  return true;
}

/* ── Get all approved admins (for display) ── */
export function getApprovedAdmins() {
  ensureSuperAdmin();
  return getAdmins();
}
