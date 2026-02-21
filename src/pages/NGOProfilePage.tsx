import { ArrowLeft, CheckCircle2, MapPin, Calendar, FileText, Heart, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProjectCard } from '../components/ProjectCard';
import { mockNGOs, mockProjects } from '../lib/mock-data';

interface NGOProfilePageProps {
  ngoId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function NGOProfilePage({ ngoId, onNavigate }: NGOProfilePageProps) {
  const ngo = mockNGOs.find((n) => n.id === ngoId);
  const ngoProjects = mockProjects.filter((p) => p.ngoId === ngoId);
  const activeProjects = ngoProjects.filter((p) => p.status === 'ongoing');
  const completedProjects = ngoProjects.filter((p) => p.status === 'completed');

  if (!ngo) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2>NGO not found</h2>
        <Button onClick={() => onNavigate('directory')} className="mt-4">
          Back to Directory
        </Button>
      </div>
    );
  }

  return (
    <div>
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('directory')}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Button>
      </div>

      {/* Cover Image */}
      <div className="w-full h-64 md:h-80 overflow-hidden bg-gray-200">
        <img
          src={ngo.coverImage}
          alt={ngo.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* NGO Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 mb-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={ngo.logo}
                alt={`${ngo.name} logo`}
                className="w-32 h-32 rounded-lg object-cover border-4 border-white shadow-lg"
              />
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {ngo.name}
                      </h1>
                      {ngo.verified && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-semibold">Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{ngo.location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Founded {ngo.yearFounded}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{ngo.registrationNumber}</span>
                      </div>
                    </div>
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {ngo.cause}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 md:mt-0">
                    <Button className="bg-accent hover:bg-accent/90">
                      <Heart className="w-4 h-4 mr-2" />
                      Donate
                    </Button>
                    <Button variant="outline">
                      <Users className="w-4 h-4 mr-2" />
                      Volunteer
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-1">
                {ngo.activeProjects}
              </div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-1">
                {ngo.completedProjects}
              </div>
              <div className="text-sm text-gray-600">Completed Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-accent mb-1">
                ₹{(ngo.totalFundsRaised / 100000).toFixed(1)}L
              </div>
              <div className="text-sm text-gray-600">Funds Raised</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {ngo.yearFounded ? new Date().getFullYear() - ngo.yearFounded : 0}
              </div>
              <div className="text-sm text-gray-600">Years of Impact</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Left Column - About */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About This NGO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Mission</h3>
                  <p className="text-gray-700">{ngo.mission}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vision</h3>
                  <p className="text-gray-700">{ngo.vision}</p>
                </div>
              </CardContent>
            </Card>

            {/* Projects Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="active">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="active">
                      Active ({activeProjects.length})
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                      Completed ({completedProjects.length})
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="active">
                    {activeProjects.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {activeProjects.map((project) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            onViewDetails={(id) => onNavigate('project', { projectId: id })}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No active projects</p>
                    )}
                  </TabsContent>
                  <TabsContent value="completed">
                    {completedProjects.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4">
                        {completedProjects.map((project) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            onViewDetails={(id) => onNavigate('project', { projectId: id })}
                          />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">No completed projects</p>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Transparency */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Transparency & Trust
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600 italic">
                  "Making Every Contribution Count"
                </p>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Verified NGO</p>
                      <p className="text-xs text-gray-600">
                        Registration and compliance verified
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Regular Updates</p>
                      <p className="text-xs text-gray-600">
                        Project progress tracked and reported
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Fund Allocation</p>
                      <p className="text-xs text-gray-600">
                        Clear breakdown of how funds are used
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">Impact Reporting</p>
                      <p className="text-xs text-gray-600">
                        Measurable outcomes and beneficiary data
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Registration Number</p>
                  <p className="font-mono text-gray-900">{ngo.registrationNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Year Founded</p>
                  <p className="text-gray-900">{ngo.yearFounded}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Primary Cause</p>
                  <p className="text-gray-900">{ngo.cause}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
