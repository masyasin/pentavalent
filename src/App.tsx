
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "./contexts/LanguageContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import AppLayout from "./components/AppLayout";
import NewsPage from "./pages/NewsPage";
import NewsDetail from "./pages/NewsDetail";
import CompanyProfile from "./pages/public/about/CompanyProfile";
import VisionMission from "./pages/public/about/VisionMission";
import Management from "./pages/public/about/Management";
import NetworkPartners from "./pages/public/about/NetworkPartners";
import LegalityAchievements from "./pages/public/about/LegalityAchievements";
import BusinessPage from "./pages/public/business/BusinessPage";
import InvestorPage from "./pages/public/investor/InvestorPage";

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
              <Route path="/*" element={<AppLayout />} />
            </Routes>
          </BrowserRouter>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
