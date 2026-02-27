import { useEffect, useMemo, useState } from 'react';
import { Search, RotateCw } from 'lucide-react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { StatusBadge } from '../components/StatusBadge';
import { getErrorMessage } from '../lib/api';
import { adminService } from '../lib/api/admin.service';
import { authService } from '../lib/api/auth.service';
import { ngoService } from '../lib/api/ngo.service';
import { NgoLogo } from '../components/NgoLogo';
import type {
  AdminNgoDetails,
  AdminNgoListItem,
  AdminNgoStatus,
  AdminStats,
} from '../lib/api/types';

interface AdminNGOApprovalsPageProps {
  onNavigate: (page: string, params?: any) => void;
  initialStatus?: AdminNgoStatus;
}

const PAGE_SIZE = 10;
const STATUS_TABS: AdminNgoStatus[] = ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'];

export function AdminNGOApprovalsPage({ onNavigate, initialStatus = 'PENDING' }: AdminNGOApprovalsPageProps) {
  const [selectedStatus, setSelectedStatus] = useState<AdminNgoStatus>(initialStatus);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(PAGE_SIZE);

  const [ngos, setNgos] = useState<AdminNgoListItem[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [total, setTotal] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [rejectingNgo, setRejectingNgo] = useState<AdminNgoListItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectReasonError, setRejectReasonError] = useState('');

  const [selectedNgoId, setSelectedNgoId] = useState<number | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [viewError, setViewError] = useState('');
  const [ngoDetails, setNgoDetails] = useState<AdminNgoDetails | null>(null);

  const isAdmin = authService.isAdminToken();

  useEffect(() => {
    setSelectedStatus(initialStatus);
    setPage(1);
  }, [initialStatus]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const loadData = async () => {
    if (!isAdmin) return;
    setIsLoading(true);
    setError('');

    try {
      const [listResponse, statsResponse] = await Promise.all([
        adminService.listNgos({
          status: selectedStatus,
          search,
          page,
          limit,
        }),
        adminService.getStats(),
      ]);

      setNgos(listResponse.items);
      setTotal(listResponse.total);
      setStats(statsResponse);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    loadData();
  }, [selectedStatus, search, page, limit]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(total / PAGE_SIZE));
  }, [total]);

  const handleApprove = async (ngoId: number) => {
    setSuccessMessage('');
    setIsActionLoading(true);
    try {
      await adminService.approveNgo(ngoId);
      setSuccessMessage('NGO approved successfully.');
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectingNgo) return;

    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      setRejectReasonError('Rejection reason is required.');
      return;
    }

    setSuccessMessage('');
    setRejectReasonError('');
    setIsActionLoading(true);

    try {
      await adminService.rejectNgo(rejectingNgo.id, trimmedReason);
      setSuccessMessage('NGO rejected successfully.');
      setRejectingNgo(null);
      setRejectReason('');
      await loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  const openDetails = async (ngoId: number) => {
    setSelectedNgoId(ngoId);
    setIsViewOpen(true);
    setViewLoading(true);
    setViewError('');
    setNgoDetails(null);

    try {
      const detail = await adminService.getNgoDetails(ngoId);
      setNgoDetails(detail);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setViewError('NGO details were not found. It may have been deleted.');
      } else {
        setViewError(getErrorMessage(err));
      }
    } finally {
      setViewLoading(false);
    }
  };

  const handleCloseView = () => {
    setIsViewOpen(false);
    setSelectedNgoId(null);
    setViewLoading(false);
    setViewError('');
    setNgoDetails(null);
  };

  const handleDeleteNgo = async (id: number) => {
    const shouldDelete = window.confirm('This will permanently delete the NGO and all related data. Continue?');
    if (!shouldDelete) return;

    setDeletingId(id);
    setError('');
    setSuccessMessage('');

    try {
      await ngoService.deleteNgo(id);
      setNgos((prev) => prev.filter((ngo) => ngo.id !== id));
      setTotal((prev) => Math.max(0, prev - 1));
      setSuccessMessage('NGO deleted successfully.');

      if (selectedNgoId === id) {
        handleCloseView();
      }

      void loadData();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h2 className="text-xl font-semibold">Admin access required</h2>
        <p className="mt-2 text-gray-600">Please sign in with an admin account to view NGO approvals.</p>
        <Button className="mt-4" onClick={() => onNavigate('login')}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">NGO Approvals</h1>
            <p className="text-lg text-gray-600">Review NGO onboarding requests and current statuses</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData} disabled={isLoading || isActionLoading}>
              <RotateCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button className="bg-primary hover:bg-primary/90" onClick={() => onNavigate('admin')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">{stats.pendingNgos}</p>
              <p className="text-sm text-gray-700">Pending NGOs</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">{stats.approvedNgos}</p>
              <p className="text-sm text-gray-700">Approved NGOs</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">{stats.rejectedNgos}</p>
              <p className="text-sm text-gray-700">Rejected NGOs</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalVolunteers}</p>
              <p className="text-sm text-gray-700">Total Volunteers</p>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-4">
              <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
              <p className="text-sm text-gray-700">Total Projects</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>NGO Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={selectedStatus}
            onValueChange={(value: string) => {
              setSelectedStatus(value as AdminNgoStatus);
              setPage(1);
            }}
          >
            <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
              {STATUS_TABS.map((status) => (
                <TabsTrigger key={status} value={status}>
                  {status}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by organization name or email"
              className="pl-10 bg-white"
            />
          </div>

          {successMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>NGO</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      Loading NGOs...
                    </TableCell>
                  </TableRow>
                ) : ngos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                      No NGOs found for the selected filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  ngos.map((ngo) => (
                    <TableRow
                      key={ngo.id}
                      className={selectedStatus === 'APPROVED' ? '' : 'cursor-pointer hover:bg-gray-50'}
                      onClick={selectedStatus === 'APPROVED' ? undefined : () => openDetails(ngo.id)}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <NgoLogo logoUrl={ngo.logoUrl} name={ngo.ngoName} size="sm" />
                          <div>
                            <div className="font-semibold text-gray-900">{ngo.ngoName}</div>
                            {ngo.registrationNumber && (
                              <div className="text-xs text-gray-500">Reg: {ngo.registrationNumber}</div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">{ngo.email || ngo.userEmail || '-'}</TableCell>
                      <TableCell className="text-gray-700">
                        {[ngo.city, ngo.state].filter(Boolean).join(', ') || '-'}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={ngo.status} variant="small" />
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {ngo.createdAt ? new Date(ngo.createdAt).toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          {selectedStatus !== 'APPROVED' && selectedStatus !== 'PENDING' && (
                            <Button variant="outline" size="sm" onClick={() => openDetails(ngo.id)}>
                              View
                            </Button>
                          )}
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === ngo.id}
                            onClick={() => {
                              void handleDeleteNgo(ngo.id);
                            }}
                          >
                            {deletingId === ngo.id ? 'Deleting...' : 'Delete'}
                          </Button>
                          {ngo.status === 'PENDING' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-secondary hover:bg-secondary/90"
                                disabled={isActionLoading}
                                onClick={() => handleApprove(ngo.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={isActionLoading}
                                onClick={() => {
                                  setRejectReason('');
                                  setRejectReasonError('');
                                  setRejectingNgo(ngo);
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
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
                disabled={page <= 1 || isLoading}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Prev
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages || isLoading}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(rejectingNgo)}
        onOpenChange={(open: boolean) => {
          if (!open) {
            setRejectingNgo(null);
            setRejectReason('');
            setRejectReasonError('');
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject NGO</DialogTitle>
            <DialogDescription>
              Provide a rejection reason for {rejectingNgo?.ngoName}. This reason is required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="reject-reason">Reason</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => {
                setRejectReason(e.target.value);
                if (rejectReasonError) setRejectReasonError('');
              }}
              placeholder="Enter rejection reason"
              className="bg-white min-h-28"
            />
            {rejectReasonError && <p className="text-sm text-red-700">{rejectReasonError}</p>}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectingNgo(null)} disabled={isActionLoading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={isActionLoading}>
              {isActionLoading ? 'Rejecting...' : 'Reject NGO'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isViewOpen}
        onOpenChange={(open: boolean) => {
          if (!open) {
            handleCloseView();
          }
        }}
      >
        <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>NGO Details</DialogTitle>
            <DialogDescription>Complete onboarding and audit details</DialogDescription>
          </DialogHeader>

          {viewLoading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-24 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : viewError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <p className="text-sm text-red-700">{viewError}</p>
            </div>
          ) : ngoDetails ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <NgoLogo logoUrl={ngoDetails.logoUrl} name={ngoDetails.ngoName} size="md" />
                <div>
                  <p className="text-sm text-gray-500">Organization</p>
                  <p className="text-lg font-semibold text-gray-900">{ngoDetails.ngoName}</p>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deletingId === ngoDetails.id}
                  onClick={() => {
                    void handleDeleteNgo(ngoDetails.id);
                  }}
                >
                  {deletingId === ngoDetails.id ? 'Deleting...' : 'Delete NGO'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Organization</p>
                  <p className="font-semibold text-gray-900">{ngoDetails.ngoName}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <StatusBadge status={ngoDetails.status} variant="small" />
                </div>
                <div>
                  <p className="text-gray-500">Email</p>
                  <p className="text-gray-900">{ngoDetails.email || ngoDetails.userEmail || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Phone</p>
                  <p className="text-gray-900">{ngoDetails.phone || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Registration Number</p>
                  <p className="text-gray-900">{ngoDetails.registrationNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Founded</p>
                  <p className="text-gray-900">{ngoDetails.yearFounded || '-'}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900 mb-2">Mission</p>
                <p className="text-sm text-gray-700">{ngoDetails.mission || '-'}</p>
              </div>

              <div className="rounded-lg border p-4 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900 mb-2">Vision</p>
                <p className="text-sm text-gray-700">{ngoDetails.vision || '-'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Website</p>
                  <p className="text-gray-900 break-all">{ngoDetails.websiteUrl || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">NGO Type</p>
                  <p className="text-gray-900">{ngoDetails.ngoType || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-gray-500">Cause Focus</p>
                  <p className="text-gray-900">{ngoDetails.causeFocus?.length ? ngoDetails.causeFocus.join(', ') : '-'}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900 mb-2">Address</p>
                <p className="text-sm text-gray-700">
                  {[ngoDetails.address, ngoDetails.city, ngoDetails.state, ngoDetails.pincode]
                    .filter(Boolean)
                    .join(', ') || '-'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Primary Contact Name</p>
                  <p className="text-gray-900">{ngoDetails.primaryContactName || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Primary Contact Email</p>
                  <p className="text-gray-900 break-all">{ngoDetails.primaryContactEmail || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Primary Contact Phone</p>
                  <p className="text-gray-900">{ngoDetails.primaryContactPhone || '-'}</p>
                </div>
              </div>

              <div className="rounded-lg border p-4 bg-gray-50">
                <p className="text-sm font-semibold text-gray-900 mb-3">Compliance</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">PAN Number</p>
                    <p className="text-gray-900">{ngoDetails.panNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">TAN Number</p>
                    <p className="text-gray-900">{ngoDetails.tanNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">GST Number</p>
                    <p className="text-gray-900">{ngoDetails.gstNumber || '-'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">12A Registered</p>
                    <p className="text-gray-900">{ngoDetails.is12aRegistered == null ? '-' : ngoDetails.is12aRegistered ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">80G Registered</p>
                    <p className="text-gray-900">{ngoDetails.is80gRegistered == null ? '-' : ngoDetails.is80gRegistered ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">FCRA Registered</p>
                    <p className="text-gray-900">{ngoDetails.fcraRegistered == null ? '-' : ngoDetails.fcraRegistered ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {(ngoDetails.rejectionReason || ngoDetails.suspensionReason) && (
                <div className="rounded-lg border border-red-200 p-4 bg-red-50">
                  <p className="text-sm font-semibold text-red-900 mb-2">Admin Remarks</p>
                  {ngoDetails.rejectionReason && (
                    <p className="text-sm text-red-800 mb-1">Rejection: {ngoDetails.rejectionReason}</p>
                  )}
                  {ngoDetails.suspensionReason && (
                    <p className="text-sm text-red-800">Suspension: {ngoDetails.suspensionReason}</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Created At</p>
                  <p className="text-gray-900">
                    {ngoDetails.createdAt ? new Date(ngoDetails.createdAt).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Updated At</p>
                  <p className="text-gray-900">
                    {ngoDetails.updatedAt ? new Date(ngoDetails.updatedAt).toLocaleString() : '-'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Reviewed By</p>
                  <p className="text-gray-900">{ngoDetails.reviewedBy || '-'}</p>
                </div>
                <div>
                  <p className="text-gray-500">Reviewed At</p>
                  <p className="text-gray-900">
                    {ngoDetails.reviewedAt ? new Date(ngoDetails.reviewedAt).toLocaleString() : '-'}
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseView}>Close</Button>
              </DialogFooter>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">No details available for NGO ID {selectedNgoId ?? '-'}</p>
              <DialogFooter>
                <Button variant="outline" onClick={handleCloseView}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  );
}
