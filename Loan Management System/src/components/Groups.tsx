import { useState } from 'react';
import { Plus, Users, Eye } from 'lucide-react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { mockGroups, mockGroupMembers, mockLoans } from '../lib/mock-data';
import { Group } from '../lib/types';
import { toast } from 'sonner@2.0.3';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(amount);
};

export function Groups() {
  const [groups, setGroups] = useState(mockGroups);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const handleAddGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const newGroup: Group = {
      id: `G${String(groups.length + 1).padStart(3, '0')}`,
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      memberCount: 0,
      totalLoans: 0,
      activeLoans: 0,
      totalSavings: 0,
      createdAt: new Date(),
      status: 'active',
    };
    
    setGroups([...groups, newGroup]);
    setIsAddDialogOpen(false);
    toast.success('Group created successfully');
  };

  const viewGroup = (group: Group) => {
    setSelectedGroup(group);
    setIsViewDialogOpen(true);
  };

  const getGroupMembers = (groupId: string) => {
    return mockGroupMembers.filter(m => m.groupId === groupId);
  };

  const getGroupLoans = (groupId: string) => {
    const members = getGroupMembers(groupId);
    const memberIds = members.map(m => m.customerId);
    return mockLoans.filter(loan => memberIds.includes(loan.customerId));
  };

  const getTotalMembers = () => groups.reduce((sum, g) => sum + g.memberCount, 0);
  const getTotalSavings = () => groups.reduce((sum, g) => sum + g.totalSavings, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Groups</h1>
          <p className="text-gray-500 mt-1">Manage lending groups and members</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Create New Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleAddGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Group Name *</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea 
                  id="description" 
                  name="description"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Group</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{groups.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{getTotalMembers()}</div>
            <p className="text-xs text-gray-500 mt-1">Across all groups</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Group Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(getTotalSavings())}
            </div>
            <p className="text-xs text-gray-500 mt-1">Combined savings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Group Loans</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {groups.reduce((sum, g) => sum + g.activeLoans, 0)}
            </div>
            <p className="text-xs text-gray-500 mt-1">Currently active</p>
          </CardContent>
        </Card>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{group.name}</CardTitle>
                    <Badge 
                      variant={group.status === 'active' ? 'default' : 'secondary'}
                      className="mt-1 capitalize"
                    >
                      {group.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{group.description}</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                <div>
                  <p className="text-xs text-gray-500">Members</p>
                  <p className="text-2xl font-bold text-blue-600">{group.memberCount}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Active Loans</p>
                  <p className="text-2xl font-bold text-orange-600">{group.activeLoans}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Loans</p>
                  <p className="text-lg font-medium">{group.totalLoans}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Savings</p>
                  <p className="text-lg font-medium">{formatCurrency(group.totalSavings)}</p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => viewGroup(group)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Created {group.createdAt.toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Group Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Group Details</DialogTitle>
          </DialogHeader>
          {selectedGroup && (
            <div className="space-y-6">
              {/* Group Information */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Group Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Group Name</Label>
                    <p className="font-medium">{selectedGroup.name}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Status</Label>
                    <Badge variant="default" className="capitalize">
                      {selectedGroup.status}
                    </Badge>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-500">Description</Label>
                    <p className="font-medium">{selectedGroup.description}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Created Date</Label>
                    <p className="font-medium">{selectedGroup.createdAt.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Total Members</Label>
                    <p className="font-medium">{selectedGroup.memberCount}</p>
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Financial Summary</h3>
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500">Total Loans</p>
                      <p className="text-2xl font-bold">{selectedGroup.totalLoans}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500">Active Loans</p>
                      <p className="text-2xl font-bold text-green-600">{selectedGroup.activeLoans}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-500">Total Savings</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {formatCurrency(selectedGroup.totalSavings)}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Group Members */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Group Members</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getGroupMembers(selectedGroup.id).map((member) => (
                        <TableRow key={member.id}>
                          <TableCell className="font-medium">{member.customerId}</TableCell>
                          <TableCell>{member.customerName}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={member.role === 'leader' ? 'default' : 'secondary'}
                              className="capitalize"
                            >
                              {member.role}
                            </Badge>
                          </TableCell>
                          <TableCell>{member.joinedAt.toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Group Loans */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Member Loans</h3>
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Loan ID</TableHead>
                        <TableHead>Member</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getGroupLoans(selectedGroup.id).map((loan) => (
                        <TableRow key={loan.id}>
                          <TableCell className="font-medium">{loan.id}</TableCell>
                          <TableCell>{loan.customerName}</TableCell>
                          <TableCell>{loan.productName}</TableCell>
                          <TableCell>{formatCurrency(loan.principal)}</TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(loan.balance)}
                          </TableCell>
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
