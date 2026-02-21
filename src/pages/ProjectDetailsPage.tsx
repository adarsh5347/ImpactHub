import { ArrowLeft, MapPin, Calendar, Users, Target, Heart, UserPlus, Download, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { StatusBadge } from '../components/StatusBadge';
import { mockProjects, mockNGOs } from '../lib/mock-data';

interface ProjectDetailsPageProps {
  projectId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function ProjectDetailsPage({ projectId, onNavigate }: ProjectDetailsPageProps) {
  const project = mockProjects.find((p) => p.id === projectId);
  const ngo = project ? mockNGOs.find((n) => n.id === project.ngoId) : null;

  if (!project || !ngo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2>Project not found</h2>
        <Button onClick={() => onNavigate('directory')} className="mt-4">
          Back to Directory
        </Button>
      </div>
    );
  }

  const fundingProgress = (project.fundsRaised / project.fundingGoal) * 100;
  const volunteerProgress = (project.volunteersEnrolled / project.volunteersNeeded) * 100;

  return (
    <div>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('ngo-profile', { ngoId: project.ngoId })}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {ngo.name}
        </Button>
      </div>

      {/* Project Header */}
      <div className="w-full h-96 overflow-hidden bg-gray-200 relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 text-white p-8">
          <div className="max-w-7xl mx-auto">
            <StatusBadge status={project.status} />
            <h1 className="text-3xl md:text-4xl font-bold mt-3 mb-2">
              {project.title}
            </h1>
            <p className="text-lg text-white/90">{project.ngoName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">Location</span>
                    </div>
                    <p className="font-semibold text-gray-900">{project.location}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Timeline</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {new Date(project.startDate).getFullYear()} - {new Date(project.endDate).getFullYear()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Beneficiaries</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {project.beneficiaries.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">Cause</span>
                    </div>
                    <p className="font-semibold text-gray-900">{project.cause}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Project Description</h3>
                  <p className="text-gray-700 leading-relaxed">{project.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Project Objectives</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Reach {project.beneficiaries.toLocaleString()} beneficiaries across {project.location}
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Implement sustainable {project.cause.toLowerCase()} solutions
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Create measurable impact with transparent reporting
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">
                        Engage local communities for long-term sustainability
                      </span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Required Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Required Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {project.requiredResources.map((resource, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-gray-700">{resource}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Fund Allocation */}
            <Card>
              <CardHeader>
                <CardTitle>Fund Allocation Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4 italic">
                  "Making Every Contribution Count" - Transparent reporting of how your donations are used
                </p>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700">Program Implementation</span>
                      <span className="text-sm font-semibold text-gray-900">65%</span>
                    </div>
                    <Progress value={65} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700">Infrastructure & Resources</span>
                      <span className="text-sm font-semibold text-gray-900">20%</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700">Training & Capacity Building</span>
                      <span className="text-sm font-semibold text-gray-900">10%</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-700">Administrative Costs</span>
                      <span className="text-sm font-semibold text-gray-900">5%</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Donation/Volunteer CTAs */}
          <div className="space-y-6">
            {/* Funding Card */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Support This Project</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Funding Progress */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">Funding Progress</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {Math.round(fundingProgress)}%
                    </span>
                  </div>
                  <Progress value={fundingProgress} className="h-3 mb-3" />
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Raised</span>
                      <span className="font-semibold text-gray-900">
                        ₹{(project.fundsRaised / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Goal</span>
                      <span className="text-gray-700">
                        ₹{(project.fundingGoal / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Remaining</span>
                      <span className="text-accent font-semibold">
                        ₹{((project.fundingGoal - project.fundsRaised) / 100000).toFixed(1)}L
                      </span>
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-accent hover:bg-accent/90" size="lg">
                  <Heart className="w-5 h-5 mr-2" />
                  Donate Now
                </Button>

                {/* Volunteer Section */}
                <div className="pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Volunteer Opportunities</h4>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">Volunteers</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {project.volunteersEnrolled} / {project.volunteersNeeded}
                    </span>
                  </div>
                  <Progress value={volunteerProgress} className="h-2 mb-4" />
                  <Button variant="outline" className="w-full" size="lg">
                    <UserPlus className="w-5 h-5 mr-2" />
                    Join as Volunteer
                  </Button>
                </div>

                {/* Project Documentation */}
                <div className="pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Documentation</h4>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Project Proposal (PDF)
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Budget Breakdown (PDF)
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Impact Report (PDF)
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* NGO Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the NGO</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={ngo.logo}
                    alt={ngo.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{ngo.name}</p>
                    {ngo.verified && (
                      <div className="flex items-center gap-1 text-green-600 text-xs">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Verified NGO</span>
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">{ngo.mission}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onNavigate('ngo-profile', { ngoId: ngo.id })}
                >
                  View NGO Profile
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
