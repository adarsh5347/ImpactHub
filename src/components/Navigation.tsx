import { useState } from 'react';
import { Menu, X, Heart, LogOut, User } from 'lucide-react';
import { Button } from './ui/button';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  userRole?: 'donor' | 'volunteer' | 'ngo' | null;
  currentUser?: any;
  onLogout?: () => void;
}

export function Navigation({ currentPage, onNavigate, userRole, currentUser, onLogout }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Home', page: 'landing' },
    { label: 'Browse NGOs', page: 'directory' },
    { label: 'Volunteer', page: 'volunteer-dashboard' },
  ];

  const roleMenuItems = [
    { label: 'Volunteer Dashboard', page: 'volunteer-dashboard', role: 'volunteer' },
    { label: 'NGO Admin Panel', page: 'ngo-admin', role: 'ngo' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate('landing')}
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity group"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-bold text-xl text-gray-900">ImpactHub</span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`font-medium transition-all relative ${
                  currentPage === item.page
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.label}
                {currentPage === item.page && (
                  <div className="absolute -bottom-[21px] left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            ))}
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            {userRole && currentUser ? (
              <>
                {/* User Menu */}
                <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-50 to-green-50 rounded-full">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-gray-900">
                      {currentUser.fullName || currentUser.ngoName || 'User'}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">{userRole}</div>
                  </div>
                </div>
                
                {roleMenuItems
                  .filter(item => item.role === userRole)
                  .map((item) => (
                    <Button
                      key={item.page}
                      variant="outline"
                      size="sm"
                      onClick={() => onNavigate(item.page)}
                      className="border-2 hover:shadow-md transition-all"
                    >
                      {item.label}
                    </Button>
                  ))}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('login')}
                  className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white transition-all"
                >
                  Sign In as Volunteer
                </Button>
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md hover:shadow-lg transition-all"
                  onClick={() => onNavigate('login')}
                >
                  NGO Sign In
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.page}
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className={`${
                    currentPage === item.page
                      ? 'text-primary font-semibold'
                      : 'text-gray-600'
                  } text-left py-2`}
                >
                  {item.label}
                </button>
              ))}
              
              {userRole && currentUser ? (
                <>
                  <div className="py-2 border-t border-gray-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {currentUser.fullName || currentUser.ngoName || 'User'}
                        </div>
                        <div className="text-sm text-gray-500 capitalize">{userRole}</div>
                      </div>
                    </div>
                  </div>
                  
                  {roleMenuItems
                    .filter(item => item.role === userRole)
                    .map((item) => (
                      <Button
                        key={item.page}
                        variant="outline"
                        onClick={() => {
                          onNavigate(item.page);
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start"
                      >
                        {item.label}
                      </Button>
                    ))}
                  
                  <Button
                    variant="ghost"
                    onClick={() => {
                      onLogout?.();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <div className="flex flex-col space-y-2 pt-2 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="border-2 border-secondary text-secondary hover:bg-secondary hover:text-white"
                  >
                    Sign In as Volunteer
                  </Button>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-primary to-blue-600"
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                  >
                    NGO Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}