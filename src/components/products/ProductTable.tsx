import { useState, useMemo } from "react";
import { mockProducts } from "@/data/mockProducts";
import { useAppStore } from "@/store/useAppStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, Star, ChevronUp, ChevronDown, ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/hooks/useLanguage";

type SortField = 'marketCap' | 'apy7d' | 'managementFee' | 'subscriptionFee' | 'redemptionFee' | 'revenueShare' | 'name';
type SortDirection = 'asc' | 'desc';

export const ProductTable = () => {
  const { selectedProductId, setSelectedProductId, favorites, toggleFavorite, isFavorite } = useAppStore();
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>('apy7d');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const parseMarketCap = (cap: string | undefined): number => {
    if (!cap) return 0;
    const num = parseFloat(cap.replace(/[^0-9.]/g, ''));
    if (cap.includes('B')) return num * 1000000000;
    if (cap.includes('M')) return num * 1000000;
    return num;
  };

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.tokenName.toLowerCase().includes(searchLower) ||
          p.platforms.some((pl) => pl.toLowerCase().includes(searchLower))
      );
    }

    if (showFavoritesOnly) {
      products = products.filter((p) => favorites.includes(p.id));
    }

    products.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'marketCap':
          comparison = parseMarketCap(a.totalMarketCap) - parseMarketCap(b.totalMarketCap);
          break;
        case 'apy7d':
          comparison = a.apy7d - b.apy7d;
          break;
        case 'managementFee':
          comparison = a.managementFee - b.managementFee;
          break;
        case 'subscriptionFee':
          comparison = a.subscriptionFee - b.subscriptionFee;
          break;
        case 'redemptionFee':
          comparison = a.redemptionFee - b.redemptionFee;
          break;
        case 'revenueShare':
          comparison = a.revenueShare - b.revenueShare;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });

    return products;
  }, [search, sortField, sortDirection, showFavoritesOnly, favorites]);

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th 
      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === 'desc' ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />
        )}
      </div>
    </th>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">{t('productLibrary')}</h1>
          <p className="text-muted-foreground">
            发现并对比最优质的稳定币收益产品
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={showFavoritesOnly ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="gap-2"
          >
            <Star className="w-4 h-4" />
            {t('favorites')} ({favorites.length})
          </Button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t('searchProducts')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat-card">
          <span className="text-xs text-muted-foreground">产品总数</span>
          <span className="font-display font-bold text-2xl">{mockProducts.length}</span>
        </div>
        <div className="stat-card">
          <span className="text-xs text-muted-foreground">最高年化</span>
          <span className="font-display font-bold text-2xl text-primary">
            {Math.max(...mockProducts.map((p) => p.apy7d)).toFixed(2)}%
          </span>
        </div>
        <div className="stat-card">
          <span className="text-xs text-muted-foreground">平均年化</span>
          <span className="font-display font-bold text-2xl">
            {(mockProducts.reduce((acc, p) => acc + p.apy7d, 0) / mockProducts.length).toFixed(2)}%
          </span>
        </div>
        <div className="stat-card">
          <span className="text-xs text-muted-foreground">支持链数</span>
          <span className="font-display font-bold text-2xl">
            {new Set(mockProducts.flatMap((p) => p.chains)).size}
          </span>
        </div>
      </div>

      {/* Product Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/30 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">
                  收藏
                </th>
                <SortHeader field="name">产品名称</SortHeader>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  代币
                </th>
                <SortHeader field="marketCap">{t('marketCap')}</SortHeader>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  平台
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  支持链
                </th>
                <SortHeader field="apy7d">{t('sevenDayApy')}</SortHeader>
                <SortHeader field="managementFee">{t('managementFee')}</SortHeader>
                <SortHeader field="subscriptionFee">{t('subscriptionFee')}</SortHeader>
                <SortHeader field="redemptionFee">{t('redemptionFee')}</SortHeader>
                <SortHeader field="revenueShare">{t('revenueShare')}</SortHeader>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {filteredProducts.map((product) => (
                <tr 
                  key={product.id} 
                  className="data-table-row cursor-pointer"
                  onClick={() => setSelectedProductId(product.id)}
                >
                  <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => toggleFavorite(product.id)}
                      className="p-1 hover:bg-muted rounded"
                    >
                      <Star 
                        className={cn(
                          "w-4 h-4 transition-colors",
                          isFavorite(product.id) ? "fill-secondary text-secondary" : "text-muted-foreground"
                        )} 
                      />
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="font-medium text-sm max-w-[200px] truncate">{product.name}</div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="chip bg-primary/10 text-primary font-semibold">
                      {product.tokenName}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-display font-semibold">
                    {product.totalMarketCap}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {product.platforms.slice(0, 2).map((platform) => (
                        <span key={platform} className="chip bg-muted text-muted-foreground text-xs">
                          {platform}
                        </span>
                      ))}
                      {product.platforms.length > 2 && (
                        <span className="chip bg-muted text-muted-foreground text-xs">
                          +{product.platforms.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1 max-w-[150px]">
                      {product.chains.slice(0, 2).map((chain) => (
                        <span key={chain} className="chip bg-info/10 text-info text-xs">
                          {chain}
                        </span>
                      ))}
                      {product.chains.length > 2 && (
                        <span className="chip bg-info/10 text-info text-xs">
                          +{product.chains.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="font-display font-bold text-primary">{product.apy7d}%</span>
                  </td>
                  <td className="px-4 py-4 font-display">
                    {product.managementFee}%
                  </td>
                  <td className="px-4 py-4 font-display">
                    {product.subscriptionFee}%
                  </td>
                  <td className="px-4 py-4 font-display">
                    {product.redemptionFee}%
                  </td>
                  <td className="px-4 py-4 font-display">
                    {product.revenueShare}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="p-12 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-display font-semibold text-lg mb-2">未找到产品</h3>
            <p className="text-muted-foreground">
              {showFavoritesOnly ? "您还没有收藏任何产品" : "尝试调整搜索条件"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
