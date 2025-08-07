
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Index from './pages/Index';
import GroupInputOrders from './pages/GroupInputOrders';
import InputPricingVerification from './pages/InputPricingVerification';
import ReverseBulkAuctions from './pages/ReverseBulkAuctions';
import F2CSubscriptionBoxes from './pages/F2CSubscriptionBoxes';
import Auth from './pages/Auth';
import About from './pages/About';
import Contact from './pages/Contact';
import Profile from './pages/Profile';
import SearchResultsPage from './pages/SearchResultsPage';
import Logistics from './pages/Logistics';
import ServiceProviders from './pages/ServiceProviders';
import QualityControlDiscussions from './pages/QualityControlDiscussions';
import TrainingEvents from './pages/TrainingEvents';
import MarketLinkages from './pages/MarketLinkages';
import SentimentAnalysis from './pages/SentimentAnalysis';
import SupplyChainProblems from './pages/SupplyChainProblems';
import LogisticsIssues from './pages/supplyChainProblems/LogisticsIssues';
import MarketAccess from './pages/supplyChainProblems/MarketAccess';
import PostHarvestLosses from './pages/supplyChainProblems/PostHarvestLosses';
import PriceVolatility from './pages/supplyChainProblems/PriceVolatility';
import QualityControl from './pages/supplyChainProblems/QualityControl';
import LogisticsSolutionsMap from './pages/LogisticsSolutionsMap';
import MarketDemandHotspot from './pages/MarketDemandHotspot';
import CommodityTrading from './pages/CommodityTrading';
import BarterExchange from './pages/commodityTrading/BarterExchange';
import MarketplaceView from './pages/commodityTrading/MarketplaceView';
import PriceTrends from './pages/commodityTrading/PriceTrends';
import MyTrades from './pages/MyTrades';
import CommunityForums from './pages/CommunityForums';
import FarmerPortal from './pages/FarmerPortal';
import FarmerExporterCollaboration from './pages/FarmerExporterCollaboration';
import ExporterProfile from './pages/ExporterProfile';
import FarmerSuccessStories from './pages/FarmerSuccessStories';
import CommunityForum from './pages/CommunityForum';
const BatchTrackingPage = React.lazy(() => import('./components/BatchTrackingPage').then(module => ({ default: module.BatchTrackingPage })));
const CarbonForumPage = React.lazy(() => import('./components/CarbonForumPage').then(module => ({ default: module.CarbonForumPage })));
const NetworkingPage = React.lazy(() => import('./components/NetworkingPage').then(module => ({ default: module.NetworkingPage })));
import { OfflineBanner } from './components/OfflineBanner';
import TransporterSignUp from './pages/TransporterSignUp';
import ServiceProviderRegistration from './pages/ServiceProviderRegistration';
import KilimoAmsData from './pages/KilimoAmsData';
import ApiDocs from './pages/ApiDocs';
import SupplyChainAPI from './pages/SupplyChainAPI';
import DataManagement from './pages/DataManagement';
import DataStatus from './pages/DataStatus';
import DataJobs from './pages/DataJobs';
import SystemStatus from './pages/SystemStatus';
import FAQPage from './pages/FAQPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
// import DonationListPage from './pages/DonationListPage';
import PartnerWithUs from './pages/PartnerWithUs';
import PartnerDashboard from './pages/PartnerDashboard';
import BusinessMarketing from './pages/BusinessMarketing';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from 'sonner';
import FarmInputMarketplace from './pages/FarmInputMarketplace';
import CityMarkets from './pages/CityMarkets';
import EquipmentMarketplace from './pages/EquipmentMarketplace';
import FoodRescueDashboard from './pages/FoodRescueDashboard';
import ImperfectSurplusDashboard from './pages/ImperfectSurplusDashboard';
import BulkOrderDashboard from './pages/BulkOrderDashboard';
import DonationFormPage from './pages/DonationFormPage';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
         <div className="min-h-screen bg-background font-sans antialiased">
           <OfflineBanner />
           <AuthProvider>
             <React.Suspense fallback={<div>Loading...</div>}>
               <Routes>
                 <Route path="/" element={<Index />} />
                 <Route path="/auth" element={<Auth />} />
                 <Route path="/about" element={<About />} />
                 <Route path="/contact" element={<Contact />} />
                 <Route path="/profile" element={<Profile />} />
                 <Route path="/search" element={<SearchResultsPage />} />
                 <Route path="/logistics" element={<Logistics />} />
                 <Route path="/farm-input-marketplace" element={<FarmInputMarketplace />} />
                 <Route path="/inputs/group-orders" element={<GroupInputOrders />} />
                 <Route path="/inputs/pricing-verification" element={<InputPricingVerification />} />
                 <Route path="/bulk-auctions" element={<ReverseBulkAuctions />} />
                 <Route path="/f2c-subscriptions" element={<F2CSubscriptionBoxes />} />
                 <Route path="/service-providers" element={<ServiceProviders />} />
                 <Route path="/quality-control-discussions" element={<QualityControlDiscussions />} />
                 <Route path="/training-events" element={<TrainingEvents />} />
                 <Route path="/market-linkages" element={<MarketLinkages />} />
                 <Route path="/sentiment-analysis" element={<SentimentAnalysis />} />
                 <Route path="/supply-chain-problems" element={<SupplyChainProblems />} />
                 <Route path="/supply-chain-problems/logistics-issues" element={<LogisticsIssues />} />
                 <Route path="/supply-chain-problems/market-access" element={<MarketAccess />} />
                 <Route path="/supply-chain-problems/post-harvest-losses" element={<PostHarvestLosses />} />
                 <Route path="/supply-chain-problems/price-volatility" element={<PriceVolatility />} />
                 <Route path="/supply-chain-problems/quality-control" element={<QualityControl />} />
                 {/* Strategic Features Tabs */}
                 <Route path="/batch-tracking" element={<BatchTrackingPage farmerId="USER_ID_PLACEHOLDER" />} />
                 <Route path="/carbon-forum" element={<CarbonForumPage userId="USER_ID_PLACEHOLDER" />} />
                 <Route path="/networking" element={<NetworkingPage userId="USER_ID_PLACEHOLDER" />} />
                 <Route path="/logistics-solutions-map" element={<LogisticsSolutionsMap />} />
                 <Route path="/market-demand-hotspot" element={<MarketDemandHotspot />} />
                 <Route path="/commodity-trading" element={<CommodityTrading />} />
                 <Route path="/barter-exchange" element={<BarterExchange />} />
                 <Route path="/marketplace" element={<MarketplaceView />} />
                 <Route path="/price-trends" element={<PriceTrends />} />
                 <Route path="/my-trades" element={<MyTrades />} />
                 <Route path="/community-forums" element={<CommunityForums />} />
                 <Route path="/city-markets" element={<CityMarkets />} />
                 <Route path="/farmer-portal" element={<FarmerPortal />} />
                 <Route path="/equipment-marketplace" element={<EquipmentMarketplace />} />
                 <Route path="/food-rescue-dashboard" element={<FoodRescueDashboard user={{}} />} />
                 <Route path="/imperfect-surplus-dashboard" element={<ImperfectSurplusDashboard />} />
                 <Route path="/bulk-order-dashboard" element={<BulkOrderDashboard user={{}} />} />
                 <Route path="/donation-form" element={<DonationFormPage />} />
                 {/* <Route path="/donation-list" element={<DonationListPage />} /> */}
                 <Route path="/partner-with-us" element={<PartnerWithUs />} />
                 <Route path="/partner-dashboard" element={<PartnerDashboard />} />
                 <Route path="/farmer-exporter-collaboration" element={<FarmerExporterCollaboration />} />
                 <Route path="/exporter-profile" element={<ExporterProfile />} />
                 <Route path="/farmer-success-stories" element={<FarmerSuccessStories />} />
                 <Route path="/community-forum" element={<CommunityForum />} />
                 <Route path="/transporter-signup" element={<TransporterSignUp />} />
                 <Route path="/service-provider-registration" element={<ServiceProviderRegistration />} />
                 <Route path="/kilimo-ams-data" element={<KilimoAmsData />} />
                 <Route path="/api-docs" element={<ApiDocs />} />
                 <Route path="/supply-chain-api" element={<SupplyChainAPI />} />
                 <Route path="/data-management" element={<DataManagement />} />
                 <Route path="/data-status" element={<DataStatus />} />
                 <Route path="/data-jobs" element={<DataJobs />} />
                 <Route path="/system-status" element={<SystemStatus />} />
                 <Route path="/admin" element={<AdminPanel />} />
                 <Route path="/faq" element={<FAQPage />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                  <Route path="/business-marketing" element={<BusinessMarketing />} />
                 <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                 <Route path="*" element={<NotFound />} />
               </Routes>
             </React.Suspense>
             <Toaster />
             <ScrollToTop />
          </AuthProvider>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
