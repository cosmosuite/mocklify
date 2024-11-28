import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthPage } from './pages/AuthPage';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './components/Dashboard/index';
import { TestimonialGenerator } from './components/TestimonialGenerator';
import { HandwrittenTestimonial } from './components/HandwrittenTestimonial';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { PaymentScreenshot } from './components/PaymentScreenshot';
import { AuthCallback } from './components/auth/AuthCallback';
import { useAuth } from './contexts/AuthContext';

// Protected Route Component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      navigate('/auth', { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [user, navigate, location]);

  return user ? <>{children}</> : null;
}

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/login" element={<Navigate to="/auth" replace />} />
      <Route path="/signup" element={<Navigate to="/auth" replace />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="generator" element={<TestimonialGenerator />} />
        <Route path="handwritten" element={<HandwrittenTestimonial />} />
        <Route path="history" element={<History />} />
        <Route path="payment-screenshot" element={<PaymentScreenshot />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}