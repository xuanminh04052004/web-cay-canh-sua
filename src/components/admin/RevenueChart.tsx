import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Order } from '@/contexts/AdminContext';
import { formatPrice } from '@/data/plants';

interface RevenueChartProps {
  orders: Order[];
}

const RevenueChart = ({ orders }: RevenueChartProps) => {
  const [period, setPeriod] = useState<'week' | 'month'>('week');

  // Helper to get week number of the year
  const getWeekNumber = (date: Date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Get revenue data by week (last 8 weeks)
  const getWeeklyData = () => {
    const weeklyRevenue: Record<string, number> = {};
    const today = new Date();
    
    // Initialize last 8 weeks
    for (let i = 7; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - (i * 7));
      const weekNum = getWeekNumber(date);
      const year = date.getFullYear();
      const key = `Tuần ${weekNum}`;
      weeklyRevenue[key] = 0;
    }

    // Calculate revenue for completed orders
    orders
      .filter(order => order.status === 'Đã giao')
      .forEach(order => {
        const orderDate = new Date(order.date);
        const weekNum = getWeekNumber(orderDate);
        const key = `Tuần ${weekNum}`;
        if (key in weeklyRevenue) {
          weeklyRevenue[key] += order.total;
        }
      });

    return Object.entries(weeklyRevenue).map(([name, revenue]) => ({
      name,
      revenue,
    }));
  };

  // Get revenue data by month (last 12 months)
  const getMonthlyData = () => {
    const monthNames = ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'];
    const monthlyRevenue: Record<string, number> = {};
    const today = new Date();
    
    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const key = `${monthNames[date.getMonth()]}/${date.getFullYear()}`;
      monthlyRevenue[key] = 0;
    }

    // Calculate revenue for completed orders
    orders
      .filter(order => order.status === 'Đã giao')
      .forEach(order => {
        const orderDate = new Date(order.date);
        const key = `${monthNames[orderDate.getMonth()]}/${orderDate.getFullYear()}`;
        if (key in monthlyRevenue) {
          monthlyRevenue[key] += order.total;
        }
      });

    return Object.entries(monthlyRevenue).map(([name, revenue]) => ({
      name,
      revenue,
    }));
  };

  const weeklyData = getWeeklyData();
  const monthlyData = getMonthlyData();

  const totalWeeklyRevenue = weeklyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalMonthlyRevenue = monthlyData.reduce((sum, item) => sum + item.revenue, 0);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card p-3 rounded-lg shadow-lg border border-border">
          <p className="text-sm font-medium text-foreground">{label}</p>
          <p className="text-sm text-primary font-semibold">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Biểu đồ doanh thu</CardTitle>
            <CardDescription>Theo dõi doanh thu cửa hàng theo thời gian</CardDescription>
          </div>
          <Tabs value={period} onValueChange={(v) => setPeriod(v as 'week' | 'month')}>
            <TabsList>
              <TabsTrigger value="week">Theo tuần</TabsTrigger>
              <TabsTrigger value="month">Theo tháng</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">
            Tổng doanh thu {period === 'week' ? '8 tuần' : '12 tháng'} gần đây
          </p>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(period === 'week' ? totalWeeklyRevenue : totalMonthlyRevenue)}
          </p>
        </div>

        <div className="h-[300px]">
          {period === 'week' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="revenue" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <YAxis 
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenueChart;
