import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, MapPin, Calendar, Users, Target, UserPlus, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { StatusBadge } from '../components/StatusBadge';
import { projectService } from '../lib/api/project.service';
import { ngoService } from '../lib/api/ngo.service';
import { getErrorMessage } from '../lib/api';
import type { Project, NGO } from '../lib/api/types';
import { useAuth } from '../context/AuthContext';
import { NgoLogo } from '../components/NgoLogo';

interface ProjectDetailsPageProps {
  projectId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function ProjectDetailsPage({ projectId, onNavigate }: ProjectDetailsPageProps) {
  const { role } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [ngo, setNgo] = useState<NGO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [ngoLoading, setNgoLoading] = useState(false);
  const [error, setError] = useState('');
  const [enrollError, setEnrollError] = useState('');
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    if (role === 'ngo') {
      onNavigate('ngo-admin');
    }
  }, [role, onNavigate]);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError('');

    projectService
      .getProjectById(projectId)
      .then(async (data) => {
        if (!active) return;
        setProject(data);

        const hasVolunteerSession = !!localStorage.getItem('token') && !!localStorage.getItem('currentVolunteer');
        if (hasVolunteerSession) {
          try {
            const alreadyEnrolled = await projectService.getEnrollmentStatus(data.id);
            if (!active) return;
            setEnrolled(alreadyEnrolled);
          } catch {
            if (!active) return;
            setEnrolled(false);
          }
        }

        // Load NGO data
        if (data.ngoId) {
          setNgoLoading(true);
          ngoService
            .getNGOById(String(data.ngoId))
            .then((ngoData) => {
              if (!active) return;
              setNgo(ngoData);
            })
            .catch((err) => {
              if (!active) return;
              console.error('Failed to load NGO:', err);
            })
            .finally(() => {
              if (!active) return;
              setNgoLoading(false);
            });
        }
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
  }, [projectId]);

  const handleApply = async () => {
    // Check if volunteer is logged in
    const volunteer = localStorage.getItem('currentVolunteer');
    if (!volunteer) {
      onNavigate('login');
      return;
    }

    if (!project || !project.id) {
      setEnrollError('Project information not available');
      return;
    }

    try {
      setIsEnrolling(true);
      setEnrollError('');
      
      // Call enrollment endpoint
      await projectService.enrollAsVolunteer(project.id);
      
      // Refetch project to get updated volunteer count
      const updated = await projectService.getProjectById(String(project.id));
      setProject(updated);
      
      setEnrolled(true);
    } catch (err: any) {
      // Check if it's a 401/Unauthorized or 404 error
      if (err.response?.status === 401) {
        setEnrollError('You are not authenticated. Please login again.');
        setTimeout(() => onNavigate('login'), 2000);
      } else if (err.response?.status === 409) {
        setEnrolled(true);
        setEnrollError('You are already enrolled in this project.');
      } else {
        setEnrollError(getErrorMessage(err));
      }
    } finally {
      setIsEnrolling(false);
    }
  };

  const volunteersNeeded = project?.volunteersNeeded ?? 0;
  const volunteersEnrolled = project?.volunteersEnrolled ?? 0;
  const objectiveItems = useMemo(() => {
    const objectives = (project?.objectives || '').trim();
    if (!objectives) return [] as string[];

    const byLine = objectives
      .split(/\r?\n/)
      .map((item) => item.replace(/^\s*(?:\d+[.)]|[-•])\s*/, '').trim())
      .filter(Boolean);

    if (byLine.length > 1) return byLine;

    const byInlineNumbering = objectives
      .split(/\s*(?=\d+[.)]\s+)/)
      .map((item) => item.replace(/^\s*(?:\d+[.)]|[-•])\s*/, '').trim())
      .filter(Boolean);

    return byInlineNumbering.length > 1 ? byInlineNumbering : [objectives];
  }, [project?.objectives]);

  const volunteerProgress = useMemo(
    () => (volunteersNeeded ? (volunteersEnrolled / volunteersNeeded) * 100 : 0),
    [volunteersNeeded, volunteersEnrolled]
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-xl font-semibold">Failed to load project</h2>
        <p className="mt-2 text-red-700">{error}</p>
        <Button onClick={() => onNavigate('directory')} className="mt-4">
          Back to Directory
        </Button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2>Project not found</h2>
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
            onClick={() => onNavigate('ngo-profile', { ngoId: String(project.ngoId ?? '') })}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {project.ngoName}
        </Button>
      </div>

      {/* Project Header */}
      <div className="w-full h-96 overflow-hidden bg-gray-200 relative">
        <img
          src={project.imageUrl || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&h=500&fit=crop'}
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
                      {project.startDate ? new Date(project.startDate).getFullYear() : '-'} - {project.endDate ? new Date(project.endDate).getFullYear() : '-'}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">Beneficiaries</span>
                    </div>
                    <p className="font-semibold text-gray-900">
                      {(project.beneficiaries ?? 0).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Target className="w-4 h-4" />
                      <span className="text-sm">Cause</span>
                    </div>
                    <p className="font-semibold text-gray-900">{project.cause || '-'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Project Description</h3>
                  <p className="text-gray-700 leading-relaxed">{project.description || 'No description available.'}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Project Objectives</h3>
                  {objectiveItems.length ? (
                    <ol className="list-decimal list-inside space-y-2 text-gray-700">
                      {objectiveItems.map((objective, index) => (
                        <li key={`${index}-${objective.slice(0, 20)}`} className="leading-relaxed">
                          {objective}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <p className="text-gray-500">Not provided</p>
                  )}
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
                  {(project.requiredResources || []).map((resource, index) => (
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

          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Volunteer Opportunities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-600">Volunteers</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {volunteersEnrolled} / {volunteersNeeded}
                    </span>
                  </div>
                  <Progress value={volunteerProgress} className="h-2 mb-4" />
                  {enrolled ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-green-700 font-medium">You've joined this project!</span>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full"
                      size="lg"
                      onClick={handleApply}
                      disabled={isEnrolling || enrolled || project.status === 'COMPLETED'}
                    >
                      <UserPlus className="w-5 h-5 mr-2" />
                      {project.status === 'COMPLETED'
                        ? 'Completed'
                        : isEnrolling
                          ? 'Enrolling...'
                          : enrolled
                            ? 'Enrolled'
                            : 'Enroll'}
                    </Button>
                  )}
                  {enrollError && (
                    <p className="text-sm text-red-600 mt-2">{enrollError}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* NGO Info */}
            <Card>
              <CardHeader>
                <CardTitle>About the NGO</CardTitle>
              </CardHeader>
              <CardContent>
                {ngoLoading ? (
                  <p className="text-gray-600">Loading NGO information...</p>
                ) : ngo ? (
                  <>
                    <div className="flex items-center gap-3 mb-3">
                      <NgoLogo logoUrl={ngo.logoUrl} name={ngo.ngoName} size="sm" className="w-12 h-12" />
                      <div>
                        <p className="font-semibold text-gray-900">{ngo.ngoName}</p>
                        {ngo.isVerified && (
                          <div className="flex items-center gap-1 text-green-600 text-xs">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified NGO</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{ngo.mission || 'No mission statement available'}</p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => onNavigate('ngo-profile', { ngoId: ngo.id })}
                    >
                      View NGO Profile
                    </Button>
                  </>
                ) : (
                  <p className="text-gray-600">NGO information not available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
