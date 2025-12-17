import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { mockProducts } from "@/data/mockProducts";
import { Button } from "@/components/ui/button";
import { 
  Star, ChevronRight, CheckCircle, AlertCircle, 
  FileText, ExternalLink, Building, Shield,
  ArrowRight, ClipboardList
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AssistantStep {
  id: string;
  title: string;
  completed: boolean;
}

export const AccountAssistant = () => {
  const { favorites, setSelectedProductId, setCurrentPage } = useAppStore();
  const [selectedProductForAssistant, setSelectedProductForAssistant] = useState<string | null>(null);
  const [steps, setSteps] = useState<AssistantStep[]>([
    { id: "company", title: "确认公司主体", completed: false },
    { id: "eligibility", title: "核实投资者资质", completed: false },
    { id: "documents", title: "准备提交资料", completed: false },
    { id: "apply", title: "提交开户申请", completed: false },
  ]);

  const favoriteProducts = mockProducts.filter((p) => favorites.includes(p.id));
  const selectedProduct = mockProducts.find((p) => p.id === selectedProductForAssistant);

  const toggleStep = (stepId: string) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s))
    );
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl font-bold mb-1">开户助手</h1>
          <p className="text-muted-foreground">
            管理您的开户申请流程
          </p>
        </div>

        <div className="glass-card p-12 text-center">
          <Star className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-display font-semibold text-xl mb-2">暂无收藏产品</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            您还没有收藏任何稳定币产品。请先在产品知识库中浏览并收藏感兴趣的产品。
          </p>
          <Button onClick={() => setCurrentPage('home')} className="gap-2">
            浏览产品
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold mb-1">开户助手</h1>
        <p className="text-muted-foreground">
          管理您的开户申请流程
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Product Selection */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-display font-semibold flex items-center gap-2">
            <Star className="w-5 h-5 text-secondary" />
            已收藏产品
          </h2>
          
          <div className="space-y-3">
            {favoriteProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => setSelectedProductForAssistant(product.id)}
                className={cn(
                  "glass-card p-4 cursor-pointer transition-all",
                  selectedProductForAssistant === product.id
                    ? "border-primary ring-1 ring-primary"
                    : "hover:border-primary/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <span className="font-display font-bold text-xs">{product.tokenName}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{product.name}</h3>
                    <p className="text-sm text-primary">{product.apy7d}% APY</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Assistant Flow */}
        <div className="lg:col-span-2">
          {selectedProduct ? (
            <div className="space-y-6 animate-fade-in">
              {/* Selected Product Info */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display font-semibold text-lg">
                    {selectedProduct.name} 开户流程
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedProductId(selectedProduct.id);
                      setCurrentPage('home');
                    }}
                    className="text-muted-foreground"
                  >
                    查看详情
                  </Button>
                </div>

                {/* Progress Steps */}
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={step.id}
                      onClick={() => toggleStep(step.id)}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-all",
                        step.completed
                          ? "bg-primary/10 border border-primary/20"
                          : "bg-muted/50 hover:bg-muted"
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                          step.completed
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted-foreground/20 text-muted-foreground"
                        )}
                      >
                        {step.completed ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <span className="font-display font-bold">{index + 1}</span>
                        )}
                      </div>
                      <span className={cn(
                        "font-medium",
                        step.completed && "text-primary"
                      )}>
                        {step.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Details */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Company Requirements */}
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
                    <Building className="w-5 h-5 text-primary" />
                    公司主体限制
                  </h3>
                  <div className="space-y-2">
                    {selectedProduct.regionRestrictions && selectedProduct.regionRestrictions.length > 0 ? (
                      selectedProduct.regionRestrictions.map((region) => (
                        <div key={region} className="flex items-center gap-2 text-sm">
                          <AlertCircle className="w-4 h-4 text-destructive" />
                          <span>不支持 {region} 实体</span>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <CheckCircle className="w-4 h-4" />
                        <span>无地区限制</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Qualification */}
                <div className="glass-card p-6">
                  <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-primary" />
                    投资者资质
                  </h3>
                  <div className="space-y-2">
                    {selectedProduct.companyRequirements?.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-secondary" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Required Documents */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold flex items-center gap-2 mb-4">
                  <ClipboardList className="w-5 h-5 text-primary" />
                  所需资料清单
                </h3>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    "公司注册证明",
                    "股东/董事信息",
                    "公司章程",
                    "银行开户证明",
                    "合格投资者声明",
                    "授权代表证明",
                  ].map((doc) => (
                    <div
                      key={doc}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <FileText className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="glass-card p-6 gradient-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-semibold text-lg mb-1">
                      准备好了？
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      点击下方按钮直达官方开户入口
                    </p>
                  </div>
                  <Button className="gap-2">
                    立即开户
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-12 text-center h-full flex flex-col items-center justify-center">
              <ClipboardList className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="font-display font-semibold text-xl mb-2">选择一个产品</h3>
              <p className="text-muted-foreground">
                从左侧列表中选择一个收藏的产品开始开户流程
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
