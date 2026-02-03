import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const footerSections = [
    {
      title: 'Platform',
      links: [
        { label: 'Agricultural Marketplace', href: '/marketplace' },
        { label: 'Logistics Solutions', href: '/logistics' },
        { label: 'Food Rescue', href: '/food-rescue-dashboard' },
        { label: 'Farmer Portal', href: '/farmer-portal' },
        { label: 'Community Forum', href: '/community-forum' },
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'FAQ', href: '/faq' },
        { label: 'Contact', href: '/contact' },
        { label: 'Partner with us', href: '/partner-with-us' },
      ]
    },
    {
      title: 'Features',
      links: [
        { label: 'Market Data', href: '/kilimo-ams-data' },
        { label: 'Analytics', href: '/sentiment-analysis' },
        { label: 'Bluetooth', href: '/bluetooth-marketplace' },
        { label: 'Advertise', href: '/advertise' },
      ]
    },
  ];

  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto py-12 px-4">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-foreground">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link 
                      to={link.href} 
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
          {/* SokoConnect Brand Section */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground">SokoConnect</h4>
            <p className="text-sm text-muted-foreground mb-4">
              Connecting farmers, traders, and service providers for a better agricultural ecosystem.
            </p>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="/about" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SokoConnect. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;