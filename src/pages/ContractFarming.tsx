import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FileText, Users, Calendar, MapPin, DollarSign, Shield, Star } from 'lucide-react';
import { MobileHeader, MobileNav } from '@/components/ui/mobile-nav';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContractFarmingOpportunity {
  id: string;
  title: string;
  company_name: string;
  crop_type: string;
  contract_duration: number;
  price_per_unit: number;
  minimum_area: number;
  location: string;
  requirements: string[];
  benefits: string[];
  description: string;
  status: string;
  created_at: string;
  application_deadline: string;
}

const ContractFarming: React.FC = () => {
  const [opportunities, setOpportunities] = useState<ContractFarmingOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newOpportunity, setNewOpportunity] = useState({
    title: '',
    company_name: '',
    crop_type: '',
    contract_duration: '',
    price_per_unit: '',
    minimum_area: '',
    location: '',
    requirements: '',
    benefits: '',
    description: '',
    application_deadline: ''
  });

  useEffect(() => {
    fetchOpportunities();
  }, []);

  async function fetchOpportunities() {
    setLoading(true);
    try {
      // Mock data for now - replace with actual Supabase query
      const mockData = [
        {
          id: '1',
          title: 'Premium Avocado Contract',
          company_name: 'Fresh Exports Ltd',
          crop_type: 'Avocado',
          contract_duration: 24,
          price_per_unit: 80,
          minimum_area: 2,
          location: 'Murang\'a County',
          requirements: ['GAP Certification', 'Irrigation system', 'Minimum 100 trees'],
          benefits: ['Guaranteed market', 'Technical support', 'Input supply'],
          description: 'Looking for avocado farmers for export market. Full support provided.',
          status: 'active',
          created_at: new Date().toISOString(),
          application_deadline: '2024-12-31'
        },
        {
          id: '2',
          title: 'Organic Coffee Contract',
          company_name: 'Kenya Coffee Coop',
          crop_type: 'Coffee',
          contract_duration: 36,
          price_per_unit: 120,
          minimum_area: 1,
          location: 'Kiambu County',
          requirements: ['Organic certification', 'Altitude above 1500m'],
          benefits: ['Premium pricing', 'Training provided', 'Equipment loans'],
          description: 'Seeking organic coffee farmers for specialty market.',
          status: 'active',
          created_at: new Date().toISOString(),
          application_deadline: '2024-11-30'
        }
      ];
      setOpportunities(mockData);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast({
        title: 'Error',
        description: 'Failed to load contract farming opportunities',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  }

  const crops = Array.from(new Set(opportunities.map(o => o.crop_type)));
  const locations = Array.from(new Set(opportunities.map(o => o.location)));

  const filteredOpportunities = opportunities.filter(o => {
    const matchesSearch = o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         o.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCrop = selectedCrop === 'all' || o.crop_type === selectedCrop;
    const matchesLocation = selectedLocation === 'all' || o.location === selectedLocation;
    return matchesSearch && matchesCrop && matchesLocation;
  });

  const handleCreateOpportunity = async () => {
    try {
      // Here you would save to Supabase
      toast({
        title: 'Success',
        description: 'Contract farming opportunity created successfully'
      });
      setIsCreateDialogOpen(false);
      setNewOpportunity({
        title: '',
        company_name: '',
        crop_type: '',
        contract_duration: '',
        price_per_unit: '',
        minimum_area: '',
        location: '',
        requirements: '',
        benefits: '',
        description: '',
        application_deadline: ''
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create opportunity',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen pb-20 lg:pb-0">
      <MobileHeader title="Contract Farming" />
      
      <main className="py-6 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Contract Farming Opportunities</h1>
          <p className="text-muted-foreground">
            Secure farming contracts with guaranteed markets and support
          </p>
          
          <Card className="mt-4 bg-blue-50 dark:bg-blue-950 border-blue-200">
            <CardContent className="pt-4">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Shield className="h-5 w-5" />
                How We Protect Both Parties
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium mb-1">For Farmers:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Milestone-based payments</li>
                    <li>• Escrow payment system</li>
                    <li>• Dispute resolution process</li>
                    <li>• Contract document uploads (Google Drive)</li>
                    <li>• Protection warnings system</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-1">For Buyers:</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Quality verification at milestones</li>
                    <li>• Verified farmer profiles</li>
                    <li>• Progress tracking system</li>
                    <li>• Payment release controls</li>
                    <li>• Contract violation reporting</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs mt-3 text-blue-700 dark:text-blue-400">
                Contract documents can be uploaded via Google Drive links during contract creation. All parties can access and verify documents.
              </p>
            </CardContent>
          </Card>
        </div>

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
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(location => (
                  <SelectItem key={location} value={location}>{location}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <FileText className="mr-2 h-4 w-4" />
                Create Contract Opportunity
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Contract Farming Opportunity</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={newOpportunity.title}
                      onChange={e => setNewOpportunity({...newOpportunity, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      value={newOpportunity.company_name}
                      onChange={e => setNewOpportunity({...newOpportunity, company_name: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="crop">Crop Type</Label>
                    <Input
                      id="crop"
                      value={newOpportunity.crop_type}
                      onChange={e => setNewOpportunity({...newOpportunity, crop_type: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={newOpportunity.location}
                      onChange={e => setNewOpportunity({...newOpportunity, location: e.target.value})}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration (months)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newOpportunity.contract_duration}
                      onChange={e => setNewOpportunity({...newOpportunity, contract_duration: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price per Unit (KES)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newOpportunity.price_per_unit}
                      onChange={e => setNewOpportunity({...newOpportunity, price_per_unit: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Min Area (acres)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={newOpportunity.minimum_area}
                      onChange={e => setNewOpportunity({...newOpportunity, minimum_area: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="requirements">Requirements (comma separated)</Label>
                  <Input
                    id="requirements"
                    value={newOpportunity.requirements}
                    onChange={e => setNewOpportunity({...newOpportunity, requirements: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="benefits">Benefits (comma separated)</Label>
                  <Input
                    id="benefits"
                    value={newOpportunity.benefits}
                    onChange={e => setNewOpportunity({...newOpportunity, benefits: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newOpportunity.description}
                    onChange={e => setNewOpportunity({...newOpportunity, description: e.target.value})}
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
                <Button onClick={handleCreateOpportunity} className="w-full">
                  Create Opportunity
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-12">Loading opportunities...</div>
          ) : filteredOpportunities.length > 0 ? (
            filteredOpportunities.map(opp => (
              <Card key={opp.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{opp.title}</span>
                    <Badge variant="outline">
                      <Calendar className="mr-1 h-3 w-3" />
                      {opp.contract_duration} months
                    </Badge>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {opp.company_name}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Crop:</span> {opp.crop_type}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {opp.location}
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      KES {opp.price_per_unit}/unit
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Min:</span> {opp.minimum_area} acres
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">{opp.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Requirements
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {opp.requirements.map((req, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Star className="h-4 w-4" />
                        Benefits
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {opp.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button className="flex-1">Apply Now</Button>
                    <Button variant="outline">Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">No contract farming opportunities found.</div>
          )}
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
};

export default ContractFarming;