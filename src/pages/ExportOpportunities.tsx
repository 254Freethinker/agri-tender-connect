import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Globe, Users, Calendar, MapPin, Package, TrendingUp, Info } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { getMarketLinkages, createMarketLinkage, applyToMarketLinkage } from '@/services/marketLinkageService';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const ExportOpportunities: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedCounty, setSelectedCounty] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    description: '',
    crops_involved: '',
    counties: '',
    requirements: '',
    benefits: '',
    contact_info: '',
    application_deadline: '',
    start_date: '',
    duration_months: '',
    minimum_quantity: '',
    price_range: '',
    max_participants: ''
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    setLoading(true);
    try {
      const data = await getMarketLinkages({ 
        linkage_type: 'export_opportunity',
        activeOnly: true 
      });
      setOpportunities(data || []);
    } catch (error) {
      console.error('Error fetching export opportunities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load export opportunities',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const crops = Array.from(new Set(opportunities.flatMap(o => o.crops_involved || [])));
  const counties = Array.from(new Set(opportunities.flatMap(o => o.counties || [])));

  const filteredOpportunities = opportunities.filter(o => {
    const matchesSearch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         o.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'all' || (o.crops_involved && o.crops_involved.includes(selectedCrop));
    const matchesCounty = selectedCounty === 'all' || (o.counties && o.counties.includes(selectedCounty));
    return matchesSearch && matchesCrop && matchesCounty;
  });

  const handleCreateOpportunity = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create export opportunities',
        variant: 'destructive'
      });
      return;
    }

    try {
      await createMarketLinkage({
        title: newOpportunity.title,
        description: newOpportunity.description,
        linkage_type: 'export_opportunity',
        crops_involved: newOpportunity.crops_involved.split(',').map(c => c.trim()),
        counties: newOpportunity.counties.split(',').map(c => c.trim()),
        requirements: newOpportunity.requirements.split(',').map(r => r.trim()),
        benefits: newOpportunity.benefits.split(',').map(b => b.trim()),
        contact_info: newOpportunity.contact_info,
        application_deadline: newOpportunity.application_deadline || undefined,
        start_date: newOpportunity.start_date || undefined,
        duration_months: newOpportunity.duration_months ? parseInt(newOpportunity.duration_months) : undefined,
        minimum_quantity: newOpportunity.minimum_quantity ? parseFloat(newOpportunity.minimum_quantity) : undefined,
        price_range: newOpportunity.price_range || undefined,
        max_participants: newOpportunity.max_participants ? parseInt(newOpportunity.max_participants) : undefined
      });

      toast({
        title: 'Success',
        description: 'Export opportunity created successfully'
      });
      
      setIsCreateDialogOpen(false);
      setNewOpportunity({
        title: '',
        description: '',
        crops_involved: '',
        counties: '',
        requirements: '',
        benefits: '',
        contact_info: '',
        application_deadline: '',
        start_date: '',
        duration_months: '',
        minimum_quantity: '',
        price_range: '',
        max_participants: ''
      });
      
      fetchOpportunities();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create export opportunity',
        variant: 'destructive'
      });
    }
  };

  const handleApply = async (linkageId: string) => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to apply',
        variant: 'destructive'
      });
      return;
    }

    try {
      await applyToMarketLinkage(linkageId);
      toast({
        title: 'Success',
        description: 'Application submitted successfully'
      });
      fetchOpportunities();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit application',
        variant: 'destructive'
      });
    }
  };

  return (
    <AppLayout title="Export Opportunities">
      <div className="container mx-auto px-4 py-6 max-w-7xl pb-24">
        {/* Info Banner */}
        <Card className="mb-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-start gap-3">
              <Globe className="h-6 w-6 text-primary mt-1" />
              <div>
                <CardTitle className="text-2xl">Export Market Opportunities</CardTitle>
                <CardDescription className="mt-2 text-base">
                  Connect with international buyers and grow your export business
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Access verified export opportunities from international markets. Get fair prices, 
              technical support, and quality certification assistance to meet global standards.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-background rounded-lg p-4 border">
                <Globe className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Global Markets</h4>
                <p className="text-sm text-muted-foreground">Access to EU, US, Asian markets</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <TrendingUp className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Premium Prices</h4>
                <p className="text-sm text-muted-foreground">Higher returns for quality produce</p>
              </div>
              <div className="bg-background rounded-lg p-4 border">
                <Users className="h-8 w-8 text-primary mb-2" />
                <h4 className="font-semibold mb-1">Full Support</h4>
                <p className="text-sm text-muted-foreground">Training, certification, logistics help</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Create Button */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search opportunities..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="sm:w-64"
            />
            <Select value={selectedCrop} onValueChange={setSelectedCrop}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Crops" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Crops</SelectItem>
                {crops.map(crop => (
                  <SelectItem key={crop} value={crop}>{crop}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedCounty} onValueChange={setSelectedCounty}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Counties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Counties</SelectItem>
                {counties.map(county => (
                  <SelectItem key={county} value={county}>{county}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Globe className="mr-2 h-4 w-4" />
                Post Export Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Export Opportunity</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={newOpportunity.title}
                    onChange={e => setNewOpportunity({...newOpportunity, title: e.target.value})}
                    placeholder="e.g., Avocado Export to Europe"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newOpportunity.description}
                    onChange={e => setNewOpportunity({...newOpportunity, description: e.target.value})}
                    placeholder="Describe the export opportunity..."
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crops">Crops (comma separated) *</Label>
                    <Input
                      id="crops"
                      value={newOpportunity.crops_involved}
                      onChange={e => setNewOpportunity({...newOpportunity, crops_involved: e.target.value})}
                      placeholder="Avocado, Mango, Pineapple"
                    />
                  </div>
                  <div>
                    <Label htmlFor="counties">Counties (comma separated) *</Label>
                    <Input
                      id="counties"
                      value={newOpportunity.counties}
                      onChange={e => setNewOpportunity({...newOpportunity, counties: e.target.value})}
                      placeholder="Murang'a, Kiambu, Nairobi"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="requirements">Requirements (comma separated) *</Label>
                  <Input
                    id="requirements"
                    value={newOpportunity.requirements}
                    onChange={e => setNewOpportunity({...newOpportunity, requirements: e.target.value})}
                    placeholder="GlobalGAP, Organic certification"
                  />
                </div>
                <div>
                  <Label htmlFor="benefits">Benefits (comma separated) *</Label>
                  <Input
                    id="benefits"
                    value={newOpportunity.benefits}
                    onChange={e => setNewOpportunity({...newOpportunity, benefits: e.target.value})}
                    placeholder="Premium prices, Training, Logistics support"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minQuantity">Minimum Quantity (kg)</Label>
                    <Input
                      id="minQuantity"
                      type="number"
                      value={newOpportunity.minimum_quantity}
                      onChange={e => setNewOpportunity({...newOpportunity, minimum_quantity: e.target.value})}
                      placeholder="1000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="priceRange">Price Range (KES)</Label>
                    <Input
                      id="priceRange"
                      value={newOpportunity.price_range}
                      onChange={e => setNewOpportunity({...newOpportunity, price_range: e.target.value})}
                      placeholder="80-120 per kg"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (months)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newOpportunity.duration_months}
                      onChange={e => setNewOpportunity({...newOpportunity, duration_months: e.target.value})}
                      placeholder="12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="maxParticipants">Max Participants</Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      value={newOpportunity.max_participants}
                      onChange={e => setNewOpportunity({...newOpportunity, max_participants: e.target.value})}
                      placeholder="50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={newOpportunity.start_date}
                      onChange={e => setNewOpportunity({...newOpportunity, start_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline">Application Deadline</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={newOpportunity.application_deadline}
                      onChange={e => setNewOpportunity({...newOpportunity, application_deadline: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact">Contact Information *</Label>
                  <Input
                    id="contact"
                    value={newOpportunity.contact_info}
                    onChange={e => setNewOpportunity({...newOpportunity, contact_info: e.target.value})}
                    placeholder="Email and phone number"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreateOpportunity} className="w-full">
                  Create Opportunity
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Opportunities List */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading opportunities...</p>
            </div>
          ) : filteredOpportunities.length > 0 ? (
            filteredOpportunities.map(opp => (
              <Card key={opp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between flex-wrap gap-2">
                    <CardTitle className="text-xl">{opp.title}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      {opp.application_deadline && (
                        <Badge variant="outline">
                          <Calendar className="mr-1 h-3 w-3" />
                          Deadline: {new Date(opp.application_deadline).toLocaleDateString()}
                        </Badge>
                      )}
                      <Badge variant="default">
                        {opp.participants_count || 0} / {opp.max_participants || '∞'} Applied
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">{opp.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Crops:</span>
                        <span className="text-muted-foreground">{opp.crops_involved?.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">Counties:</span>
                        <span className="text-muted-foreground">{opp.counties?.join(', ')}</span>
                      </div>
                      {opp.price_range && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Price Range:</span>
                          <span className="text-muted-foreground">KES {opp.price_range}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {opp.minimum_quantity && (
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Min Quantity:</span>
                          <span className="text-muted-foreground">{opp.minimum_quantity} kg</span>
                        </div>
                      )}
                      {opp.duration_months && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">Duration:</span>
                          <span className="text-muted-foreground">{opp.duration_months} months</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 pt-2">
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Requirements</h4>
                      <div className="flex flex-wrap gap-1">
                        {opp.requirements?.map((req: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 text-sm">Benefits</h4>
                      <div className="flex flex-wrap gap-1">
                        {opp.benefits?.map((benefit: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button 
                      onClick={() => handleApply(opp.id)} 
                      className="flex-1"
                      disabled={opp.max_participants && opp.participants_count >= opp.max_participants}
                    >
                      {opp.max_participants && opp.participants_count >= opp.max_participants ? 'Closed' : 'Apply Now'}
                    </Button>
                    <Button variant="outline">Contact</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">No export opportunities found</p>
                <p className="text-sm text-muted-foreground">
                  {searchTerm || selectedCrop !== 'all' || selectedCounty !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'Be the first to post an opportunity!'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ExportOpportunities;