import { useState } from 'react';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockLoans, mockPayments, mockCustomers, mockSavingsAccounts } from '../lib/mock-data';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

export function Reports() {
  const [dateRange, setDateRange] = useState('month');
  const [reportType, setReportType] = useState('overview');

  // Portfolio Analytics
  const portfolioAtRisk = mockLoans
    .filter(l => l.status === 'overdue')
    .reduce((sum, l) => sum + l.balance, 0);
  
  const totalOutstanding = mockLoans
    .filter(l => l.status === 'active' || l.status === 'overdue')
    .reduce((sum, l) => sum + l.balance, 0);

  const parRatio = (portfolioAtRisk / totalOutstanding) * 100;

  // Loan Performance by Product
  const loansByProduct = mockLoans.reduce((acc, loan) => {
    const existing = acc.find(item => item.product === loan.productName);
    if (existing) {
      existing.count += 1;
      existing.amount += loan.principal;
    } else {
      acc.push({ product: loan.productName, count: 1, amount: loan.principal });
    }
    return acc;
  }, [] as { product: string; count: number; amount: number }[]);

  // Monthly Disbursement & Collection
  const monthlyPerformance = [
    { month: 'Jan', disbursed: 450000, collected: 120000, outstanding: 330000 },
    { month: 'Feb', disbursed: 500000, collected: 180000, outstanding: 650000 },
    { month: 'Mar', disbursed: 380000, collected: 210000, outstanding: 820000 },
    { month: 'Apr', disbursed: 620000, collected: 250000, outstanding: 1190000 },
    { month: 'May', disbursed: 550000, collected: 290000, outstanding: 1450000 },
    { month: 'Jun', disbursed: 480000, collected: 310000, outstanding: 1620000 },
  ];

  // Loan Status Distribution
  const loanStatusData = [
    { name: 'Active', value: mockLoans.filter(l => l.status === 'active').length },
    { name: 'Pending', value: mockLoans.filter(l => l.status === 'pending').length },
    { name: 'Overdue', value: mockLoans.filter(l => l.status === 'overdue').length },
    { name: 'Cleared', value: mockLoans.filter(l => l.status === 'cleared').length },
  ];

  // Customer Segmentation
  const customerSegments = [
    { segment: 'New (<3 months)', count: 2, percentage: 40 },
    { segment: 'Regular (3-12 months)', count: 2, percentage: 40 },
    { segment: 'Loyal (>12 months)', count: 1, percentage: 20 },
  ];

  // Top Borrowers
  const topBorrowers = mockCustomers.map(customer => {
    const customerLoans = mockLoans.filter(l => l.customerId === customer.id);
    const totalBorrowed = customerLoans.reduce((sum, l) => sum + l.principal, 0);
    const totalPaid = mockPayments
      .filter(p => p.customerId === customer.id)
      .reduce((sum, p) => sum + p.amount, 0);
    return {
      name: `${customer.firstName} ${customer.lastName}`,
      borrowed: totalBorrowed,
      paid: totalPaid,
      loans: customerLoans.length,
    };
  }).sort((a, b) => b.borrowed - a.borrowed).slice(0, 5);

  // Payment Collection Rate
  const collectionRate = [
    { week: 'Week 1', target: 50000, collected: 48000, rate: 96 },
    { week: 'Week 2', target: 50000, collected: 52000, rate: 104 },
    { week: 'Week 3', target: 50000, collected: 45000, rate: 90 },
    { week: 'Week 4', target: 50000, collected: 51000, rate: 102 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">Comprehensive insights and data analysis</p>
        </div>
        <div className="flex gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Portfolio at Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{parRatio.toFixed(2)}%</div>
            <p className="text-xs text-gray-500 mt-1">{formatCurrency(portfolioAtRisk)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Repayment Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">94.5%</div>
            <p className="text-xs text-gray-500 mt-1">On-time payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Loan Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(mockLoans.reduce((sum, l) => sum + l.principal, 0) / mockLoans.length)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Per loan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Borrowers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(mockLoans.filter(l => l.status === 'active').map(l => l.customerId)).size}
            </div>
            <p className="text-xs text-gray-500 mt-1">Out of {mockCustomers.length} total</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Disbursement & Collection</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Bar dataKey="disbursed" fill="#3B82F6" name="Disbursed" />
                <Bar dataKey="collected" fill="#10B981" name="Collected" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Outstanding Balance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="outstanding" stroke="#F59E0B" strokeWidth={2} name="Outstanding" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Loan Portfolio by Product</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={loansByProduct}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ product, count }) => `${product}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {loansByProduct.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Collection Rate Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={collectionRate}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="rate" stroke="#10B981" strokeWidth={2} name="Collection Rate %" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports Tabs */}
      <Tabs defaultValue="loans" className="space-y-4">
        <TabsList>
          <TabsTrigger value="loans">Loan Reports</TabsTrigger>
          <TabsTrigger value="customers">Customer Reports</TabsTrigger>
          <TabsTrigger value="payments">Payment Reports</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="loans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Loan Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 pb-4 border-b">
                  <div>
                    <p className="text-sm text-gray-500">Total Loans</p>
                    <p className="text-2xl font-bold">{mockLoans.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Disbursed</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(mockLoans.reduce((sum, l) => sum + l.principal, 0))}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Outstanding</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {formatCurrency(totalOutstanding)}
                    </p>
                  </div>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Total Amount</TableHead>
                      <TableHead>Avg Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loansByProduct.map((item) => (
                      <TableRow key={item.product}>
                        <TableCell className="font-medium">{item.product}</TableCell>
                        <TableCell>{item.count}</TableCell>
                        <TableCell>{formatCurrency(item.amount)}</TableCell>
                        <TableCell>{formatCurrency(item.amount / item.count)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Borrowers</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Loans</TableHead>
                      <TableHead>Borrowed</TableHead>
                      <TableHead>Paid</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topBorrowers.map((borrower, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{borrower.name}</TableCell>
                        <TableCell>{borrower.loans}</TableCell>
                        <TableCell>{formatCurrency(borrower.borrowed)}</TableCell>
                        <TableCell className="text-green-600">{formatCurrency(borrower.paid)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Customer Segmentation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerSegments.map((segment) => (
                    <div key={segment.segment} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{segment.segment}</span>
                        <span className="text-sm text-gray-500">{segment.count} customers ({segment.percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${segment.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Payments</p>
                  <p className="text-2xl font-bold">{mockPayments.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Total Collected</p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatCurrency(mockPayments.reduce((sum, p) => sum + p.amount, 0))}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Avg Payment</p>
                  <p className="text-2xl font-bold">
                    {formatCurrency(mockPayments.reduce((sum, p) => sum + p.amount, 0) / mockPayments.length)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">This Month</p>
                  <p className="text-2xl font-bold text-blue-600">2</p>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Method</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {['cash', 'bank_transfer', 'mobile_money', 'check'].map(method => {
                    const methodPayments = mockPayments.filter(p => p.paymentMethod === method);
                    const total = methodPayments.reduce((sum, p) => sum + p.amount, 0);
                    const percentage = (total / mockPayments.reduce((sum, p) => sum + p.amount, 0)) * 100;
                    
                    return (
                      <TableRow key={method}>
                        <TableCell className="font-medium capitalize">{method.replace('_', ' ')}</TableCell>
                        <TableCell>{methodPayments.length}</TableCell>
                        <TableCell>{formatCurrency(total)}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{percentage.toFixed(1)}%</Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portfolio" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Portfolio Quality</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {((1 - parRatio / 100) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-500 mt-2">Healthy Portfolio</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Default Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {((mockLoans.filter(l => l.status === 'overdue').length / mockLoans.length) * 100).toFixed(1)}%
                </div>
                <p className="text-sm text-gray-500 mt-2">Overdue Loans</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recovery Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">87.3%</div>
                <p className="text-sm text-gray-500 mt-2">Collections vs Disbursements</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Loan Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Status</TableHead>
                    <TableHead>Count</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {['active', 'pending', 'overdue', 'cleared'].map(status => {
                    const statusLoans = mockLoans.filter(l => l.status === status);
                    const total = statusLoans.reduce((sum, l) => sum + l.principal, 0);
                    const percentage = (statusLoans.length / mockLoans.length) * 100;
                    
                    return (
                      <TableRow key={status}>
                        <TableCell>
                          <Badge
                            variant={
                              status === 'active' ? 'default' :
                              status === 'cleared' ? 'secondary' :
                              status === 'overdue' ? 'destructive' : 'outline'
                            }
                            className="capitalize"
                          >
                            {status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{statusLoans.length}</TableCell>
                        <TableCell>{formatCurrency(total)}</TableCell>
                        <TableCell>{percentage.toFixed(1)}%</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
