import { useAppStore } from "@/store/useAppStore";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { ProductListV2 } from "@/components/products/ProductListV2";
import { AssetDashboardV2 } from "@/components/dashboard/AssetDashboardV2";
import { AIChatbot } from "@/components/chat/AIChatbot";
import { cn } from "@/lib/utils";

const Index = () => {
  const { currentPage, sidebarCollapsed } = useAppStore();

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <Header />
        <main className="p-6">
          {currentPage === 'home' && <ProductListV2 />}
          {currentPage === 'dashboard' && <AssetDashboardV2 />}
        </main>
      </div>
      <AIChatbot />
    </div>
  );
};

export default Index;