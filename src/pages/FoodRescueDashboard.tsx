import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, Package, MapPin, Users, Plus, Calendar, Building2 } from 'lucide-react';
import { MobileHeader, MobileNav } from '@/components/ui/mobile-nav';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export default function FoodRescueDashboard({ user }: any) {
  const { user: authUser } = useAuth();
  const [listings, setListings] = useState<any[]>([]);
  const [recipients, setRecipients] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateListingOpen, setIsCreateListingOpen] = useState(false);
  const [isRegisterOrgOpen, setIsRegisterOrgOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [listingsRes, recipientsRes, orgsRes] = await Promise.all([
        supabase.from('food_rescue_listings').select('*, donor:donor_id(full_name)').eq('status', 'available'),
        supabase.from('food_rescue_recipients').select('*').eq('verification_status', 'verified'),
        supabase.from('organizations').select('*').order('created_at', { ascending: false })
      ]);

      setListings(listingsRes.data || []);
      setRecipients(recipientsRes.data || []);
      setOrganizations(orgsRes.data || []);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to load data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const handleRegisterOrg = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to register',
        variant: 'destructive'
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    try {
      const { error } = await supabase.from('organizations').insert({
        user_id: authUser.id,
        org_name: formData.get('org_name'),
        org_type: formData.get('org_type'),
        registration_number: formData.get('registration_number'),
        contact_person: formData.get('contact_person'),
        contact_phone: formData.get('contact_phone'),
        contact_email: formData.get('contact_email'),
        physical_address: formData.get('physical_address'),
        county: formData.get('county'),
        description: formData.get('description'),
        beneficiary_count: parseInt(formData.get('beneficiary_count') as string)
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Organization registered! Pending verification.'
      });
      setIsRegisterOrgOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to register organization',
        variant: 'destructive'
      });
    }
  };

  const handleCreateListing = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!authUser) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create listing',
        variant: 'destructive'
      });
      return;
    }

    const formData = new FormData(e.currentTarget);
    try {
      const { error } = await supabase.from('food_rescue_listings').insert({
        donor_id: authUser.id,
        product_name: formData.get('product_name'),
        quantity: parseFloat(formData.get('quantity') as string),
        unit: formData.get('unit'),
        pickup_location: formData.get('pickup_location'),
        expiry_date: formData.get('expiry_date'),
        description: formData.get('description'),
        transport_provided: formData.get('transport_provided') === 'true',
        transport_details: formData.get('transport_details'),
        pickup_deadline: formData.get('pickup_deadline')
      });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Surplus food listing created successfully'
      });
      setIsCreateListingOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create listing',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <MobileHeader title="Food Rescue" />
      
      <main className="py-6 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500" />
            Food Rescue Dashboard
          </h1>
          <p className="text-muted-foreground">Connecting surplus food with those in need</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Package className="h-4 w-4" />
                Available Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{listings.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Verified Recipients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recipients.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Organizations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organizations.length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="listings" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="listings">Available Food</TabsTrigger>
            <TabsTrigger value="recipients">Recipients</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isCreateListingOpen} onOpenChange={setIsCreateListingOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    List Surplus Food
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>List Surplus Food</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateListing} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Product Name*</Label>
                        <Input name="product_name" required />
                      </div>
                      <div>
                        <Label>Quantity*</Label>
                        <Input name="quantity" type="number" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Unit*</Label>
                        <select name="unit" className="w-full border rounded-md p-2" required>
                          <option value="Kg">Kg</option>
                          <option value="Bags">Bags</option>
                          <option value="Crates">Crates</option>
                          <option value="Pieces">Pieces</option>
                        </select>
                      </div>
                      <div>
                        <Label>Expiry Date*</Label>
                        <Input name="expiry_date" type="date" required />
                      </div>
                    </div>
                    <div>
                      <Label>Pickup Location*</Label>
                      <Input name="pickup_location" required />
                    </div>
                    <div>
                      <Label>Transport Provided?*</Label>
                      <select name="transport_provided" className="w-full border rounded-md p-2" required>
                        <option value="false">No - Recipient arranges transport</option>
                        <option value="true">Yes - I will deliver</option>
                      </select>
                    </div>
                    <div>
                      <Label>Transport Details (optional)</Label>
                      <Textarea name="transport_details" placeholder="Delivery radius, conditions, etc." />
                    </div>
                    <div>
                      <Label>Pickup Deadline (optional)</Label>
                      <Input name="pickup_deadline" type="datetime-local" />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea name="description" />
                    </div>
                    <Button type="submit" className="w-full">Create Listing</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {listings.map(listing => (
                <Card key={listing.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{listing.product_name}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      By {listing.donor?.full_name || 'Anonymous'}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Badge variant="secondary">
                      <Package className="mr-1 h-3 w-3" />
                      {listing.quantity} {listing.unit}
                    </Badge>
                    <div className="text-sm space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-3 w-3" />
                        {listing.pickup_location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        Expires: {new Date(listing.expiry_date).toLocaleDateString()}
                      </div>
                    </div>
                    <Button className="w-full" size="sm">Claim</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recipients" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {recipients.map(recipient => (
                <Card key={recipient.id}>
                  <CardHeader>
                    <CardTitle>{recipient.name}</CardTitle>
                    <Badge variant="secondary">{recipient.type}</Badge>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Contact:</strong> {recipient.contact_person}</div>
                      <div><strong>Phone:</strong> {recipient.phone}</div>
                      <div><strong>Address:</strong> {recipient.address}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            <div className="flex justify-end">
              <Dialog open={isRegisterOrgOpen} onOpenChange={setIsRegisterOrgOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Register Organization
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Register Your Organization</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRegisterOrg} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Organization Name*</Label>
                        <Input name="org_name" required />
                      </div>
                      <div>
                        <Label>Type*</Label>
                        <select name="org_type" className="w-full border rounded-md p-2" required>
                          <option value="school">School</option>
                          <option value="hospital">Hospital</option>
                          <option value="cbo">CBO</option>
                          <option value="ngo">NGO</option>
                          <option value="charity">Charity</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Registration Number*</Label>
                        <Input name="registration_number" required />
                      </div>
                      <div>
                        <Label>County*</Label>
                        <Input name="county" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Contact Person*</Label>
                        <Input name="contact_person" required />
                      </div>
                      <div>
                        <Label>Contact Phone*</Label>
                        <Input name="contact_phone" required />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Email*</Label>
                        <Input name="contact_email" type="email" required />
                      </div>
                      <div>
                        <Label>Beneficiaries</Label>
                        <Input name="beneficiary_count" type="number" />
                      </div>
                    </div>
                    <div>
                      <Label>Physical Address*</Label>
                      <Input name="physical_address" required />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea name="description" />
                    </div>
                    <Button type="submit" className="w-full">Submit for Verification</Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {organizations.map(org => (
                <Card key={org.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{org.org_name}</CardTitle>
                        <Badge variant="outline" className="mt-1">{org.org_type}</Badge>
                      </div>
                      <Badge variant={org.verification_status === 'verified' ? 'default' : 'secondary'}>
                        {org.verification_status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div><strong>Contact:</strong> {org.contact_person}</div>
                      <div><strong>Phone:</strong> {org.contact_phone}</div>
                      <div><strong>County:</strong> {org.county}</div>
                      {org.beneficiary_count && (
                        <div><strong>Beneficiaries:</strong> {org.beneficiary_count}</div>
                      )}
                      {org.trust_score > 0 && (
                        <div><strong>Trust Score:</strong> {org.trust_score}/5.0</div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
      
      <MobileNav />
    </div>
  );
}
