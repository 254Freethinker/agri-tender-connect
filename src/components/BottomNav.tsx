import { Home, Search, ShoppingCart, MessageSquare, User, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Search, label: "Markets", path: "/marketplace" },
    { icon: ShoppingCart, label: "Orders", path: "/bulk-orders" },
    { icon: MessageSquare, label: "Forum", path: "/community-forum" },
  ];

  const allPages = [
    { label: "Marketplace", path: "/marketplace", category: "Trade" },
    { label: "Bulk Orders", path: "/bulk-orders", category: "Trade" },
    { label: "Group Input Orders", path: "/inputs/group-orders", category: "Trade" },
    { label: "Barter Trade", path: "/barter-trade", category: "Trade" },
    { label: "Auctions", path: "/auction-dashboard", category: "Trade" },
    { label: "F2C Marketplace", path: "/f2c-marketplace", category: "Trade" },
    { label: "Equipment Marketplace", path: "/equipment-marketplace", category: "Trade" },
    { label: "Farm Input Marketplace", path: "/farm-input-marketplace", category: "Trade" },
    
    { label: "Contract Farming", path: "/contract-farming", category: "Contracts" },
    { label: "Export Opportunities", path: "/export-opportunities", category: "Contracts" },
    
    { label: "Food Rescue", path: "/food-rescue-dashboard", category: "Social Impact" },
    { label: "Donations", path: "/donation-list", category: "Social Impact" },
    
    { label: "Logistics", path: "/logistics", category: "Services" },
    { label: "Service Providers", path: "/service-providers", category: "Services" },
    { label: "Major Routes", path: "/major-routes", category: "Services" },
    { label: "Transporter Signup", path: "/transporter-signup", category: "Services" },
    
    { label: "Community Forum", path: "/community-forum", category: "Community" },
    { label: "Carbon Forum", path: "/carbon-forum", category: "Community" },
    { label: "Training Events", path: "/training-events", category: "Community" },
    { label: "Farmer Portal", path: "/farmer-portal", category: "Community" },
    { label: "Success Stories", path: "/farmer-success-stories", category: "Community" },
    
    { label: "City Markets", path: "/city-markets", category: "Market Info" },
    { label: "Market Linkages", path: "/market-linkages", category: "Market Info" },
    { label: "Price Trends", path: "/price-trends", category: "Market Info" },
    { label: "Sentiment Analysis", path: "/sentiment-analysis", category: "Market Info" },
    
    { label: "Batch Tracking", path: "/batch-tracking", category: "Technology" },
    { label: "API Management", path: "/api-management", category: "Technology" },
    { label: "Data Status", path: "/data-status", category: "Technology" },
    
    { label: "Weather", path: "/weather", category: "Resources" },
    { label: "Cooperative Groups", path: "/cooperative-groups", category: "Resources" },
    { label: "Farm Tourism", path: "/farm-tourism", category: "Resources" },
    
    { label: "About", path: "/about", category: "Info" },
    { label: "Contact", path: "/contact", category: "Info" },
    { label: "FAQ", path: "/faq", category: "Info" },
    { label: "Partner With Us", path: "/partner-with-us", category: "Info" },
  ];

  const categories = Array.from(new Set(allPages.map(p => p.category)));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
        
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="flex flex-col items-center justify-center gap-1 flex-1 h-full">
              <Menu className="h-5 w-5" />
              <span className="text-xs font-medium">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>All Features</SheetTitle>
              <SheetDescription>
                Access all AgriTender Connect features
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(80vh-100px)] mt-4">
              <div className="space-y-6">
                {categories.map(category => (
                  <div key={category}>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground">{category}</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {allPages.filter(p => p.category === category).map(page => (
                        <Link key={page.path} to={page.path}>
                          <Button variant="outline" className="w-full justify-start h-auto py-2">
                            <span className="text-xs">{page.label}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};
