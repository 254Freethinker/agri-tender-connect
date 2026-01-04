import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Truck, 
  Building2, 
  AlertTriangle, 
  BookOpen, 
  MessageCircle,
  TrendingUp,
  Globe,
  Handshake,
  Package,
  MapPin,
  Users,
  Heart,
  Recycle,
  Settings,
  HelpCircle,
  Shield,
  FileText,
  Phone,
  Sprout,
  BarChart3,
  Bluetooth,
  Award,
  Calendar,
  ShoppingCart
} from 'lucide-react';

const moreFeatures = [
  {
    title: 'Explore App',
    description: 'Discover additional features and tools',
    items: [
      { icon: Users, label: 'Co-operative Management', href: '/cooperative-groups' },
      { icon: Sprout, label: 'Carbon Footprint', href: '/carbon-forum' },
      { icon: MapPin, label: 'Farm Tourism', href: '/farm-tourism' },
      { icon: Calendar, label: 'Training Events', href: '/training-events' },
      { icon: Handshake, label: 'Market Linkage', href: '/market-linkages' },
      { icon: Package, label: 'Batch Tracking', href: '/batch-tracking' }
    ]
  },
  {
    title: 'Marketplace & Commerce',
    description: 'Buy, sell, and trade agricultural products',
    items: [
      { icon: ShoppingCart, label: 'Agricultural Marketplace', href: '/marketplace' },
      { icon: Building2, label: 'Service Providers', href: '/service-providers' },
      { icon: Sprout, label: 'Farmer Portal', href: '/farmer-portal' },
      { icon: Bluetooth, label: 'Bluetooth Marketplace', href: '/bluetooth-marketplace' },
      { icon: Recycle, label: 'Imperfect Surplus', href: '/imperfect-surplus-dashboard' }
    ]
  },
  {
    title: 'Supply Chain Solutions',
    description: 'Logistics and transport services',
    items: [
      { icon: Truck, label: 'Logistics Solutions Map', href: '/logistics-solutions-map', badge: 'A1-A9' },
      { icon: Package, label: 'Bulk Orders', href: '/bulk-orders' },
      { icon: AlertTriangle, label: 'Supply Chain Problems', href: '/supply-chain-problems' },
      { icon: TrendingUp, label: 'Market Demand Hotspot', href: '/market-demand-hotspot' }
    ]
  },
  {
    title: 'Trading & Contracts',
    description: 'Advanced trading options',
    items: [
      { icon: Handshake, label: 'Barter Exchange', href: '/barter-exchange' },
      { icon: Globe, label: 'Export Opportunities', href: '/export-market-opportunities', badge: 'A1-A9' },
      { icon: Building2, label: 'Contract Farming', href: '/contract-farming' },
      { icon: MapPin, label: 'Road Markets', href: '/major-routes' }
    ]
  },
  {
    title: 'Community & Success',
    description: 'Connect and learn from others',
    items: [
      { icon: Award, label: 'Farmer Success Stories', href: '/farmer-success-stories' },
      { icon: Handshake, label: 'Partner Showcase', href: '/partners' },
      { icon: MessageCircle, label: 'Community Forum', href: '/community-forum' },
      { icon: Heart, label: 'Food Rescue Dashboard', href: '/food-rescue-dashboard' }
    ]
  },
  {
    title: 'Data & Analytics',
    description: 'Market data and insights',
    items: [
      { icon: TrendingUp, label: 'Market Data', href: '/kilimo-ams-data' },
      { icon: BarChart3, label: 'Sentiment Analysis', href: '/sentiment-analysis' },
      { icon: FileText, label: 'API Documentation', href: '/api-docs' }
    ]
  },
  {
    title: 'Farm Inputs',
    description: 'Agricultural inputs and supplies',
    items: [
      { icon: Package, label: 'Farm Input Marketplace', href: '/farm-input-marketplace' },
      { icon: Users, label: 'Group Input Orders', href: '/inputs/group-orders' },
      { icon: TrendingUp, label: 'Input Pricing Verification', href: '/inputs/pricing-verification' }
    ]
  },
  {
    title: 'Account & Support',
    description: 'Settings and help',
    items: [
      { icon: Settings, label: 'Profile Settings', href: '/profile' },
      { icon: Shield, label: 'Privacy Policy', href: '/privacy-policy' },
      { icon: FileText, label: 'Terms of Service', href: '/terms-of-service' },
      { icon: HelpCircle, label: 'FAQ', href: '/faq' },
      { icon: Phone, label: 'Contact Us', href: '/contact' }
    ]
  }
];

export default function MorePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto p-4 space-y-6 pb-24">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">More Features</h1>
          <p className="text-muted-foreground">
            Explore all AgriConnect features and services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {moreFeatures.map((section) => (
            <Card key={section.title}>
              <CardHeader>
                <CardTitle className="text-lg">{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className="p-2 rounded-full bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium text-sm">{item.label}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <MobileNavigation />
    </div>
  );
}
