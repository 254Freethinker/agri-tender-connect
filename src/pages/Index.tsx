
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Package, 
  Heart, 
  TrendingUp, 
  Users, 
  Leaf, 
  Handshake,
  ShoppingCart,
  Building2,
  ArrowRight,
  Truck,
  BarChart3,
  MapPin,
  DollarSign,
  Tractor,
  Warehouse
} from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Food Rescue Network',
    description: 'Connect surplus food with communities in need, reducing waste and hunger.',
    link: '/food-rescue-dashboard',
    color: 'bg-gradient-to-br from-red-500 to-pink-500',
    textColor: 'text-red-600'
  },
  {
    icon: Handshake,
    title: 'Contract Farming',
    description: 'Secure partnerships between farmers and buyers with guaranteed markets.',
    link: '/contract-farming',
    color: 'bg-gradient-to-br from-green-500 to-emerald-500',
    textColor: 'text-green-600'
  },
  {
    icon: ShoppingCart,
    title: 'Group Input Orders',
    description: 'Collective purchasing power for affordable farm inputs and better prices.',
    link: '/inputs/group-orders',
    color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    textColor: 'text-blue-600'
  },
  {
    icon: Package,
    title: 'Farm Input Marketplace',
    description: 'Access quality seeds, fertilizers, and equipment from verified suppliers.',
    link: '/farm-input-marketplace',
    color: 'bg-gradient-to-br from-purple-500 to-violet-500',
    textColor: 'text-purple-600'
  }
];

const stats = [
  { icon: Users, label: 'Active Users', value: '25,000+', growth: '+15%' },
  { icon: Package, label: 'Food Rescued', value: '2.3M kg', growth: '+32%' },
  { icon: Leaf, label: 'CO₂ Prevented', value: '850 tons', growth: '+28%' },
  { icon: Building2, label: 'Partner Organizations', value: '450+', growth: '+12%' }
];

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                AgriConnect
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
              <Link to="/auth">
                <Button variant="outline">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              🌟 #1 Agricultural Platform in Africa
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Transforming Agriculture
              <br />
              One Connection at a Time
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Connect farmers, reduce food waste, optimize supply chains, and build a sustainable food system 
              for Africa. Join thousands of farmers, suppliers, and organizations making a difference.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/food-rescue-dashboard">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white">
                <Heart className="h-5 w-5 mr-2" />
                Start Food Rescue
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link to="/farm-input-marketplace">
              <Button size="lg" variant="outline">
                <Package className="h-5 w-5 mr-2" />
                Browse Marketplace
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg p-6 border">
                  <div className="text-center space-y-2">
                    <Icon className="h-8 w-8 mx-auto text-green-600" />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                    <Badge variant="secondary" className="text-xs">
                      {stat.growth}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Comprehensive Agricultural Solutions
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From farm to fork, we provide tools and connections that empower every step of the agricultural value chain.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} to={feature.link}>
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2 group cursor-pointer bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-md">
                    <CardHeader className="space-y-4">
                      <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base leading-relaxed">
                        {feature.description}
                      </CardDescription>
                      <div className="flex items-center mt-4 text-sm font-medium text-primary group-hover:translate-x-2 transition-transform">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quick Action Cards */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Started Today</h2>
            <p className="text-lg text-muted-foreground">
              Choose your path to agricultural success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* City Markets Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>City Markets</CardTitle>
                <CardDescription>
                  View city market prices and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/city-markets">
                  <Button className="w-full" size="lg">
                    City Markets
                  </Button>
                </Link>
              </CardContent>
            </Card>
            
            {/* Start Farming Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Tractor className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Start Farming</CardTitle>
                <CardDescription>
                  Access farming tools, crop tracking, and agricultural resources
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/farmer-portal">
                  <Button className="w-full" size="lg">
                    Start Farming
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Farm Equipment Card */}
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Warehouse className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>Farm Equipment</CardTitle>
                <CardDescription>
                  Buy, sell, or rent farm equipment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/equipment-marketplace">
                  <Button className="w-full" size="lg">
                    Equipment Marketplace
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Making Real Impact Across Africa
          </h2>
          <p className="text-xl opacity-90 leading-relaxed">
            Our platform has connected thousands of stakeholders, rescued millions of kilograms of food, 
            and created sustainable supply chain solutions that benefit everyone from smallholder farmers to urban consumers.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-12">
            <div className="space-y-2">
              <div className="text-4xl font-bold">98%</div>
              <div className="text-lg opacity-90">Farmer Satisfaction</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">45%</div>
              <div className="text-lg opacity-90">Cost Reduction</div>
            </div>
            <div className="space-y-2">
              <div className="text-4xl font-bold">72%</div>
              <div className="text-lg opacity-90">Waste Reduction</div>
            </div>
          </div>

          <div className="pt-8">
            <Link to="/food-rescue-dashboard">
              <Button size="lg" variant="secondary" className="bg-white text-green-600 hover:bg-gray-100">
                <Heart className="h-5 w-5 mr-2" />
                Join the Movement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-6">
          <div className="flex items-center justify-center space-x-2">
            <Leaf className="h-6 w-6 text-green-400" />
            <span className="text-lg font-semibold">AgriConnect</span>
          </div>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Building sustainable agricultural supply chains across Africa through technology, 
            innovation, and community collaboration.
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link>
            <Link to="/terms-of-service" className="text-gray-400 hover:text-white">Terms of Service</Link>
            <Link to="/contact" className="text-gray-400 hover:text-white">Support</Link>
          </div>
          <div className="text-gray-500 text-sm">
            © 2024 AgriConnect. Transforming African Agriculture.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
