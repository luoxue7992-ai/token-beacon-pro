import { useMemo, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
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

type TimeRange = '30' | '60' | '90' | '180' | '365';

// Color palette for individual assets
const ASSET_COLORS = [
  '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316',
  '#6366f1', '#14b8a6', '#f43f5e', '#a855f7', '#22c55e',
];

const TOTAL_COLOR = 'hsl(var(--primary))';

// Generate mock historical market value data
const generateMarketValueHistory = (currentValue: number, volatility: number, days: number, seed: number = 0) => {
  const data = [];
  
  let value = currentValue * (0.7 + (Math.sin(seed) * 0.5 + 0.5) * 0.2);

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const randomFactor = Math.sin(seed + i * 0.3) * 0.5 + 0.5;
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
  const [timeRange, setTimeRange] = useState<TimeRange>('30');

  const days = parseInt(timeRange);

  // Combined chart data with total and all assets
  const chartData = useMemo(() => {
    if (assets.length === 0) return { data: [], assetList: [] };

    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    // Generate total history
    const totalHistory = generateMarketValueHistory(totalValue, 0.03, days, 1);
    
    // Generate individual asset histories
    const assetHistories = assets.map((asset, idx) => ({
      token: asset.token,
      color: ASSET_COLORS[idx % ASSET_COLORS.length],
      history: generateMarketValueHistory(asset.value, getVolatility(asset.category), days, idx * 7),
    }));

    const dataLength = days + 1;
    const mergedData = [];
    
    for (let i = 0; i < dataLength; i++) {
      const dataPoint: Record<string, string | number> = {
        date: totalHistory[i]?.date || '',
        total: totalHistory[i]?.value || 0,
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
  }, [assets, days]);

  if (assets.length === 0) {
    return null;
  }

  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  return (
    <div className="glass-card p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="font-display font-semibold text-lg flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          {language === 'zh' ? '市值走势' : 'Market Value Trends'}
        </h2>
        
        <Tabs value={timeRange} onValueChange={(v) => setTimeRange(v as TimeRange)}>
          <TabsList className="h-8">
            <TabsTrigger value="30" className="text-xs px-3 h-6">
              {language === 'zh' ? '30天' : '30D'}
            </TabsTrigger>
            <TabsTrigger value="60" className="text-xs px-3 h-6">
              {language === 'zh' ? '60天' : '60D'}
            </TabsTrigger>
            <TabsTrigger value="90" className="text-xs px-3 h-6">
              {language === 'zh' ? '90天' : '90D'}
            </TabsTrigger>
            <TabsTrigger value="180" className="text-xs px-3 h-6">
              {language === 'zh' ? '180天' : '180D'}
            </TabsTrigger>
            <TabsTrigger value="365" className="text-xs px-3 h-6">
              {language === 'zh' ? '365天' : '365D'}
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span>{language === 'zh' ? '钱包总市值' : 'Total Wallet Value'}</span>
          <span className="text-primary font-semibold">
            ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        {chartData.assetList.map((asset) => (
          <div key={asset.token} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: asset.color }}
            />
            <span>{asset.token}</span>
          </div>
        ))}
      </div>

      {/* Combined Chart */}
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData.data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
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
                name === 'total' ? (language === 'zh' ? '钱包总市值' : 'Total Wallet Value') : name
              ]}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            {/* Total line - thicker and prominent */}
            <Line
              type="monotone"
              dataKey="total"
              stroke={TOTAL_COLOR}
              strokeWidth={3}
              dot={false}
              activeDot={{ r: 5, strokeWidth: 0 }}
            />
            {/* Individual asset lines */}
            {chartData.assetList.map((asset) => (
              <Line
                key={asset.token}
                type="monotone"
                dataKey={asset.token}
                stroke={asset.color}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
