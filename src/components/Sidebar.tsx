import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard,
  MessageSquareQuote,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  ChevronDown,
  ChevronUp,
  Loader2,
  Menu
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { TokenBalance } from './TokenBalance';

interface Props {
  currentView: 'dashboard' | 'generator' | 'history' | 'settings' | 'payment-screenshot';
  onViewChange: (view: 'dashboard' | 'generator' | 'history' | 'settings' | 'payment-screenshot') => void;
}

export function Sidebar({ currentView, onViewChange }: Props): JSX.Element {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    social: true,
    payments: true
  });
  const sidebarRef = useRef<HTMLDivElement>(null);

  const mainMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }
  ];

  const socialItems = [
    { 
      id: 'generator', 
      icon: MessageSquareQuote, 
      label: 'Testimonials'
    }
  ];

  const paymentItems = [
    {
      id: 'payment-screenshot',
      icon: Bell,
      label: 'Notification',
    }
  ];

  const bottomMenuItems = [
    { id: 'history', icon: History, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help' }
  ];

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const toggleSection = (section: 'social' | 'payments') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  useEffect(() => {
    function handleMouseEnter() {
      if (isCollapsed) {
        setIsCollapsed(false);
      }
    }

    function handleMouseLeave() {
      if (!isCollapsed) {
        setIsCollapsed(true);
      }
    }

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('mouseenter', handleMouseEnter);
      sidebar.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('mouseenter', handleMouseEnter);
        sidebar.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [isCollapsed]);

  // Update currentView based on location
  useEffect(() => {
    const path = location.pathname.slice(1) || 'dashboard';
    if (path !== currentView) {
      onViewChange(path as any);
    }
  }, [location, currentView, onViewChange]);

  return (
    <div 
      ref={sidebarRef}
      className={cn(
        "fixed left-0 top-0 h-screen bg-gray-50 border-r border-gray-200 z-50 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "h-16 px-4 flex items-center border-b border-gray-200",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && <div className="font-semibold text-xl text-gray-900">TestiGen</div>}
        <Menu className="w-5 h-5 text-gray-500" />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {/* Main Menu */}
          <ul className="space-y-1 mb-4">
            {mainMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id as any)}
                  className={cn(
                    "w-full flex items-center rounded-lg transition-colors",
                    isCollapsed ? "px-3 py-2.5 justify-center" : "px-4 py-2",
                    currentView === item.id
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
                  )}
                >
                  <item.icon size={18} />
                  {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>

          {/* Social Proof Section */}
          <div className="mb-4">
            {!isCollapsed && (
              <button
                onClick={() => toggleSection('social')}
                className="w-full flex items-center justify-between px-3 mb-2 text-xs font-medium text-gray-400 uppercase hover:text-gray-600"
              >
                <span>Social Proof</span>
                {expandedSections.social ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
            {expandedSections.social && (
              <ul className="space-y-1">
                {socialItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onViewChange(item.id as any)}
                      className={cn(
                        "w-full flex items-center rounded-lg transition-colors",
                        isCollapsed ? "px-3 py-2.5 justify-center" : "px-4 py-2",
                        currentView === item.id
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
                      )}
                    >
                      <item.icon size={18} />
                      {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Payment Proof Section */}
          <div className="mb-4">
            {!isCollapsed && (
              <button
                onClick={() => toggleSection('payments')}
                className="w-full flex items-center justify-between px-3 mb-2 text-xs font-medium text-gray-400 uppercase hover:text-gray-600"
              >
                <span>Payment Proof</span>
                {expandedSections.payments ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
            {expandedSections.payments && (
              <ul className="space-y-1">
                {paymentItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => onViewChange(item.id as any)}
                      className={cn(
                        "w-full flex items-center rounded-lg transition-colors",
                        isCollapsed ? "px-3 py-2.5 justify-center" : "px-4 py-2",
                        currentView === item.id
                          ? "bg-gray-900 text-white"
                          : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
                      )}
                    >
                      <item.icon size={18} />
                      {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Bottom Menu */}
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2 text-xs font-medium text-gray-400 uppercase">
                General
              </div>
            )}
            <ul className="space-y-1">
              {bottomMenuItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => ['history', 'settings'].includes(item.id) && onViewChange(item.id as any)}
                    className={cn(
                      "w-full flex items-center rounded-lg transition-colors",
                      isCollapsed ? "px-3 py-2.5 justify-center" : "px-4 py-2",
                      currentView === item.id
                        ? "bg-gray-900 text-white"
                        : "text-gray-600 hover:bg-gray-200/50 hover:text-gray-900"
                    )}
                  >
                    <item.icon size={18} />
                    {!isCollapsed && <span className="ml-3 text-sm font-medium">{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex-shrink-0 p-2 border-t border-gray-200">
          {isCollapsed ? (
            <TokenBalance isExpanded={false} />
          ) : (
            <TokenBalance />
          )}
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "w-full flex items-center rounded-lg text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 transition-colors mt-2",
              isCollapsed ? "px-3 py-2.5 justify-center" : "px-4 py-2"
            )}
            title={isCollapsed ? "Logout" : undefined}
          >
            {isLoggingOut ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <LogOut size={18} />
            )}
            {!isCollapsed && (
              <span className="ml-3 text-sm font-medium">
                {isLoggingOut ? 'Logging out...' : 'Logout'}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}