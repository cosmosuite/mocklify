import { useState, useRef, useEffect, useCallback } from 'react';
import {
  LayoutDashboard,
  MessageSquareQuote,
  X,
  ChevronLeft,
  History,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  ChevronDown,
  ChevronUp,
  Loader2,
  PenTool
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';
import { TokenBalance } from './TokenBalance';

interface Props {
  currentView: 'dashboard' | 'generator' | 'handwritten' | 'history' | 'settings' | 'payment-screenshot';
  onViewChange: (view: 'dashboard' | 'generator' | 'handwritten' | 'history' | 'settings' | 'payment-screenshot') => void;
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export function Sidebar({ currentView, onViewChange, isOpen, isMobile, onClose }: Props): JSX.Element {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(window.innerWidth >= 768);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    social: true,
    payments: true
  });
  const sidebarRef = useRef<HTMLDivElement>(null);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const mainMenuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }
  ];

  const socialItems = [
    { 
      id: 'generator', 
      icon: MessageSquareQuote, 
      label: 'Social Testimonials'
    },
    {
      id: 'handwritten',
      icon: PenTool,
      label: 'Handwritten Notes'
    }
  ];

  const paymentItems = [
    {
      id: 'payment-screenshot',
      icon: Bell,
      label: 'Payment Notifications',
    }
  ];

  const bottomMenuItems = [
    { id: 'history', icon: History, label: 'History' },
    { id: 'settings', icon: Settings, label: 'Settings' },
    { id: 'help', icon: HelpCircle, label: 'Help' }
  ];

  const handleLogout = async () => {
    if (isLoggingOut) return;
    
    try {
      console.log('Starting logout process...');
      setIsLoggingOut(true);
      
      const result = await signOut();
      console.log('Logout result:', result);
      
      if (result?.success) {
        console.log('Navigating to auth page...');
        navigate('/auth', { replace: true });
      }
    } catch (err) {
      console.error('Detailed logout error:', err);
      const error = err as Error;
      alert(`Logout failed: ${error.message || 'Unknown error'}`);
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
    const path = location.pathname.slice(1) || 'dashboard';
    if (path !== currentView) {
      onViewChange(path as any);
    }
  }, [location, currentView, onViewChange]);

  return (
    <div 
      ref={sidebarRef}
      className={cn("fixed top-0 h-screen bg-[#0F0F0F] border-r border-[#1F1F1F] z-40 transition-all duration-300",
        isMobile ? (
          isOpen ? "left-0" : "-left-full"
        ) : (
          isCollapsed ? "w-16" : "w-64"
        ),
        isMobile ? "w-64" : undefined
      )}
    >
      {/* Logo Section */}
      <div className={cn(
        "h-16 px-4 flex items-center border-b border-[#1F1F1F]",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {isCollapsed ? (
          <img 
            src="https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/67420a637776d5779a90aebe.png"
            alt="Mocklify"
            className="h-8 w-auto"
          />
        ) : (
          <>
            <img 
              src="https://storage.googleapis.com/msgsndr/0iO3mS8O2ALa5vmXwP3d/media/674200b17fc15f51f4219724.png"
              alt="Mocklify"
              className="h-8 w-auto"
            />
            <button
              onClick={toggleCollapse}
              className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-[#1F1F1F] rounded-lg transition-colors"
              title="Collapse sidebar"
            >
              <ChevronLeft size={18} className="transition-transform" />
            </button>
          </>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex-1 overflow-y-auto py-2 px-2">
          {/* Main Menu */}
          <ul className="space-y-1 mb-4" onClick={isMobile ? onClose : undefined}>
            {mainMenuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => onViewChange(item.id as any)}
                  className={cn(
                    "w-full flex items-center rounded-lg transition-colors",
                    isCollapsed ? "px-3 py-2.5 justify-center" : "px-4 py-2",
                    currentView === item.id
                      ? "bg-[#CCFC7E] text-black"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
                className="w-full flex items-center justify-between px-3 mb-2 text-xs font-medium text-gray-400 uppercase hover:text-gray-300"
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
                          ? "bg-[#CCFC7E] text-black"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
                className="w-full flex items-center justify-between px-3 mb-2 text-xs font-medium text-gray-400 uppercase hover:text-gray-300"
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
                          ? "bg-[#CCFC7E] text-black"
                          : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
                        ? "bg-[#CCFC7E] text-black"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
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
        <div className="flex-shrink-0 p-2 border-t border-[#1F1F1F]">
          {isCollapsed ? (
            <TokenBalance isExpanded={false} />
          ) : (
            <TokenBalance />
          )}
          
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={cn(
              "w-full flex items-center rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors mt-2",
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
      
      {/* Mobile Close Button */}
      {isMobile && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-300"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}