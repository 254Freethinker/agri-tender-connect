import React, { useState, useEffect, lazy, Suspense } from 'react';
import { MainNav } from "@/components/MainNav";
import { MobileNav } from "@/components/MobileNav";
import { BottomNav } from "@/components/BottomNav";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ServiceProvider, ServiceProviderType } from '@/types';
import { fetchServiceProviders } from '@/services/serviceProvidersAPI';
import { Map, AlertTriangle } from 'lucide-react';

// Lazy load the map component to prevent SSR issues with Leaflet
const ServiceProvidersMap = lazy(() => import('@/components/logistics/ServiceProvidersMap'));
import MapLegend from '@/components/logistics/MapLegend';
import ProviderFilters from '@/components/logistics/ProviderFilters';
import ProvidersList from '@/components/logistics/ProvidersList';
import RegistrationPrompt from '@/components/logistics/RegistrationPrompt';

const MapLoadingFallback = () => (
  <div className="w-full h-[500px] rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
    <div className="text-center">
      <Map className="h-12 w-12 mx-auto mb-4 text-muted-foreground animate-pulse" />
      <p className="text-muted-foreground">Loading map...</p>
    </div>
  </div>
);

const MapErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="w-full h-[500px] rounded-lg overflow-hidden border bg-muted flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-orange-500" />
          <h3 className="font-medium mb-2">Map could not be loaded</h3>
          <p className="text-sm text-muted-foreground mb-4">Please try refreshing the page</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const LogisticsSolutionsMap: React.FC = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [filteredProviders, setFilteredProviders] = useState<ServiceProvider[]>([]);
  const [selectedType, setSelectedType] = useState<ServiceProviderType | 'all'>('all');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [mapReady, setMapReady] = useState(false);
  
  useEffect(() => {
    // Delay map loading to ensure DOM is ready
    const timer = setTimeout(() => setMapReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        setIsLoading(true);
        const data = await fetchServiceProviders();
        setProviders(data);
        setFilteredProviders(data);
      } catch (error) {
        console.error('Error fetching providers:', error);
        toast({
          title: 'Error',
          description: 'Failed to load service providers. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProviders();
  }, [toast]);
  
  useEffect(() => {
    let filtered = [...providers];
    
    if (selectedType !== 'all') {
      filtered = filtered.filter(provider => provider.businessType === selectedType);
    }
    
    if (selectedCounty !== 'all') {
      filtered = filtered.filter(provider => 
        provider.location.county.toLowerCase() === selectedCounty.toLowerCase()
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(provider => 
        provider.name.toLowerCase().includes(term) || 
        provider.description.toLowerCase().includes(term) ||
        provider.services.some(service => service.toLowerCase().includes(term)) ||
        provider.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredProviders(filtered);
  }, [providers, selectedType, selectedCounty, searchTerm]);

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedCounty('all');
    setSearchTerm('');
  };

  return (
    <div className="flex min-h-screen flex-col pb-20 md:pb-0">
      <header className="sticky top-0 z-30 w-full border-b bg-background">
        <div className="container flex h-16 items-center">
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>
      </header>
      
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Logistics Solutions Map</h1>
          <p className="text-muted-foreground">
            Find service providers near you on the interactive map
          </p>
        </div>

        {/* Disclaimer */}
        <Card className="mb-6 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-4">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <strong>Disclaimer:</strong> AgriConnect facilitates connections between willing buyers and sellers. 
              We do not guarantee the quality of services or take responsibility for transactions. 
              Always verify service providers independently before engaging.
            </p>
          </CardContent>
        </Card>
        
        <ProviderFilters 
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedCounty={selectedCounty}
          setSelectedCounty={setSelectedCounty}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredProvidersCount={filteredProviders.length}
        />
        
        <MapLegend />
        
        <MapErrorBoundary>
          {mapReady && (
            <Suspense fallback={<MapLoadingFallback />}>
              <ServiceProvidersMap 
                providers={filteredProviders}
                selectedType={selectedType}
              />
            </Suspense>
          )}
        </MapErrorBoundary>
        
        <ProvidersList 
          providers={filteredProviders}
          isLoading={isLoading}
          resetFilters={resetFilters}
        />
        
        {!isLoading && filteredProviders.length > 9 && (
          <div className="mt-6 text-center">
            <Button variant="outline">
              Show More ({filteredProviders.length - 9} remaining)
            </Button>
          </div>
        )}
        
        <RegistrationPrompt />
      </main>
      
      <BottomNav />
    </div>
  );
};

export default LogisticsSolutionsMap;
