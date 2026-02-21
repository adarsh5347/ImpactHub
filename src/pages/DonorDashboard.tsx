import { Heart, Download, Calendar, TrendingUp, FileText, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { StatusBadge } from '../components/StatusBadge';
import { mockDonations } from '../lib/mock-data';

interface DonorDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export function DonorDashboard({ onNavigate }: DonorDashboardProps) {
  const totalDonated = mockDonations.reduce((sum, d) => sum + d.amount, 0);
  const donationCount = mockDonations.length;
  const projectsSupported = new Set(mockDonations.map(d => d.projectId)).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Donor Dashboard
        </h1>
        <p className="text-lg text-gray-600">
          Track your contributions and see the impact you're making
        </p>
        <p className="text-sm text-gray-500 italic mt-2">
          "Making Every Contribution Count"
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" fill="white" />
              </div>
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              ₹{(totalDonated / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-700">Total Donated</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-secondary" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {donationCount}
            </div>
            <div className="text-sm text-gray-700">Donations Made</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {projectsSupported}
            </div>
            <div className="text-sm text-gray-700">Projects Supported</div>
          </CardContent>
        </Card>
      </div>

      {/* Donation History */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Donation History</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>NGO</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Receipt</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>{new Date(donation.date).toLocaleDateString()}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{donation.projectName}</TableCell>
                    <TableCell className="text-gray-600">{donation.ngoName}</TableCell>
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
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Contribution Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Contributions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">December 2024</p>
                  <p className="text-2xl font-bold text-gray-900">₹50,000</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-green-600 font-semibold">+25%</p>
                  <p className="text-xs text-gray-600">vs last month</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">November 2024</p>
                  <p className="text-2xl font-bold text-gray-900">₹25,000</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">October 2024</p>
                  <p className="text-2xl font-bold text-gray-900">₹75,000</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tax Benefits & Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-gray-900">FY 2024-25 Donations</p>
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  ₹{(totalDonated / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-gray-600">
                  Eligible for 80G tax deduction
                </p>
              </div>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download Annual Report
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download 80G Certificate
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download All Receipts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Impact Summary */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Impact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">2,500+</div>
              <p className="text-gray-700">Lives Impacted</p>
              <p className="text-sm text-gray-600 mt-1">Through your donations</p>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-secondary mb-2">4</div>
              <p className="text-gray-700">Active Projects</p>
              <p className="text-sm text-gray-600 mt-1">Currently supporting</p>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <div className="text-4xl font-bold text-accent mb-2">100%</div>
              <p className="text-gray-700">Transparency</p>
              <p className="text-sm text-gray-600 mt-1">Track every contribution</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
