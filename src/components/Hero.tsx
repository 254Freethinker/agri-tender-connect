
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Users, 
  Truck, 
  MessageCircle, 
  ArrowRight,
  Megaphone,
  DollarSign,
  Target
} from 'lucide-react';
import heroFarmingTeam from '@/assets/hero-farming-team.jpg';

const Hero: React.FC = () => {
  const features = [
    {
      icon: TrendingUp,
      title: 'Real-time Market Data',
      description: 'Access live agricultural market prices and demand forecasts',
      link: '/kilimo-ams-data'
    },
    {
      icon: Users,
      title: 'Service Providers',
      description: 'Connect with agricultural service providers and experts',
      link: '/service-providers'
    },
    {
      icon: Truck,
      title: 'Logistics Solutions',
      description: 'Find transportation and storage solutions for your produce',
      link: '/logistics'
    },
    {
      icon: MessageCircle,
      title: 'Community Forum',
      description: 'Join discussions with fellow farmers and agribusiness professionals',
      link: '/community-forum'
    }
  ];

  return (
    <div className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroFarmingTeam})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-primary/40" />
      </div>

      <div className="relative container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4 bg-white/90 text-primary">
            🌾 Agricultural Technology Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg">
            Connect. Trade. Grow.
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto drop-shadow">
            Empowering farmers and agribusiness with real-time market data, logistics solutions, 
            and community connections across Kenya's agricultural value chain.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link to="/kilimo-ams-data">
              <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-white/90">
                Explore Market Data
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/business-marketing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/20">
                <Megaphone className="mr-2 h-4 w-4" />
                Advertise Your Business
              </Button>
            </Link>
          </div>

          {/* Business Marketing Highlight */}
          <div className="bg-white/95 backdrop-blur rounded-lg p-6 mb-12 border border-primary/20 shadow-xl">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Megaphone className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-primary">Business Marketing</h3>
              <Badge className="bg-primary">Popular</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Reach thousands of farmers and agricultural professionals. Advertise your business for just $20 for 30 days.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-primary">
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                <span>Targeted Audience</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>$20 for 30 Days</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4" />
                <span>1000+ Daily Visitors</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer bg-white/95 backdrop-blur">
              <Link to={feature.link}>
                <CardContent className="p-6 text-center">
                  <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-white/80 text-sm drop-shadow">
            Trusted by farmers, cooperatives, and agribusiness across Kenya
          </p>
        </div>
      </div>
    </div>
  );
};

export default Hero;
