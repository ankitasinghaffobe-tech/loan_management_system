import { useState } from 'react';
import { Plus, Edit, Trash2, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
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
import { mockLoanProducts, mockLoans } from '../lib/mock-data';
import { LoanProduct } from '../lib/types';
import { toast } from 'sonner@2.0.3';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function LoanProducts() {
  const [products, setProducts] = useState(mockLoanProducts);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<LoanProduct | null>(null);

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newProduct: LoanProduct = {
      id: `LP${String(products.length + 1).padStart(3, '0')}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as any,
      minAmount: parseFloat(formData.get('minAmount') as string),
      maxAmount: parseFloat(formData.get('maxAmount') as string),
      interestRate: parseFloat(formData.get('interestRate') as string),
      minDuration: parseInt(formData.get('minDuration') as string),
      maxDuration: parseInt(formData.get('maxDuration') as string),
      penaltyRate: parseFloat(formData.get('penaltyRate') as string),
      processingFee: parseFloat(formData.get('processingFee') as string),
      isActive: formData.get('isActive') === 'on',
      eligibilityRules: formData.get('eligibilityRules') as string,
      createdAt: new Date(),
    };
    
    if (editingProduct) {
      setProducts(products.map(p => p.id === editingProduct.id ? { ...newProduct, id: editingProduct.id } : p));
      toast.success('Loan product updated successfully');
    } else {
      setProducts([...products, newProduct]);
      toast.success('Loan product created successfully');
    }
    
    setIsAddDialogOpen(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: LoanProduct) => {
    setEditingProduct(product);
    setIsAddDialogOpen(true);
  };

  const handleDelete = (productId: string) => {
    const hasLoans = mockLoans.some(loan => loan.productId === productId);
    if (hasLoans) {
      toast.error('Cannot delete product with existing loans');
      return;
    }
    setProducts(products.filter(p => p.id !== productId));
    toast.success('Loan product deleted');
  };

  const toggleStatus = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
    toast.success('Product status updated');
  };

  const getProductLoans = (productId: string) => {
    return mockLoans.filter(loan => loan.productId === productId);
  };

  const getProductStats = (productId: string) => {
    const loans = getProductLoans(productId);
    const active = loans.filter(l => l.status === 'active').length;
    const totalDisbursed = loans.reduce((sum, l) => sum + l.principal, 0);
    return { total: loans.length, active, totalDisbursed };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Loan Products</h1>
          <p className="text-gray-500 mt-1">Configure loan types and their terms</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
          setIsAddDialogOpen(open);
          if (!open) setEditingProduct(null);
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? 'Edit Loan Product' : 'Create New Loan Product'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={editingProduct?.name}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  defaultValue={editingProduct?.description}
                  rows={3}
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Product Type *</Label>
                <Select name="type" defaultValue={editingProduct?.type} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal Loan</SelectItem>
                    <SelectItem value="business">Business Loan</SelectItem>
                    <SelectItem value="group">Group Loan</SelectItem>
                    <SelectItem value="emergency">Emergency Loan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minAmount">Minimum Amount *</Label>
                  <Input 
                    id="minAmount" 
                    name="minAmount" 
                    type="number"
                    defaultValue={editingProduct?.minAmount}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxAmount">Maximum Amount *</Label>
                  <Input 
                    id="maxAmount" 
                    name="maxAmount" 
                    type="number"
                    defaultValue={editingProduct?.maxAmount}
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minDuration">Min Duration (months) *</Label>
                  <Input 
                    id="minDuration" 
                    name="minDuration" 
                    type="number"
                    defaultValue={editingProduct?.minDuration}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDuration">Max Duration (months) *</Label>
                  <Input 
                    id="maxDuration" 
                    name="maxDuration" 
                    type="number"
                    defaultValue={editingProduct?.maxDuration}
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="interestRate">Interest Rate (%) *</Label>
                  <Input 
                    id="interestRate" 
                    name="interestRate" 
                    type="number"
                    step="0.1"
                    defaultValue={editingProduct?.interestRate}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="penaltyRate">Penalty Rate (%) *</Label>
                  <Input 
                    id="penaltyRate" 
                    name="penaltyRate" 
                    type="number"
                    step="0.1"
                    defaultValue={editingProduct?.penaltyRate}
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="processingFee">Processing Fee *</Label>
                  <Input 
                    id="processingFee" 
                    name="processingFee" 
                    type="number"
                    defaultValue={editingProduct?.processingFee}
                    required 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="eligibilityRules">Eligibility Rules</Label>
                <Textarea 
                  id="eligibilityRules" 
                  name="eligibilityRules"
                  defaultValue={editingProduct?.eligibilityRules}
                  rows={2}
                  placeholder="e.g., Minimum 6 months employment"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="isActive" 
                  name="isActive"
                  defaultChecked={editingProduct?.isActive ?? true}
                />
                <Label htmlFor="isActive">Active Product</Label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingProduct(null);
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-gray-500 mt-1">All products</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {products.filter(p => p.isActive).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Available for lending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Personal Loan</div>
            <p className="text-xs text-gray-500 mt-1">3 active loans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Interest Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(products.reduce((sum, p) => sum + p.interestRate, 0) / products.length).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500 mt-1">Across all products</p>
          </CardContent>
        </Card>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => {
          const stats = getProductStats(product.id);
          
          return (
            <Card key={product.id} className={!product.isActive ? 'opacity-60' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Package className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <Badge 
                        variant={product.isActive ? 'default' : 'secondary'}
                        className="mt-1 capitalize"
                      >
                        {product.type}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={product.isActive}
                      onCheckedChange={() => toggleStatus(product.id)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{product.description}</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Amount Range</p>
                    <p className="font-medium text-sm">
                      {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Duration Range</p>
                    <p className="font-medium text-sm">
                      {product.minDuration} - {product.maxDuration} months
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Interest Rate</p>
                    <p className="font-medium text-sm text-blue-600">{product.interestRate}% p.a.</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Processing Fee</p>
                    <p className="font-medium text-sm">{formatCurrency(product.processingFee)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Penalty Rate</p>
                    <p className="font-medium text-sm text-red-600">{product.penaltyRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Eligibility</p>
                    <p className="font-medium text-sm text-xs">{product.eligibilityRules || 'N/A'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                      <p className="text-xs text-gray-500">Total Loans</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                      <p className="text-xs text-gray-500">Active</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold">{formatCurrency(stats.totalDisbursed)}</p>
                      <p className="text-xs text-gray-500">Disbursed</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
