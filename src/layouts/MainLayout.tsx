import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';

export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<'dashboard' | 'generator' | 'history' | 'settings' | 'payment-screenshot'>(
    location.pathname === '/' ? 'dashboard' : 
    location.pathname.slice(1) as any
  );

  const handleViewChange = (view: 'dashboard' | 'generator' | 'history' | 'settings' | 'payment-screenshot') => {
    setCurrentView(view);
    navigate(`/${view === 'dashboard' ? '' : view}`);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="flex-1 flex flex-col min-w-0 ml-16">
        {['generator', 'payment-screenshot'].includes(currentView) && (
          <Header currentView={currentView} />
        )}
        
        <div className="flex-1 bg-gray-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}