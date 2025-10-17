import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Mail, Phone, Globe, Users, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import PartnerCarousel from '@/components/partners/PartnerCarousel';

interface Partner {
  id: string;
  company_name: string;
  contact_email?: string;
  contact_phone?: string;
  website?: string;
  description?: string;
  logo_url?: string;
  created_at: string;
}

const PartnersShowcase: React.FC = () => {
  const navigate = useNavigate();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPartners(data || []);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Active Partners', value: partners.length.toString(), icon: <Users className="h-5 w-5" /> },
    { label: 'Partner Events', value: '50+', icon: <Award className="h-5 w-5" /> },
    { label: 'Farmers Reached', value: '50,000+', icon: <TrendingUp className="h-5 w-5" /> },
  ];

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Better Contrast */}
      <section className="relative h-[400px] flex items-center justify-center bg-gradient-to-br from-green-700 via-green-600 to-emerald-700 py-16">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-black/10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">Our Partners</h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-white font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            Together with our partners, we're transforming agriculture and empowering farmers across Kenya
          </p>
          <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100 font-semibold shadow-lg" onClick={() => navigate('/partner-with-us')}>
            <Mail className="h-4 w-4 mr-2" />
            Become a Partner
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-primary/10 rounded-full">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Carousel */}
      <PartnerCarousel partners={partners} />

      {/* Partner Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Meet Our Partners</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our partners provide essential services, funding, and support to help farmers succeed
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading partners...</p>
            </div>
          ) : partners.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No partners yet. Be the first!</p>
              <Button onClick={() => navigate('/partner-with-us')}>
                Become a Partner
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {partners.map((partner) => (
                <Card key={partner.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    {partner.logo_url && (
                      <div className="mb-4 h-24 flex items-center justify-center">
                        <img
                          src={partner.logo_url}
                          alt={partner.company_name}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <CardTitle className="text-xl">{partner.company_name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {partner.description && (
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {partner.description}
                      </p>
                    )}
                    
                    <Separator className="my-4" />
                    
                    <div className="space-y-2">
                      {partner.contact_email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <a 
                            href={`mailto:${partner.contact_email}`}
                            className="text-primary hover:underline break-all"
                          >
                            {partner.contact_email}
                          </a>
                        </div>
                      )}
                      
                      {partner.contact_phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <a 
                            href={`tel:${partner.contact_phone}`}
                            className="text-primary hover:underline"
                          >
                            {partner.contact_phone}
                          </a>
                        </div>
                      )}
                      
                      {partner.website && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <a 
                            href={partner.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline flex items-center gap-1 break-all"
                          >
                            Visit Website
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Interested in Partnering?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join our ecosystem and help transform agriculture in Kenya
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" onClick={() => navigate('/partner-with-us')}>
              <Mail className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4" />
              <a href="mailto:sokoconnect@tenderzville-portal.co.ke" className="hover:underline">
                sokoconnect@tenderzville-portal.co.ke
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PartnersShowcase;
