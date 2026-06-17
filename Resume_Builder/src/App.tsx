import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { ResumesPage } from "./pages/ResumesPage";
import { CreateResumePage } from "./pages/CreateResumePage";
import { BuilderPage } from "./pages/BuilderPage";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/resumes" element={<ResumesPage />} />
          <Route path="/resumes/new" element={<CreateResumePage />} />
          <Route path="/resumes/:id/edit" element={<BuilderPage />} />
        </Route>

        <Route path="/app/*" element={<Navigate to="/resumes" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
