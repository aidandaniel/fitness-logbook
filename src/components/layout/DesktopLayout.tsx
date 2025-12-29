import { useLocation } from 'react-router-dom';
import { SidebarNav } from './SidebarNav';
import { BottomNav } from './BottomNav';
import { Footer } from './Footer';

interface DesktopLayoutProps {
  children: React.ReactNode;
}

export function DesktopLayout({ children }: DesktopLayoutProps) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 flex-col">
      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <SidebarNav currentPath={location.pathname} />

        {/* Main Content Area */}
        <div className="flex-1 md:ml-0 flex flex-col min-w-0">
          <main className="flex-1">
            {children}
          </main>
          
          {/* Footer - Hidden on mobile, shown on desktop */}
          <div className="hidden md:block">
            <Footer />
          </div>
        </div>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav currentPath={location.pathname} />
    </div>
  );
}
