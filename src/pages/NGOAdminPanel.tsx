import { useEffect, useMemo, useState } from 'react';
import { Plus, TrendingUp, Users, FolderOpen, Download, Edit, RotateCw, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { StatusBadge } from '../components/StatusBadge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { getErrorMessage } from '../lib/api';
import { ngoService } from '../lib/api/ngo.service';
import { projectService } from '../lib/api/project.service';
import { enrollmentService } from '../lib/api/enrollment.service';
import type { NGO, Project, ProjectCreateRequest, ProjectEnrollmentGroup } from '../lib/api/types';
import { NgoLogo } from '../components/NgoLogo';

interface NGOAdminPanelProps {
  onNavigate: (page: string, params?: any) => void;
}

export function NGOAdminPanel({ onNavigate }: NGOAdminPanelProps) {
  const maxLogoSizeBytes = 5 * 1024 * 1024;
  const maxCoverSizeBytes = 10 * 1024 * 1024;
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [currentNGO, setCurrentNGO] = useState<NGO | null>(null);
  const [ngoProjects, setNgoProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [projectError, setProjectError] = useState('');
  const [projectSuccess, setProjectSuccess] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [completingProjectId, setCompletingProjectId] = useState<number | null>(null);
  const [enrollmentGroups, setEnrollmentGroups] = useState<ProjectEnrollmentGroup[]>([]);
  const [expandedProjectIds, setExpandedProjectIds] = useState<Record<number, boolean>>({});
  const [profileForm, setProfileForm] = useState({
    ngoName: '',
    mission: '',
    vision: '',
    websiteUrl: '',
    phone: '',
    city: '',
    state: '',
    logoUrl: '',
    logoPublicId: '',
    coverImageUrl: '',
    coverImagePublicId: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState('');
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState('');
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError('');

    ngoService
      .getCurrentNGOFromSession()
      .then(async (ngo) => {
        if (!active) return;
        if (!ngo) {
          setError('Unable to identify current NGO session. Please login again.');
          return;
        }
        setCurrentNGO(ngo);
        const [projects, enrollments] = await Promise.all([
          ngoService.getNGOProjects(ngo.id),
          enrollmentService.getNgoEnrollments(ngo.id),
        ]);
        if (!active) return;
        setNgoProjects(projects);
        setEnrollmentGroups(enrollments);
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
  }, []);

  useEffect(() => {
    if (!currentNGO) return;
    setProfileForm({
      ngoName: currentNGO.ngoName || '',
      mission: currentNGO.mission || '',
      vision: currentNGO.vision || '',
      websiteUrl: currentNGO.websiteUrl || '',
      phone: currentNGO.phone || '',
      city: currentNGO.city || '',
      state: currentNGO.state || '',
      logoUrl: currentNGO.logoUrl || '',
      logoPublicId: currentNGO.logoPublicId || '',
      coverImageUrl: currentNGO.coverImageUrl || '',
      coverImagePublicId: currentNGO.coverImagePublicId || '',
    });
    setLogoFile(null);
    setLogoPreviewUrl('');
    setCoverFile(null);
    setCoverPreviewUrl('');
  }, [currentNGO]);

  // Refresh projects every 10 seconds to get updated volunteer counts
  useEffect(() => {
    if (!currentNGO) return;

    const interval = setInterval(async () => {
      try {
        const updated = await ngoService.getNGOProjects(currentNGO.id);
        setNgoProjects(updated);
      } catch (err) {
        console.error('Failed to refresh projects:', err);
      }
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(interval);
  }, [currentNGO]);

  const activeVolunteers = useMemo(
    () => ngoProjects.reduce((sum, project) => sum + (project.volunteersEnrolled ?? 0), 0),
    [ngoProjects]
  );

  const handleCreateProject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentNGO) return;
    setProjectError('');

    const form = new FormData(e.currentTarget);
    const objectivesRaw = String(form.get('objectives') || '');
    const payload: ProjectCreateRequest = {
      title: String(form.get('title') || ''),
      cause: String(form.get('cause') || ''),
      description: String(form.get('description') || ''),
      objectives: objectivesRaw,
      beneficiaries: Number(form.get('beneficiaries') || 0),
      volunteersNeeded: Number(form.get('volunteers') || 0),
      startDate: String(form.get('startDate') || '') || undefined,
      endDate: String(form.get('endDate') || '') || undefined,
      location: `${currentNGO.city || ''}, ${currentNGO.state || ''}`.trim(),
      status: 'ONGOING',
    };

    if (!payload.title) {
      setProjectError('Title is required.');
      return;
    }

    try {
      setIsCreating(true);
      await projectService.createProject(payload);
      const refreshed = await ngoService.getNGOProjects(currentNGO.id);
      setNgoProjects(refreshed);
      setShowProjectForm(false);
      setProjectSuccess('Project created successfully.');
    } catch (err) {
      setProjectError(getErrorMessage(err));
    } finally {
      setIsCreating(false);
    }
  };

  const handleRefresh = async () => {
    if (!currentNGO) return;
    try {
      setIsRefreshing(true);
      const updated = await ngoService.getNGOProjects(currentNGO.id);
      const enrollments = await enrollmentService.getNgoEnrollments(currentNGO.id);
      setNgoProjects(updated);
      setEnrollmentGroups(enrollments);
    } catch (err) {
      console.error('Failed to refresh:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  const toggleProjectEnrollments = (projectId: number) => {
    setExpandedProjectIds((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleMarkCompleted = async (projectId: number) => {
    if (!currentNGO) return;
    setProjectError('');
    setProjectSuccess('');
    try {
      setCompletingProjectId(projectId);
      const updated = await projectService.markProjectCompleted(currentNGO.id, projectId);
      setNgoProjects((prev) => prev.map((project) => (project.id === projectId ? updated : project)));
      setProjectSuccess('Project marked as completed.');
      toast.success('Project marked as completed.');
    } catch (err) {
      const message = getErrorMessage(err);
      setProjectError(message);
      toast.error(message);
    } finally {
      setCompletingProjectId(null);
    }
  };

  const handleProfileInputChange = (field: keyof typeof profileForm, value: string) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('Please select a valid image file for NGO logo.');
      event.currentTarget.value = '';
      return;
    }

    if (file.size > maxLogoSizeBytes) {
      setProfileError('Logo image must be 5MB or smaller.');
      event.currentTarget.value = '';
      return;
    }

    setProfileError('');
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);
    }
    setLogoFile(file);
    setLogoPreviewUrl(URL.createObjectURL(file));
  };

  const clearLogoUpdate = () => {
    if (logoPreviewUrl) {
      URL.revokeObjectURL(logoPreviewUrl);
    }
    setLogoPreviewUrl('');
    setLogoFile(null);
  };

  const handleCoverFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setProfileError('Please select a valid image file for NGO cover image.');
      event.currentTarget.value = '';
      return;
    }

    if (file.size > maxCoverSizeBytes) {
      setProfileError('Cover image must be 10MB or smaller.');
      event.currentTarget.value = '';
      return;
    }

    setProfileError('');
    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setCoverFile(file);
    setCoverPreviewUrl(URL.createObjectURL(file));
  };

  const clearCoverUpdate = () => {
    if (coverPreviewUrl) {
      URL.revokeObjectURL(coverPreviewUrl);
    }
    setCoverPreviewUrl('');
    setCoverFile(null);
  };

  const handleSaveProfile = async () => {
    if (!currentNGO) return;

    setProfileError('');
    setProfileSuccess('');

    try {
      setIsSavingProfile(true);
      let logoUrl = profileForm.logoUrl || undefined;
      let logoPublicId = profileForm.logoPublicId || undefined;
      let coverImageUrl = profileForm.coverImageUrl || undefined;
      let coverImagePublicId = profileForm.coverImagePublicId || undefined;

      if (logoFile) {
        const uploadedLogo = await ngoService.uploadNgoLogo(logoFile);
        logoUrl = uploadedLogo.logoUrl;
        logoPublicId = uploadedLogo.publicId;
      }

      if (coverFile) {
        const uploadedCover = await ngoService.uploadNgoCover(coverFile);
        coverImageUrl = uploadedCover.coverImageUrl;
        coverImagePublicId = uploadedCover.publicId;
      }

      const updated = await ngoService.updateNGO(currentNGO.id, {
        ngoName: profileForm.ngoName || undefined,
        mission: profileForm.mission || undefined,
        vision: profileForm.vision || undefined,
        websiteUrl: profileForm.websiteUrl || undefined,
        phone: profileForm.phone || undefined,
        city: profileForm.city || undefined,
        state: profileForm.state || undefined,
        logoUrl,
        logoPublicId,
        coverImageUrl,
        coverImagePublicId,
      });

      setCurrentNGO(updated);
      setProfileSuccess('NGO profile updated successfully.');
      clearLogoUpdate();
      clearCoverUpdate();
    } catch (err) {
      setProfileError(getErrorMessage(err));
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">Loading NGO admin data...</p>
      </div>
    );
  }

  if (error || !currentNGO) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-xl font-semibold">Unable to load admin panel</h2>
        <p className="mt-2 text-red-700">{error || 'No NGO session found.'}</p>
        <Button className="mt-4" onClick={() => onNavigate('login')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              NGO Admin Panel
            </h1>
            <p className="text-lg text-gray-600">{currentNGO.ngoName}</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RotateCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <FolderOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {ngoProjects.length}
            </div>
            <div className="text-sm text-gray-700">Total Projects</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {activeVolunteers}
            </div>
            <div className="text-sm text-gray-700">Active Volunteers</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {ngoProjects.filter((project) => project.status === 'COMPLETED').length}
            </div>
            <div className="text-sm text-gray-700">Completed Projects</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <Tabs defaultValue="projects" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>NGO Logo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <NgoLogo
                      logoUrl={logoPreviewUrl || profileForm.logoUrl || currentNGO.logoUrl}
                      name={profileForm.ngoName || currentNGO.ngoName}
                      size="lg"
                    />
                    <Input type="file" accept="image/*" onChange={handleLogoFileChange} className="bg-white" />
                    <p className="text-xs text-gray-500">Supported formats: JPG, PNG, WEBP. Max size: 5MB.</p>
                    {logoFile && (
                      <Button type="button" variant="outline" onClick={clearLogoUpdate}>
                        Remove Selected Logo
                      </Button>
                    )}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Edit Profile</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <Label htmlFor="coverImage">Cover Image</Label>
                      {(coverPreviewUrl || profileForm.coverImageUrl || currentNGO.coverImageUrl) && (
                        <img
                          src={coverPreviewUrl || profileForm.coverImageUrl || currentNGO.coverImageUrl || ''}
                          alt="NGO cover"
                          className="w-full h-40 rounded-lg object-cover border border-gray-200"
                        />
                      )}
                      <Input
                        id="coverImage"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverFileChange}
                        className="bg-white"
                      />
                      <p className="text-xs text-gray-500">Supported formats: JPG, PNG, WEBP. Max size: 10MB.</p>
                      {coverFile && (
                        <Button type="button" variant="outline" onClick={clearCoverUpdate}>
                          Remove Selected Cover
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="ngoName">NGO Name</Label>
                        <Input
                          id="ngoName"
                          value={profileForm.ngoName}
                          onChange={(e) => handleProfileInputChange('ngoName', e.target.value)}
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="websiteUrl">Website</Label>
                        <Input
                          id="websiteUrl"
                          value={profileForm.websiteUrl}
                          onChange={(e) => handleProfileInputChange('websiteUrl', e.target.value)}
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => handleProfileInputChange('phone', e.target.value)}
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={profileForm.city}
                          onChange={(e) => handleProfileInputChange('city', e.target.value)}
                          className="bg-white"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={profileForm.state}
                        onChange={(e) => handleProfileInputChange('state', e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="mission">Mission</Label>
                      <Textarea
                        id="mission"
                        value={profileForm.mission}
                        onChange={(e) => handleProfileInputChange('mission', e.target.value)}
                        className="bg-white min-h-24"
                      />
                    </div>
                    <div>
                      <Label htmlFor="vision">Vision</Label>
                      <Textarea
                        id="vision"
                        value={profileForm.vision}
                        onChange={(e) => handleProfileInputChange('vision', e.target.value)}
                        className="bg-white min-h-24"
                      />
                    </div>

                    {profileError && <p className="text-sm text-red-700">{profileError}</p>}
                    {profileSuccess && <p className="text-sm text-green-700">{profileSuccess}</p>}

                    <Button onClick={handleSaveProfile} disabled={isSavingProfile} className="bg-primary hover:bg-primary/90">
                      {isSavingProfile ? 'Saving...' : 'Save Profile'}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Projects Tab */}
            <TabsContent value="projects" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Project Management</h3>
                <Button
                  onClick={() => setShowProjectForm(!showProjectForm)}
                  className="bg-secondary hover:bg-secondary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Project
                </Button>
              </div>

              {showProjectForm && (
                <Card className="bg-gray-50 border-2 border-dashed">
                  <CardHeader>
                    <CardTitle>Create New Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4" onSubmit={handleCreateProject}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Project Title</Label>
                          <Input id="title" name="title" placeholder="Enter project title" className="bg-white" />
                        </div>
                        <div>
                          <Label htmlFor="cause">Cause Category</Label>
                          <Select name="cause">
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Select cause" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="education">Education</SelectItem>
                              <SelectItem value="healthcare">Healthcare</SelectItem>
                              <SelectItem value="environment">Environment</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                            name="description"
                          placeholder="Describe your project objectives and impact"
                          className="bg-white min-h-24"
                        />
                      </div>

                      <div>
                        <Label htmlFor="objectives">Objectives (optional)</Label>
                        <Textarea
                          id="objectives"
                          name="objectives"
                          placeholder="List project objectives"
                          className="bg-white min-h-20"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave blank if not provided.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="beneficiaries">Beneficiaries</Label>
                          <Input id="beneficiaries" name="beneficiaries" type="number" placeholder="1000" className="bg-white" />
                        </div>
                        <div>
                          <Label htmlFor="volunteers">Volunteers Needed</Label>
                          <Input id="volunteers" name="volunteers" type="number" placeholder="20" className="bg-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input id="startDate" name="startDate" type="date" className="bg-white" />
                        </div>
                        <div>
                          <Label htmlFor="endDate">End Date</Label>
                          <Input id="endDate" name="endDate" type="date" className="bg-white" />
                        </div>
                      </div>

                      {projectError && <p className="text-sm text-red-700">{projectError}</p>}
                      {projectSuccess && <p className="text-sm text-green-700">{projectSuccess}</p>}

                      <div className="flex gap-3 pt-4">
                        <Button type="submit" disabled={isCreating} className="bg-primary hover:bg-primary/90">
                          {isCreating ? 'Creating...' : 'Create Project'}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowProjectForm(false)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Project Name</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Volunteers</TableHead>
                      <TableHead>Timeline</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ngoProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium">{project.title}</TableCell>
                        <TableCell>
                          <StatusBadge status={project.status} variant="small" />
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-semibold">{project.volunteersEnrolled ?? 0}</span>
                            <span className="text-gray-600"> / {project.volunteersNeeded ?? 0}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {project.startDate ? new Date(project.startDate).getFullYear() : '-'} - {project.endDate ? new Date(project.endDate).getFullYear() : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onNavigate('ngo-project-edit', { projectId: String(project.id) })}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={project.status === 'COMPLETED' || completingProjectId === project.id}
                              onClick={() => handleMarkCompleted(project.id)}
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              {project.status === 'COMPLETED'
                                ? 'Completed'
                                : completingProjectId === project.id
                                  ? 'Updating...'
                                  : 'Mark as Completed'}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Volunteers Tab */}
            <TabsContent value="volunteers" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Project Enrollments</h3>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Volunteer Data
                </Button>
              </div>

              <div className="space-y-4">
                {ngoProjects.map((project) => {
                  const group = enrollmentGroups.find((entry) => entry.projectId === project.id);
                  const volunteers = group?.enrolledVolunteers ?? [];
                  const isExpanded = !!expandedProjectIds[project.id];

                  return (
                    <Card key={project.id}>
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">{project.title}</h4>
                            <p className="text-sm text-gray-600">
                              {project.location || 'Location not set'} • {project.status}
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleProjectEnrollments(project.id)}
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4 mr-2" /> : <ChevronDown className="w-4 h-4 mr-2" />}
                            View Enrollments ({volunteers.length})
                          </Button>
                        </div>

                        {isExpanded && (
                          <div className="overflow-x-auto border rounded-md">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Name</TableHead>
                                  <TableHead>Email</TableHead>
                                  <TableHead>Phone</TableHead>
                                  <TableHead>City</TableHead>
                                  <TableHead>Enrolled At</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {volunteers.length > 0 ? (
                                  volunteers.map((volunteer) => (
                                    <TableRow key={`${project.id}-${volunteer.id}`}>
                                      <TableCell className="font-medium">{volunteer.fullName}</TableCell>
                                      <TableCell>{volunteer.email}</TableCell>
                                      <TableCell>{volunteer.phone || '-'}</TableCell>
                                      <TableCell>{volunteer.city || '-'}</TableCell>
                                      <TableCell>
                                        {volunteer.enrolledAt
                                          ? new Date(volunteer.enrolledAt).toLocaleString()
                                          : '-'}
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center text-gray-500 py-6">
                                      No volunteers enrolled yet.
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
