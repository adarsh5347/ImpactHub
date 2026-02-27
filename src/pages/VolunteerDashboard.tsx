import { useEffect, useMemo, useState } from 'react';
import { Users, Clock, Award, MapPin, Calendar, CheckCircle2, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { getErrorMessage } from '../lib/api';
import { projectService } from '../lib/api/project.service';
import { volunteerService } from '../lib/api/volunteer.service';
import type { Project, Volunteer, VolunteerActivity } from '../lib/api/types';

interface VolunteerDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export function VolunteerDashboard({ onNavigate }: VolunteerDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<VolunteerActivity[]>([]);
  const [currentVolunteer, setCurrentVolunteer] = useState<Volunteer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError('');

    Promise.all([projectService.getProjects(), volunteerService.getCurrentVolunteer()])
      .then(async ([projectsResponse, volunteer]) => {
        if (!active) return;
        setProjects(projectsResponse);
        setCurrentVolunteer(volunteer);

        if (volunteer?.id != null) {
          const activityResponse = await volunteerService.getVolunteerActivities(volunteer.id);
          if (!active) return;
          setActivities(activityResponse);
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
  }, []);

  const volunteerStats = useMemo(() => {
    const hoursContributed = activities.reduce(
      (sum, activity) => sum + (activity.hoursContributed ?? 0),
      0
    );
    const projectsJoined = activities.length;
    const certificatesEarned = activities.filter((a) => a.status === 'COMPLETED').length;
    return { hoursContributed, projectsJoined, certificatesEarned };
  }, [activities]);

  const allSkills = ['all', 'Teaching', 'Healthcare', 'Event Management', 'Business Management', 'Communication'];

  const filteredOpportunities = projects.filter((project) => {
    if (project.status === 'COMPLETED') return false;
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const skills = project.requiredResources || [];
    const matchesSkill = selectedSkill === 'all' || skills.includes(selectedSkill);
    return matchesSearch && matchesSkill;
  });

  const projectStatusById = useMemo(() => {
    const map = new Map<number, string>();
    projects.forEach((project) => {
      map.set(Number(project.id), project.status);
    });
    return map;
  }, [projects]);

  const completedEnrollments = useMemo(
    () => activities.filter((activity) => projectStatusById.get(Number(activity.projectId)) === 'COMPLETED'),
    [activities, projectStatusById]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Volunteer Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Find opportunities to make a difference with your time and skills
        </p>
        {error && <p className="text-sm text-red-700 mt-2">{error}</p>}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {volunteerStats.hoursContributed}
            </div>
            <div className="text-sm text-gray-700">Hours Contributed</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {volunteerStats.projectsJoined}
            </div>
            <div className="text-sm text-gray-700">Projects Joined</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {volunteerStats.certificatesEarned}
            </div>
            <div className="text-sm text-gray-700">Certificates Earned</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Available Opportunities */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Opportunities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="text"
                  placeholder="Search opportunities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-white"
                />
                <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                  <SelectTrigger className="bg-white md:w-48">
                    <SelectValue placeholder="Filter by skill" />
                  </SelectTrigger>
                  <SelectContent>
                    {allSkills.map((skill) => (
                      <SelectItem key={skill} value={skill}>
                        {skill === 'all' ? 'All Skills' : skill}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Opportunities List */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8 text-gray-600">Loading opportunities...</div>
                ) : (
                  <>
                {filteredOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                              <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-900 mb-1">
                                {opportunity.title}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">{opportunity.ngoName}</p>
                              <p className="text-sm text-gray-700 mb-3">{opportunity.description || 'No description provided.'}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {(opportunity.requiredResources || []).map((skill) => (
                              <Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {skill}
                              </Badge>
                            ))}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{opportunity.location || 'India'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{opportunity.startDate || 'Flexible start'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{opportunity.endDate || 'Ongoing'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 md:min-w-[150px]">
                          {(opportunity.volunteersNeeded ?? 0) - (opportunity.volunteersEnrolled ?? 0) > 0 ? (
                            <>
                              <p className="text-sm text-gray-600 text-center">
                                {(opportunity.volunteersNeeded ?? 0) - (opportunity.volunteersEnrolled ?? 0)} spots left
                              </p>
                              <Button
                                className="bg-secondary hover:bg-secondary/90"
                                onClick={() => onNavigate('project', { projectId: String(opportunity.id) })}
                              >
                                Apply Now
                              </Button>
                            </>
                          ) : (
                            <Button disabled variant="outline">
                              Spots Filled
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                  </>
                )}
              </div>

              {filteredOpportunities.length === 0 && (
                <div className="text-center py-12">
                  <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">No Opportunities Found</h3>
                  <p className="text-gray-600">Try adjusting your search or filters</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* My Active Engagements */}
          <Card>
            <CardHeader>
              <CardTitle>My Active Engagements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1">{activities[0]?.projectTitle || 'No active engagement'}</h4>
                <p className="text-sm text-gray-600 mb-2">Status: {activities[0]?.status || '-'}</p>
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{activities[0]?.hoursContributed ?? 0} hours completed</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1">{activities[1]?.projectTitle || 'No active engagement'}</h4>
                <p className="text-sm text-gray-600 mb-2">Status: {activities[1]?.status || '-'}</p>
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{activities[1]?.hoursContributed ?? 0} hours completed</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>

              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-1">{activities[2]?.projectTitle || 'No active engagement'}</h4>
                <p className="text-sm text-gray-600 mb-2">Status: {activities[2]?.status || '-'}</p>
                <div className="flex items-center gap-2 text-sm text-gray-700 mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{activities[2]?.hoursContributed ?? 0} hours completed</span>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Completed Projects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedEnrollments.length > 0 ? (
                completedEnrollments.map((activity) => (
                  <div key={activity.enrollmentId} className="p-3 bg-green-50 rounded-lg">
                    <p className="font-semibold text-sm text-gray-900">{activity.projectTitle || 'Project'}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      Completed {activity.enrollmentDate ? new Date(activity.enrollmentDate).toLocaleDateString() : ''}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500">No completed projects yet.</p>
              )}
            </CardContent>
          </Card>

          {/* Skills & Availability */}
          <Card>
            <CardHeader>
              <CardTitle>My Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">My Skills</h4>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {currentVolunteer?.skills?.[0] || 'No skill'}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {currentVolunteer?.skills?.[1] || 'No skill'}
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {currentVolunteer?.skills?.[2] || 'No skill'}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Availability</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">{currentVolunteer?.availability || 'Availability not set'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">{volunteerStats.hoursContributed} hours contributed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="text-gray-700">Remote & In-person</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="w-full">
                Update Profile
              </Button>
            </CardContent>
          </Card>

          {/* Certificates */}
          <Card>
            <CardHeader>
              <CardTitle>Certificates</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Award className="w-8 h-8 text-green-600" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">Education Volunteer</p>
                  <p className="text-xs text-gray-600">Dec 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <Award className="w-8 h-8 text-green-600" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900">Healthcare Support</p>
                  <p className="text-xs text-gray-600">Nov 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
