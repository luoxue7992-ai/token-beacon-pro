import { useAppStore } from "@/store/useAppStore";
import { OnboardingForm } from "@/components/onboarding/OnboardingForm";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ProductList } from "@/components/products/ProductList";
import { AccountAssistant } from "@/components/assistant/AccountAssistant";
import { AssetDashboard } from "@/components/dashboard/AssetDashboard";
import { AIChatbot } from "@/components/chat/AIChatbot";

const Index = () => {
  const { isOnboarded, currentPage } = useAppStore();

  if (!isOnboarded) {
    return <OnboardingForm />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          {currentPage === 'home' && <ProductList />}
          {currentPage === 'assistant' && <AccountAssistant />}
          {currentPage === 'dashboard' && <AssetDashboard />}
        </main>
      </div>
      <AIChatbot />
    </div>
  );
};

export default Index;
