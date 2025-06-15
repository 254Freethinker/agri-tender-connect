
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  TrendingUp, 
  Truck, 
  Users, 
  MessageCircle, 
  BarChart3,
  DollarSign,
  Megaphone
} from 'lucide-react';

const navigationItems = [
  {
    name: 'Home',
    href: '/',
    icon: Home,
  },
  {
    name: 'Market Data',
    href: '/kilimo-ams-data',
    icon: TrendingUp,
  },
  {
    name: 'Logistics',
    href: '/logistics',
    icon: Truck,
  },
  {
    name: 'Service Providers',
    href: '/service-providers',
    icon: Users,
  },
  {
    name: 'Advertise Business',
    href: '/business-marketing',
    icon: Megaphone,
    highlight: true,
  },
  {
    name: 'Trading',
    href: '/commodity-trading',
    icon: DollarSign,
  },
  {
    name: 'Community',
    href: '/community-forum',
    icon: MessageCircle,
  },
  {
    name: 'Analytics',
    href: '/sentiment-analysis',
    icon: BarChart3,
  },
];

export const MainNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="hidden md:flex items-center space-x-1">
      <Link to="/" className="flex items-center space-x-2 mr-6">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold">A</span>
        </div>
        <span className="hidden lg:inline-block font-bold">AgriConnect</span>
      </Link>
      
      {navigationItems.map((item) => {
        const isActive = location.pathname === item.href;
        return (
          <Link key={item.name} to={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={cn(
                "flex items-center space-x-2",
                item.highlight && !isActive && "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200",
                item.highlight && isActive && "bg-green-600 hover:bg-green-700"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="hidden lg:inline">{item.name}</span>
            </Button>
          </Link>
        );
      })}
    </nav>
  );
};
