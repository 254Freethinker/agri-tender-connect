import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { QrCode, Package, MapPin, Calendar, Plus, CheckCircle, AlertCircle } from "lucide-react";

interface BatchEvent {
  timestamp: string;
  event: string;
  location?: string;
  notes?: string;
}

interface Batch {
  id: string;
  batch_id: string;
  product_type: string;
  quantity: number;
  unit: string;
  origin: string;
  destination: string;
  status: string;
  events: BatchEvent[];
  quality_score: number;
  certifications: string[];
  created_at: string;
}

export default function BatchTracking() {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchBatchId, setSearchBatchId] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form state for creating new batch
  const [newBatch, setNewBatch] = useState({
    product_type: "",
    quantity: "",
    unit: "Kg",
    origin: "",
    destination: "",
  });

  // Form state for adding events
  const [newEvent, setNewEvent] = useState({
    event: "",
    location: "",
    notes: "",
  });

  useEffect(() => {
    fetchUserBatches();
  }, []);

  const fetchUserBatches = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("batch_tracking")
        .select("*")
        .eq("farmer_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBatches(data || []);
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

  const searchBatch = async () => {
    if (!searchBatchId.trim()) {
      toast({
        title: "Enter Batch ID",
        description: "Please enter a batch ID to search",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("batch_tracking")
        .select("*")
        .eq("batch_id", searchBatchId)
        .single();

      if (error) throw error;
      
      if (data) {
        setSelectedBatch(data);
        toast({
          title: "Batch Found",
          description: `Batch ${searchBatchId} found successfully`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Batch Not Found",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const createBatch = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const batchId = `BATCH-${Date.now()}`;
      const { error } = await supabase
        .from("batch_tracking")
        .insert({
          batch_id: batchId,
          farmer_id: user.id,
          product_type: newBatch.product_type,
          quantity: parseFloat(newBatch.quantity),
          unit: newBatch.unit,
          origin: newBatch.origin,
          destination: newBatch.destination,
          status: "in_transit",
          events: [
            {
              timestamp: new Date().toISOString(),
              event: "Batch Created",
              location: newBatch.origin,
              notes: "Batch initiated and ready for tracking",
            },
          ],
        });

      if (error) throw error;

      toast({
        title: "Batch Created",
        description: `Batch ${batchId} created successfully`,
      });

      setNewBatch({
        product_type: "",
        quantity: "",
        unit: "Kg",
        origin: "",
        destination: "",
      });

      fetchUserBatches();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addEvent = async () => {
    if (!selectedBatch || !newEvent.event) {
      toast({
        title: "Missing Information",
        description: "Please provide event details",
        variant: "destructive",
      });
      return;
    }

    try {
      const updatedEvents = [
        ...selectedBatch.events,
        {
          timestamp: new Date().toISOString(),
          event: newEvent.event,
          location: newEvent.location,
          notes: newEvent.notes,
        },
      ];

      const { error } = await supabase
        .from("batch_tracking")
        .update({ events: updatedEvents })
        .eq("id", selectedBatch.id);

      if (error) throw error;

      toast({
        title: "Event Added",
        description: "Batch event recorded successfully",
      });

      setNewEvent({ event: "", location: "", notes: "" });
      fetchUserBatches();
      
      // Update selected batch
      const { data } = await supabase
        .from("batch_tracking")
        .select("*")
        .eq("id", selectedBatch.id)
        .single();
      
      if (data) setSelectedBatch(data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "quality_checked":
        return <CheckCircle className="h-5 w-5 text-blue-500" />;
      case "recalled":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Package className="h-5 w-5 text-orange-500" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading batch tracking...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Batch Tracking & Traceability</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Track your agricultural products from farm to market with complete transparency
        </p>
      </div>

      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Search Batch
          </CardTitle>
          <CardDescription>Enter a batch ID to track a specific shipment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Enter Batch ID (e.g., BATCH-1234567890)"
              value={searchBatchId}
              onChange={(e) => setSearchBatchId(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchBatch()}
            />
            <Button onClick={searchBatch}>Search</Button>
          </div>
        </CardContent>
      </Card>

      {/* Create New Batch */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Create New Batch
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Batch</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Product Type</Label>
              <Input
                value={newBatch.product_type}
                onChange={(e) => setNewBatch({ ...newBatch, product_type: e.target.value })}
                placeholder="e.g., Maize, Tomatoes"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input
                  type="number"
                  value={newBatch.quantity}
                  onChange={(e) => setNewBatch({ ...newBatch, quantity: e.target.value })}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label>Unit</Label>
                <Select value={newBatch.unit} onValueChange={(value) => setNewBatch({ ...newBatch, unit: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kg">Kg</SelectItem>
                    <SelectItem value="Bags">Bags</SelectItem>
                    <SelectItem value="Crates">Crates</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Origin</Label>
              <Input
                value={newBatch.origin}
                onChange={(e) => setNewBatch({ ...newBatch, origin: e.target.value })}
                placeholder="Farm location"
              />
            </div>
            <div className="space-y-2">
              <Label>Destination</Label>
              <Input
                value={newBatch.destination}
                onChange={(e) => setNewBatch({ ...newBatch, destination: e.target.value })}
                placeholder="Market/Buyer location"
              />
            </div>
            <Button onClick={createBatch} className="w-full">Create Batch</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Batch Details */}
      {selectedBatch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Batch: {selectedBatch.batch_id}</span>
              <Badge variant="outline" className="flex items-center gap-2">
                {getStatusIcon(selectedBatch.status)}
                {selectedBatch.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Product</p>
                <p className="font-medium">{selectedBatch.product_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-medium">{selectedBatch.quantity} {selectedBatch.unit}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Origin</p>
                <p className="font-medium">{selectedBatch.origin}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Destination</p>
                <p className="font-medium">{selectedBatch.destination}</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              <h3 className="font-semibold">Batch Journey</h3>
              <div className="space-y-4">
                {selectedBatch.events.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-3 w-3 rounded-full bg-primary" />
                      {index < selectedBatch.events.length - 1 && (
                        <div className="h-full w-0.5 bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">{event.event}</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {new Date(event.timestamp).toLocaleString()}
                        </p>
                        {event.location && (
                          <p className="flex items-center gap-2">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </p>
                        )}
                        {event.notes && <p className="text-xs">{event.notes}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Event */}
            <div className="border-t pt-4 space-y-4">
              <h3 className="font-semibold">Add Event</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Event description"
                  value={newEvent.event}
                  onChange={(e) => setNewEvent({ ...newEvent, event: e.target.value })}
                />
                <Input
                  placeholder="Location (optional)"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                />
                <Textarea
                  placeholder="Additional notes (optional)"
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                />
                <Button onClick={addEvent} className="w-full">Add Event</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User's Batches */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">My Batches</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch) => (
            <Card key={batch.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedBatch(batch)}>
              <CardHeader>
                <CardTitle className="text-base">{batch.batch_id}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  {getStatusIcon(batch.status)}
                  {batch.status}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Product:</span>
                  <span className="font-medium">{batch.product_type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quantity:</span>
                  <span className="font-medium">{batch.quantity} {batch.unit}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Events:</span>
                  <span className="font-medium">{batch.events.length}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
