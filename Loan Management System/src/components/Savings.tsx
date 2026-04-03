import { useState } from 'react';
import { Plus, Search, TrendingUp, TrendingDown } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { mockSavingsAccounts, mockSavingsTransactions, mockCustomers } from '../lib/mock-data';
import { SavingsTransaction } from '../lib/types';
import { toast } from 'sonner@2.0.3';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function Savings() {
  const [accounts, setAccounts] = useState(mockSavingsAccounts);
  const [transactions, setTransactions] = useState(mockSavingsTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [isTransactionDialogOpen, setIsTransactionDialogOpen] = useState(false);

  const filteredAccounts = accounts.filter(account =>
    account.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    account.customerId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTransaction = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const accountId = formData.get('accountId') as string;
    const type = formData.get('type') as 'deposit' | 'withdrawal';
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    
    const account = accounts.find(a => a.id === accountId);
    if (!account) return;
    
    if (type === 'withdrawal' && amount > account.balance) {
      toast.error('Insufficient balance');
      return;
    }
    
    const balanceBefore = account.balance;
    const balanceAfter = type === 'deposit' ? balanceBefore + amount : balanceBefore - amount;
    
    const newTransaction: SavingsTransaction = {
      id: `ST${String(transactions.length + 1).padStart(3, '0')}`,
      accountId: account.id,
      customerId: account.customerId,
      customerName: account.customerName,
      type,
      amount,
      balanceBefore,
      balanceAfter,
      transactionDate: new Date(formData.get('transactionDate') as string),
      description,
      recordedBy: 'Current User',
    };
    
    setTransactions([newTransaction, ...transactions]);
    setAccounts(accounts.map(a => 
      a.id === accountId ? { ...a, balance: balanceAfter } : a
    ));
    setIsTransactionDialogOpen(false);
    toast.success(`${type === 'deposit' ? 'Deposit' : 'Withdrawal'} recorded successfully`);
  };

  const getTotalBalance = () => accounts.reduce((sum, a) => sum + a.balance, 0);
  const getTotalDeposits = () => transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
  const getTotalWithdrawals = () => transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Savings</h1>
          <p className="text-gray-500 mt-1">Manage savings accounts and transactions</p>
        </div>
        <Dialog open={isTransactionDialogOpen} onOpenChange={setIsTransactionDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Record Savings Transaction</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleTransaction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="accountId">Select Account *</Label>
                <Select name="accountId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.filter(a => a.status === 'active').map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.accountNumber} - {account.customerName} - Balance: {formatCurrency(account.balance)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Transaction Type *</Label>
                <Select name="type" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deposit">Deposit</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount *</Label>
                  <Input 
                    id="amount" 
                    name="amount" 
                    type="number"
                    step="0.01"
                    min="0.01"
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="transactionDate">Date *</Label>
                  <Input 
                    id="transactionDate" 
                    name="transactionDate" 
                    type="date"
                    defaultValue={new Date().toISOString().split('T')[0]}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  rows={2}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsTransactionDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Transaction</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(getTotalBalance())}
            </div>
            <p className="text-xs text-gray-500 mt-1">All accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(getTotalDeposits())}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(getTotalWithdrawals())}
            </div>
            <p className="text-xs text-gray-500 mt-1">All time</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Accounts and Transactions */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Savings Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by customer, account number, or ID..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Account Number</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Balance</TableHead>
                    <TableHead>Interest Rate</TableHead>
                    <TableHead>Min Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">{account.accountNumber}</TableCell>
                      <TableCell>{account.customerName}</TableCell>
                      <TableCell className="font-medium text-blue-600">
                        {formatCurrency(account.balance)}
                      </TableCell>
                      <TableCell>{account.interestRate}% p.a.</TableCell>
                      <TableCell>{formatCurrency(account.minimumBalance)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={account.status === 'active' ? 'default' : 'secondary'}
                          className="capitalize"
                        >
                          {account.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {account.createdAt.toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Balance Before</TableHead>
                    <TableHead>Balance After</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Recorded By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.transactionDate.toLocaleDateString()}</TableCell>
                      <TableCell className="font-medium">
                        {accounts.find(a => a.id === transaction.accountId)?.accountNumber}
                      </TableCell>
                      <TableCell>{transaction.customerName}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {transaction.type === 'deposit' ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <Badge
                            variant={transaction.type === 'deposit' ? 'default' : 'secondary'}
                            className="capitalize"
                          >
                            {transaction.type}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className={`font-medium ${transaction.type === 'deposit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </TableCell>
                      <TableCell>{formatCurrency(transaction.balanceBefore)}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(transaction.balanceAfter)}
                      </TableCell>
                      <TableCell className="text-sm">{transaction.description}</TableCell>
                      <TableCell className="text-sm text-gray-500">{transaction.recordedBy}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
