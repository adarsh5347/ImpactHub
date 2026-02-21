import { useState } from 'react';
import { ArrowLeft, Mail, Lock, Users, Building2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';

interface LoginPageProps {
  onNavigate: (page: string, params?: any) => void;
  onLogin: (userType: 'volunteer' | 'ngo', userData: any) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [userType, setUserType] = useState<'volunteer' | 'ngo'>('volunteer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    if (userType === 'volunteer') {
      const volunteers = JSON.parse(localStorage.getItem('volunteers') || '[]');
      const volunteer = volunteers.find((v: any) => v.email === email);
      
      if (!volunteer) {
        setError('No volunteer account found. Please register first.');
        return;
      }

      if (volunteer.password !== password) {
        setError('Incorrect password. Please try again.');
        return;
      }

      localStorage.setItem('currentVolunteer', JSON.stringify(volunteer));
      onLogin('volunteer', volunteer);
      onNavigate('volunteer-dashboard');
    } else {
      const ngos = JSON.parse(localStorage.getItem('ngos') || '[]');
      const ngo = ngos.find((n: any) => n.email === email);
      
      if (!ngo) {
        setError('No NGO account found. Please register first.');
        return;
      }

      if (ngo.password !== password) {
        setError('Incorrect password. Please try again.');
        return;
      }

      localStorage.setItem('currentNGO', JSON.stringify(ngo));
      onLogin('ngo', ngo);
      onNavigate('ngo-admin');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-6 sm:py-8 md:py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('landing')}
            className="gap-2 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back to Home
          </Button>
        </div>

        <Card className="shadow-2xl border-0">
          <CardContent className="p-6 sm:p-8">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-lg">
                {userType === 'volunteer' ? (
                  <Users className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                ) : (
                  <Building2 className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Sign in to continue to ImpactHub
              </p>
            </div>

            {/* User Type Toggle */}
            <div className="flex gap-2 mb-4 sm:mb-6 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setUserType('volunteer')}
                className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-md text-sm sm:text-base font-medium transition-all ${
                  userType === 'volunteer'
                    ? 'bg-white text-secondary shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                Volunteer
              </button>
              <button
                onClick={() => setUserType('ngo')}
                className={`flex-1 py-2 sm:py-2.5 px-3 sm:px-4 rounded-md text-sm sm:text-base font-medium transition-all ${
                  userType === 'ngo'
                    ? 'bg-white text-primary shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 className="w-3 h-3 sm:w-4 sm:h-4 inline mr-1 sm:mr-2" />
                NGO
              </button>
            </div>

            {/* Login Form */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="pl-10 bg-white h-12"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="your password"
                    className="pl-10 bg-white h-12"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <Button
                onClick={handleLogin}
                className={`w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all ${
                  userType === 'volunteer'
                    ? 'bg-secondary hover:bg-secondary/90'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                Sign In
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() =>
                      onNavigate(
                        userType === 'volunteer'
                          ? 'volunteer-registration'
                          : 'ngo-registration'
                      )
                    }
                    className={`font-semibold hover:underline ${
                      userType === 'volunteer' ? 'text-secondary' : 'text-primary'
                    }`}
                  >
                    Register here
                  </button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Use the email and password you provided during registration
          </p>
        </div>
      </div>
    </div>
  );
}