import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface PriceTrendChartProps {
  assets: Array<{
    token: string;
    price: number;
    category: string;
  }>;
}

// Generate mock historical price data
const generatePriceHistory = (currentPrice: number, token: string) => {
  const days = 30;
  const data = [];
  let price = currentPrice * (0.85 + Math.random() * 0.1); // Start 85-95% of current

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Add some volatility
    const volatility = token === 'BTC' || token === 'ETH' ? 0.03 : 0.005;
    const change = (Math.random() - 0.45) * volatility * price;
    price = Math.max(price + change, 0.01);
    
    data.push({
      date: date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      price: parseFloat(price.toFixed(4)),
    });
  }

  // Ensure last price matches current
  if (data.length > 0) {
    data[data.length - 1].price = currentPrice;
  }

  return data;
};

const CHART_COLORS = [
  '#f59e0b', // amber
  '#3b82f6', // blue
  '#10b981', // emerald
  '#8b5cf6', // violet
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#f97316', // orange
  '#84cc16', // lime
];

export const PriceTrendChart = ({ assets }: PriceTrendChartProps) => {
  const { language } = useLanguage();

  const chartData = useMemo(() => {
    if (assets.length === 0) return { data: [], tokens: [] };

    // Get unique tokens (max 4 for readability)
    const uniqueTokens = [...new Set(assets.map(a => a.token))].slice(0, 4);
    
    // Generate price history for each token
    const tokenHistories = uniqueTokens.map(token => {
      const asset = assets.find(a => a.token === token);
      return {
        token,
        history: generatePriceHistory(asset?.price || 1, token),
      };
    });

    // Merge into single dataset
    const days = 31;
    const mergedData = [];
    
    for (let i = 0; i < days; i++) {
      const dataPoint: Record<string, string | number> = {
        date: tokenHistories[0]?.history[i]?.date || '',
      };
      
      tokenHistories.forEach(({ token, history }) => {
        if (history[i]) {
          dataPoint[token] = history[i].price;
        }
      });
      
      mergedData.push(dataPoint);
    }

    return { data: mergedData, tokens: uniqueTokens };
  }, [assets]);

  if (assets.length === 0 || chartData.data.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-6">
      <h2 className="font-display font-semibold text-lg mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-primary" />
        {language === 'zh' ? '价格走势 (30天)' : 'Price Trends (30 Days)'}
      </h2>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4">
        {chartData.tokens?.map((token, index) => (
          <div key={token} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: CHART_COLORS[index % CHART_COLORS.length] }}
            />
            <span>{token}</span>
          </div>
        ))}
      </div>

      <div className="h-64">
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
              width={60}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`, '']}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            {chartData.tokens?.map((token, index) => (
              <Line
                key={token}
                type="monotone"
                dataKey={token}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                strokeWidth={2}
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
