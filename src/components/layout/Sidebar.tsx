import { cn } from "@/lib/utils";
import { useAppStore } from "@/store/useAppStore";
import { LayoutDashboard, Star, Wallet, Database, MessageCircle } from "lucide-react";

const navItems = [
  { id: 'home', label: '产品知识库', icon: Database },
  { id: 'assistant', label: '开户助手', icon: Star },
  { id: 'dashboard', label: '资产看板', icon: Wallet },
] as const;

export const Sidebar = () => {
  const { currentPage, setCurrentPage, favorites } = useAppStore();

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-card border-r border-border flex flex-col z-40">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg">StableFi</h1>
            <p className="text-xs text-muted-foreground">机构投资平台</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id as typeof currentPage)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                isActive 
                  ? "bg-primary/10 text-primary border border-primary/20" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {item.id === 'assistant' && favorites.length > 0 && (
                <span className="ml-auto bg-secondary text-secondary-foreground text-xs px-2 py-0.5 rounded-full">
                  {favorites.length}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <div className="glass-card p-4 rounded-lg">
          <p className="text-xs text-muted-foreground mb-2">需要帮助？</p>
          <p className="text-sm text-foreground">联系专属顾问获取定制化投资方案</p>
        </div>
      </div>
    </aside>
  );
};
