import { MapPin, Calendar, Users, TrendingUp } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { StatusBadge } from './StatusBadge';
import { Badge } from './ui/badge';
import { Project } from '../lib/mock-data';

interface ProjectCardProps {
  project: Project;
  onViewDetails: (projectId: string) => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const volunteersRemaining = project.volunteersNeeded - project.volunteersEnrolled;

  return (
    <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
      <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {volunteersRemaining > 0 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-secondary text-white border-0 shadow-md">
              <Users className="w-3 h-3 mr-1" />
              {volunteersRemaining} volunteers needed
            </Badge>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <StatusBadge status={project.status} variant="small" />
        </div>
      </div>
      <CardContent className="p-6">
        <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">
          {project.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3">{project.ngoName}</p>
        
        <div className="flex items-center text-sm text-gray-500 gap-3 mb-4">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{project.location.split(',')[0]}</span>
          </div>
          <div className="text-gray-400">•</div>
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{project.beneficiaries >= 1000 ? `${(project.beneficiaries / 1000).toFixed(0)}K` : project.beneficiaries} impacted</span>
          </div>
        </div>

        {/* Volunteer Progress */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Volunteers</span>
            <span className="text-sm font-semibold text-secondary">
              {project.volunteersEnrolled} of {project.volunteersNeeded}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-secondary h-2 rounded-full transition-all"
              style={{ width: `${(project.volunteersEnrolled / project.volunteersNeeded) * 100}%` }}
            />
          </div>
        </div>

        <Button
          onClick={() => onViewDetails(project.id)}
          className="w-full bg-primary hover:bg-primary/90 transition-all hover:shadow-md"
        >
          View Project
        </Button>
      </CardContent>
    </Card>
  );
}