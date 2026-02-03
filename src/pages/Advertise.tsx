import React from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Megaphone, ShieldCheck, BarChart3 } from 'lucide-react';

const Advertise: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-10">
        <header className="max-w-3xl">
          <h1 className="text-3xl font-bold tracking-tight">Advertise on SokoConnect</h1>
          <p className="mt-2 text-muted-foreground">
            Reach farmers, traders, and agribusinesses across the supply chain with trusted, measurable placements.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/contact">
              <Button>Contact Sales</Button>
            </Link>
            <Link to="/partner-with-us">
              <Button variant="outline">Partner with Us</Button>
            </Link>
          </div>
        </header>

        <section className="mt-10 grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                <CardTitle className="text-base">Sponsored Visibility</CardTitle>
              </div>
              <CardDescription>Promote your products and services where decisions happen.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Ideal for input suppliers, equipment dealers, logistics providers, and service professionals.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                <CardTitle className="text-base">Performance Reporting</CardTitle>
              </div>
              <CardDescription>Track engagement and optimize your placements.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              We’ll share basic campaign outcomes to help you understand what’s working.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                <CardTitle className="text-base">Trust-First</CardTitle>
              </div>
              <CardDescription>We prioritize safety and relevance for users.</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Ads must be agriculture-relevant and comply with our policies; misleading claims are rejected.
            </CardContent>
          </Card>
        </section>

        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold">What we need from you</h2>
          <ul className="mt-3 list-disc pl-5 text-sm text-muted-foreground space-y-1">
            <li>Business name and what you’re promoting</li>
            <li>Target counties/regions and preferred audience</li>
            <li>Duration and budget range</li>
            <li>Creative assets (logo, banner, copy) or we can help you format them</li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Advertise;
