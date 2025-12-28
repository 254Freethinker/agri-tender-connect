
import React from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  TrendingUp, 
  Shield, 
  Heart,
  Mail,
  Phone,
  MapPin,
  Truck,
  Wheat,
  Building2,
  BarChart3,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import aboutHeroBg from '@/assets/about-hero-bg.png';

const About: React.FC = () => {
  const navigate = useNavigate();

  const stats = [
    { label: 'Platform Launch', value: '2026', icon: <Users className="h-5 w-5" /> },
    { label: 'Target Counties', value: '47', icon: <MapPin className="h-5 w-5" /> },
    { label: 'Beta Testers', value: '100+', icon: <Building2 className="h-5 w-5" /> },
    { label: 'Development Stage', value: '85%', icon: <TrendingUp className="h-5 w-5" /> }
  ];

  const features = [
    {
      icon: <Wheat className="h-6 w-6 text-primary" />,
      title: 'Farm Management',
      description: 'Comprehensive tools for crop tracking, inventory management, and yield optimization'
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: 'Market Intelligence',
      description: 'Real-time market prices, demand forecasting, and trade opportunities'
    },
    {
      icon: <Truck className="h-6 w-6 text-primary" />,
      title: 'Smart Logistics',
      description: 'End-to-end logistics solutions connecting farmers to markets efficiently'
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: 'Financial Services',
      description: 'Access to credit, insurance, and digital payment solutions'
    }
  ];

  const achievements = [
    'Winner - Kenya Digital Economy Awards 2024',
    'ISO 27001 Certified for Data Security',
    'Partnership with Ministry of Agriculture',
    'Featured in TechCrunch Africa',
    'Google for Startups Alumni'
  ];

  return (
    <div className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative text-white py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${aboutHeroBg})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/85 via-primary/70 to-primary/50" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 drop-shadow-lg">Transforming Agriculture in Kenya</h1>
          <p className="text-lg md:text-xl mb-8 max-w-4xl mx-auto leading-relaxed drop-shadow">
            SokoConnect empowers every stakeholder in the agricultural supply chain - from smallholder farmers 
            to large-scale traders, transporters to processors, and cooperatives to consumers. We're building 
            a connected ecosystem where everyone thrives through technology, transparency, and community collaboration.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" variant="secondary" onClick={() => navigate('/partner-with-us')}>
              <Mail className="h-4 w-4 mr-2" />
              Partner With Us
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              Join Platform
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
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

      <div className="container mx-auto px-4 py-16">
        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                To revolutionize Kenya's agricultural sector by connecting all stakeholders - farmers, traders, 
                transporters, cooperatives, processors, and consumers - with technology that enables market access, 
                fair pricing, efficient logistics, and sustainable growth for everyone in the supply chain.
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-secondary" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                A digitally-enabled agricultural ecosystem where every farmer in Kenya has 
                access to the tools, knowledge, and opportunities needed to thrive in 
                modern agriculture and contribute to national food security.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-3">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Impact Section */}
        <section className="mb-16 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Vision for Impact</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Launching in 2026 - We're building for measurable transformation
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">100+</div>
              <div className="text-muted-foreground">Beta users testing the platform</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">47</div>
              <div className="text-muted-foreground">Counties planned for coverage</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">2026</div>
              <div className="text-muted-foreground">Official launch year</div>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-center text-2xl md:text-3xl mb-2">
                Why Choose SokoConnect?
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Value for Every Stakeholder in the Agri-Supply Chain
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">For Farmers</h3>
                  <p className="text-sm text-muted-foreground">Direct market access, fair prices, and farm management tools</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Truck className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">For Traders</h3>
                  <p className="text-sm text-muted-foreground">Bulk sourcing, quality verification, and logistics coordination</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">For Cooperatives</h3>
                  <p className="text-sm text-muted-foreground">Group orders, collective bargaining, and member management</p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-primary/10 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Heart className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Community First</h3>
                  <p className="text-sm text-muted-foreground">Built for all stakeholders - transparent, fair, and inclusive</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-green-700 to-green-600 text-white">
            <CardContent className="pt-8 pb-8">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Transform Agriculture Together?</h2>
              <p className="text-base md:text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                Join us in building Kenya's most comprehensive agricultural platform. Whether you're a farmer, trader, 
                transporter, cooperative, or service provider - there's a place for you in the SokoConnect ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
                <Button variant="secondary" size="lg" onClick={() => navigate('/partner-with-us')}>
                  <Mail className="h-4 w-4 mr-2" />
                  Contact Our Team
                </Button>
                <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-green-700" onClick={() => navigate('/auth')}>
                  Join Platform
                </Button>
              </div>
              
              <Separator className="my-6 bg-white/20" />
              
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm max-w-3xl mx-auto">
                <div className="flex flex-col items-center justify-center gap-2 p-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words text-center text-xs sm:text-sm">sokoconnect@tenderzville-portal.co.ke</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="text-center">+254 700 123 456</span>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 p-2 sm:col-span-2 md:col-span-1">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="text-center">Nairobi, Kenya</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;
