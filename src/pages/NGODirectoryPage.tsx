import { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Card } from '../components/ui/card';
import { NGOCard } from '../components/NGOCard';
import { mockNGOs } from '../lib/mock-data';

interface NGODirectoryPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function NGODirectoryPage({ onNavigate }: NGODirectoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCause, setSelectedCause] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const causes = ['all', 'Education', 'Environment', 'Healthcare', 'Women Empowerment', 'Child Welfare', 'Rural Development'];
  const locations = ['all', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Jaipur'];

  const filteredNGOs = mockNGOs.filter((ngo) => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ngo.mission.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCause = selectedCause === 'all' || ngo.cause === selectedCause;
    const matchesLocation = selectedLocation === 'all' || ngo.location.includes(selectedLocation);
    const matchesVerified = !showVerifiedOnly || ngo.verified;
    
    return matchesSearch && matchesCause && matchesLocation && matchesVerified;
  });

  const activeFiltersCount = [
    selectedCause !== 'all',
    selectedLocation !== 'all',
    showVerifiedOnly,
  ].filter(Boolean).length;

  const clearFilters = () => {
    setSelectedCause('all');
    setSelectedLocation('all');
    setShowVerifiedOnly(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
          Browse NGOs
        </h1>
        <p className="text-base sm:text-lg text-gray-600">
          Discover verified NGOs making a real difference across India
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search NGOs by name or mission..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 sm:pl-10 bg-white text-sm sm:text-base h-10 sm:h-11"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <Select value={selectedCause} onValueChange={setSelectedCause}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Cause" />
              </SelectTrigger>
              <SelectContent>
                {causes.map((cause) => (
                  <SelectItem key={cause} value={cause}>
                    {cause === 'all' ? 'All Causes' : cause}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Select Location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location === 'all' ? 'All Locations' : location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant={showVerifiedOnly ? 'default' : 'outline'}
              onClick={() => setShowVerifiedOnly(!showVerifiedOnly)}
              className="justify-start"
            >
              <Filter className="w-4 h-4 mr-2" />
              Verified Only
            </Button>

            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="justify-start text-gray-600"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters ({activeFiltersCount})
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredNGOs.length}</span> NGOs
        </p>
      </div>

      {/* NGO Grid */}
      {filteredNGOs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNGOs.map((ngo) => (
            <NGOCard
              key={ngo.id}
              ngo={ngo}
              onViewDetails={(id) => onNavigate('ngo-profile', { ngoId: id })}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No NGOs Found</h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any NGOs matching your criteria. Try adjusting your filters.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}