import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { MobileNavigation } from '@/components/MobileNavigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  MapPin, 
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Sprout,
  Package,
  Plus,
  Edit,
  Trash,
  Eye,
  BarChart3,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface FarmStats {
  monthlyRevenue: number;
  totalArea: number;
  averageYield: number;
  activeAlerts: number;
  totalCrops: number;
  totalLivestock: number;
}

interface Task {
  id: string;
  title: string;
  description: string | null;
  crop: string;
  date: string;
  priority: string;
  status: string;
}

interface FarmerProduce {
  id: string;
  name: string;
  category: string;
  county: string;
  quantity: number;
  unit: string;
  quality_grade: string;
  price_per_unit: number | null;
  available_from: string | null;
  description: string | null;
  status: string;
  is_organic: boolean;
  created_at: string;
}

const categories = ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Meat', 'Poultry', 'Herbs', 'Root Crops', 'Legumes'];
const kenyanCounties = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Uasin Gishu', 'Kiambu', 'Machakos', 'Kajiado', 'Nyeri', 'Meru', 'Kilifi', 'Trans Nzoia', 'Bungoma', 'Kakamega'];
const qualityGrades = ['A', 'B', 'C'];

const FarmerPortal: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [stats, setStats] = useState<FarmStats>({
    monthlyRevenue: 0,
    totalArea: 0,
    averageYield: 0,
    activeAlerts: 0,
    totalCrops: 0,
    totalLivestock: 0
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [produce, setProduce] = useState<FarmerProduce[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProduceDialogOpen, setIsProduceDialogOpen] = useState(false);
  const [editingProduce, setEditingProduce] = useState<FarmerProduce | null>(null);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  
  const [produceForm, setProduceForm] = useState({
    name: '',
    category: '',
    county: '',
    quantity: '',
    unit: 'kg',
    quality_grade: 'B',
    price_per_unit: '',
    available_from: '',
    description: '',
    is_organic: false
  });

  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    crop: '',
    date: '',
    priority: 'medium'
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      // Fetch profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData) setProfile(profileData);

      // Fetch farm statistics (upsert if not exists)
      const { data: farmStats, error: statsError } = await supabase
        .from('farm_statistics')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code === 'PGRST116') {
        // Create initial stats
        await supabase.from('farm_statistics').insert({ user_id: user.id });
      } else if (farmStats) {
        setStats({
          monthlyRevenue: farmStats.monthly_revenue || 0,
          totalArea: farmStats.total_area || 0,
          averageYield: farmStats.average_yield || 0,
          activeAlerts: farmStats.active_alerts || 0,
          totalCrops: farmStats.total_crops || 0,
          totalLivestock: farmStats.total_livestock || 0
        });
      }

      // Fetch tasks
      const { data: tasksData } = await supabase
        .from('farm_tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .limit(10);
      
      if (tasksData) setTasks(tasksData);

      // Fetch farmer's produce
      const { data: produceData } = await supabase
        .from('farmer_produce')
        .select('*')
        .eq('farmer_id', user.id)
        .order('created_at', { ascending: false });
      
      if (produceData) setProduce(produceData);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load farm data',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleProduceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const payload = {
        farmer_id: user.id,
        name: produceForm.name,
        category: produceForm.category,
        county: produceForm.county,
        quantity: parseFloat(produceForm.quantity),
        unit: produceForm.unit,
        quality_grade: produceForm.quality_grade,
        price_per_unit: produceForm.price_per_unit ? parseFloat(produceForm.price_per_unit) : null,
        available_from: produceForm.available_from || null,
        description: produceForm.description || null,
        is_organic: produceForm.is_organic
      };

      if (editingProduce) {
        const { error } = await supabase
          .from('farmer_produce')
          .update(payload)
          .eq('id', editingProduce.id);
        if (error) throw error;
        toast({ title: 'Success', description: 'Product updated successfully!' });
      } else {
        const { error } = await supabase
          .from('farmer_produce')
          .insert(payload);
        if (error) throw error;
        toast({ title: 'Success', description: 'Product added to marketplace!' });
      }

      resetProduceForm();
      setIsProduceDialogOpen(false);
      setEditingProduce(null);
      fetchAllData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save product',
        variant: 'destructive'
      });
    }
  };

  const handleDeleteProduce = async (id: string) => {
    try {
      const { error } = await supabase
        .from('farmer_produce')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: 'Deleted', description: 'Product removed from listings' });
      fetchAllData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete product',
        variant: 'destructive'
      });
    }
  };

  const handleEditProduce = (item: FarmerProduce) => {
    setEditingProduce(item);
    setProduceForm({
      name: item.name,
      category: item.category,
      county: item.county,
      quantity: item.quantity.toString(),
      unit: item.unit,
      quality_grade: item.quality_grade,
      price_per_unit: item.price_per_unit?.toString() || '',
      available_from: item.available_from || '',
      description: item.description || '',
      is_organic: item.is_organic
    });
    setIsProduceDialogOpen(true);
  };

  const resetProduceForm = () => {
    setProduceForm({
      name: '',
      category: '',
      county: '',
      quantity: '',
      unit: 'kg',
      quality_grade: 'B',
      price_per_unit: '',
      available_from: '',
      description: '',
      is_organic: false
    });
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('farm_tasks')
        .insert({
          user_id: user.id,
          title: taskForm.title,
          description: taskForm.description || null,
          crop: taskForm.crop,
          date: taskForm.date,
          priority: taskForm.priority,
          status: 'pending'
        });
      
      if (error) throw error;
      toast({ title: 'Success', description: 'Task created!' });
      setIsTaskDialogOpen(false);
      setTaskForm({ title: '', description: '', crop: '', date: '', priority: 'medium' });
      fetchAllData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create task',
        variant: 'destructive'
      });
    }
  };

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('farm_tasks')
        .update({ status: newStatus })
        .eq('id', taskId);
      if (error) throw error;
      toast({ title: 'Updated', description: 'Task status updated' });
      fetchAllData();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getQualityColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-orange-100 text-orange-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  // Chart data from real produce
  const categoryData = produce.reduce((acc, item) => {
    const existing = acc.find(c => c.name === item.category);
    if (existing) {
      existing.value += item.quantity;
    } else {
      acc.push({ name: item.category, value: item.quantity });
    }
    return acc;
  }, [] as { name: string; value: number }[]);

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto py-6 px-4 pb-24">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            Welcome, {profile?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground">Manage your farm operations, products, and track performance</p>
        </div>

        <Tabs defaultValue="dashboard" className="w-full">
          <div className="overflow-x-auto scrollbar-hide mb-6">
            <TabsList className="flex w-max min-w-full space-x-2 px-1">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="products">My Products ({produce.length})</TabsTrigger>
              <TabsTrigger value="tasks">Tasks ({tasks.length})</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="dashboard">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Revenue</span>
                      </div>
                      <p className="text-2xl font-bold">KES {stats.monthlyRevenue.toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-muted-foreground">Farm Area</span>
                      </div>
                      <p className="text-2xl font-bold">{stats.totalArea} acres</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Package className="h-4 w-4 text-amber-600" />
                        <span className="text-sm text-muted-foreground">Products</span>
                      </div>
                      <p className="text-2xl font-bold">{produce.length}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-muted-foreground">Pending Tasks</span>
                      </div>
                      <p className="text-2xl font-bold">{tasks.filter(t => t.status === 'pending').length}</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Recent Tasks */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Upcoming Tasks
                    </CardTitle>
                    <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="h-4 w-4 mr-1" /> Add Task
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Farm Task</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleTaskSubmit} className="space-y-4">
                          <div>
                            <Label>Task Title *</Label>
                            <Input 
                              value={taskForm.title}
                              onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                              placeholder="e.g., Fertilizer application"
                              required
                            />
                          </div>
                          <div>
                            <Label>Crop/Activity</Label>
                            <Input 
                              value={taskForm.crop}
                              onChange={(e) => setTaskForm({...taskForm, crop: e.target.value})}
                              placeholder="e.g., Maize, General"
                              required
                            />
                          </div>
                          <div>
                            <Label>Due Date *</Label>
                            <Input 
                              type="date"
                              value={taskForm.date}
                              onChange={(e) => setTaskForm({...taskForm, date: e.target.value})}
                              required
                            />
                          </div>
                          <div>
                            <Label>Priority</Label>
                            <Select value={taskForm.priority} onValueChange={(v) => setTaskForm({...taskForm, priority: v})}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label>Description</Label>
                            <Textarea 
                              value={taskForm.description}
                              onChange={(e) => setTaskForm({...taskForm, description: e.target.value})}
                              placeholder="Additional details..."
                              rows={2}
                            />
                          </div>
                          <DialogFooter>
                            <Button type="submit">Create Task</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </CardHeader>
                  <CardContent>
                    {tasks.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No tasks yet. Create your first farm task!</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {tasks.slice(0, 5).map((task) => (
                          <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              {task.status === 'completed' ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : task.status === 'in-progress' ? (
                                <Clock className="h-4 w-4 text-amber-600" />
                              ) : (
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                              )}
                              <div>
                                <p className="font-medium">{task.title}</p>
                                <p className="text-sm text-muted-foreground">{task.crop} • {task.date}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                              {task.status !== 'completed' && (
                                <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, 'completed')}>
                                  Complete
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-600" />
                  My Products
                </CardTitle>
                <Dialog open={isProduceDialogOpen} onOpenChange={(open) => {
                  setIsProduceDialogOpen(open);
                  if (!open) {
                    setEditingProduce(null);
                    resetProduceForm();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" /> Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{editingProduce ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleProduceSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Product Name *</Label>
                          <Input 
                            value={produceForm.name}
                            onChange={(e) => setProduceForm({...produceForm, name: e.target.value})}
                            placeholder="e.g., Fresh Tomatoes"
                            required
                          />
                        </div>
                        <div>
                          <Label>Category *</Label>
                          <Select value={produceForm.category} onValueChange={(v) => setProduceForm({...produceForm, category: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Quantity *</Label>
                          <Input 
                            type="number"
                            value={produceForm.quantity}
                            onChange={(e) => setProduceForm({...produceForm, quantity: e.target.value})}
                            placeholder="100"
                            required
                          />
                        </div>
                        <div>
                          <Label>Unit *</Label>
                          <Select value={produceForm.unit} onValueChange={(v) => setProduceForm({...produceForm, unit: v})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="kg">Kilograms</SelectItem>
                              <SelectItem value="crates">Crates</SelectItem>
                              <SelectItem value="pieces">Pieces</SelectItem>
                              <SelectItem value="bags">Bags</SelectItem>
                              <SelectItem value="bunches">Bunches</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>County *</Label>
                          <Select value={produceForm.county} onValueChange={(v) => setProduceForm({...produceForm, county: v})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              {kenyanCounties.map(county => (
                                <SelectItem key={county} value={county}>{county}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Quality Grade</Label>
                          <Select value={produceForm.quality_grade} onValueChange={(v) => setProduceForm({...produceForm, quality_grade: v})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {qualityGrades.map(grade => (
                                <SelectItem key={grade} value={grade}>Grade {grade}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Price per Unit (KES)</Label>
                          <Input 
                            type="number"
                            value={produceForm.price_per_unit}
                            onChange={(e) => setProduceForm({...produceForm, price_per_unit: e.target.value})}
                            placeholder="50"
                          />
                        </div>
                        <div>
                          <Label>Available From</Label>
                          <Input 
                            type="date"
                            value={produceForm.available_from}
                            onChange={(e) => setProduceForm({...produceForm, available_from: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea 
                          value={produceForm.description}
                          onChange={(e) => setProduceForm({...produceForm, description: e.target.value})}
                          placeholder="Describe your product..."
                          rows={2}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          id="is_organic"
                          checked={produceForm.is_organic}
                          onChange={(e) => setProduceForm({...produceForm, is_organic: e.target.checked})}
                          className="rounded"
                        />
                        <Label htmlFor="is_organic" className="cursor-pointer flex items-center gap-1">
                          <Sprout className="h-4 w-4 text-green-600" /> Organic Certified
                        </Label>
                      </div>
                      <DialogFooter>
                        <Button type="submit">{editingProduce ? 'Update' : 'Add Product'}</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {produce.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">No Products Listed</h3>
                    <p className="text-muted-foreground mb-4">Start selling by adding your first product</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {produce.map((item) => (
                      <div key={item.id} className="p-4 border rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                              {item.name}
                              {item.is_organic && <Badge variant="outline" className="text-green-600"><Sprout className="h-3 w-3 mr-1" /> Organic</Badge>}
                            </h3>
                            <p className="text-muted-foreground">{item.category}</p>
                          </div>
                          <Badge className={getQualityColor(item.quality_grade)}>Grade {item.quality_grade}</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Quantity</p>
                            <p className="font-medium">{item.quantity} {item.unit}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Location</p>
                            <p className="font-medium">{item.county}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Price</p>
                            <p className="font-medium">{item.price_per_unit ? `KES ${item.price_per_unit}/${item.unit}` : 'Negotiable'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <Badge variant={item.status === 'available' ? 'default' : 'secondary'}>{item.status}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleEditProduce(item)}>
                            <Edit className="h-4 w-4 mr-1" /> Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="destructive">
                                <Trash className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will remove "{item.name}" from your listings permanently.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduce(item.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>All Farm Tasks</CardTitle>
                <Dialog open={isTaskDialogOpen} onOpenChange={setIsTaskDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="h-4 w-4 mr-1" /> Add Task
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Farm Task</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleTaskSubmit} className="space-y-4">
                      <div>
                        <Label>Task Title *</Label>
                        <Input 
                          value={taskForm.title}
                          onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label>Crop/Activity</Label>
                        <Input 
                          value={taskForm.crop}
                          onChange={(e) => setTaskForm({...taskForm, crop: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label>Due Date *</Label>
                        <Input 
                          type="date"
                          value={taskForm.date}
                          onChange={(e) => setTaskForm({...taskForm, date: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label>Priority</Label>
                        <Select value={taskForm.priority} onValueChange={(v) => setTaskForm({...taskForm, priority: v})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Low</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="high">High</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Create Task</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Calendar className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p>No tasks scheduled yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {task.status === 'completed' ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <Clock className="h-5 w-5 text-amber-600" />
                          )}
                          <div>
                            <p className="font-medium">{task.title}</p>
                            <p className="text-sm text-muted-foreground">{task.crop} • {task.date}</p>
                            {task.description && <p className="text-sm text-muted-foreground mt-1">{task.description}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                          <Badge variant={task.status === 'completed' ? 'default' : 'outline'}>{task.status}</Badge>
                          {task.status !== 'completed' && (
                            <Button size="sm" variant="outline" onClick={() => updateTaskStatus(task.id, 'completed')}>
                              Mark Done
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Products by Category
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categoryData.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Add products to see analytics</p>
                      </div>
                    ) : (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={categoryData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#22c55e" name="Quantity" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Product Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {categoryData.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>Add products to see distribution</p>
                      </div>
                    ) : (
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                              {categoryData.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{produce.length}</p>
                      <p className="text-sm text-muted-foreground">Total Products</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{produce.filter(p => p.status === 'available').length}</p>
                      <p className="text-sm text-muted-foreground">Available</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-amber-600">{produce.filter(p => p.is_organic).length}</p>
                      <p className="text-sm text-muted-foreground">Organic</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{new Set(produce.map(p => p.county)).size}</p>
                      <p className="text-sm text-muted-foreground">Counties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <MobileNavigation />
    </div>
  );
};

export default FarmerPortal;
