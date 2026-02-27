import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ngoService } from '../lib/api/ngo.service';
import { projectService } from '../lib/api/project.service';
import { getErrorMessage } from '../lib/api';
import type { NGO, ProjectStatus, ProjectUpdateRequest } from '../lib/api/types';
import { toast } from 'sonner';

interface NGOProjectEditPageProps {
  projectId: string;
  onNavigate: (page: string, params?: any) => void;
}

export function NGOProjectEditPage({ projectId, onNavigate }: NGOProjectEditPageProps) {
  const [currentNGO, setCurrentNGO] = useState<NGO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [cause, setCause] = useState('');
  const [description, setDescription] = useState('');
  const [objectives, setObjectives] = useState('');
  const [status, setStatus] = useState<ProjectStatus>('ONGOING');
  const [beneficiaries, setBeneficiaries] = useState('0');
  const [volunteersNeeded, setVolunteersNeeded] = useState('0');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        setIsLoading(true);
        setError('');

        const ngo = await ngoService.getCurrentNGOFromSession();
        if (!active) return;

        if (!ngo) {
          setError('Unable to identify current NGO session. Please login again.');
          return;
        }

        setCurrentNGO(ngo);

        const project = await projectService.getNgoProjectById(ngo.id, projectId);
        if (!active) return;

        setTitle(project.title || '');
        setCause(project.cause || '');
        setDescription(project.description || '');
        setObjectives(project.objectives || '');
        setStatus(project.status || 'ONGOING');
        setBeneficiaries(String(project.beneficiaries ?? 0));
        setVolunteersNeeded(String(project.volunteersNeeded ?? 0));
        setStartDate(project.startDate || '');
        setEndDate(project.endDate || '');
      } catch (err) {
        if (!active) return;
        setError(getErrorMessage(err));
      } finally {
        if (!active) return;
        setIsLoading(false);
      }
    };

    load();

    return () => {
      active = false;
    };
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentNGO) return;

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    const payload: Partial<ProjectUpdateRequest> = {
      title: title.trim(),
      cause: cause.trim(),
      description,
      objectives,
      status,
      beneficiaries: Number(beneficiaries || 0),
      volunteersNeeded: Number(volunteersNeeded || 0),
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    };

    try {
      setIsSaving(true);
      setError('');
      await projectService.updateNgoProject(currentNGO.id, projectId, payload);
      toast.success('Project updated successfully.');
      onNavigate('ngo-admin');
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-gray-600">Loading project...</p>
      </div>
    );
  }

  if (error && !currentNGO) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-xl font-semibold">Unable to load project editor</h2>
        <p className="mt-2 text-red-700">{error}</p>
        <Button className="mt-4" onClick={() => onNavigate('login')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Button variant="ghost" className="gap-2" onClick={() => onNavigate('ngo-admin')}>
          <ArrowLeft className="w-4 h-4" />
          Back to NGO Admin
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Project</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-white" />
              </div>
              <div>
                <Label htmlFor="cause">Cause Category</Label>
                <Input id="cause" value={cause} onChange={(e) => setCause(e.target.value)} className="bg-white" />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-white min-h-24"
              />
            </div>

            <div>
              <Label htmlFor="objectives">Objectives (optional)</Label>
              <Textarea
                id="objectives"
                value={objectives}
                onChange={(e) => setObjectives(e.target.value)}
                className="bg-white min-h-20"
              />
              <p className="text-xs text-gray-500 mt-1">Leave blank if not provided.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={(value: string) => setStatus(value as ProjectStatus)}>
                  <SelectTrigger id="status" className="bg-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="OPEN">Open</SelectItem>
                    <SelectItem value="ONGOING">Ongoing</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="beneficiaries">Beneficiaries</Label>
                <Input
                  id="beneficiaries"
                  type="number"
                  min={0}
                  value={beneficiaries}
                  onChange={(e) => setBeneficiaries(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="volunteersNeeded">Volunteers Needed</Label>
                <Input
                  id="volunteersNeeded"
                  type="number"
                  min={0}
                  value={volunteersNeeded}
                  onChange={(e) => setVolunteersNeeded(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-white"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-700">{error}</p>}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSaving} className="bg-primary hover:bg-primary/90">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="outline" onClick={() => onNavigate('ngo-admin')}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
