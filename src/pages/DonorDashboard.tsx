import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';

interface DonorDashboardProps {
  onNavigate: (page: string) => void;
}

export function DonorDashboard({ onNavigate }: DonorDashboardProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Support Dashboard</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            This release focuses on volunteer and NGO project workflows. Support tracking features are currently not available.
          </p>
          <Button variant="outline" onClick={() => onNavigate('directory')}>
            Browse NGOs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
