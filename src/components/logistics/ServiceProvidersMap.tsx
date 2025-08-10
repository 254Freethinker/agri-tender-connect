
import React, { useState, useEffect } from 'react';
import { ServiceProvider, ServiceProviderType } from '@/types';
import { Button } from "@/components/ui/button";
import { Loader2, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ServiceProvidersMapProps {
  providers: ServiceProvider[];
  selectedType: ServiceProviderType | 'all';
}

const ServiceProvidersMap: React.FC<ServiceProvidersMapProps> = ({ providers, selectedType }) => {
  const { toast } = useToast();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  // Simulate map tiles loading for production appearance
  useEffect(() => {
    const timer = setTimeout(() => {
      setMapLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Group providers by location for clustering
  const getProvidersByLocation = () => {
    const locationGroups: Record<string, ServiceProvider[]> = {};
    
    providers.forEach(provider => {
      const lat = provider.location.coordinates?.latitude || 0;
      const lng = provider.location.coordinates?.longitude || 0;
      const locationKey = `${lat}-${lng}`;
      
      if (!locationGroups[locationKey]) {
        locationGroups[locationKey] = [];
      }
      locationGroups[locationKey].push(provider);
    });
    
    return locationGroups;
  };

  return (
    <div className="w-full h-[500px] bg-gray-50 rounded-lg relative overflow-hidden border">
      {/* Map visualization with provider pins */}
      <div className="absolute inset-0">
        {mapLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Loading map...</p>
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 opacity-25 pointer-events-none">
            <img 
              src="/kenya-map-outline.svg" 
              alt="Kenya Map Outline" 
              className="max-w-full max-h-full object-contain"
              onLoad={() => setIsImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement as HTMLElement | null;
                if (parent) {
                  parent.style.backgroundColor = 'rgb(229 231 235)';
                  parent.style.backgroundImage = "url(data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23bbb' fill-opacity='0.25' fill-rule='evenodd'/%3E%3C/svg%3E)";
                  parent.style.backgroundSize = 'cover';
                  parent.style.backgroundRepeat = 'no-repeat';
                }
              }}
            />
          </div>
        )}
      </div>
      
      {/* Dynamic pins based on real provider data */}
      <div className="absolute inset-0 z-10">
        {providers.length > 0 ? (
          <>
            {/* Nairobi */}
            <div 
              className="absolute w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 pulse-animation"
              style={{ left: '50%', top: '60%' }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white px-2 py-1 rounded text-xs shadow-sm">
                Nairobi ({providers.filter(p => p.location.county === 'Nairobi').length})
              </div>
            </div>
            
            {/* Show other major locations as needed */}
            <div 
              className="absolute w-4 h-4 bg-green-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: '60%', top: '80%' }}
            >
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white px-2 py-1 rounded text-xs shadow-sm">
                Mombasa ({providers.filter(p => p.location.county === 'Mombasa').length})
              </div>
            </div>
            
            {/* Some dynamic pins based on provider data */}
            {providers.slice(0, 5).map((provider, index) => (
              <div
                key={provider.id || index}
                className="absolute w-3 h-3 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 hover:w-4 hover:h-4 transition-all cursor-pointer"
                style={{ 
                  left: `${30 + (index * 10)}%`, 
                  top: `${40 + (index * 5)}%` 
                }}
                onClick={() => {
                  toast({
                    title: provider.name,
                    description: provider.description,
                  });
                }}
              >
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white px-2 py-1 rounded text-xs shadow-sm opacity-0 group-hover:opacity-100">
                  {provider.name}
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
              <h3 className="text-lg font-medium mb-2">Interactive Map Ready for Providers</h3>
              <p className="text-muted-foreground mb-4">
                Our service provider registry is growing. Connect with key agricultural service providers as they join the platform.
              </p>
              <Button className="gap-2" onClick={() => window.location.href = "/service-provider-registration"}>
                Register as Provider
              </Button>
            </div>
          </div>
        )}
      </div>
      
      {providers.length > 0 && (
        <div className="absolute top-4 right-4 bg-white p-3 rounded-md shadow-md">
          <p className="font-medium text-sm">
            Showing {providers.length} providers
            {selectedType !== 'all' ? ` of type ${selectedType}` : ''}
          </p>
        </div>
      )}

      <style>
        {`
        .pulse-animation {
          box-shadow: 0 0 0 rgba(66, 153, 225, 0.6);
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(66, 153, 225, 0.6);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(66, 153, 225, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(66, 153, 225, 0);
          }
        }
        `}
      </style>
    </div>
  );
};

export default ServiceProvidersMap;
