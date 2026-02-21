import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { SplashScreen } from './components/SplashScreen';
import { LandingPage } from './pages/LandingPage';
import { NGODirectoryPage } from './pages/NGODirectoryPage';
import { NGOProfilePage } from './pages/NGOProfilePage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { DonorDashboard } from './pages/DonorDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { NGOAdminPanel } from './pages/NGOAdminPanel';
import { VolunteerRegistrationPage } from './pages/VolunteerRegistrationPage';
import { NGORegistrationPage } from './pages/NGORegistrationPage';
import { LoginPage } from './pages/LoginPage';
import { AboutPage } from './pages/AboutPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CompliancePage } from './pages/CompliancePage';

type Page = 'landing' | 'directory' | 'ngo-profile' | 'project' | 'donor-dashboard' | 'volunteer-dashboard' | 'ngo-admin' | 'volunteer-registration' | 'ngo-registration' | 'login' | 'about' | 'how-it-works' | 'compliance';
type UserRole = 'donor' | 'volunteer' | 'ngo' | null;

interface PageParams {
  ngoId?: string;
  projectId?: string;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [pageParams, setPageParams] = useState<PageParams>({});
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check for existing session on mount
  useEffect(() => {
    const volunteer = localStorage.getItem('currentVolunteer');
    const ngo = localStorage.getItem('currentNGO');
    
    if (volunteer) {
      setUserRole('volunteer');
      setCurrentUser(JSON.parse(volunteer));
    } else if (ngo) {
      setUserRole('ngo');
      setCurrentUser(JSON.parse(ngo));
    }
  }, []);

  const handleLogin = (userType: 'volunteer' | 'ngo', userData: any) => {
    setUserRole(userType);
    setCurrentUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentVolunteer');
    localStorage.removeItem('currentNGO');
    setUserRole(null);
    setCurrentUser(null);
    setCurrentPage('landing');
  };

  const handleNavigate = (page: string, params?: PageParams) => {
    // Protect volunteer dashboard
    if (page === 'volunteer-dashboard') {
      const volunteer = localStorage.getItem('currentVolunteer');
      if (!volunteer) {
        setCurrentPage('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setUserRole('volunteer');
      setCurrentUser(JSON.parse(volunteer));
    }

    // Protect NGO admin panel
    if (page === 'ngo-admin') {
      const ngo = localStorage.getItem('currentNGO');
      if (!ngo) {
        setCurrentPage('login');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      setUserRole('ngo');
      setCurrentUser(JSON.parse(ngo));
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
      case 'donor-dashboard':
        return <DonorDashboard onNavigate={handleNavigate} />;
      case 'volunteer-dashboard':
        return <VolunteerDashboard onNavigate={handleNavigate} />;
      case 'ngo-admin':
        return <NGOAdminPanel onNavigate={handleNavigate} />;
      case 'volunteer-registration':
        return <VolunteerRegistrationPage onNavigate={handleNavigate} />;
      case 'ngo-registration':
        return <NGORegistrationPage onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} onLogin={handleLogin} />;
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
      {!showSplash && (
        <>
          <Navigation 
            currentPage={currentPage} 
            onNavigate={handleNavigate} 
            userRole={userRole}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
          <main className="flex-1">
            {renderPage()}
          </main>
          <Footer onNavigate={handleNavigate} />
        </>
      )}
    </div>
  );
}