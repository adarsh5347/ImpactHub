import { useEffect, useMemo, useState } from 'react';
import { Search, RotateCw, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { adminService } from '../lib/api/admin.service';
import { authService } from '../lib/api/auth.service';
import { getErrorMessage } from '../lib/api';
import type { AdminVolunteerSummary } from '../lib/api/types';

interface AdminVolunteersPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const PAGE_SIZE = 10;

export function AdminVolunteersPage({ onNavigate }: AdminVolunteersPageProps) {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AdminVolunteerSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const isAdmin = authService.isAdminToken();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadVolunteers = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    setError('');

    try {
      const response = await adminService.getRegisteredVolunteers({
        search,
        page,
        limit: PAGE_SIZE,
      });
      setItems(response.items);
      setTotal(response.total);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadVolunteers();
  }, [search, page]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / PAGE_SIZE)), [total]);

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-xl font-semibold">Admin access required</h2>
        <p className="mt-2 text-gray-600">Please sign in with an admin account to view registered volunteers.</p>
        <Button className="mt-4" onClick={() => onNavigate('login')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Registered Volunteers</h1>
          <p className="text-lg text-gray-600">Platform-wide volunteer registrations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadVolunteers} disabled={isLoading}>
            <RotateCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="bg-primary hover:bg-primary/90" onClick={() => onNavigate('admin')}>
            Back to Dashboard
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Volunteers ({total})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email or phone"
              className="pl-10 bg-white"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Registered On</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">Loading volunteers...</TableCell>
                  </TableRow>
                ) : items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      No registered volunteers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  items.map((volunteer) => (
                    <TableRow key={volunteer.id}>
                      <TableCell className="font-medium text-gray-900">{volunteer.fullName}</TableCell>
                      <TableCell>{volunteer.email || '-'}</TableCell>
                      <TableCell>{volunteer.phone || '-'}</TableCell>
                      <TableCell>{volunteer.city || '-'}</TableCell>
                      <TableCell>{volunteer.state || '-'}</TableCell>
                      <TableCell>
                        {volunteer.createdAt ? new Date(volunteer.createdAt).toLocaleDateString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                disabled={page <= 1 || isLoading}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={page >= totalPages || isLoading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
