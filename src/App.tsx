
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import Index from './pages/Index';
import Marketplace from './pages/Marketplace';
import BulkOrders from './pages/BulkOrders';
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
import BarterTrade from './pages/BarterTrade';
import DonationListPage from './pages/DonationListPage';
import AuctionDashboard from './pages/AuctionDashboard';
import MarketplaceView from './pages/commodityTrading/MarketplaceView';
import PriceTrends from './pages/commodityTrading/PriceTrends';
import MyTrades from './pages/MyTrades';
import CommunityForums from './pages/CommunityForums';
import FarmerPortal from './pages/FarmerPortal';
import FarmerExporterCollaboration from './pages/FarmerExporterCollaboration';
import ExporterProfile from './pages/ExporterProfile';
import FarmerSuccessStories from './pages/FarmerSuccessStories';
import CommunityForum from './pages/CommunityForum';
const NetworkingPage = React.lazy(() => import('./components/NetworkingPage').then(module => ({ default: module.NetworkingPage })));
import CarbonForum from './pages/CarbonForum';
import { OfflineBanner } from './components/OfflineBanner';
import TransporterSignUp from './pages/TransporterSignUp';
import ServiceProviderRegistration from './pages/ServiceProviderRegistration';
import KilimoAmsData from './pages/KilimoAmsData';
import ApiDocs from './pages/ApiDocs';
import SupplyChainAPI from './pages/SupplyChainAPI';
import PartnersShowcase from './pages/PartnersShowcase';
import MajorRoutesMarketplace from './pages/MajorRoutesMarketplace';
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
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from 'sonner';
import { BottomNav } from './components/BottomNav';
import FarmInputMarketplace from './pages/FarmInputMarketplace';
import CityMarkets from './pages/CityMarkets';
import EquipmentMarketplace from './pages/EquipmentMarketplace';
import FoodRescueDashboard from './pages/FoodRescueDashboard';
import ImperfectSurplusDashboard from './pages/ImperfectSurplusDashboard';
import BulkOrderDashboard from './pages/BulkOrderDashboard';
import DonationFormPage from './pages/DonationFormPage';
import BuyRequestsPage from './pages/BuyRequestsPage';
import ExportMarketOpportunities from './pages/ExportMarketOpportunities';
import ExportOpportunities from './pages/ExportOpportunities';
import ContractFarming from './pages/ContractFarming';
import RoadMarkets from './pages/RoadMarkets';
import AdminPanel from './pages/AdminPanel';
import NotFound from './pages/NotFound';
import ScrollToTop from './components/ScrollToTop';
import BluetoothMarketplacePage from './pages/BluetoothMarketplacePage';
import MorePage from './pages/MorePage';
import SupplyChainDashboardPage from './pages/SupplyChainDashboardPage';
import MarketplacePage from './pages/MarketplacePage';
import RoadMarketsPage from './pages/RoadMarketsPage';
import CooperativeGroupsPage from './pages/CooperativeGroupsPage';
import FarmTourismPage from './pages/FarmTourismPage';
import WeatherPage from './pages/WeatherPage';
import ContractFarmingPage from './pages/ContractFarmingPage';
import EquipmentMarketplacePage from './pages/EquipmentMarketplacePage';
import F2CMarketplace from './pages/F2CMarketplace';
import BatchTracking from './pages/BatchTracking';
import ApiManagement from './pages/ApiManagement';
import MajorRoutesMapPage from './pages/MajorRoutesMapPage';

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
                  <Route path="/carbon-forum" element={<CarbonForum />} />
                  <Route path="/networking" element={<NetworkingPage userId="USER_ID_PLACEHOLDER" />} />
                 <Route path="/logistics-solutions-map" element={<LogisticsSolutionsMap />} />
                 <Route path="/market-demand-hotspot" element={<MarketDemandHotspot />} />
                 <Route path="/commodity-trading" element={<CommodityTrading />} />
                   <Route path="/barter-exchange" element={<BarterExchange />} />
                   <Route path="/barter-trade" element={<BarterTrade />} />
                   <Route path="/donation-list" element={<DonationListPage />} />
                   <Route path="/auction-dashboard" element={<AuctionDashboard />} />
                   <Route path="/agent-product-auction-dashboard" element={<AuctionDashboard />} />
                   <Route path="/marketplace" element={<MarketplacePage />} />
                   <Route path="/marketplace-old" element={<Marketplace />} />
                    <Route path="/agricultural-marketplace" element={<MarketplaceView />} />
                  <Route path="/bulk-orders" element={<BulkOrders />} />
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
                   <Route path="/buy-requests" element={<BuyRequestsPage />} />
                   <Route path="/export-market-opportunities" element={<ExportMarketOpportunities />} />
                   <Route path="/export-opportunities" element={<ExportOpportunities />} />
                   <Route path="/contract-farming" element={<ContractFarming />} />
                   <Route path="/road-markets" element={<RoadMarketsPage />} />
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
                  <Route path="/terms-of-service" element={<TermsOfServicePage />} />
                   <Route path="/bluetooth-marketplace" element={<BluetoothMarketplacePage />} />
                   <Route path="/more" element={<MorePage />} />
                   <Route path="/supply-chain-dashboard" element={<SupplyChainDashboardPage />} />
                   <Route path="/cooperative-groups" element={<CooperativeGroupsPage />} />
                   <Route path="/farm-tourism" element={<FarmTourismPage />} />
                   <Route path="/weather" element={<WeatherPage />} />
                  <Route path="/contract-farming-page" element={<ContractFarmingPage />} />
                   <Route path="/equipment-marketplace-page" element={<EquipmentMarketplacePage />} />
          <Route path="/partners-showcase" element={<PartnersShowcase />} />
          <Route path="/major-routes" element={<MajorRoutesMarketplace />} />
          <Route path="/major-routes-map" element={<MajorRoutesMapPage />} />
          <Route path="/f2c-marketplace" element={<F2CMarketplace />} />
          <Route path="/batch-tracking" element={<BatchTracking />} />
          <Route path="/api-management" element={<ApiManagement />} />
                   <Route path="*" element={<NotFound />} />
               </Routes>
              </React.Suspense>
              <Toaster />
              <ScrollToTop />
              <BottomNav />
           </AuthProvider>
         </div>
       </ThemeProvider>
     </Router>
   );
 }
 
 export default App;
