import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './pages/LandingPage';
import { NGODirectoryPage } from './pages/NGODirectoryPage';
import { NGOProfilePage } from './pages/NGOProfilePage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { NGOAdminPanel } from './pages/NGOAdminPanel';
import { NGOProjectEditPage } from './pages/NGOProjectEditPage';
import { VolunteerRegistrationPage } from './pages/VolunteerRegistrationPage';
import { NGORegistrationPage } from './pages/NGORegistrationPage';
import { LoginPage } from './pages/LoginPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CompliancePage } from './pages/CompliancePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminNGOApprovalsPage } from './pages/AdminNGOApprovalsPage';
import { AdminVolunteersPage } from './pages/AdminVolunteersPage';
import { authService } from './lib/api/auth.service';
import { useAuth } from './context/AuthContext';
import { Toaster } from './components/ui/sonner';

type Page = 'landing' | 'directory' | 'ngo-profile' | 'project' | 'volunteer-dashboard' | 'ngo-admin' | 'ngo-project-edit' | 'admin' | 'admin-ngos' | 'admin-volunteers' | 'volunteer-registration' | 'ngo-registration' | 'login' | 'about' | 'how-it-works' | 'compliance';

console.log(import.meta.env.VITE_API_URL);

interface PageParams {
  ngoId?: string;
  projectId?: string;
  loginType?: 'volunteer' | 'ngo';
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [pageParams, setPageParams] = useState<PageParams>({});
  const [loginInfoMessage, setLoginInfoMessage] = useState('');
  const { role: userRole, user: currentUser, isInitializing, applyLoginResponse, logout } = useAuth();

  const handleLogin = async (response: any) => {
    await applyLoginResponse(response);
    setLoginInfoMessage('');
  };

  const handleLogout = () => {
    logout();
    setLoginInfoMessage('');
    setCurrentPage('landing');
  };

  const hasSessionRole = (expected: 'volunteer' | 'ngo' | 'admin') => {
    if (userRole === expected) return true;

    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    if (!token) return false;

    if (expected === 'admin') {
      return authService.isAdminToken(token) || !!localStorage.getItem('currentAdmin');
    }

    if (expected === 'volunteer') {
      return !!localStorage.getItem('currentVolunteer');
    }

    return !!localStorage.getItem('currentNGO');
  };

  const isAdminRestrictedPage = (page: string) => {
    return page === 'admin' || page === 'admin-ngos' || page === 'admin-volunteers';
  };

  useEffect(() => {
    if (isInitializing) return;
    if (hasSessionRole('admin') && !isAdminRestrictedPage(currentPage)) {
      setCurrentPage('admin');
      setPageParams({});
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage, isInitializing, userRole]);

  useEffect(() => {
    const handlePopState = () => {
      if (hasSessionRole('admin')) {
        window.location.reload();
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [userRole]);

  const handleNavigate = (page: string, params?: PageParams) => {
    if (page !== 'login') {
      setLoginInfoMessage('');
    }

    if (hasSessionRole('admin') && !isAdminRestrictedPage(page)) {
      setCurrentPage('admin');
      setPageParams({});
      window.location.reload();
      return;
    }

    // Protect volunteer dashboard
    if (page === 'volunteer-dashboard') {
      if (!hasSessionRole('volunteer')) {
        setLoginInfoMessage('Please sign in as a volunteer to continue.');
        setCurrentPage('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Protect NGO admin panel
    if (page === 'ngo-admin' || page === 'ngo-project-edit') {
      if (!hasSessionRole('ngo')) {
        setLoginInfoMessage('Please sign in as an NGO user to continue.');
        setCurrentPage('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    if ((page === 'project' || page === 'ngo-profile') && hasSessionRole('ngo')) {
      setCurrentPage('ngo-admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (page === 'admin' || page === 'admin-ngos' || page === 'admin-volunteers') {
      if (!hasSessionRole('admin')) {
        setLoginInfoMessage('Admin access is required for this page. Please sign in with an admin account.');
        setCurrentPage('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    // Reset user role when going to landing
    if (page === 'landing') {
      // Don't reset the user role, just navigate
    }

    setCurrentPage(page as Page);
    setPageParams(params || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'directory':
        return <NGODirectoryPage onNavigate={handleNavigate} />;
      case 'ngo-profile':
        return pageParams.ngoId ? (
          <NGOProfilePage ngoId={pageParams.ngoId} onNavigate={handleNavigate} />
        ) : (
          <NGODirectoryPage onNavigate={handleNavigate} />
        );
      case 'project':
        return pageParams.projectId ? (
          <ProjectDetailsPage projectId={pageParams.projectId} onNavigate={handleNavigate} />
        ) : (
          <NGODirectoryPage onNavigate={handleNavigate} />
        );
      case 'volunteer-dashboard':
        return <VolunteerDashboard onNavigate={handleNavigate} />;
      case 'ngo-admin':
        return <NGOAdminPanel onNavigate={handleNavigate} />;
      case 'ngo-project-edit':
        return pageParams.projectId ? (
          <NGOProjectEditPage projectId={pageParams.projectId} onNavigate={handleNavigate} />
        ) : (
          <NGOAdminPanel onNavigate={handleNavigate} />
        );
      case 'admin':
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      case 'admin-ngos':
        return (
          <AdminNGOApprovalsPage
            onNavigate={handleNavigate}
            initialStatus={(pageParams as { status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED' }).status}
          />
        );
      case 'admin-volunteers':
        return <AdminVolunteersPage onNavigate={handleNavigate} />;
      case 'volunteer-registration':
        return <VolunteerRegistrationPage onNavigate={handleNavigate} />;
      case 'ngo-registration':
        return <NGORegistrationPage onNavigate={handleNavigate} />;
      case 'login':
        return (
          <LoginPage
            onNavigate={handleNavigate}
            onLogin={handleLogin}
            infoMessage={loginInfoMessage}
            initialUserType={(pageParams as { loginType?: 'volunteer' | 'ngo' }).loginType}
          />
        );
      case 'about':
        return <AboutPage />;
      case 'how-it-works':
        return <HowItWorksPage />;
      case 'compliance':
        return <CompliancePage />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      {!showSplash && !isInitializing && (
        <>
          <Navigation 
            currentPage={currentPage} 
            onNavigate={handleNavigate} 
            userRole={userRole as any}
            currentUser={currentUser as any}
            onLogout={handleLogout}
          />
          <main className="flex-1">
            {renderPage()}
          </main>
          <Footer onNavigate={handleNavigate} />
          <Toaster />
        </>
      )}
    </div>
  );
}