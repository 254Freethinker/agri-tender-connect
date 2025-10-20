import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Leaf, TrendingUp, Users, Calendar, Plus, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CarbonForum: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    post_type: 'discussion',
    tags: ''
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('community_posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            avatar_url
          )
        `)
        .eq('category', 'carbon_credits')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to create a post',
        variant: 'destructive'
      });
      return;
    }

    if (!newPost.title || !newPost.content) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all fields',
        variant: 'destructive'
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('community_posts')
        .insert({
          author_id: user.id,
          title: newPost.title,
          content: newPost.content,
          category: 'carbon_credits',
          post_type: newPost.post_type,
          tags: newPost.tags.split(',').map(t => t.trim()).filter(Boolean)
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your post has been created'
      });

      setNewPost({ title: '', content: '', post_type: 'discussion', tags: '' });
      setShowCreateForm(false);
      fetchPosts();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create post',
        variant: 'destructive'
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center gap-2">
            <Leaf className="h-10 w-10 text-green-600" />
            Carbon Credits & Circular Economy Forum
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            Connect with experts, learn about carbon credits, share success stories, and discover opportunities 
            in sustainable agriculture. Join farmers and organizations working towards a greener future.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Market Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">$15-30</div>
              <p className="text-sm text-muted-foreground">Per ton CO2e in Kenya</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-blue-600" />
                Interested Farmers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">Growing</div>
              <p className="text-sm text-muted-foreground">Join the movement</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="h-5 w-5 text-purple-600" />
                Discussions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{posts.length}</div>
              <p className="text-sm text-muted-foreground">Active conversations</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
          <CardHeader>
            <CardTitle>Why Carbon Credits Matter for Kenyan Farmers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p><strong>💰 Additional Income:</strong> Earn $15-30 per ton of CO2e sequestered through regenerative farming practices</p>
            <p><strong>🌱 Sustainable Practices:</strong> Get paid for conservation agriculture, agroforestry, and organic farming</p>
            <p><strong>📈 Market Access:</strong> Connect with international buyers and carbon credit aggregators</p>
            <p><strong>🎓 Training & Support:</strong> Free training on measurement, reporting, and verification (MRV)</p>
            <p><strong>🤝 Collective Action:</strong> Join farmer groups to access carbon markets more easily</p>
          </CardContent>
        </Card>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Community Posts</h2>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Label>Post Type</Label>
                  <Select value={newPost.post_type} onValueChange={(val) => setNewPost({...newPost, post_type: val})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discussion">Discussion</SelectItem>
                      <SelectItem value="success_story">Success Story</SelectItem>
                      <SelectItem value="opportunity">Opportunity</SelectItem>
                      <SelectItem value="question">Question</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    placeholder="Enter post title"
                  />
                </div>
                <div>
                  <Label>Content</Label>
                  <Textarea
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    placeholder="Share your thoughts, experiences, or questions..."
                    rows={8}
                  />
                </div>
                <div>
                  <Label>Tags (comma separated)</Label>
                  <Input
                    value={newPost.tags}
                    onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                    placeholder="carbon-credits, agroforestry, regenerative"
                  />
                </div>
                <Button onClick={handleCreatePost} className="w-full">
                  Create Post
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">Loading posts...</div>
          ) : posts.length > 0 ? (
            posts.map(post => (
              <Card key={post.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg mb-2">{post.title}</CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{post.profiles?.full_name || 'Anonymous'}</span>
                        <span>•</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <Badge>{post.post_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3">{post.content}</p>
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag: string, idx: number) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Leaf className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">No posts yet. Be the first to start a conversation!</p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default CarbonForum;
