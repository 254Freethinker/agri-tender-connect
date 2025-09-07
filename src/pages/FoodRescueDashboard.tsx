import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FoodListingForm, FoodListingGrid, RecipientRegistrationForm } from '@/components/FoodRescueComponents';
import { Plus, Heart, Package, Users, Truck, BarChart3 } from 'lucide-react';

export default function FoodRescueDashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isRecipientDialogOpen, setIsRecipientDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    setIsDialogOpen(false);
    setIsRecipientDialogOpen(false);
  };

  const stats = [
    { icon: Package, label: 'Food Rescued', value: '2,340 kg', color: 'text-green-600' },
    { icon: Users, label: 'People Fed', value: '1,250+', color: 'text-blue-600' },
    { icon: Truck, label: 'Active Donors', value: '45', color: 'text-purple-600' },
    { icon: Heart, label: 'Recipients', value: '28', color: 'text-red-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="py-6 px-4 max-w-7xl mx-auto space-y-6">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Food Rescue Network
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connecting surplus food with communities in need. Together, we can eliminate food waste and hunger.
          </p>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg p-4 border">
                  <div className="text-center space-y-2">
                    <Icon className={`h-6 w-6 mx-auto ${stat.color}`} />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Donate Food
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Food Donation</DialogTitle>
              </DialogHeader>
              <FoodListingForm onSuccess={handleRefresh} />
            </DialogContent>
          </Dialog>

          <Dialog open={isRecipientDialogOpen} onOpenChange={setIsRecipientDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="lg" className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Register as Recipient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Register as Food Recipient</DialogTitle>
              </DialogHeader>
              <RecipientRegistrationForm onSuccess={handleRefresh} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Food</TabsTrigger>
            <TabsTrigger value="my-donations">My Donations</TabsTrigger>
            <TabsTrigger value="matches">Matches</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="space-y-6">
            <div key={refreshKey}>
              <FoodListingGrid />
            </div>
          </TabsContent>

          <TabsContent value="my-donations" className="space-y-6">
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Your Food Donations</h3>
              <p className="text-muted-foreground mb-6">
                Track your food donations and see their impact on the community.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                Create Your First Donation
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-6">
            <div className="text-center py-12">
              <Truck className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Food Matches</h3>
              <p className="text-muted-foreground mb-6">
                Coordinate pickups and deliveries with recipients.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Community Impact</h3>
              <p className="text-muted-foreground mb-6">
                See how food rescue efforts are making a difference.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
                <div className="bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-300">Environmental Impact</h4>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400 mt-2">850 kg CO₂</p>
                  <p className="text-sm text-green-600 dark:text-green-400">prevented from waste</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300">Food Saved</h4>
                  <p className="text-2xl font-bold text-blue-700 dark:text-blue-400 mt-2">2,340 kg</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">diverted from landfills</p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300">Lives Touched</h4>
                  <p className="text-2xl font-bold text-purple-700 dark:text-purple-400 mt-2">1,250+</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">people fed</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
