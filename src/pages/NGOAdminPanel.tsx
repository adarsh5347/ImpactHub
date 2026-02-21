import { Plus, TrendingUp, Users, Heart, FolderOpen, Calendar, Download, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { StatusBadge } from '../components/StatusBadge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { mockProjects, mockDonations, mockNGOs } from '../lib/mock-data';
import { useState } from 'react';

interface NGOAdminPanelProps {
  onNavigate: (page: string, params?: any) => void;
}

export function NGOAdminPanel({ onNavigate }: NGOAdminPanelProps) {
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Using first NGO as example
  const currentNGO = mockNGOs[0];
  const ngoProjects = mockProjects.filter(p => p.ngoId === currentNGO.id);
  const ngoDonations = mockDonations.filter(d => 
    ngoProjects.some(p => p.id === d.projectId)
  );

  const totalFundsReceived = ngoDonations.reduce((sum, d) => sum + d.amount, 0);
  const activeVolunteers = ngoProjects.reduce((sum, p) => sum + p.volunteersEnrolled, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              NGO Admin Panel
            </h1>
            <p className="text-lg text-gray-600">{currentNGO.name}</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Edit className="w-4 h-4 mr-2" />
            Edit NGO Profile
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₹{(totalFundsReceived / 100000).toFixed(1)}L
            </div>
            <div className="text-sm text-gray-700">Funds Received</div>
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
              {ngoDonations.length}
            </div>
            <div className="text-sm text-gray-700">Total Donations</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Card>
        <Tabs defaultValue="projects" className="w-full">
          <CardHeader>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
            </TabsList>
          </CardHeader>

          <CardContent>
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
                    <form className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title">Project Title</Label>
                          <Input id="title" placeholder="Enter project title" className="bg-white" />
                        </div>
                        <div>
                          <Label htmlFor="cause">Cause Category</Label>
                          <Select>
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
                          placeholder="Describe your project objectives and impact"
                          className="bg-white min-h-24"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="goal">Funding Goal (₹)</Label>
                          <Input id="goal" type="number" placeholder="500000" className="bg-white" />
                        </div>
                        <div>
                          <Label htmlFor="beneficiaries">Beneficiaries</Label>
                          <Input id="beneficiaries" type="number" placeholder="1000" className="bg-white" />
                        </div>
                        <div>
                          <Label htmlFor="volunteers">Volunteers Needed</Label>
                          <Input id="volunteers" type="number" placeholder="20" className="bg-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate">Start Date</Label>
                          <Input id="startDate" type="date" className="bg-white" />
                        </div>
                        <div>
                          <Label htmlFor="endDate">End Date</Label>
                          <Input id="endDate" type="date" className="bg-white" />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="bg-primary hover:bg-primary/90">
                          Create Project
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
                      <TableHead>Funding</TableHead>
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
                            <div className="font-semibold text-gray-900">
                              ₹{(project.fundsRaised / 100000).toFixed(1)}L
                            </div>
                            <div className="text-gray-600">
                              of ₹{(project.fundingGoal / 100000).toFixed(1)}L
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <span className="font-semibold">{project.volunteersEnrolled}</span>
                            <span className="text-gray-600"> / {project.volunteersNeeded}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {new Date(project.startDate).getFullYear()} - {new Date(project.endDate).getFullYear()}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Donations Tab */}
            <TabsContent value="donations" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Donation Tracking</h3>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Receipt</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ngoDonations.map((donation) => (
                      <TableRow key={donation.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(donation.date).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{donation.projectName}</TableCell>
                        <TableCell className="font-semibold">
                          ₹{donation.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {donation.receiptNumber}
                          </code>
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={donation.status} variant="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <Card className="bg-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        Compliance-Ready Data Organization
                      </h4>
                      <p className="text-sm text-gray-700">
                        All donation records are organized for easy manual audit support and compliance reporting.
                        Export detailed reports for CSR teams and government review.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Volunteers Tab */}
            <TabsContent value="volunteers" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Volunteer Management</h3>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export Volunteer Data
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {ngoProjects.map((project) => (
                  <Card key={project.id}>
                    <CardContent className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                        {project.title}
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Enrolled</span>
                          <span className="font-semibold text-gray-900">
                            {project.volunteersEnrolled}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Needed</span>
                          <span className="text-gray-600">{project.volunteersNeeded}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Available Spots</span>
                          <span className="font-semibold text-accent">
                            {project.volunteersNeeded - project.volunteersEnrolled}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full mt-4">
                        Manage Volunteers
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </CardContent>
        </Tabs>
      </Card>
    </div>
  );
}
