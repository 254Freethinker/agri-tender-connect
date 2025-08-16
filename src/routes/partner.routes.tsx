import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Loader2 } from 'lucide-react';

// Lazy load partner components for better performance
const PartnerDashboard = lazy(() => import('@/pages/PartnerDashboard'));
const PartnerWithUs = lazy(() => import('@/pages/PartnerWithUs'));
const PartnerOnboarding = lazy(() => import('@/pages/partner/OnboardingPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Loader2 className="h-8 w-8 animate-spin" />
  </div>
);

const PartnerRoutes = createBrowserRouter([
  {
    path: '/partner/onboarding',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PartnerOnboarding />
      </Suspense>
    ),
  },
  {
    path: '/partner/dashboard',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PartnerDashboard />
      </Suspense>
    ),
  },
  {
    path: '/partner/with-us',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <PartnerWithUs />
      </Suspense>
    ),
  },
]);

export default PartnerRoutes;
