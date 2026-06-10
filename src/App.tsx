import { lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { AetherLoader } from "./components/AetherLoader";
import { ScrollToTop } from "./components/ScrollToTop";
import { queryClient } from "./lib/queryClient";

// Lazy-load every page — each becomes its own JS chunk loaded on demand.
// This means the initial bundle only includes React, the router, and the
// providers — NOT the heavy ChatPage or landing page component tree.
const Index = lazy(() => import("./pages/Index"));
const ChatPage = lazy(() => import("./pages/ChatPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  if (loading) return <AetherLoader />;
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {/* Reset scroll position on every route change */}
          <ScrollToTop />
          {/* Suspense boundary: shows AetherLoader while any lazy page chunk loads */}
          <Suspense fallback={<AetherLoader />}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/chat"
                element={
                  <ProtectedRoute>
                    <ChatPage />
                  </ProtectedRoute>
                }
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
