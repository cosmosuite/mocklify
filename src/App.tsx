import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './components/Dashboard';
import { TestimonialGenerator } from './components/TestimonialGenerator';
import { History } from './components/History';
import { Settings } from './components/Settings';
import { PaymentScreenshot } from './components/PaymentScreenshot';
import { useAuth } from './contexts/AuthContext';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard onNavigate={() => {}} />} />
            <Route path="generator" element={<TestimonialGenerator />} />
            <Route path="history" element={<History />} />
            <Route path="payment-screenshot" element={<PaymentScreenshot />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}