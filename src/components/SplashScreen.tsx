import { Heart } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(onComplete, 500); // Wait for fade out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-gradient-to-br from-[#0a4a70] via-[#0f5e8e] to-[#0ea5e9] z-[9999] flex items-center justify-center transition-opacity duration-500 ${
        isAnimating ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="text-center px-4 sm:px-6">
        {/* Logo with pop animation */}
        <div
          className={`transform transition-all duration-700 ease-out ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          style={{
            animation: isAnimating ? 'popIn 0.6s ease-out' : 'none',
          }}
        >
          {/* Mobile: Stacked Layout */}
          <div className="flex flex-col items-center justify-center gap-4 mb-6 md:hidden">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Heart className="w-8 h-8 text-primary" fill="currentColor" />
            </div>
            <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">
              ImpactHub
            </h1>
          </div>

          {/* Desktop: Side-by-side Layout */}
          <div className="hidden md:flex items-center justify-center gap-6 mb-6">
            <div className="w-16 h-16 lg:w-20 lg:h-20 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
              <Heart className="w-10 h-10 lg:w-12 lg:h-12 text-primary" fill="currentColor" />
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none">
              ImpactHub
            </h1>
          </div>
        </div>

        {/* Tagline with delayed pop animation */}
        <div
          className={`transform transition-all duration-700 ease-out delay-300 ${
            isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
          style={{
            animation: isAnimating ? 'popIn 0.6s ease-out 0.3s both' : 'none',
          }}
        >
          <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 font-semibold max-w-2xl mx-auto px-4">
            Making Every Contribution Count
          </p>
        </div>
      </div>

      <style>{`
        @keyframes popIn {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}