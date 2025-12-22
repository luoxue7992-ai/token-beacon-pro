import { useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { AssetCategory } from "@/types";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Asset {
  token: string;
  value: number;
  balance: number;
  price: number;
  category: AssetCategory;
}

interface MarketValueTrendChartProps {
  assets: Asset[];
}

type ViewMode = 'category' | 'total' | 'asset';

const CATEGORY_INFO: Record<AssetCategory, { name: string; nameZh: string; color: string }> = {
  crypto: { name: 'Cryptocurrency', nameZh: '加密货币', color: '#f59e0b' },
  tokenised_mmf: { name: 'Tokenised MMF', nameZh: '代币化货币基金', color: '#3b82f6' },
  tokenised_gold: { name: 'Tokenised Gold', nameZh: '代币化黄金', color: '#eab308' },
  stablecoin: { name: 'Stablecoin', nameZh: '稳定币', color: '#10b981' },
};

// Color palette for individual assets
const ASSET_COLORS = [
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
  '#6366f1', '#14b8a6', '#f43f5e', '#a855f7', '#22c55e',
];

// Generate mock historical market value data
const generateMarketValueHistory = (currentValue: number, volatility: number, seed: number = 0) => {
  const days = 30;
  const data = [];
  
  let value = currentValue * (0.8 + (Math.sin(seed) * 0.5 + 0.5) * 0.15);

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const randomFactor = Math.sin(seed + i * 0.5) * 0.5 + 0.5;
    const change = (randomFactor - 0.4) * volatility * value;
    value = Math.max(value + change, 0);
    
    data.push({
      date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      value: parseFloat(value.toFixed(2)),
    });
  }

  if (data.length > 0) {
    data[data.length - 1].value = currentValue;
  }

  return data;
};

const getVolatility = (category: AssetCategory): number => {
  const volatilityMap: Record<AssetCategory, number> = {
    crypto: 0.05,
    tokenised_gold: 0.02,
    tokenised_mmf: 0.005,
    stablecoin: 0.001,
  };
  return volatilityMap[category];
};

export const MarketValueTrendChart = ({ assets }: MarketValueTrendChartProps) => {
  const { language } = useLanguage();
  const [viewMode, setViewMode] = useState<ViewMode>('total');

  // Total market value chart data
  const totalChartData = useMemo(() => {
    if (assets.length === 0) return [];

    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    const history = generateMarketValueHistory(totalValue, 0.03, 1);
    
    return history.map(item => ({
      date: item.date,
      total: item.value,
    }));
  }, [assets]);

  // Category chart data
  const categoryChartData = useMemo(() => {
    if (assets.length === 0) return { data: [], categories: [] };

    const categoryValues = assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + asset.value;
      return acc;
    }, {} as Record<AssetCategory, number>);

    const activeCategories = (Object.keys(categoryValues) as AssetCategory[])
      .filter(cat => categoryValues[cat] > 0);

    if (activeCategories.length === 0) return { data: [], categories: [] };

    const categoryHistories = activeCategories.map((category, idx) => ({
      category,
      history: generateMarketValueHistory(categoryValues[category], getVolatility(category), idx * 10),
    }));

    const days = 31;
    const mergedData = [];
    
    for (let i = 0; i < days; i++) {
      const dataPoint: Record<string, string | number> = {
        date: categoryHistories[0]?.history[i]?.date || '',
      };
      
      categoryHistories.forEach(({ category, history }) => {
        if (history[i]) {
          dataPoint[category] = history[i].value;
        }
      });
      
      mergedData.push(dataPoint);
    }

    return { data: mergedData, categories: activeCategories };
  }, [assets]);

  // Individual asset chart data
  const assetChartData = useMemo(() => {
    if (assets.length === 0) return { data: [], assetList: [] };

    const assetHistories = assets.map((asset, idx) => ({
      token: asset.token,
      color: ASSET_COLORS[idx % ASSET_COLORS.length],
      history: generateMarketValueHistory(asset.value, getVolatility(asset.category), idx * 7),
    }));

    const days = 31;
    const mergedData = [];
    
    for (let i = 0; i < days; i++) {
      const dataPoint: Record<string, string | number> = {
        date: assetHistories[0]?.history[i]?.date || '',
      };
      
      assetHistories.forEach(({ token, history }) => {
        if (history[i]) {
          dataPoint[token] = history[i].value;
        }
      });
      
      mergedData.push(dataPoint);
    }

    return { 
      data: mergedData, 
      assetList: assetHistories.map(a => ({ token: a.token, color: a.color }))
    };
  }, [assets]);

  if (assets.length === 0) {
    return null;
  }

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {language === 'zh' ? '市值走势 (30天)' : 'Market Value Trends (30 Days)'}
        </h2>
        
        <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as ViewMode)}>
          <TabsList className="h-8">
            <TabsTrigger value="total" className="text-xs px-3 h-6">
              {language === 'zh' ? '总市值' : 'Total'}
            </TabsTrigger>
            <TabsTrigger value="category" className="text-xs px-3 h-6">
              {language === 'zh' ? '按类别' : 'By Category'}
            </TabsTrigger>
            <TabsTrigger value="asset" className="text-xs px-3 h-6">
              {language === 'zh' ? '按资产' : 'By Asset'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Total Value View */}
      {viewMode === 'total' && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-sm text-muted-foreground">
              {language === 'zh' ? '钱包总市值' : 'Total Wallet Value'}:
            </span>
            <span className="font-semibold text-primary">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={totalChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="gradient-total" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number) => [
                    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    language === 'zh' ? '总市值' : 'Total Value'
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#gradient-total)"
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Category View */}
      {viewMode === 'category' && (
        <>
          <div className="flex flex-wrap gap-4 mb-4">
            {categoryChartData.categories.map((category) => (
              <div key={category} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: CATEGORY_INFO[category].color }}
                />
                <span>{language === 'zh' ? CATEGORY_INFO[category].nameZh : CATEGORY_INFO[category].name}</span>
              </div>
            ))}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={categoryChartData.data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  {categoryChartData.categories.map((category) => (
                    <linearGradient key={category} id={`gradient-${category}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={CATEGORY_INFO[category].color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={CATEGORY_INFO[category].color} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    language === 'zh' ? CATEGORY_INFO[name as AssetCategory]?.nameZh : CATEGORY_INFO[name as AssetCategory]?.name
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                {categoryChartData.categories.map((category) => (
                  <Area
                    key={category}
                    type="monotone"
                    dataKey={category}
                    stroke={CATEGORY_INFO[category].color}
                    strokeWidth={2}
                    fill={`url(#gradient-${category})`}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {/* Asset View */}
      {viewMode === 'asset' && (
        <>
          <div className="flex flex-wrap gap-3 mb-4">
            {assetChartData.assetList.map((asset) => (
              <div key={asset.token} className="flex items-center gap-2 text-sm">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: asset.color }}
                />
                <span>{asset.token}</span>
              </div>
            ))}
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={assetChartData.data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  width={70}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    name
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                {assetChartData.assetList.map((asset) => (
                  <Line
                    key={asset.token}
                    type="monotone"
                    dataKey={asset.token}
                    stroke={asset.color}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 0 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
};