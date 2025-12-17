import { useState, useMemo } from "react";
import { mockProducts } from "@/data/mockProducts";
import { ProductCard } from "./ProductCard";
import { ProductDetail } from "./ProductDetail";
import { useAppStore } from "@/store/useAppStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, TrendingUp, Star, Filter } from "lucide-react";

export const ProductList = () => {
  const { selectedProductId, setSelectedProductId, favorites } = useAppStore();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"apy" | "fee" | "name">("apy");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const selectedProduct = mockProducts.find((p) => p.id === selectedProductId);

  const filteredProducts = useMemo(() => {
    let products = [...mockProducts];

    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.tokenName.toLowerCase().includes(searchLower) ||
          p.platforms.some((pl) => pl.toLowerCase().includes(searchLower))
      );
    }

    // Filter by favorites
    if (showFavoritesOnly) {
      products = products.filter((p) => favorites.includes(p.id));
    }

    // Sort
    switch (sortBy) {
      case "apy":
        products.sort((a, b) => b.apy7d - a.apy7d);
        break;
      case "fee":
        products.sort((a, b) => a.managementFee - b.managementFee);
        break;
      case "name":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [search, sortBy, showFavoritesOnly, favorites]);

  if (selectedProduct) {
    return (
      <ProductDetail
        product={selectedProduct}
        onBack={() => setSelectedProductId(null)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">产品知识库</h1>
          <p className="text-muted-foreground">
            发现并对比最优质的稳定币收益产品
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="搜索产品..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={showFavoritesOnly ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
          className="gap-2"
        >
          <Star className="w-4 h-4" />
          收藏 ({favorites.length})
        </Button>

        <div className="flex items-center gap-2 ml-auto">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          <Select value={sortBy} onValueChange={(v: "apy" | "fee" | "name") => setSortBy(v)}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apy">
                <span className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  收益率排序
                </span>
              </SelectItem>
              <SelectItem value="fee">
                <span className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  费用排序
                </span>
              </SelectItem>
              <SelectItem value="name">名称排序</SelectItem>
            </SelectContent>
          </Select>
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

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => setSelectedProductId(product.id)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-semibold text-lg mb-2">未找到产品</h3>
          <p className="text-muted-foreground">
            {showFavoritesOnly
              ? "您还没有收藏任何产品"
              : "尝试调整搜索条件"}
          </p>
        </div>
      )}
    </div>
  );
};
