
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import FeaturedContent from '@/components/FeaturedContent';
import SearchSection from '@/components/SearchSection';
import { 
  Tractor, 
  TrendingUp, 
  DollarSign, 
  Users, 
  MapPin, 
  BarChart3,
  Truck,
  Warehouse,
  Clock,
  Bluetooth,
  Package
} from 'lucide-react';
import { MobileNavigation } from '@/components/MobileNavigation';
import { PWAInstallPrompt } from '@/components/pwa/PWAInstallPrompt';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <Hero />
      
      {/* Search Section */}
      <SearchSection />
      
      {/* Mobile Top Navigation */}
      <section className="lg:hidden bg-background border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-4 gap-3">
            <Link to="/farm-input-marketplace" className="flex flex-col items-center gap-2 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">Marketplace</span>
            </Link>
            <Link to="/service-providers" className="flex flex-col items-center gap-2 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">Services</span>
            </Link>
            <Link to="/commodity-trading" className="flex flex-col items-center gap-2 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">Trading</span>
            </Link>
            <Link to="/community-forum" className="flex flex-col items-center gap-2 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xs font-medium text-center">Community</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Real-time Market Data Section */}
      <section className="py-8 bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Real-time Market Data</h2>
            <p className="text-muted-foreground">Live prices and trends</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center bg-background/80 backdrop-blur">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">$2.40</div>
                <div className="text-sm text-muted-foreground">Maize/kg</div>
                <div className="text-xs text-green-600">+5.2%</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-background/80 backdrop-blur">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">$3.20</div>
                <div className="text-sm text-muted-foreground">Beans/kg</div>
                <div className="text-xs text-green-600">+2.1%</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-background/80 backdrop-blur">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-red-600">$1.80</div>
                <div className="text-sm text-muted-foreground">Rice/kg</div>
                <div className="text-xs text-red-600">-1.3%</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-background/80 backdrop-blur">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">$4.50</div>
                <div className="text-sm text-muted-foreground">Coffee/kg</div>
                <div className="text-xs text-green-600">+8.7%</div>
              </CardContent>
            </Card>
          </div>
          <div className="text-center mt-4">
            <Link to="/kilimo-ams-data">
              <Button variant="outline" size="sm">View All Markets</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Features Grid */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">Platform Features</h2>
            <p className="text-muted-foreground">Everything you need for agricultural success</p>
          </div>
          
          {/* Mobile Grid Layout */}
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {/* Marketplace Features */}
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-sm lg:text-base">Farm Inputs</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/farm-input-marketplace">
                  <Button size="sm" className="w-full text-xs">Shop Now</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Warehouse className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-sm lg:text-base">Equipment</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/equipment-marketplace">
                  <Button size="sm" className="w-full text-xs">Browse</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-sm lg:text-base">Trading</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/commodity-trading">
                  <Button size="sm" className="w-full text-xs">Trade</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-sm lg:text-base">Logistics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/logistics">
                  <Button size="sm" className="w-full text-xs">Find Transport</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-sm lg:text-base">City Markets</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/city-markets">
                  <Button size="sm" className="w-full text-xs">View Markets</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Tractor className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-sm lg:text-base">Farming Portal</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/farmer-portal">
                  <Button size="sm" className="w-full text-xs">Start Farming</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Bluetooth className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-sm lg:text-base">Bluetooth Market</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/bluetooth-marketplace">
                  <Button size="sm" className="w-full text-xs">Connect</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-sm lg:text-base">Supply Chain</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/supply-chain-dashboard">
                  <Button size="sm" className="w-full text-xs">Track</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Service Providers Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Service Providers</h2>
            <p className="text-muted-foreground">Professional agricultural services</p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-sm">Veterinary Services</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/veterinary-services">
                  <Button variant="outline" size="sm" className="w-full text-xs">Find Vets</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-sm">Feed & Nutrition</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/feed-nutrition">
                  <Button variant="outline" size="sm" className="w-full text-xs">Get Advice</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-sm">Farm Construction</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/farm-construction">
                  <Button variant="outline" size="sm" className="w-full text-xs">Build</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-sm">Consultancies</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/consultancies">
                  <Button variant="outline" size="sm" className="w-full text-xs">Consult</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-6">
            <Link to="/service-providers">
              <Button>View All Service Providers</Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Additional Features Grid */}
      <section className="py-8 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <Card className="text-center">
              <CardHeader className="pb-3">
                <Clock className="h-6 w-6 text-accent mx-auto mb-2" />
                <CardTitle className="text-sm">Donations</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/donation-list">
                  <Button variant="outline" size="sm" className="w-full text-xs">View</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-3">
                <Warehouse className="h-6 w-6 text-accent mx-auto mb-2" />
                <CardTitle className="text-sm">Food Rescue</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/food-rescue-dashboard">
                  <Button variant="outline" size="sm" className="w-full text-xs">Rescue</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-3">
                <TrendingUp className="h-6 w-6 text-accent mx-auto mb-2" />
                <CardTitle className="text-sm">Auctions</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/agent-product-auction-dashboard">
                  <Button variant="outline" size="sm" className="w-full text-xs">Bid</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-3">
                <BarChart3 className="h-6 w-6 text-accent mx-auto mb-2" />
                <CardTitle className="text-sm">Analytics</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/sentiment-analysis">
                  <Button variant="outline" size="sm" className="w-full text-xs">Analyze</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="text-center">
              <CardHeader className="pb-3">
                <DollarSign className="h-6 w-6 text-accent mx-auto mb-2" />
                <CardTitle className="text-sm">Buy Requests</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to="/buy-requests">
                  <Button variant="outline" size="sm" className="w-full text-xs">Request</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Content */}
      <FeaturedContent />
      
      {/* PWA Install Prompt */}
      <PWAInstallPrompt />
      
      {/* Professional Footer */}
      <footer className="bg-background border-t">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Platform */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">Platform</h3>
              <div className="space-y-2 text-xs">
                <Link to="/commodity-trading" className="block text-muted-foreground hover:text-foreground">Commodity Trading</Link>
                <Link to="/logistics" className="block text-muted-foreground hover:text-foreground">Logistics</Link>
                <Link to="/service-providers" className="block text-muted-foreground hover:text-foreground">Service Providers</Link>
                <Link to="/farm-input-marketplace" className="block text-muted-foreground hover:text-foreground">Farm Input Marketplace</Link>
                <Link to="/equipment-marketplace" className="block text-muted-foreground hover:text-foreground">Equipment Marketplace</Link>
                <Link to="/agricultural-marketplace" className="block text-muted-foreground hover:text-foreground">Agricultural Marketplace</Link>
              </div>
            </div>
            
            {/* Support */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">Support</h3>
              <div className="space-y-2 text-xs">
                <Link to="/about" className="block text-muted-foreground hover:text-foreground">FAQ</Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-foreground">Contact</Link>
                <Link to="/community-forum" className="block text-muted-foreground hover:text-foreground">Community Forum</Link>
                <Link to="/partner-with-us" className="block text-muted-foreground hover:text-foreground">Partner with us</Link>
              </div>
            </div>
            
            {/* Features */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">Features</h3>
              <div className="space-y-2 text-xs">
                <Link to="/kilimo-ams-data" className="block text-muted-foreground hover:text-foreground">Market Data</Link>
                <Link to="/sentiment-analysis" className="block text-muted-foreground hover:text-foreground">Analytics</Link>
                <Link to="/city-markets" className="block text-muted-foreground hover:text-foreground">City Markets</Link>
                <Link to="/veterinary-services" className="block text-muted-foreground hover:text-foreground">Veterinary Services</Link>
              </div>
            </div>
            
            {/* Company */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">AgriConnect</h3>
              <p className="text-xs text-muted-foreground mb-3">
                Connecting farmers, traders, and service providers for a better agricultural ecosystem.
              </p>
              <div className="space-y-2 text-xs">
                <Link to="/about" className="block text-muted-foreground hover:text-foreground">About Us</Link>
                <Link to="/contact" className="block text-muted-foreground hover:text-foreground">Contact</Link>
              </div>
            </div>
          </div>
          
          <div className="border-t mt-6 pt-4 text-center">
            <p className="text-xs text-muted-foreground">
              © 2024 AgriConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
      
      {/* Bottom padding for mobile navigation */}
      <div className="pb-20 md:pb-0"></div>
    </div>
  );
};

export default Index;
