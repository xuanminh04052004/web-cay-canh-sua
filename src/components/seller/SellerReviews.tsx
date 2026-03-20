import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, MessageSquare, Send, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useSeller, SellerReview } from '@/contexts/SellerContext';
import { useToast } from '@/hooks/use-toast';

const SellerReviews = () => {
  const { sellerReviews, replyToReview } = useSeller();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Mock reviews if empty
  const displayReviews: SellerReview[] = sellerReviews.length > 0 ? sellerReviews : [
    {
      id: 'review_1',
      sellerId: '',
      productId: 'sp_1',
      orderId: 'order_1',
      customerName: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Cây rất đẹp, đóng gói cẩn thận. Shop giao hàng nhanh. Sẽ ủng hộ tiếp!',
      createdAt: '2024-03-15T10:30:00',
    },
    {
      id: 'review_2',
      sellerId: '',
      productId: 'sp_2',
      orderId: 'order_2',
      customerName: 'Trần Thị B',
      rating: 4,
      comment: 'Cây khỏe mạnh, nhưng giao hơi lâu. Nhìn chung hài lòng.',
      reply: 'Cảm ơn bạn đã đánh giá! Shop sẽ cải thiện tốc độ giao hàng ạ.',
      repliedAt: '2024-03-16T09:00:00',
      createdAt: '2024-03-14T14:20:00',
    },
    {
      id: 'review_3',
      sellerId: '',
      productId: 'sp_1',
      orderId: 'order_3',
      customerName: 'Lê Văn C',
      rating: 5,
      comment: 'Lần thứ 3 mua ở shop rồi, chất lượng luôn tốt!',
      createdAt: '2024-03-13T08:15:00',
    },
  ];

  const filteredReviews = displayReviews.filter(r =>
    r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.comment.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const averageRating = displayReviews.length > 0
    ? displayReviews.reduce((sum, r) => sum + r.rating, 0) / displayReviews.length
    : 0;

  const ratingDistribution = [5, 4, 3, 2, 1].map(rating => ({
    rating,
    count: displayReviews.filter(r => r.rating === rating).length,
    percentage: displayReviews.length > 0
      ? (displayReviews.filter(r => r.rating === rating).length / displayReviews.length) * 100
      : 0,
  }));

  const handleReply = (reviewId: string) => {
    if (!replyText.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập nội dung phản hồi.',
        variant: 'destructive',
      });
      return;
    }

    replyToReview(reviewId, replyText);
    toast({
      title: 'Thành công',
      description: 'Đã gửi phản hồi.',
    });
    setReplyingTo(null);
    setReplyText('');
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Đánh giá</h1>
        <p className="text-muted-foreground">Xem và phản hồi đánh giá từ khách hàng</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-primary">{averageRating.toFixed(1)}</p>
                <div className="mt-1">{renderStars(Math.round(averageRating))}</div>
                <p className="text-sm text-muted-foreground mt-1">{displayReviews.length} đánh giá</p>
              </div>
              <div className="flex-1 space-y-2">
                {ratingDistribution.map(({ rating, count, percentage }) => (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-sm w-8">{rating} ⭐</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-400 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Chưa phản hồi</p>
                <p className="text-3xl font-bold">
                  {displayReviews.filter(r => !r.reply).length}
                </p>
              </div>
              <MessageSquare className="w-12 h-12 text-primary/30" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm đánh giá..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Star className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có đánh giá nào</p>
            </CardContent>
          </Card>
        ) : (
          filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarFallback>{review.customerName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{review.customerName}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-sm text-muted-foreground">
                              {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-foreground">{review.comment}</p>

                      {/* Reply */}
                      {review.reply ? (
                        <div className="mt-4 p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                          <p className="text-sm font-medium text-primary mb-1">Phản hồi của Shop</p>
                          <p className="text-sm">{review.reply}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {review.repliedAt && new Date(review.repliedAt).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      ) : (
                        <div className="mt-4">
                          {replyingTo === review.id ? (
                            <div className="space-y-3">
                              <Textarea
                                placeholder="Nhập phản hồi của bạn..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <Button onClick={() => handleReply(review.id)}>
                                  <Send className="w-4 h-4 mr-2" />
                                  Gửi phản hồi
                                </Button>
                                <Button variant="outline" onClick={() => {
                                  setReplyingTo(null);
                                  setReplyText('');
                                }}>
                                  Hủy
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setReplyingTo(review.id)}
                            >
                              <MessageSquare className="w-4 h-4 mr-2" />
                              Phản hồi
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerReviews;
