import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Package, 
  Users, 
  MapPin, 
  Truck, 
  FileText, 
  X,
  Loader2,
  ArrowRight,
  Building2,
  Wheat,
  Calendar
} from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'produce' | 'market' | 'provider' | 'opportunity' | 'event' | 'farmer';
  title: string;
  subtitle: string;
  location?: string;
  link: string;
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const debounce = setTimeout(() => {
      performSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    const searchResults: SearchResult[] = [];

    try {
      // Search produce/products
      const { data: produce } = await supabase
        .from('farmer_produce')
        .select('id, name, category, county')
        .ilike('name', `%${searchQuery}%`)
        .eq('status', 'available')
        .limit(5);

      if (produce) {
        produce.forEach(p => {
          searchResults.push({
            id: p.id,
            type: 'produce',
            title: p.name,
            subtitle: p.category,
            location: p.county,
            link: '/marketplace'
          });
        });
      }

      // Search city markets
      const { data: markets } = await supabase
        .from('city_markets')
        .select('id, market_name, city, county')
        .or(`market_name.ilike.%${searchQuery}%,city.ilike.%${searchQuery}%`)
        .eq('is_active', true)
        .limit(5);

      if (markets) {
        markets.forEach(m => {
          searchResults.push({
            id: m.id,
            type: 'market',
            title: m.market_name,
            subtitle: `City: ${m.city}`,
            location: m.county,
            link: '/city-markets'
          });
        });
      }

      // Search logistics providers
      const { data: providers } = await supabase
        .from('logistics_providers')
        .select('id, company_name, coverage_areas')
        .ilike('company_name', `%${searchQuery}%`)
        .eq('is_verified', true)
        .limit(5);

      if (providers) {
        providers.forEach(p => {
          searchResults.push({
            id: p.id,
            type: 'provider',
            title: p.company_name,
            subtitle: 'Logistics Provider',
            location: p.coverage_areas?.join(', '),
            link: '/logistics'
          });
        });
      }

      // Search export opportunities
      const { data: opportunities } = await supabase
        .from('export_opportunities')
        .select('id, title, product_category, delivery_location')
        .or(`title.ilike.%${searchQuery}%,product_category.ilike.%${searchQuery}%`)
        .eq('status', 'open')
        .limit(5);

      if (opportunities) {
        opportunities.forEach(o => {
          searchResults.push({
            id: o.id,
            type: 'opportunity',
            title: o.title,
            subtitle: o.product_category,
            location: o.delivery_location || undefined,
            link: '/export-opportunities'
          });
        });
      }

      // Search training events
      const { data: events } = await supabase
        .from('training_events')
        .select('id, title, event_type, location')
        .or(`title.ilike.%${searchQuery}%,event_type.ilike.%${searchQuery}%`)
        .limit(5);

      if (events) {
        events.forEach(e => {
          searchResults.push({
            id: e.id,
            type: 'event',
            title: e.title,
            subtitle: e.event_type || 'Training Event',
            location: e.location || undefined,
            link: '/training-events'
          });
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (result: SearchResult) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    navigate(result.link);
    onClose();
    setQuery('');
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'produce': return <Wheat className="h-4 w-4 text-green-600" />;
      case 'market': return <Building2 className="h-4 w-4 text-blue-600" />;
      case 'provider': return <Truck className="h-4 w-4 text-purple-600" />;
      case 'opportunity': return <FileText className="h-4 w-4 text-amber-600" />;
      case 'event': return <Calendar className="h-4 w-4 text-red-600" />;
      case 'farmer': return <Users className="h-4 w-4 text-emerald-600" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      produce: 'bg-green-100 text-green-800',
      market: 'bg-blue-100 text-blue-800',
      provider: 'bg-purple-100 text-purple-800',
      opportunity: 'bg-amber-100 text-amber-800',
      event: 'bg-red-100 text-red-800',
      farmer: 'bg-emerald-100 text-emerald-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const quickLinks = [
    { label: 'Marketplace', link: '/marketplace', icon: Package },
    { label: 'Logistics', link: '/logistics', icon: Truck },
    { label: 'Export Opportunities', link: '/export-opportunities', icon: FileText },
    { label: 'City Markets', link: '/city-markets', icon: Building2 },
    { label: 'Training Events', link: '/training-events', icon: Calendar },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="sr-only">Search AgriConnect</DialogTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search produce, markets, providers, opportunities..."
              className="pl-10 pr-10 h-12 text-lg border-0 focus-visible:ring-0"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                onClick={() => setQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="border-t">
          <ScrollArea className="max-h-[60vh]">
            <div className="p-4">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                  </p>
                  {results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleSelect(result)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent text-left transition-colors"
                    >
                      <div className="p-2 rounded-full bg-muted">
                        {getTypeIcon(result.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{result.title}</span>
                          <Badge className={`text-xs ${getTypeBadge(result.type)}`}>
                            {result.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{result.subtitle}</span>
                          {result.location && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {result.location}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              ) : query.length >= 2 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No results found for "{query}"</p>
                  <p className="text-sm">Try different keywords or browse categories below</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {recentSearches.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-3">Recent Searches</p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((search, i) => (
                          <Button
                            key={i}
                            variant="outline"
                            size="sm"
                            onClick={() => setQuery(search)}
                            className="text-sm"
                          >
                            {search}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-3">Quick Links</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {quickLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Button
                            key={link.link}
                            variant="outline"
                            className="justify-start gap-2"
                            onClick={() => {
                              navigate(link.link);
                              onClose();
                            }}
                          >
                            <Icon className="h-4 w-4" />
                            {link.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="border-t p-3 bg-muted/50">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Press <kbd className="px-1.5 py-0.5 bg-background rounded border">ESC</kbd> to close</span>
            <span>Search across all AgriConnect data</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalSearch;
