import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Key, Copy, Trash2, Plus, Activity, Eye, EyeOff } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKey {
  id: string;
  key_name: string;
  api_key: string;
  tier: string;
  rate_limit: number;
  is_active: boolean;
  created_at: string;
  last_used_at: string;
}

interface UsageStats {
  total_requests: number;
  requests_by_endpoint: Record<string, number>;
}

export default function ApiManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [newKeyName, setNewKeyName] = useState("");
  const [newKeyTier, setNewKeyTier] = useState("free");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchApiKeys();
    fetchUsageStats();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("api_keys")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsageStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get all API keys for this user
      const { data: keys } = await supabase
        .from("api_keys")
        .select("id")
        .eq("user_id", user.id);

      if (!keys || keys.length === 0) {
        setUsageStats({ total_requests: 0, requests_by_endpoint: {} });
        return;
      }

      const keyIds = keys.map(k => k.id);

      // Get usage data
      const { data: usage, error } = await supabase
        .from("api_usage")
        .select("endpoint, status_code")
        .in("api_key_id", keyIds);

      if (error) throw error;

      const stats: UsageStats = {
        total_requests: usage?.length || 0,
        requests_by_endpoint: {},
      };

      usage?.forEach((req: any) => {
        if (!stats.requests_by_endpoint[req.endpoint]) {
          stats.requests_by_endpoint[req.endpoint] = 0;
        }
        stats.requests_by_endpoint[req.endpoint]++;
      });

      setUsageStats(stats);
    } catch (error: any) {
      console.error("Error fetching usage stats:", error);
    }
  };

  const generateApiKey = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key = "sk_";
    for (let i = 0; i < 48; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your API key",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const apiKey = generateApiKey();
      const rateLimits = { free: 500, premium: 50000, enterprise: -1 };

      const { error } = await supabase.from("api_keys").insert({
        user_id: user.id,
        key_name: newKeyName,
        api_key: apiKey,
        tier: newKeyTier,
        rate_limit: rateLimits[newKeyTier as keyof typeof rateLimits],
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: "API Key Created",
        description: "Your new API key has been generated",
      });

      setNewKeyName("");
      setNewKeyTier("free");
      fetchApiKeys();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const toggleKeyVisibility = (keyId: string) => {
    setShowKey(prev => ({ ...prev, [keyId]: !prev[keyId] }));
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "API key copied to clipboard",
    });
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from("api_keys")
        .delete()
        .eq("id", keyId);

      if (error) throw error;

      toast({
        title: "API Key Deleted",
        description: "The API key has been permanently deleted",
      });

      fetchApiKeys();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case "enterprise":
        return "bg-purple-500";
      case "premium":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading API management...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">API Management</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Manage your API keys and monitor usage across all SokoConnect services
        </p>
      </div>

      {/* Usage Stats */}
      {usageStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              API Usage Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-3xl font-bold text-primary">{usageStats.total_requests.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Top Endpoints</p>
                <div className="space-y-1">
                  {Object.entries(usageStats.requests_by_endpoint)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 5)
                    .map(([endpoint, count]) => (
                      <div key={endpoint} className="flex justify-between text-sm">
                        <span className="text-muted-foreground truncate">{endpoint}</span>
                        <span className="font-medium">{count}</span>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create New API Key */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create New API Key
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate New API Key</DialogTitle>
            <DialogDescription>
              Create a new API key for accessing SokoConnect services
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production API Key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tier">Tier</Label>
              <Select value={newKeyTier} onValueChange={setNewKeyTier}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free (500 req/day)</SelectItem>
                  <SelectItem value="premium">Premium (50,000 req/day)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (Unlimited)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Alert>
              <AlertDescription>
                Keep your API key secure. It cannot be recovered once you close this dialog.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button onClick={createApiKey}>Generate API Key</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* API Keys List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Your API Keys</h2>
        {apiKeys.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No API keys yet. Create one to get started!
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {apiKeys.map((key) => (
              <Card key={key.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{key.key_name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge className={getTierBadgeColor(key.tier)}>{key.tier}</Badge>
                      <Badge variant={key.is_active ? "default" : "secondary"}>
                        {key.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>
                    Rate Limit: {key.rate_limit === -1 ? "Unlimited" : `${key.rate_limit.toLocaleString()} req/day`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        value={showKey[key.id] ? key.api_key : "••••••••••••••••••••••••••••••••"}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => toggleKeyVisibility(key.id)}
                      >
                        {showKey[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyToClipboard(key.api_key)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Created</p>
                      <p className="font-medium">{new Date(key.created_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Used</p>
                      <p className="font-medium">
                        {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : "Never"}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="destructive"
                    onClick={() => deleteApiKey(key.id)}
                    className="w-full"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete API Key
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
