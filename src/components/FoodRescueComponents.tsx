import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Package, Phone, Mail, Plus, Heart } from 'lucide-react';
import { toast } from 'sonner';

interface FoodListing {
  id: string;
  product_name: string;
  description: string | null;
  quantity: number;
  unit: string;
  expiry_date: string | null;
  pickup_location: string;
  pickup_time_start: string | null;
  pickup_time_end: string | null;
  status: string;
  donor_id: string;
  created_at: string;
}

interface FoodRecipient {
  id: string;
  name: string;
  type: string | null;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  address: string;
  verification_status: string;
}

interface FoodMatch {
  id: string;
  listing_id: string;
  recipient_id: string;
  status: string;
  pickup_scheduled_time: string | null;
  notes: string | null;
  created_at: string;
}

export const FoodListingForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    product_name: '',
    description: '',
    quantity: '',
    unit: 'kg',
    expiry_date: '',
    pickup_location: '',
    pickup_time_start: '',
    pickup_time_end: ''
  });
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please sign in to create listings');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('food_rescue_listings')
        .insert({
          ...formData,
          quantity: parseFloat(formData.quantity),
          donor_id: user.id,
          expiry_date: formData.expiry_date || null,
          pickup_time_start: formData.pickup_time_start || null,
          pickup_time_end: formData.pickup_time_end || null
        });

      if (error) throw error;

      toast.success('Food listing created successfully!');
      setFormData({
        product_name: '',
        description: '',
        quantity: '',
        unit: 'kg',
        expiry_date: '',
        pickup_location: '',
        pickup_time_start: '',
        pickup_time_end: ''
      });
      onSuccess();
    } catch (error) {
      toast.error('Error creating listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" />
          Donate Food
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product_name">Product Name *</Label>
              <Input
                id="product_name"
                value={formData.product_name}
                onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                placeholder="e.g., Tomatoes, Bread, Rice"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <div className="flex gap-2">
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="10"
                  required
                />
                <Select value={formData.unit} onValueChange={(value) => setFormData({ ...formData, unit: value })}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">kg</SelectItem>
                    <SelectItem value="bags">bags</SelectItem>
                    <SelectItem value="boxes">boxes</SelectItem>
                    <SelectItem value="pieces">pieces</SelectItem>
                    <SelectItem value="liters">liters</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Additional details about the food quality, freshness, etc."
              rows={3}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry_date">Expiry Date</Label>
              <Input
                id="expiry_date"
                type="datetime-local"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup_location">Pickup Location *</Label>
              <Input
                id="pickup_location"
                value={formData.pickup_location}
                onChange={(e) => setFormData({ ...formData, pickup_location: e.target.value })}
                placeholder="Full address for pickup"
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pickup_time_start">Available From</Label>
              <Input
                id="pickup_time_start"
                type="datetime-local"
                value={formData.pickup_time_start}
                onChange={(e) => setFormData({ ...formData, pickup_time_start: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pickup_time_end">Available Until</Label>
              <Input
                id="pickup_time_end"
                type="datetime-local"
                value={formData.pickup_time_end}
                onChange={(e) => setFormData({ ...formData, pickup_time_end: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating...' : 'Create Food Listing'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export const FoodListingGrid: React.FC = () => {
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('food_rescue_listings')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch (error) {
      toast.error('Error loading food listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleClaimFood = async (listingId: string) => {
    if (!user) {
      toast.error('Please sign in to claim food');
      return;
    }

    try {
      const { error } = await supabase
        .from('food_rescue_matches')
        .insert({
          listing_id: listingId,
          recipient_id: user.id,
          status: 'pending'
        });

      if (error) throw error;

      toast.success('Food claim request sent! The donor will contact you.');
      fetchListings();
    } catch (error) {
      toast.error('Error claiming food. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg"></div>
            <CardContent className="p-4 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
              <div className="h-3 bg-muted rounded w-full"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Available Food Donations</h2>
        <Badge variant="secondary">{listings.length} items available</Badge>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {listings.map((listing) => (
          <Card key={listing.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{listing.product_name}</CardTitle>
                <Badge variant="outline" className="text-xs">
                  {listing.quantity} {listing.unit}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              {listing.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {listing.description}
                </p>
              )}
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{listing.pickup_location}</span>
                </div>
                
                {listing.expiry_date && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Expires: {new Date(listing.expiry_date).toLocaleDateString()}</span>
                  </div>
                )}
                
                {listing.pickup_time_start && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      Available: {new Date(listing.pickup_time_start).toLocaleTimeString()}
                      {listing.pickup_time_end && ` - ${new Date(listing.pickup_time_end).toLocaleTimeString()}`}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">
                  Posted {new Date(listing.created_at).toLocaleDateString()}
                </span>
                <Button
                  size="sm"
                  onClick={() => handleClaimFood(listing.id)}
                  className="flex items-center gap-1"
                >
                  <Heart className="h-3 w-3" />
                  Claim Food
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {listings.length === 0 && (
        <Card className="p-8 text-center">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No food donations available</h3>
          <p className="text-muted-foreground">
            Check back later or consider donating food yourself.
          </p>
        </Card>
      )}
    </div>
  );
};

export const RecipientRegistrationForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    contact_person: '',
    phone: '',
    email: '',
    address: '',
    capacity_description: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('food_rescue_recipients')
        .insert(formData);

      if (error) throw error;

      toast.success('Registration submitted! We will verify and contact you soon.');
      setFormData({
        name: '',
        type: '',
        contact_person: '',
        phone: '',
        email: '',
        address: '',
        capacity_description: ''
      });
      onSuccess();
    } catch (error) {
      toast.error('Error submitting registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5" />
          Register as Food Recipient
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Organization Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Charity/Organization name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Organization Type *</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="charity">Charity</SelectItem>
                  <SelectItem value="food_bank">Food Bank</SelectItem>
                  <SelectItem value="shelter">Shelter</SelectItem>
                  <SelectItem value="community_center">Community Center</SelectItem>
                  <SelectItem value="school">School</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact_person">Contact Person *</Label>
              <Input
                id="contact_person"
                value={formData.contact_person}
                onChange={(e) => setFormData({ ...formData, contact_person: e.target.value })}
                placeholder="Full name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+254..."
                required
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@organization.org"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Full address"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity_description">Capacity & Description</Label>
            <Textarea
              id="capacity_description"
              value={formData.capacity_description}
              onChange={(e) => setFormData({ ...formData, capacity_description: e.target.value })}
              placeholder="Describe your organization's capacity to receive food donations..."
              rows={3}
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Submitting...' : 'Submit Registration'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};