import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { usePuterStore } from "~/lib/puter";

export function useRequireAuth() {
  const { auth, isLoading } = usePuterStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=${location.pathname}`);
    }
  }, [isLoading, auth.isAuthenticated, navigate, location.pathname]);

  return { auth, isLoading };
}
