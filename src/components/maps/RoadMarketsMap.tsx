import React, { useEffect, useRef, useState } from 'react';

interface RouteVendor {
  id: string;
  name: string;
  route: string;
  location: string;
  lat: number;
  lng: number;
  services: string[];
  products: string[];
  rating: number;
  phone: string;
  verified: boolean;
  description?: string;
}

interface RouteData {
  id: string;
  name: string;
  coordinates: number[][];
  color: string;
  description: string;
}

interface RoadMarketsMapProps {
  vendors: RouteVendor[];
  routes: RouteData[];
  onVendorClick?: (vendor: RouteVendor) => void;
}

const RoadMarketsMap: React.FC<RoadMarketsMapProps> = ({ vendors, routes, onVendorClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapInstance, setMapInstance] = useState<any>(null);
  const [L, setL] = useState<any>(null);

  useEffect(() => {
    // Dynamically import Leaflet
    const loadLeaflet = async () => {
      const leaflet = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      
      // Fix default marker icons
      delete (leaflet.Icon.Default.prototype as any)._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      
      setL(leaflet);
    };
    
    loadLeaflet();
  }, []);

  useEffect(() => {
    if (!L || !mapRef.current || mapInstance) return;

    // Initialize map centered on Kenya
    const map = L.map(mapRef.current).setView([-1.2921, 36.8219], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    setMapInstance(map);

    return () => {
      map.remove();
    };
  }, [L]);

  useEffect(() => {
    if (!mapInstance || !L) return;

    // Clear existing layers except tile layer
    mapInstance.eachLayer((layer: any) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapInstance.removeLayer(layer);
      }
    });

    // Draw routes
    routes.forEach(route => {
      const coordinates = route.coordinates.map(coord => [coord[0], coord[1]] as [number, number]);
      L.polyline(coordinates, { 
        color: route.color, 
        weight: 4, 
        opacity: 0.7 
      }).addTo(mapInstance);
    });

    // Add vendor markers
    vendors.forEach(vendor => {
      const marker = L.marker([vendor.lat, vendor.lng]).addTo(mapInstance);
      
      const popupContent = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px;">${vendor.name}</h3>
          ${vendor.verified ? '<span style="background: #e5e7eb; padding: 2px 8px; border-radius: 4px; font-size: 12px;">✓ Verified</span>' : ''}
          <p style="margin: 8px 0; color: #666; font-size: 14px;">📍 ${vendor.location}</p>
          <p style="margin: 4px 0; font-size: 14px;">⭐ ${vendor.rating}/5</p>
          <p style="margin: 8px 0; font-size: 14px;"><strong>Products:</strong> ${vendor.products.join(', ')}</p>
          <p style="margin: 8px 0; font-size: 14px;">📞 ${vendor.phone}</p>
          ${vendor.description ? `<p style="margin: 8px 0; color: #666; font-size: 13px;">${vendor.description}</p>` : ''}
        </div>
      `;
      
      marker.bindPopup(popupContent);
      
      if (onVendorClick) {
        marker.on('click', () => onVendorClick(vendor));
      }
    });
  }, [mapInstance, L, vendors, routes, onVendorClick]);

  return (
    <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
  );
};

export default RoadMarketsMap;
