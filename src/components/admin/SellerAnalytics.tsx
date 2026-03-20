import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Store,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Award,
  BarChart3,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useSeller } from '@/contexts/SellerContext';
import { formatPrice } from '@/data/plants';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const SellerAnalytics = () => {
  const { allSellers, allSubOrders } = useSeller();

  // Tính thống kê seller trực tiếp từ allSubOrders — luôn khớp với đơn hàng mỗi khi thay đổi
  const sellerStats = useMemo(() => {
    return allSellers
      .filter(s => s.status === 'approved')
      .map(seller => {
        const orders = allSubOrders.filter(o => o.sellerId === seller.id);
        const deliveredOrders = orders.filter(o => o.status === 'delivered');
        const cancelledOrders = orders.filter(o => o.status === 'cancelled');
        const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'confirmed' || o.status === 'shipping');
        
        const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.total, 0);
        const completionRate = orders.length > 0 
          ? Math.round((deliveredOrders.length / orders.length) * 100)
          : 0;

        return {
          id: seller.id,
          shopName: seller.shopName,
          logo: seller.logo,
          totalOrders: orders.length,
          deliveredOrders: deliveredOrders.length,
          cancelledOrders: cancelledOrders.length,
          pendingOrders: pendingOrders.length,
          totalRevenue,
          completionRate,
        };
      })
      .sort((a, b) => b.totalRevenue - a.totalRevenue);
  }, [allSellers, allSubOrders]);

  // Top 5 sellers by revenue
  const topSellers = sellerStats.slice(0, 5);

  // Tổng quan — tính trực tiếp từ allSubOrders, khớp với đơn hàng mỗi khi thay đổi
  const overallStats = useMemo(() => {
    const totalOrders = allSubOrders.length;
    const deliveredOrders = allSubOrders.filter(o => o.status === 'delivered').length;
    const cancelledOrders = allSubOrders.filter(o => o.status === 'cancelled').length;
    const totalRevenue = allSubOrders
      .filter(o => o.status === 'delivered')
      .reduce((sum, o) => sum + o.total, 0);
    const avgCompletionRate = totalOrders > 0
      ? Math.round((deliveredOrders / totalOrders) * 100)
      : sellerStats.length > 0
        ? Math.round(sellerStats.reduce((sum, s) => sum + s.completionRate, 0) / sellerStats.length)
        : 0;

    return {
      totalRevenue,
      totalOrders,
      deliveredOrders,
      cancelledOrders,
      avgCompletionRate,
      activeSellers: sellerStats.length,
    };
  }, [allSubOrders, sellerStats]);

  // Chart data for revenue by seller
  const revenueChartData = topSellers.map(s => ({
    name: s.shopName.length > 10 ? s.shopName.substring(0, 10) + '...' : s.shopName,
    revenue: s.totalRevenue,
  }));

  // Pie chart data for order status
  const orderStatusData = [
    { name: 'Đã giao', value: overallStats.deliveredOrders, color: 'hsl(var(--primary))' },
    { name: 'Đã hủy', value: overallStats.cancelledOrders, color: 'hsl(var(--destructive))' },
    { name: 'Đang xử lý', value: overallStats.totalOrders - overallStats.deliveredOrders - overallStats.cancelledOrders, color: 'hsl(var(--muted-foreground))' },
  ].filter(d => d.value > 0);

  const chartConfig = {
    revenue: { label: 'Doanh thu', color: 'hsl(var(--primary))' },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-display text-3xl text-foreground">Thống kê Seller</h1>
        <p className="text-muted-foreground mt-1">Phân tích doanh thu và hiệu suất của các seller</p>
      </div>

      {/* Overall Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <DollarSign className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{formatPrice(overallStats.totalRevenue)}</p>
                <p className="text-sm text-muted-foreground">Tổng doanh thu</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Store className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{overallStats.activeSellers}</p>
                <p className="text-sm text-muted-foreground">Seller hoạt động</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-green-500/20 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{overallStats.avgCompletionRate}%</p>
                <p className="text-sm text-muted-foreground">Tỷ lệ hoàn thành TB</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 bg-destructive/20 rounded-xl">
                <XCircle className="w-6 h-6 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{overallStats.cancelledOrders}</p>
                <p className="text-sm text-muted-foreground">Đơn đã hủy</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Seller Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Doanh thu theo Seller (Top 5)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {revenueChartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={revenueChartData} layout="vertical">
                    <XAxis type="number" tickFormatter={(v) => formatPrice(v)} />
                    <YAxis type="category" dataKey="name" width={100} />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      formatter={(value) => formatPrice(value as number)}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chưa có dữ liệu doanh thu
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Trạng thái đơn hàng
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orderStatusData.length > 0 ? (
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <ChartTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Chưa có đơn hàng
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Top Sellers Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Top Sellers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topSellers.length > 0 ? (
            <div className="space-y-4">
              {topSellers.map((seller, index) => (
                <motion.div
                  key={seller.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl"
                >
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-amber-700 text-white' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    #{index + 1}
                  </div>

                  {/* Shop Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                      {seller.logo ? (
                        <img src={seller.logo} alt={seller.shopName} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Store className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-foreground truncate">{seller.shopName}</p>
                      <p className="text-sm text-muted-foreground">{seller.totalOrders} đơn hàng</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6">
                    <div className="text-center">
                      <p className="font-semibold text-primary">{formatPrice(seller.totalRevenue)}</p>
                      <p className="text-xs text-muted-foreground">Doanh thu</p>
                    </div>
                    <div className="text-center w-32">
                      <div className="flex items-center gap-2">
                        <Progress value={seller.completionRate} className="h-2 flex-1" />
                        <span className="text-sm font-medium text-foreground">{seller.completionRate}%</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Hoàn thành</p>
                    </div>
                  </div>

                  {/* Order Badges */}
                  <div className="hidden lg:flex items-center gap-2">
                    <Badge variant="default" className="bg-green-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {seller.deliveredOrders}
                    </Badge>
                    {seller.cancelledOrders > 0 && (
                      <Badge variant="destructive">
                        <XCircle className="w-3 h-3 mr-1" />
                        {seller.cancelledOrders}
                      </Badge>
                    )}
                    {seller.pendingOrders > 0 && (
                      <Badge variant="secondary">
                        <Clock className="w-3 h-3 mr-1" />
                        {seller.pendingOrders}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              <Store className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có seller nào được duyệt</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* All Sellers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết tất cả Sellers</CardTitle>
        </CardHeader>
        <CardContent>
          {sellerStats.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Shop</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Doanh thu</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Đơn hàng</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Đã giao</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Đã hủy</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Tỷ lệ hoàn thành</th>
                  </tr>
                </thead>
                <tbody>
                  {sellerStats.map((seller) => (
                    <tr key={seller.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                            {seller.logo ? (
                              <img src={seller.logo} alt={seller.shopName} className="w-full h-full object-cover rounded-lg" />
                            ) : (
                              <Store className="w-4 h-4 text-primary" />
                            )}
                          </div>
                          <span className="font-medium text-foreground">{seller.shopName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-primary">{formatPrice(seller.totalRevenue)}</td>
                      <td className="py-3 px-4 text-right text-foreground">{seller.totalOrders}</td>
                      <td className="py-3 px-4 text-right text-green-600">{seller.deliveredOrders}</td>
                      <td className="py-3 px-4 text-right text-destructive">{seller.cancelledOrders}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Progress value={seller.completionRate} className="h-2 w-20" />
                          <span className="text-sm font-medium text-foreground w-12">{seller.completionRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              Chưa có dữ liệu seller
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SellerAnalytics;
