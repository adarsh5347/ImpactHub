import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, CheckCircle2, MapPin, Calendar, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { ProjectCard } from '../components/ProjectCard';
import { ngoService } from '../lib/api/ngo.service';
import { getErrorMessage } from '../lib/api';
import type { NGO, Project } from '../lib/api/types';
import { useAuth } from '../context/AuthContext';
import { NgoLogo } from '../components/NgoLogo';

interface NGOProfilePageProps {
  ngoId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function NGOProfilePage({ ngoId, onNavigate }: NGOProfilePageProps) {
  const { role } = useAuth();
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [ngoProjects, setNgoProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (role === 'ngo') {
      onNavigate('ngo-admin');
      return;
    }

    let active = true;
    setIsLoading(true);
    setError('');

    Promise.all([ngoService.getNGOs(), ngoService.getNGOProjects(ngoId)])
      .then(([ngos, projects]) => {
        if (!active) return;
        const currentNgo = ngos.find((item) => String(item.id) === String(ngoId)) ?? null;
        setNgo(currentNgo);
        setNgoProjects(projects);
      })
      .catch((err) => {
        if (!active) return;
        setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!active) return;
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ngoId, role, onNavigate]);

  const activeProjects = useMemo(
    () => ngoProjects.filter((p) => p.status === 'ONGOING'),
    [ngoProjects]
  );
  const completedProjects = useMemo(
    () => ngoProjects.filter((p) => p.status === 'COMPLETED'),
    [ngoProjects]
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">Loading NGO profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-xl font-semibold">Failed to load NGO profile</h2>
        <p className="mt-2 text-red-700">{error}</p>
        <Button onClick={() => onNavigate('directory')} className="mt-4">
          Back to Directory
        </Button>
      </div>
    );
  }

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
          src={ngo.coverImageUrl || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=1200&h=400&fit=crop'}
          alt={ngo.ngoName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* NGO Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-16 mb-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <NgoLogo
                logoUrl={ngo.logoUrl}
                name={ngo.ngoName}
                size="lg"
                className="border-4 border-white shadow-lg"
              />
              <div className="flex-1">
                <div className="mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        {ngo.ngoName}
                      </h1>
                      {ngo.isVerified && (
                        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-semibold">Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{[ngo.city, ngo.state].filter(Boolean).join(', ') || 'India'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>Founded {ngo.yearFounded || '-'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{ngo.registrationNumber}</span>
                      </div>
                    </div>
                    <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                      {ngo.causeFocus?.[0] || 'Social Impact'}
                    </div>
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
                {ngo.activeProjects ?? 0}
              </div>
              <div className="text-sm text-gray-600">Active Projects</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-1">
                {ngo.completedProjects ?? 0}
              </div>
              <div className="text-sm text-gray-600">Completed Projects</div>
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
                  <p className="text-gray-700">{ngo.mission || 'No mission details available.'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Vision</h3>
                  <p className="text-gray-700">{ngo.vision || 'No vision details available.'}</p>
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
                            onViewDetails={(id) => onNavigate('project', { projectId: String(id) })}
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
                            onViewDetails={(id) => onNavigate('project', { projectId: String(id) })}
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
