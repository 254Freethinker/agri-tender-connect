import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, AlertTriangle, Building2, Flag } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reports, setReports] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [warnings, setWarnings] = useState<any[]>([]);

  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  async function checkAdminStatus() {
    if (!user) {
      navigate('/auth');
      return;
    }

    try {
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id);

      const hasAdminRole = roles?.some(r => r.role === 'admin');
      setIsAdmin(hasAdminRole || false);

      if (!hasAdminRole) {
        toast({
          title: 'Access Denied',
          description: 'You do not have admin privileges',
          variant: 'destructive'
        });
        navigate('/');
        return;
      }

      fetchData();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchData() {
    try {
      const [reportsRes, orgsRes, warningsRes] = await Promise.all([
        supabase.from('post_reports').select('*, community_posts(title)').eq('status', 'pending'),
        supabase.from('organizations').select('*').eq('verification_status', 'pending'),
        supabase.from('farmer_protection_warnings').select('*').order('created_at', { ascending: false })
      ]);

      setReports(reportsRes.data || []);
      setOrganizations(orgsRes.data || []);
      setWarnings(warningsRes.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async function handleVerifyOrganization(id: string, status: 'verified' | 'rejected') {
    try {
      const { error } = await supabase
        .from('organizations')
        .update({ verification_status: status })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Organization ${status}`
      });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Failed to update organization',
        variant: 'destructive'
      });
    }
  }

  async function handleReport(id: string, action: 'approved' | 'dismissed') {
    try {
      const { error } = await supabase
        .from('post_reports')
        .update({ status: action })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Report ${action}`
      });
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto py-12 text-center">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            Admin Panel
          </h1>
          <p className="text-muted-foreground">Manage reports, verify organizations, and moderate content</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Flag className="h-4 w-4" />
                Pending Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reports.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Pending Verifications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{organizations.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Active Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{warnings.filter(w => w.status === 'active').length}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="w-full">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="reports">Post Reports</TabsTrigger>
            <TabsTrigger value="organizations">Organizations</TabsTrigger>
            <TabsTrigger value="warnings">Farmer Warnings</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-4">
            {reports.length > 0 ? reports.map(report => (
              <Card key={report.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{report.community_posts?.title || 'Post'}</span>
                    <Badge variant="outline">{report.report_type}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={() => handleReport(report.id, 'approved')}>
                      Remove Post
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleReport(report.id, 'dismissed')}>
                      Dismiss
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card><CardContent className="text-center py-12">No pending reports</CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="organizations" className="space-y-4">
            {organizations.length > 0 ? organizations.map(org => (
              <Card key={org.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{org.org_name}</span>
                    <Badge>{org.org_type}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm mb-4">
                    <p><strong>Registration:</strong> {org.registration_number}</p>
                    <p><strong>Contact:</strong> {org.contact_person} - {org.contact_phone}</p>
                    <p><strong>County:</strong> {org.county}</p>
                    {org.description && <p><strong>Description:</strong> {org.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleVerifyOrganization(org.id, 'verified')}>
                      Verify Organization
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleVerifyOrganization(org.id, 'rejected')}>
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card><CardContent className="text-center py-12">No pending verifications</CardContent></Card>
            )}
          </TabsContent>

          <TabsContent value="warnings" className="space-y-4">
            {warnings.map(warning => (
              <Card key={warning.id}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>{warning.title}</span>
                    <Badge variant={warning.severity === 'critical' ? 'destructive' : 'default'}>
                      {warning.severity}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">{warning.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{warning.warning_type}</Badge>
                    <Badge variant="secondary">{warning.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminPanel;
