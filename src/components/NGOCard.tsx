import { CheckCircle2, MapPin, FolderOpen, Users } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { NGO } from '../lib/api/types';
import { NgoLogo } from './NgoLogo';

interface NGOCardProps {
  ngo: NGO;
  onViewDetails: (ngoId: string | number) => void;
}

export function NGOCard({ ngo, onViewDetails }: NGOCardProps) {
  // Calculate total volunteers needed across projects (mock calculation)
  const volunteersNeeded = Math.floor(Math.random() * 20) + 5;
  const ngoName = ngo.ngoName;
  const coverImage = ngo.coverImageUrl || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=400&fit=crop';
  const location = [ngo.city, ngo.state].filter(Boolean).join(', ') || 'India';
  const cause = ngo.causeFocus?.[0] || 'Social Impact';

  return (
    <Card className="overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
      <div className="aspect-[16/9] overflow-hidden bg-gray-100 relative">
        <img
          src={coverImage}
          alt={ngoName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {volunteersNeeded > 0 && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-secondary text-white border-0 shadow-md">
              <Users className="w-3 h-3 mr-1" />
              {volunteersNeeded} volunteers needed
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <NgoLogo logoUrl={ngo.logoUrl} name={ngoName} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">{ngoName}</h3>
              {ngo.isVerified && (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              )}
            </div>
            <div className="flex items-center text-sm text-gray-600 gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{ngo.mission || 'No mission details available.'}</p>

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <FolderOpen className="w-4 h-4" />
            <span>{ngo.activeProjects ?? 0} Active</span>
          </div>
          <div className="text-gray-400">•</div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-medium">{volunteersNeeded} needed</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
            {cause}
          </span>
        </div>

        <Button
          onClick={() => onViewDetails(ngo.id)}
          className="w-full bg-primary hover:bg-primary/90 transition-all hover:shadow-md"
        >
          View Details
        </Button>
      </CardContent>
    </Card>
  );
}