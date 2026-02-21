import { UserPlus, Search, HandHeart, CheckCircle, Building2, FileText, Users, BarChart } from 'lucide-react';

export function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-blue-600 to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">How It Works</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Getting started with ImpactHub is simple. Follow these easy steps to begin your journey of making a difference.
          </p>
        </div>
      </div>

      {/* For Volunteers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">For Volunteers</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Start making an impact in just four simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {/* Step 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              1
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mt-4">
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Sign Up</h3>
            <p className="text-gray-600">
              Create your free volunteer account by providing your basic information, skills, and interests.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              2
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mt-4">
              <Search className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Browse NGOs</h3>
            <p className="text-gray-600">
              Explore verified NGOs and their projects. Filter by cause, location, or skills needed.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              3
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mt-4">
              <HandHeart className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Apply</h3>
            <p className="text-gray-600">
              Apply for volunteer opportunities that match your passions and availability.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              4
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4 mt-4">
              <CheckCircle className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Make Impact</h3>
            <p className="text-gray-600">
              Start volunteering and track your contributions through your personal dashboard.
            </p>
          </div>
        </div>

        {/* For NGOs Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
            <Building2 className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">For NGOs</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connect with passionate volunteers and grow your impact
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-secondary to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              1
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 mt-4">
              <FileText className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Register</h3>
            <p className="text-gray-600">
              Complete your NGO registration with required documentation and compliance certificates.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-secondary to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              2
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 mt-4">
              <CheckCircle className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Get Verified</h3>
            <p className="text-gray-600">
              Our team reviews your application to ensure credibility and compliance standards.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-secondary to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              3
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 mt-4">
              <Building2 className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Create Projects</h3>
            <p className="text-gray-600">
              Post volunteer opportunities and showcase your ongoing projects and impact.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-white rounded-xl shadow-lg p-8 relative">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-secondary to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              4
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4 mt-4">
              <BarChart className="w-7 h-7 text-secondary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Manage & Grow</h3>
            <p className="text-gray-600">
              Connect with volunteers, manage applications, and track your organization's growth.
            </p>
          </div>
        </div>

        {/* Additional Features */}
        <div className="mt-20 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Verified Organizations</h3>
              <p className="text-gray-600 text-sm">
                All NGOs undergo rigorous verification to ensure legitimacy and compliance.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-gray-600 text-sm">
                Our platform helps connect volunteers with opportunities that match their skills and interests.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Impact Tracking</h3>
              <p className="text-gray-600 text-sm">
                Track volunteer hours, project progress, and the collective impact of your contributions.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Secure Platform</h3>
              <p className="text-gray-600 text-sm">
                Your data is protected with industry-standard security measures and privacy controls.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Communication Tools</h3>
              <p className="text-gray-600 text-sm">
                Built-in messaging and notification systems keep everyone connected and informed.
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">Dashboard Analytics</h3>
              <p className="text-gray-600 text-sm">
                Comprehensive dashboards provide insights into activities, applications, and impact metrics.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
