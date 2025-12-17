import { StablecoinProduct } from "@/types";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight, Layers, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: StablecoinProduct;
  onClick: () => void;
}

export const ProductCard = ({ product, onClick }: ProductCardProps) => {
  const { toggleFavorite, isFavorite } = useAppStore();
  const favorite = isFavorite(product.id);

  return (
    <div 
      className="glass-card-hover p-5 cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-primary/10">
            <span className="font-display font-bold text-sm">{product.tokenName}</span>
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.platforms[0]}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "shrink-0 transition-colors",
            favorite ? "text-secondary" : "text-muted-foreground hover:text-secondary"
          )}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
        >
          <Star className={cn("w-5 h-5", favorite && "fill-current")} />
        </Button>
      </div>

      {/* Chains */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {product.chains.slice(0, 3).map((chain) => (
          <span key={chain} className="chip bg-muted text-muted-foreground">
            {chain}
          </span>
        ))}
        {product.chains.length > 3 && (
          <span className="chip bg-muted text-muted-foreground">
            +{product.chains.length - 3}
          </span>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
            <Percent className="w-3 h-3" />
            7日年化
          </div>
          <p className={cn(
            "font-display font-bold text-lg",
            product.apy7d >= 5 ? "text-primary" : "text-foreground"
          )}>
            {product.apy7d.toFixed(2)}%
          </p>
        </div>
        <div className="p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-1">
            <Layers className="w-3 h-3" />
            管理费
          </div>
          <p className="font-display font-bold text-lg text-foreground">
            {product.managementFee.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Fees row */}
      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
        <span>申购费: {product.subscriptionFee}%</span>
        <span>赎回费: {product.redemptionFee}%</span>
        <span>分佣: {product.revenueShare}%</span>
      </div>

      {/* CTA */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">查看详情</span>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};
