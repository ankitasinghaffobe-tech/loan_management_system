import { useState } from 'react';
import { Plus, Search, Eye, FileText, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
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
import { mockLoans, mockCustomers, mockLoanProducts, mockLoanSchedules } from '../lib/mock-data';
import { Loan, LoanStatus } from '../lib/types';
import { toast } from 'sonner@2.0.3';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function Loans() {
  const [loans, setLoans] = useState(mockLoans);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<LoanStatus | 'all'>('all');
  const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      loan.productName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddLoan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const customerId = formData.get('customerId') as string;
    const productId = formData.get('productId') as string;
    const principal = parseFloat(formData.get('principal') as string);
    const duration = parseInt(formData.get('duration') as string);
    
    const customer = mockCustomers.find(c => c.id === customerId);
    const product = mockLoanProducts.find(p => p.id === productId);
    
    if (!customer || !product) return;
    
    const interestAmount = (principal * product.interestRate * duration) / (12 * 100);
    const totalAmount = principal + interestAmount;
    const monthlyPayment = totalAmount / duration;
    
    const newLoan: Loan = {
      id: `L${String(loans.length + 1).padStart(3, '0')}`,
      customerId: customer.id,
      customerName: `${customer.firstName} ${customer.lastName}`,
      productId: product.id,
      productName: product.name,
      principal,
      interestRate: product.interestRate,
      duration,
      totalAmount,
      totalInterest: interestAmount,
      monthlyPayment,
      balance: totalAmount,
      status: 'pending',
      disbursementDate: new Date(formData.get('disbursementDate') as string),
      maturityDate: new Date(new Date(formData.get('disbursementDate') as string).setMonth(
        new Date(formData.get('disbursementDate') as string).getMonth() + duration
      )),
      nextPaymentDate: new Date(new Date(formData.get('disbursementDate') as string).setMonth(
        new Date(formData.get('disbursementDate') as string).getMonth() + 1
      )),
      createdAt: new Date(),
    };
    
    setLoans([...loans, newLoan]);
    setIsAddDialogOpen(false);
    toast.success('Loan created successfully');
  };

  const viewLoan = (loan: Loan) => {
    setSelectedLoan(loan);
    setIsViewDialogOpen(true);
  };

  const getTotalPrincipal = () => loans.reduce((sum, loan) => sum + loan.principal, 0);
  const getTotalBalance = () => loans.reduce((sum, loan) => sum + loan.balance, 0);
  const getActiveLoans = () => loans.filter(l => l.status === 'active').length;
  const getOverdueLoans = () => loans.filter(l => l.status === 'overdue').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
          <p className="text-gray-500 mt-1">Manage and track all loans</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Loan</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddLoan} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customerId">Select Customer *</Label>
                <Select name="customerId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCustomers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.firstName} {customer.lastName} - {customer.id}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="productId">Loan Product *</Label>
                <Select name="productId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose loan product" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockLoanProducts.filter(p => p.isActive).map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - {product.interestRate}% interest
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="principal">Principal Amount *</Label>
                  <Input 
                    id="principal" 
                    name="principal" 
                    type="number" 
                    min="1000"
                    step="1000"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (months) *</Label>
                  <Input 
                    id="duration" 
                    name="duration" 
                    type="number" 
                    min="1"
                    max="60"
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="disbursementDate">Disbursement Date *</Label>
                <Input 
                  id="disbursementDate" 
                  name="disbursementDate" 
                  type="date"
                  defaultValue={new Date().toISOString().split('T')[0]}
                  required 
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Loan</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loans.length}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{getActiveLoans()}</div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Disbursed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(getTotalPrincipal())}</div>
            <p className="text-xs text-gray-500 mt-1">Principal amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Outstanding Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(getTotalBalance())}</div>
            <p className="text-xs text-red-600 mt-1">{getOverdueLoans()} overdue</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by loan ID, customer, or product..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="cleared">Cleared</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Loan ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Product</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Next Payment</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLoans.map((loan) => (
                <TableRow key={loan.id}>
                  <TableCell className="font-medium">{loan.id}</TableCell>
                  <TableCell>{loan.customerName}</TableCell>
                  <TableCell>{loan.productName}</TableCell>
                  <TableCell>{formatCurrency(loan.principal)}</TableCell>
                  <TableCell>{formatCurrency(loan.totalAmount)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(loan.balance)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        loan.status === 'active' ? 'default' :
                        loan.status === 'cleared' ? 'secondary' :
                        loan.status === 'overdue' ? 'destructive' : 'outline'
                      }
                      className="capitalize"
                    >
                      {loan.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {loan.status === 'active' || loan.status === 'overdue' 
                      ? loan.nextPaymentDate.toLocaleDateString()
                      : '-'
                    }
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewLoan(loan)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Calendar className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Loan Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loan Details</DialogTitle>
          </DialogHeader>
          {selectedLoan && (
            <div className="space-y-6">
              {/* Loan Information */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Loan Information</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-500">Loan ID</Label>
                    <p className="font-medium">{selectedLoan.id}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Customer</Label>
                    <p className="font-medium">{selectedLoan.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Product</Label>
                    <p className="font-medium">{selectedLoan.productName}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Principal</Label>
                    <p className="font-medium">{formatCurrency(selectedLoan.principal)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Interest Rate</Label>
                    <p className="font-medium">{selectedLoan.interestRate}%</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Duration</Label>
                    <p className="font-medium">{selectedLoan.duration} months</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Total Interest</Label>
                    <p className="font-medium">{formatCurrency(selectedLoan.totalInterest)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Total Amount</Label>
                    <p className="font-medium">{formatCurrency(selectedLoan.totalAmount)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Monthly Payment</Label>
                    <p className="font-medium">{formatCurrency(selectedLoan.monthlyPayment)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Balance</Label>
                    <p className="font-medium text-orange-600">{formatCurrency(selectedLoan.balance)}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Status</Label>
                    <Badge
                      variant={
                        selectedLoan.status === 'active' ? 'default' :
                        selectedLoan.status === 'cleared' ? 'secondary' :
                        selectedLoan.status === 'overdue' ? 'destructive' : 'outline'
                      }
                      className="capitalize"
                    >
                      {selectedLoan.status}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-500">Progress</Label>
                    <p className="font-medium">
                      {((1 - selectedLoan.balance / selectedLoan.totalAmount) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Timeline</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label className="text-gray-500">Disbursement Date</Label>
                    <p className="font-medium">{selectedLoan.disbursementDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Next Payment Due</Label>
                    <p className="font-medium">{selectedLoan.nextPaymentDate.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Maturity Date</Label>
                    <p className="font-medium">{selectedLoan.maturityDate.toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              {/* Repayment Schedule */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Repayment Schedule</h3>
                <div className="border rounded-lg max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Principal</TableHead>
                        <TableHead>Interest</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockLoanSchedules
                        .filter(s => s.loanId === selectedLoan.id)
                        .map((schedule) => (
                          <TableRow key={schedule.id}>
                            <TableCell>{schedule.installmentNumber}</TableCell>
                            <TableCell>{schedule.dueDate.toLocaleDateString()}</TableCell>
                            <TableCell>{formatCurrency(schedule.principalAmount)}</TableCell>
                            <TableCell>{formatCurrency(schedule.interestAmount)}</TableCell>
                            <TableCell className="font-medium">
                              {formatCurrency(schedule.totalAmount)}
                            </TableCell>
                            <TableCell>{formatCurrency(schedule.balance)}</TableCell>
                            <TableCell>
                              <Badge variant={schedule.isPaid ? 'secondary' : 'outline'}>
                                {schedule.isPaid ? 'Paid' : 'Pending'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
