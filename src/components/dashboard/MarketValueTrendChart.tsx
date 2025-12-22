import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { AssetCategory } from "@/types";

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

const CATEGORY_INFO: Record<AssetCategory, { name: string; nameZh: string; color: string }> = {
  crypto: { name: 'Cryptocurrency', nameZh: '加密货币', color: '#f59e0b' },
  tokenised_mmf: { name: 'Tokenised MMF', nameZh: '代币化货币基金', color: '#3b82f6' },
  tokenised_gold: { name: 'Tokenised Gold', nameZh: '代币化黄金', color: '#eab308' },
  stablecoin: { name: 'Stablecoin', nameZh: '稳定币', color: '#10b981' },
};

// Generate mock historical market value data for each category
const generateMarketValueHistory = (currentValue: number, category: AssetCategory) => {
  const days = 30;
  const data = [];
  
  // Volatility based on category
  const volatilityMap: Record<AssetCategory, number> = {
    crypto: 0.05,
    tokenised_gold: 0.02,
    tokenised_mmf: 0.005,
    stablecoin: 0.001,
  };
  
  const volatility = volatilityMap[category];
  let value = currentValue * (0.8 + Math.random() * 0.15); // Start 80-95% of current

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const change = (Math.random() - 0.4) * volatility * value;
    value = Math.max(value + change, 0);
    
    data.push({
      date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      value: parseFloat(value.toFixed(2)),
    });
  }

  // Ensure last value matches current
  if (data.length > 0) {
    data[data.length - 1].value = currentValue;
  }

  return data;
};

export const MarketValueTrendChart = ({ assets }: MarketValueTrendChartProps) => {
  const { language } = useLanguage();

  const chartData = useMemo(() => {
    if (assets.length === 0) return { data: [], categories: [] };

    // Calculate current market value by category
    const categoryValues = assets.reduce((acc, asset) => {
      acc[asset.category] = (acc[asset.category] || 0) + asset.value;
      return acc;
    }, {} as Record<AssetCategory, number>);

    const activeCategories = (Object.keys(categoryValues) as AssetCategory[])
      .filter(cat => categoryValues[cat] > 0);

    if (activeCategories.length === 0) return { data: [], categories: [] };

    // Generate history for each category
    const categoryHistories = activeCategories.map(category => ({
      category,
      history: generateMarketValueHistory(categoryValues[category], category),
    }));

    // Merge into single dataset
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

  if (assets.length === 0 || chartData.data.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-6">
      <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        {language === 'zh' ? '市值走势 (30天)' : 'Market Value Trends (30 Days)'}
      </h2>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {chartData.categories.map((category) => (
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
          <AreaChart data={chartData.data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              {chartData.categories.map((category) => (
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
            {chartData.categories.map((category) => (
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
    </div>
  );
};
