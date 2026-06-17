import { Outlet, useNavigate } from "react-router-dom";
import { LogOut, Plus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function AppShell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-surface">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <button
            type="button"
            onClick={() => navigate("/resumes")}
            className="cursor-pointer text-lg font-bold text-brand-700"
          >
            Career Navigator
          </button>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/resumes/new")}
              className="btn-primary inline-flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold text-white"
            >
              <Plus className="h-4 w-4" />
              New Resume
            </button>
            <span className="hidden text-sm text-muted sm:block">
              Hi, <strong className="text-ink">{user?.name}</strong>
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex cursor-pointer items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-muted hover:bg-slate-100 hover:text-ink"
            >
              <LogOut className="h-4 w-4" />
              Log out
            </button>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
