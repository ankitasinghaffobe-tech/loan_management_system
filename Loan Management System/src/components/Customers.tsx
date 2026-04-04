import { useState } from 'react';
import { Plus, Search, Eye, Edit, Trash2, UserPlus } from 'lucide-react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { mockCustomers, mockLoans, mockPayments, mockSavingsAccounts } from '../lib/mock-data';
import { Customer } from '../lib/types';
import { toast } from 'sonner@2.0.3';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function Customers() {
  const [customers, setCustomers] = useState(mockCustomers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const filteredCustomers = customers.filter(customer =>
    customer.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.phone.includes(searchQuery) ||
    customer.idNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newCustomer: Customer = {
      id: `C${String(customers.length + 1).padStart(3, '0')}`,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      idNumber: formData.get('idNumber') as string,
      address: formData.get('address') as string,
      city: formData.get('city') as string,
      dateOfBirth: new Date(formData.get('dateOfBirth') as string),
      occupation: formData.get('occupation') as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setCustomers([...customers, newCustomer]);
    setIsAddDialogOpen(false);
    toast.success('Customer registered successfully');
  };

  const viewCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsViewDialogOpen(true);
  };

  const getCustomerLoans = (customerId: string) => {
    return mockLoans.filter(loan => loan.customerId === customerId);
  };

  const getCustomerPayments = (customerId: string) => {
    return mockPayments.filter(payment => payment.customerId === customerId);
  };

  const getCustomerSavings = (customerId: string) => {
    return mockSavingsAccounts.find(account => account.customerId === customerId);
  };

  const getTotalBorrowed = (customerId: string) => {
    const loans = getCustomerLoans(customerId);
    return loans.reduce((sum, loan) => sum + loan.principal, 0);
  };

  const getTotalPaid = (customerId: string) => {
    const payments = getCustomerPayments(customerId);
    return payments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-500 mt-1">Manage customer information and profiles</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Register Customer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Customer</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddCustomer} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" name="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" name="lastName" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input id="phone" name="phone" required />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number *</Label>
                  <Input id="idNumber" name="idNumber" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input id="dateOfBirth" name="dateOfBirth" type="date" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">Occupation *</Label>
                <Input id="occupation" name="occupation" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" name="address" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input id="city" name="city" required />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Register Customer</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
            <p className="text-xs text-gray-500 mt-1">Registered members</p>
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
            <p className="text-xs text-gray-500 mt-1">With active loans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Savings Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockSavingsAccounts.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">New This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">2</div>
            <p className="text-xs text-gray-500 mt-1">+12% growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, phone, or ID number..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>ID Number</TableHead>
                <TableHead>City</TableHead>
                <TableHead>Total Borrowed</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => {
                const loans = getCustomerLoans(customer.id);
                const hasActiveLoans = loans.some(l => l.status === 'active');
                
                return (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                        <p className="text-sm text-gray-500">{customer.occupation}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{customer.email}</p>
                        <p className="text-gray-500">{customer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>{customer.idNumber}</TableCell>
                    <TableCell>{customer.city}</TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(getTotalBorrowed(customer.id))}
                    </TableCell>
                    <TableCell>
                      <Badge variant={hasActiveLoans ? 'default' : 'secondary'}>
                        {hasActiveLoans ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => viewCustomer(customer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* View Customer Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Customer Profile</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Full Name</Label>
                    <p className="font-medium">
                      {selectedCustomer.firstName} {selectedCustomer.lastName}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500">ID Number</Label>
                    <p className="font-medium">{selectedCustomer.idNumber}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="font-medium">{selectedCustomer.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Phone</Label>
                    <p className="font-medium">{selectedCustomer.phone}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Date of Birth</Label>
                    <p className="font-medium">
                      {selectedCustomer.dateOfBirth.toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Occupation</Label>
                    <p className="font-medium">{selectedCustomer.occupation}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Address</Label>
                    <p className="font-medium">{selectedCustomer.address}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">City</Label>
                    <p className="font-medium">{selectedCustomer.city}</p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Financial Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500">Total Borrowed</p>
                      <p className="text-xl font-bold">
                        {formatCurrency(getTotalBorrowed(selectedCustomer.id))}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500">Total Paid</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(getTotalPaid(selectedCustomer.id))}
                      </p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500">Savings Balance</p>
                      <p className="text-xl font-bold text-blue-600">
                        {formatCurrency(getCustomerSavings(selectedCustomer.id)?.balance || 0)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Loan History */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Loan History</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCustomerLoans(selectedCustomer.id).map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell>{loan.id}</TableCell>
                          <TableCell>{loan.productName}</TableCell>
                          <TableCell>{formatCurrency(loan.principal)}</TableCell>
                          <TableCell>{formatCurrency(loan.balance)}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                loan.status === 'active' ? 'default' :
                                loan.status === 'cleared' ? 'secondary' :
                                loan.status === 'overdue' ? 'destructive' : 'outline'
                              }
                            >
                              {loan.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Payment History</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Receipt</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Method</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCustomerPayments(selectedCustomer.id).map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>{payment.receiptNumber}</TableCell>
                          <TableCell>{payment.paymentDate.toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(payment.amount)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {payment.paymentMethod.replace('_', ' ')}
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
