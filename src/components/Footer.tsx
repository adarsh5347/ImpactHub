import { Heart, Mail, MapPin, Phone } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gray-900 text-gray-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="font-semibold text-xl text-white">ImpactHub</span>
            </div>
            <p className="text-sm text-gray-400">
              Making Every Contribution Count
            </p>
            <p className="text-sm text-gray-400">
              Connecting NGOs and Volunteers for Greater Social Impact
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleNavigation('about')} className="hover:text-white transition-colors">About Us</button></li>
              <li><button onClick={() => handleNavigation('directory')} className="hover:text-white transition-colors">Browse NGOs</button></li>
              <li><button onClick={() => handleNavigation('how-it-works')} className="hover:text-white transition-colors">How It Works</button></li>
            </ul>
          </div>

          {/* For Organizations */}
          <div>
            <h3 className="font-semibold text-white mb-4">For Organizations</h3>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => handleNavigation('ngo-registration')} className="hover:text-white transition-colors">Register Your NGO</button></li>
              <li><button onClick={() => handleNavigation('compliance')} className="hover:text-white transition-colors">Compliance Guidelines</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>contact@impacthub.org</span>
              </li>
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>+91 9136398778</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>Mumbai, India</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-gray-400">
            © 2026 ImpactHub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}