import { useEffect, useState } from 'react';
import { ArrowLeft, Mail, Lock, Users, Building2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { authService } from '../lib/api/auth.service';
import { ngoService } from '../lib/api/ngo.service';
import { getErrorMessage } from '../lib/api/client';

interface LoginPageProps {
  onNavigate: (page: string, params?: any) => void;
  onLogin: (response: any) => Promise<void>;
  infoMessage?: string;
  initialUserType?: 'volunteer' | 'ngo';
}

export function LoginPage({ onNavigate, onLogin, infoMessage, initialUserType = 'volunteer' }: LoginPageProps) {
  const [userType, setUserType] = useState<'volunteer' | 'ngo'>(initialUserType);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setUserType(initialUserType);
  }, [initialUserType]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await authService.login(email, password);

      if (!response.userType) {
        setError(response.message || 'Invalid credentials');
        return;
      }

      if (response.userType === 'VOLUNTEER') {
        await onLogin(response);
        onNavigate('volunteer-dashboard');
        return;
      }

      if (response.userType === 'NGO') {
        const ngos = await ngoService.getNGOs();
        const ngo = ngos.find((entry) => entry.email === response.email || entry.userEmail === response.email);

        if (!ngo) {
          authService.logout();
          setError('NGO profile not found. Please contact support.');
          return;
        }

        const status = String(ngo.status ?? '').toUpperCase();
        const isApproved = ngo.isVerified === true || status === 'APPROVED';

        if (!isApproved) {
          authService.logout();
          setError(
            status === 'REJECTED'
              ? 'Your NGO registration was rejected. Please contact admin for details.'
              : 'Your NGO account is pending admin approval. Access is enabled only after approval.'
          );
          return;
        }

        localStorage.setItem('currentNGO', JSON.stringify(ngo));
        await onLogin({ ...response, fullName: ngo.ngoName, userId: ngo.id });
        onNavigate('ngo-admin');
        return;
      }

      if (response.userType === 'ADMIN') {
        await onLogin(response);
        onNavigate('admin');
        return;
      }

      setError('Unsupported account type from server.');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
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
            type="button"
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
                type="button"
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
                type="button"
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

            {/* ✅ Real Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {infoMessage && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800">{infoMessage}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@example.com"
                    className="pl-10 bg-white h-12"
                    required
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
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="your password"
                    className="pl-10 bg-white h-12 pr-10"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
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
                type="submit"
                disabled={isSubmitting}
                className={`w-full h-12 text-base font-semibold shadow-lg hover:shadow-xl transition-all ${
                  userType === 'volunteer'
                    ? 'bg-secondary hover:bg-secondary/90'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button
                    type="button"
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
            </form>
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