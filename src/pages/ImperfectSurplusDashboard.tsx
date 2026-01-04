import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { 
  Recycle, 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  Tag, 
  Package,
  Percent,
  Edit,
  Trash,
  Heart,
  AlertTriangle,
  Leaf,
  Clock
} from 'lucide-react';
import surplusHeroBg from '@/assets/marketplace-hero.png';

interface SurplusProduce {
  id: string;
  seller_id: string;
  product_name: string;
  category: string;
  description: string | null;
  quantity: number;
  unit: string;
  original_price: number | null;
  discounted_price: number;
  discount_percentage: number | null;
  condition_notes: string | null;
  expiry_date: string | null;
  pickup_location: string;
  county: string;
  images: string[] | null;
  status: string;
  is_organic: boolean;
  reason_for_discount: string | null;
  created_at: string;
}

const categories = [
  'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Poultry', 'Eggs', 'Herbs', 'Root Crops', 'Legumes'
];

const discountReasons = [
  'Cosmetic imperfections', 'Near expiry date', 'Surplus harvest', 'Odd sizes/shapes', 
  'Minor blemishes', 'Overstock', 'Seasonal clearance', 'Processing grade'
];

const kenyanCounties = [
  'Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu', 'Machakos', 
  'Kajiado', 'Nyeri', 'Meru', 'Kilifi', 'Trans Nzoia', 'Bungoma', 'Kakamega', 'Other'
];

