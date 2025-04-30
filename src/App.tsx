import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Index from "./pages/Index";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import TrackerPage from "./pages/TrackerPage";
import JournalPage from "./pages/JournalPage";
import CalmPage from "./pages/CalmPage";
import EntertainPage from "./pages/EntertainPage";
import GettingStartedPage from "./pages/GettingStartedPage";
import AICompanionPage from "./pages/AICompanionPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const completed = localStorage.getItem("onboardingCompleted") === "true";
    setOnboardingCompleted(completed);
  }, []);

  if (onboardingCompleted === null) return null;

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/signup" element={<SignupPage />} />
      <Route 
        path="/getting-started" 
        element={<GettingStartedPage onComplete={() => setOnboardingCompleted(true)} />} 
      />

      {/* Protected routes */}
      <Route 
        path="/" 
        element={
          <AuthGuard>
            {onboardingCompleted ? <Index /> : <Navigate to="/getting-started" replace />}
          </AuthGuard>
        } 
      />
      <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
      <Route path="/tracker" element={<AuthGuard><TrackerPage /></AuthGuard>} />
      <Route path="/journal" element={<AuthGuard><JournalPage /></AuthGuard>} />
      <Route path="/calm" element={<AuthGuard><CalmPage /></AuthGuard>} />
      <Route path="/entertain" element={<AuthGuard><EntertainPage /></AuthGuard>} />
      <Route path="/ai-companion" element={<AuthGuard><AICompanionPage /></AuthGuard>} />

      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
