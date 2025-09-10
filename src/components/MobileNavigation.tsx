import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  ShoppingCart, 
  FileText, 
  Truck, 
  Users, 
  Heart,
  MessageCircle,
  User,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const navItems = [
  { path: '/', icon: Home, label: 'Home', color: 'text-blue-600' },
  { path: '/city-market', icon: ShoppingCart, label: 'Marketplace', color: 'text-green-600' },
  { path: '/contract-farming', icon: FileText, label: 'Contracts', color: 'text-purple-600' },
  { path: '/logistics', icon: Truck, label: 'Logistics', color: 'text-orange-600' },
  { path: '/group-orders', icon: Users, label: 'Group Orders', color: 'text-indigo-600' },
  { path: '/food-rescue-dashboard', icon: Heart, label: 'Food Rescue', color: 'text-red-600' },
  { path: '/chat-assistant', icon: MessageCircle, label: 'Chat Assistant', color: 'text-teal-600' },
  { path: '/profile', icon: User, label: 'Profile', color: 'text-gray-600' },
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const NavLink = ({ item, onClick }: { item: typeof navItems[0], onClick?: () => void }) => {
    const isActive = location.pathname === item.path;
    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
          isActive 
            ? 'bg-primary/10 text-primary' 
            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
        }`}
      >
        <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : item.color}`} />
        <span className="font-medium">{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.slice(0, 4).map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center p-2 transition-colors ${
                location.pathname === item.path
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
            </Link>
          ))}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="flex flex-col items-center p-2">
                <Menu className="h-5 w-5" />
                <span className="text-xs mt-1">More</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Navigation</h2>
                <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="space-y-2">
                {navItems.map((item) => (
                  <NavLink 
                    key={item.path} 
                    item={item} 
                    onClick={() => setIsOpen(false)} 
                  />
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Side Navigation (Optional) */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-64 bg-background border-r border-border z-40 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center mb-8">
            <div className="w-8 h-8 bg-primary rounded mr-3 flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <h1 className="text-xl font-bold">SokoConnect</h1>
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink key={item.path} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}