export default function ImperfectSurplusDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [listings, setListings] = useState<SurplusProduce[]>([]);
  const [myListings, setMyListings] = useState<SurplusProduce[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCounty, setFilterCounty] = useState<string>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<SurplusProduce | null>(null);
  
  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    description: '',
    quantity: '',
    unit: 'kg',
    original_price: '',
    discounted_price: '',
    condition_notes: '',
    expiry_date: '',
    pickup_location: '',
    county: '',
    is_organic: false,
    reason_for_discount: ''
  });

  useEffect(() => {
    fetchListings();
  }, [user]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      
      // Fetch all available listings
      const { data: allListings, error: listingsError } = await supabase
        .from('imperfect_surplus_produce')
        .select('*')
        .eq('status', 'available')
        .order('created_at', { ascending: false });

      if (listingsError) throw listingsError;
      setListings(allListings || []);

      // Fetch user's own listings if logged in
      if (user) {
        const { data: userListings, error: userError } = await supabase
          .from('imperfect_surplus_produce')
          .select('*')
          .eq('seller_id', user.id)
          .order('created_at', { ascending: false });

        if (userError) throw userError;
        setMyListings(userListings || []);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load surplus produce listings',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to create a listing',
        variant: 'destructive'
      });
      return;
    }

    try {
      const payload = {
        seller_id: user.id,
        product_name: formData.product_name,
        category: formData.category,
        description: formData.description || null,
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        discounted_price: parseFloat(formData.discounted_price),
        condition_notes: formData.condition_notes || null,
        expiry_date: formData.expiry_date || null,
        pickup_location: formData.pickup_location,
        county: formData.county,
        is_organic: formData.is_organic,
        reason_for_discount: formData.reason_for_discount || null
      };

      if (editingListing) {
        const { error } = await supabase
          .from('imperfect_surplus_produce')
          .update(payload)
          .eq('id', editingListing.id);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Listing updated successfully!' });
      } else {
        const { error } = await supabase
          .from('imperfect_surplus_produce')
          .insert(payload);
        
        if (error) throw error;
        toast({ title: 'Success', description: 'Surplus produce listing created!' });
      }

      resetForm();
      setIsCreateOpen(false);
      setEditingListing(null);
      fetchListings();
    } catch (error: any) {
      console.error('Error saving listing:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to save listing',
        variant: 'destructive'
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('imperfect_surplus_produce')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Listing removed successfully' });
      fetchListings();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete listing',
        variant: 'destructive'
      });
    }
  };

  const handleEdit = (listing: SurplusProduce) => {
    setEditingListing(listing);
    setFormData({
      product_name: listing.product_name,
      category: listing.category,
      description: listing.description || '',
      quantity: listing.quantity.toString(),
      unit: listing.unit,
      original_price: listing.original_price?.toString() || '',
      discounted_price: listing.discounted_price.toString(),
      condition_notes: listing.condition_notes || '',
      expiry_date: listing.expiry_date || '',
      pickup_location: listing.pickup_location,
      county: listing.county,
      is_organic: listing.is_organic,
      reason_for_discount: listing.reason_for_discount || ''
    });
    setIsCreateOpen(true);
  };

  const resetForm = () => {
    setFormData({
      product_name: '',
      category: '',
      description: '',
      quantity: '',
      unit: 'kg',
      original_price: '',
      discounted_price: '',
      condition_notes: '',
      expiry_date: '',
      pickup_location: '',
      county: '',
      is_organic: false,
      reason_for_discount: ''
    });
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          listing.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || listing.category === filterCategory;
    const matchesCounty = filterCounty === 'all' || listing.county === filterCounty;
    return matchesSearch && matchesCategory && matchesCounty;
  });

  const ProduceCard = ({ item, showActions = false }: { item: SurplusProduce; showActions?: boolean }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        {item.images?.[0] ? (
          <img src={item.images[0]} alt={item.product_name} className="w-full h-40 object-cover" />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center">
            <Recycle className="h-16 w-16 text-green-600 opacity-50" />
          </div>
        )}
        {item.discount_percentage && item.discount_percentage > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500 text-white">
            {item.discount_percentage}% OFF
          </Badge>
        )}
        {item.is_organic && (
          <Badge className="absolute top-2 left-2 bg-green-600 text-white">
            <Leaf className="h-3 w-3 mr-1" /> Organic
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{item.product_name}</h3>
          <Badge variant="outline">{item.category}</Badge>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            <span>{item.quantity} {item.unit}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>{item.pickup_location}, {item.county}</span>
          </div>
          {item.expiry_date && (
            <div className="flex items-center gap-2 text-amber-600">
              <Clock className="h-4 w-4" />
              <span>Best before: {new Date(item.expiry_date).toLocaleDateString()}</span>
            </div>
          )}
          {item.reason_for_discount && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              <span>{item.reason_for_discount}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 mb-3">
          {item.original_price && (
            <span className="text-muted-foreground line-through">
              KES {item.original_price.toLocaleString()}
            </span>
          )}
          <span className="text-xl font-bold text-green-600">
            KES {item.discounted_price.toLocaleString()}
          </span>
          <span className="text-sm text-muted-foreground">/{item.unit}</span>
        </div>

        {item.condition_notes && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{item.condition_notes}</p>
        )}

        <div className="flex gap-2">
          {showActions ? (
            <>
              <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                <Edit className="h-4 w-4 mr-1" /> Edit
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="destructive">
                    <Trash className="h-4 w-4 mr-1" /> Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently remove "{item.product_name}" from your listings.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(item.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button size="sm" className="flex-1">
                <Heart className="h-4 w-4 mr-1" /> Contact Seller
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center py-16 px-4"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${surplusHeroBg})` }}
      >
        <div className="container mx-auto text-center text-white">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-green-600/80 rounded-full">
              <Recycle className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">Imperfect Surplus Produce</h1>
          <p className="text-xl max-w-2xl mx-auto mb-6 opacity-90">
            Reduce food waste by buying quality produce at discounted prices. 
            Perfectly imperfect fruits, vegetables, and more from Kenyan farmers.
          </p>
          {user && (
            <Dialog open={isCreateOpen} onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (!open) {
                setEditingListing(null);
                resetForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-5 w-5 mr-2" /> List Surplus Produce
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingListing ? 'Edit Surplus Listing' : 'List Your Surplus Produce'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Product Name *</Label>
                      <Input 
                        value={formData.product_name}
                        onChange={(e) => setFormData({...formData, product_name: e.target.value})}
                        placeholder="e.g., Imperfect Tomatoes"
                        required
                      />
                    </div>
                    <div>
                      <Label>Category *</Label>
                      <Select value={formData.category} onValueChange={(v) => setFormData({...formData, category: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Quantity *</Label>
                      <Input 
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                        placeholder="50"
                        required
                      />
                    </div>
                    <div>
                      <Label>Unit *</Label>
                      <Select value={formData.unit} onValueChange={(v) => setFormData({...formData, unit: v})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="crates">Crates</SelectItem>
                          <SelectItem value="pieces">Pieces</SelectItem>
                          <SelectItem value="bunches">Bunches</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Original Price (KES)</Label>
                      <Input 
                        type="number"
                        value={formData.original_price}
                        onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <Label>Discounted Price (KES) *</Label>
                      <Input 
                        type="number"
                        value={formData.discounted_price}
                        onChange={(e) => setFormData({...formData, discounted_price: e.target.value})}
                        placeholder="60"
                        required
                      />
                    </div>
                    <div>
                      <Label>County *</Label>
                      <Select value={formData.county} onValueChange={(v) => setFormData({...formData, county: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select county" />
                        </SelectTrigger>
                        <SelectContent>
                          {kenyanCounties.map(county => (
                            <SelectItem key={county} value={county}>{county}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Pickup Location *</Label>
                      <Input 
                        value={formData.pickup_location}
                        onChange={(e) => setFormData({...formData, pickup_location: e.target.value})}
                        placeholder="Market name or address"
                        required
                      />
                    </div>
                    <div>
                      <Label>Expiry/Best Before Date</Label>
                      <Input 
                        type="date"
                        value={formData.expiry_date}
                        onChange={(e) => setFormData({...formData, expiry_date: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Reason for Discount</Label>
                      <Select value={formData.reason_for_discount} onValueChange={(v) => setFormData({...formData, reason_for_discount: v})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {discountReasons.map(reason => (
                            <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe your surplus produce..."
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Condition Notes</Label>
                    <Textarea 
                      value={formData.condition_notes}
                      onChange={(e) => setFormData({...formData, condition_notes: e.target.value})}
                      placeholder="e.g., Slight bruising but perfectly edible, odd shapes..."
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="is_organic"
                      checked={formData.is_organic}
                      onChange={(e) => setFormData({...formData, is_organic: e.target.checked})}
                      className="rounded"
                    />
                    <Label htmlFor="is_organic" className="flex items-center gap-1 cursor-pointer">
                      <Leaf className="h-4 w-4 text-green-600" /> Organic Produce
                    </Label>
                  </div>
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                    <Button type="submit">{editingListing ? 'Update Listing' : 'Create Listing'}</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border-b border-amber-200">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800">
              <strong>Marketplace Disclaimer:</strong> All transactions are between willing buyers and sellers. 
              AgriConnect facilitates connections but is not responsible for produce quality or transaction disputes. 
              Always inspect produce before purchase and agree on terms with the seller.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 pb-24">
        <Tabs defaultValue="browse" className="space-y-6">
          <TabsList>
            <TabsTrigger value="browse">Browse Surplus</TabsTrigger>
            {user && <TabsTrigger value="my-listings">My Listings ({myListings.length})</TabsTrigger>}
          </TabsList>

          <TabsContent value="browse">
            {/* Search & Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search surplus produce..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterCounty} onValueChange={setFilterCounty}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="County" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Counties</SelectItem>
                      {kenyanCounties.map(county => (
                        <SelectItem key={county} value={county}>{county}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Listings Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-40 bg-muted"></div>
                    <CardContent className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                      <div className="h-8 bg-muted rounded w-1/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredListings.length === 0 ? (
              <Card className="py-12">
                <CardContent className="text-center">
                  <Recycle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Surplus Produce Found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchQuery || filterCategory !== 'all' || filterCounty !== 'all' 
                      ? 'Try adjusting your search filters.'
                      : 'Be the first to list your surplus produce and reduce food waste!'}
                  </p>
                  {user && (
                    <Button onClick={() => setIsCreateOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> List Surplus Produce
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredListings.map(item => (
                  <ProduceCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </TabsContent>

          {user && (
            <TabsContent value="my-listings">
              {myListings.length === 0 ? (
                <Card className="py-12">
                  <CardContent className="text-center">
                    <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No Listings Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start listing your surplus produce to reduce waste and earn extra income!
                    </p>
                    <Button onClick={() => setIsCreateOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" /> Create Your First Listing
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {myListings.map(item => (
                    <ProduceCard key={item.id} item={item} showActions />
                  ))}
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </div>

      <MobileNavigation />
    </div>
  );
}
