import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, Heart, Users, TrendingUp, Target, Shield, Award, Sparkles, HandHeart, Globe, Building2, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ProjectCard } from '../components/ProjectCard';
import { projectService } from '../lib/api/project.service';
import type { Project } from '../lib/api/types';
import { getErrorMessage } from '../lib/api';

interface LandingPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [projectsError, setProjectsError] = useState('');

  useEffect(() => {
    let active = true;

    projectService
      .getProjects()
      .then((projects) => {
        if (!active) return;
        setFeaturedProjects(projects.slice(0, 3));
      })
      .catch((error) => {
        if (!active) return;
        setProjectsError(getErrorMessage(error));
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0a4a70] via-[#0f5e8e] to-[#0ea5e9] text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDEzNGgzNnYzNmgtMzZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-10"></div>
        
        {/* Animated circles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 lg:py-32 relative z-10">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 bg-white/10 backdrop-blur-md rounded-full mb-4 sm:mb-6 border border-white/20 shadow-lg">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-300" />
              <span className="text-xs sm:text-sm font-medium">Empowering Communities Through Volunteering</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight">
              ImpactHub
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 text-blue-50 max-w-2xl leading-relaxed">
              Join a community of changemakers. Volunteer or partner with verified NGOs creating real social impact across India.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 hover:scale-105 transition-all shadow-xl hover:shadow-2xl h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold"
                onClick={() => onNavigate('volunteer-registration')}
              >
                <Users className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Become a Volunteer
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all h-12 sm:h-14 px-6 sm:px-8 text-sm sm:text-base font-semibold shadow-lg"
                onClick={() => onNavigate('directory')}
              >
                Browse NGOs
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-12 sm:h-16 md:h-auto">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#f9fafb"
            />
          </svg>
        </div>
      </section>

      {/* Registration Options - Prominent */}
      <section className="py-6 sm:py-8 md:py-12 -mt-4 sm:-mt-8 md:-mt-12 lg:-mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Register as Volunteer */}
            <Card className="shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-secondary group">
              <CardContent className="p-6 sm:p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Register as Volunteer</h3>
                <p className="text-gray-600 mb-6">
                  Share your skills, time, and passion. Join our community of volunteers making real impact across India.
                </p>
                <Button
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 hover:scale-105 transition-all w-full"
                  onClick={() => onNavigate('volunteer-registration')}
                >
                  <UserPlus className="mr-2 w-5 h-5" />
                  Start Volunteering
                </Button>
              </CardContent>
            </Card>

            {/* Register as NGO */}
            <Card className="shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-primary group">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-blue-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  <Building2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Register Your NGO</h3>
                <p className="text-gray-600 mb-6">
                  Expand your reach, find volunteers, and showcase your impact. Join verified NGOs on our platform.
                </p>
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all w-full"
                  onClick={() => onNavigate('ngo-registration')}
                >
                  <Building2 className="mr-2 w-5 h-5" />
                  Register NGO
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Volunteer Section - Prominent */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-secondary/10 rounded-full mb-3 sm:mb-4">
                <HandHeart className="w-3 h-3 sm:w-4 sm:h-4 text-secondary" />
                <span className="text-xs sm:text-sm text-secondary font-semibold">Make a Difference</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                Share Your Skills, Change Lives
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
                Join our community of volunteers making real impact. From teaching to healthcare, find opportunities that match your skills and schedule.
              </p>

              <Button
                size="lg"
                className="bg-secondary hover:bg-secondary/90 hover:scale-105 transition-all shadow-lg"
                onClick={() => onNavigate('directory')}
              >
                <Users className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Find Opportunities
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <Card className="hover:shadow-lg transition-all group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Teaching & Education</h4>
                      <p className="text-sm text-gray-600">Empower students through education and skill development programs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Heart className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Healthcare Support</h4>
                      <p className="text-sm text-gray-600">Provide medical assistance and health awareness in communities</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-all group cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Globe className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">Environment & Sustainability</h4>
                      <p className="text-sm text-gray-600">Protect our planet through conservation and green initiatives</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-semibold">Live Projects</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Creating Real Impact Today
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Every contribution counts. See how your support directly impacts communities across India.
            </p>
          </div>

          {projectsError ? (
            <Card className="p-6 text-center mb-8">
              <p className="text-sm text-red-700">Failed to load featured projects: {projectsError}</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onViewDetails={(id) => onNavigate('project', { projectId: String(id) })}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <Button
              size="lg"
              variant="outline"
              className="hover:scale-105 transition-all"
              onClick={() => onNavigate('directory')}
            >
              View All Projects
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* How ImpactHub Works */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple. Transparent. Impactful.
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Four easy steps to create meaningful change
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold group-hover:scale-110 transition-transform shadow-lg">
                1
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Verified NGOs
              </h3>
              <p className="text-sm text-gray-600">
                Browse verified NGOs with transparent track records
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold group-hover:scale-110 transition-transform shadow-lg">
                2
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Choose Impact
              </h3>
              <p className="text-sm text-gray-600">
                Pick causes and projects that matter to you
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold group-hover:scale-110 transition-transform shadow-lg">
                3
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Volunteer
              </h3>
              <p className="text-sm text-gray-600">
                Share your time, skills, and passion for causes
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold group-hover:scale-110 transition-transform shadow-lg">
                4
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Track Impact
              </h3>
              <p className="text-sm text-gray-600">
                See real-time updates and measurable outcomes
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Making Every Contribution Count
              </h2>
              <p className="text-lg text-gray-600">
                Complete transparency. Verified impact. Real change.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">100% Verified</h4>
                  <p className="text-sm text-gray-600">
                    Every NGO undergoes thorough compliance checks
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Clear Reporting</h4>
                  <p className="text-sm text-gray-600">
                    Track every activity with detailed progress updates
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-3" />
                  <h4 className="font-semibold text-gray-900 mb-2">Real Outcomes</h4>
                  <p className="text-sm text-gray-600">
                    Measurable impact with beneficiary data
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-[#0a4a70] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make an Impact?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Join thousands of changemakers creating real social change through ImpactHub
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-secondary hover:bg-secondary/90 hover:scale-105 transition-all shadow-lg"
              onClick={() => onNavigate('volunteer-registration')}
            >
              <Users className="mr-2 w-5 h-5" />
              Volunteer Today
            </Button>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 hover:scale-105 transition-all shadow-lg"
              onClick={() => onNavigate('ngo-admin')}
            >
              <Building2 className="mr-2 w-5 h-5" />
              Register Your NGO
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}