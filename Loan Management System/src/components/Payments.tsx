import { useState } from 'react';
import { Plus, Search, Receipt, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
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
import { mockPayments, mockLoans } from '../lib/mock-data';
import { Payment } from '../lib/types';
import { toast } from 'sonner@2.0.3';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function Payments() {
  const [payments, setPayments] = useState(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedLoanId, setSelectedLoanId] = useState('');

  const activeLoans = mockLoans.filter(l => l.status === 'active' || l.status === 'overdue');

  const filteredPayments = payments.filter(payment =>
    payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.receiptNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.loanId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecordPayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const loanId = formData.get('loanId') as string;
    const amount = parseFloat(formData.get('amount') as string);
    const paymentMethod = formData.get('paymentMethod') as any;
    const notes = formData.get('notes') as string;
    
    const loan = mockLoans.find(l => l.id === loanId);
    if (!loan) return;
    
    // Simple calculation: split payment between principal and interest
    // In real app, this would follow the amortization schedule
    const interestPortion = (loan.balance * loan.interestRate) / (12 * 100);
    const interestPaid = Math.min(interestPortion, amount);
    const principalPaid = amount - interestPaid;
    const balanceAfter = loan.balance - principalPaid;
    
    const newPayment: Payment = {
      id: `P${String(payments.length + 1).padStart(3, '0')}`,
      loanId: loan.id,
      customerId: loan.customerId,
      customerName: loan.customerName,
      amount,
      principalPaid,
      interestPaid,
      balanceBefore: loan.balance,
      balanceAfter: Math.max(0, balanceAfter),
      paymentMethod,
      paymentDate: new Date(formData.get('paymentDate') as string),
      receiptNumber: `RCP${String(payments.length + 1).padStart(3, '0')}`,
      notes,
      recordedBy: 'Current User',
    };
    
    setPayments([newPayment, ...payments]);
    setIsAddDialogOpen(false);
    setSelectedLoanId('');
    toast.success('Payment recorded successfully');
  };

  const getTodayPayments = () => {
    const today = new Date().toDateString();
    return payments.filter(p => p.paymentDate.toDateString() === today);
  };

  const getTotalCollected = () => payments.reduce((sum, p) => sum + p.amount, 0);
  const getTodayTotal = () => getTodayPayments().reduce((sum, p) => sum + p.amount, 0);

  const selectedLoan = selectedLoanId ? mockLoans.find(l => l.id === selectedLoanId) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-500 mt-1">Record and track loan repayments</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Record Loan Payment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleRecordPayment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="loanId">Select Loan *</Label>
                <Select 
                  name="loanId" 
                  value={selectedLoanId}
                  onValueChange={setSelectedLoanId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose loan" />
                  </SelectTrigger>
                  <SelectContent>
                    {activeLoans.map((loan) => (
                      <SelectItem key={loan.id} value={loan.id}>
                        {loan.id} - {loan.customerName} - Balance: {formatCurrency(loan.balance)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedLoan && (
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Customer</p>
                        <p className="font-medium">{selectedLoan.customerName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Product</p>
                        <p className="font-medium">{selectedLoan.productName}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Outstanding Balance</p>
                        <p className="font-medium text-orange-600">
                          {formatCurrency(selectedLoan.balance)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Monthly Payment</p>
                        <p className="font-medium">{formatCurrency(selectedLoan.monthlyPayment)}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Next Due Date</p>
                        <p className="font-medium">{selectedLoan.nextPaymentDate.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Status</p>
                        <Badge
                          variant={selectedLoan.status === 'active' ? 'default' : 'destructive'}
                          className="capitalize"
                        >
                          {selectedLoan.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Payment Amount *</Label>
                  <Input 
                    id="amount" 
                    name="amount" 
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={selectedLoan?.balance}
                    placeholder="0.00"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentDate">Payment Date *</Label>
                  <Input 
                    id="paymentDate" 
                    name="paymentDate" 
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Payment Method *</Label>
                <Select name="paymentMethod" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                    <SelectItem value="check">Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea 
                  id="notes" 
                  name="notes"
                  rows={2}
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Payment</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(getTotalCollected())}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Payments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getTodayPayments().length}</div>
            <p className="text-xs text-green-600 mt-1">
              {formatCurrency(getTodayTotal())} collected
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(getTotalCollected() / payments.length)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Per transaction</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Methods Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {['cash', 'bank_transfer', 'mobile_money', 'check'].map(method => {
          const methodPayments = payments.filter(p => p.paymentMethod === method);
          const total = methodPayments.reduce((sum, p) => sum + p.amount, 0);
          
          return (
            <Card key={method}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 capitalize">{method.replace('_', ' ')}</p>
                    <p className="text-xl font-bold">{formatCurrency(total)}</p>
                    <p className="text-xs text-gray-500 mt-1">{methodPayments.length} payments</p>
                  </div>
                  <Receipt className="h-8 w-8 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by receipt, customer, or loan ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Loan ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Principal</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Balance After</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Recorded By</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                  <TableCell>{payment.paymentDate.toLocaleDateString()}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.loanId}</Badge>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell>{formatCurrency(payment.principalPaid)}</TableCell>
                  <TableCell>{formatCurrency(payment.interestPaid)}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(payment.balanceAfter)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize">
                      {payment.paymentMethod.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{payment.recordedBy}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
