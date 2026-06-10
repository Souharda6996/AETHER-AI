import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Minimal spinner — no Framer Motion dependency here (avoid circular loading)
function AuthLoader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#000",          // match AETHER dark background
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "2px solid rgba(251,146,60,0.2)",   // amber-400 @ 20% — matches AETHER orange
          borderTopColor: "#fb923c",                   // amber-400 solid top
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── Protected Route ──────────────────────────────────────────────────────────
export function ProtectedRoute() {
  const { currentUser, loading } = useAuth();

  // ── CRITICAL: show loader while Firebase checks auth ──────────────────────
  // Without this check, loading=true AND user=null → redirect to login → loop
  if (loading) return <AuthLoader />;

  // ── Auth check complete ────────────────────────────────────────────────────
  // loading is false: either user is set (authenticated) or null (not authenticated)
  if (!currentUser) return <Navigate to="/login" replace />;

  // ── Authenticated: render the protected page ───────────────────────────────
  return <Outlet />;
}

// ─── Public Route (redirect to chat if already logged in) ─────────────────────
export function PublicOnlyRoute() {
  const { currentUser, loading } = useAuth();

  if (loading) return <AuthLoader />;

  // Already logged in — send to chat immediately, skip login page
  if (currentUser) return <Navigate to="/chat" replace />;

  return <Outlet />;
}
