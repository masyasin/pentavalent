
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense, lazy } from "react";

// Lazy load pages for better performance
const AppLayout = lazy(() => import("./components/AppLayout"));
const NewsPage = lazy(() => import("./pages/NewsPage"));
const NewsDetail = lazy(() => import("./pages/NewsDetail"));
const CompanyProfile = lazy(() => import("./pages/public/about/CompanyProfile"));
const VisionMission = lazy(() => import("./pages/public/about/VisionMission"));
const Management = lazy(() => import("./pages/public/about/Management"));
const NetworkPartners = lazy(() => import("./pages/public/about/NetworkPartners"));
const LegalityAchievements = lazy(() => import("./pages/public/about/LegalityAchievements"));
const BusinessPage = lazy(() => import("./pages/public/business/BusinessPage"));
const InvestorPage = lazy(() => import("./pages/public/investor/InvestorPage"));
const CareerPage = lazy(() => import("./pages/public/career/CareerPage"));
const ContactPage = lazy(() => import("./pages/public/contact/ContactPage"));
const SitemapPage = lazy(() => import("./pages/public/SitemapPage"));
const GlobalTools = lazy(() => import("./components/ui/GlobalTools"));

// Simple Loading Fallback
const PageLoader = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[9999] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <LanguageProvider>
          <BrowserRouter
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true,
            }}
          >
            <Suspense fallback={<PageLoader />}>
              <GlobalTools />
              <Routes>
                <Route path="/news" element={<NewsPage />} />
                <Route path="/news/:slug" element={<NewsDetail />} />
                <Route path="/about/profile" element={<CompanyProfile />} />
                <Route path="/about/vision-mission" element={<VisionMission />} />
                <Route path="/about/management" element={<Management />} />
                <Route path="/about/network-partners" element={<NetworkPartners />} />
                <Route path="/about/legality-achievements" element={<LegalityAchievements />} />
                <Route path="/business/pharmaceuticals" element={<BusinessPage />} />
                <Route path="/business/consumer-goods" element={<BusinessPage />} />
                <Route path="/business/medical-equipment" element={<BusinessPage />} />
                <Route path="/business/strategi-usaha" element={<BusinessPage />} />
                <Route path="/business/distribution-flow" element={<BusinessPage />} />
                <Route path="/business/target-market" element={<BusinessPage />} />
                <Route path="/investor/ringkasan-investor" element={<InvestorPage />} />
                <Route path="/investor/informasi-saham" element={<InvestorPage />} />
                <Route path="/investor/laporan-keuangan" element={<InvestorPage />} />
                <Route path="/investor/prospektus" element={<InvestorPage />} />
                <Route path="/investor/rups" element={<InvestorPage />} />
                <Route path="/investor/keterbukaan-informasi" element={<InvestorPage />} />
                <Route path="/career" element={<CareerPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/sitemap" element={<SitemapPage />} />
                <Route path="/*" element={<AppLayout />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
