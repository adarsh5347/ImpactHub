import { Heart, Target, Users, Shield, Award, Lightbulb } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-blue-600 to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-6">
            <Heart className="w-12 h-12 text-primary" fill="currentColor" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">About ImpactHub</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Empowering NGOs and volunteers to create meaningful social impact across India
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
          </div>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            ImpactHub was created with a simple yet powerful vision: to bridge the gap between passionate volunteers and credible NGOs working towards social good. We believe that every contribution—whether time, skills, or resources—can create a ripple effect of positive change.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our platform streamlines the process of discovering, connecting, and collaborating with verified NGOs across India, making it easier than ever to turn your desire to help into tangible impact.
          </p>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Trust & Transparency</h3>
              <p className="text-gray-600">
                Every NGO on our platform is verified and vetted to ensure credibility, compliance, and genuine social impact.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
              <p className="text-gray-600">
                We prioritize creating meaningful connections between volunteers and organizations to build lasting relationships.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-xl transition-shadow">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Impact Excellence</h3>
              <p className="text-gray-600">
                We focus on quality over quantity, ensuring every partnership creates measurable and sustainable change.
              </p>
            </div>
          </div>
        </div>

        {/* What We Do */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">What We Do</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For Volunteers</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Discover verified NGOs aligned with your passions and values</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Browse volunteer opportunities across various causes and locations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Track your volunteer journey and impact contributions</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Connect with a community of like-minded changemakers</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">For NGOs</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>Reach a wider audience of dedicated volunteers and supporters</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>Manage volunteer applications and communications efficiently</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>Showcase your projects and impact to build credibility</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>Access compliance tools and resources for better governance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Our Commitment */}
        <div className="mt-16 text-center max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            We are committed to maintaining the highest standards of integrity, security, and user experience. ImpactHub is more than just a platform—it's a movement towards a more connected, compassionate, and impactful society.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Together, we can make every contribution count and create lasting change in communities across India.
          </p>
        </div>
      </div>
    </div>
  );
}
