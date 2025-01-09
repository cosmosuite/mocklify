import { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Menu } from 'lucide-react';
import { cn } from '../lib/utils';

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [currentView, setCurrentView] = useState<'dashboard' | 'generator' | 'history' | 'settings' | 'payment-screenshot'>(
    location.pathname === '/' ? 'dashboard' : 
    location.pathname.slice(1) as any
  );
  const [isSidebarCollapsed] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleViewChange = (view: 'dashboard' | 'generator' | 'history' | 'settings' | 'payment-screenshot') => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    navigate(`/${view === 'dashboard' ? '' : view}`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          className="fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
          style={{ display: isMobileMenuOpen ? 'none' : 'block' }}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu size={24} className="text-gray-700" />
        </button>
      )}

      <Sidebar 
        currentView={currentView} 
        onViewChange={handleViewChange as (view: "dashboard" | "generator" | "history" | "settings" | "payment-screenshot" | "handwritten") => void} 
        isOpen={!isMobile || isMobileMenuOpen}
        isMobile={isMobile}
        onClose={() => setIsMobileMenuOpen(false)}
      />
      
      <main className={cn(
        "flex-1 flex flex-col min-w-0",
        !isMobile && (isSidebarCollapsed ? "ml-16" : "ml-64"),
        isMobile && "ml-0"
      )}>
        {['generator', 'handwritten', 'payment-screenshot'].includes(currentView) && (
          <Header currentView={currentView} />
        )}
        
        <div className={cn(
          "flex-1 bg-gray-50",
          isMobile && "pt-16" // Add padding for mobile menu button
        )}>
          <Outlet />
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}