import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Truck, 
  Building2, 
  Users, 
  Package, 
  TrendingUp, 
  Globe, 
  Heart,
  Sprout,
  MapPin,
  Calendar,
  ShoppingCart,
  Bluetooth,
  Award,
  Handshake
} from 'lucide-react';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'Explore App',
      links: [
        { label: 'Co-operative Management', href: '/cooperative-groups', icon: Users },
        { label: 'Carbon Footprint', href: '/carbon-forum', icon: Sprout },
        { label: 'Farm Tourism', href: '/farm-tourism', icon: MapPin },
        { label: 'Training Events', href: '/training-events', icon: Calendar },
        { label: 'Market Linkage', href: '/market-linkages', icon: Handshake },
        { label: 'Batch Tracking', href: '/batch-tracking', icon: Package },
      ]
    },
    {
      title: 'Marketplace',
      links: [
        { label: 'Agricultural Marketplace', href: '/marketplace', icon: ShoppingCart },
        { label: 'Service Providers', href: '/service-providers', icon: Building2 },
        { label: 'Farmer Portal', href: '/farmer-portal', icon: Sprout },
        { label: 'Bluetooth Marketplace', href: '/bluetooth-marketplace', icon: Bluetooth },
      ]
    },
    {
      title: 'Community',
      links: [
        { label: 'Farmer Success Stories', href: '/farmer-success-stories', icon: Award },
        { label: 'Partner Showcase', href: '/partners', icon: Handshake },
        { label: 'Community Forum', href: '/community-forum', icon: Users },
        { label: 'Food Rescue', href: '/food-rescue-dashboard', icon: Heart },
      ]
    },
    {
      title: 'Data & Analytics',
      links: [
        { label: 'Market Data', href: '/kilimo-ams-data', icon: TrendingUp },
        { label: 'Sentiment Analysis', href: '/sentiment-analysis', icon: TrendingUp },
        { label: 'Supply Chain Problems', href: '/supply-chain-problems', icon: Package },
        { label: 'Logistics', href: '/logistics', icon: Truck },
      ]
    },
    {
      title: 'Platform',
      links: [
        { label: 'Commodity Trading', href: '/commodity-trading', icon: Globe },
        { label: 'Export Opportunities', href: '/export-opportunities', icon: Globe },
        { label: 'Contract Farming', href: '/contract-farming', icon: Handshake },
        { label: 'Bulk Orders', href: '/bulk-orders', icon: Package },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQ', href: '/faq', icon: null },
        { label: 'Contact Us', href: '/contact', icon: null },
        { label: 'Privacy Policy', href: '/privacy-policy', icon: null },
        { label: 'Terms of Service', href: '/terms-of-service', icon: null },
      ]
    }
  ];

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto py-12 px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
                    >
                      {link.icon && <link.icon className="h-3 w-3" />}
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Brand Section */}
        <div className="border-t pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-lg text-foreground">AgriConnect Kenya</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Connecting farmers, traders, and service providers for a better agricultural ecosystem across Kenya.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
                About Us
              </Link>
              <Link to="/partner-with-us" className="text-sm text-muted-foreground hover:text-foreground">
                Partner With Us
              </Link>
              <Link to="/api-docs" className="text-sm text-muted-foreground hover:text-foreground">
                API
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AgriConnect Kenya. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
