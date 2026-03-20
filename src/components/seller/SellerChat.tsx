import { useState } from 'react';
import { Send, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSeller } from '@/contexts/SellerContext';

const SellerChat = () => {
  const { chatConversations, chatMessages, sendMessage, markMessagesAsRead } = useSeller();
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');

  const mockConversations = chatConversations.length > 0 ? chatConversations : [
    { customerId: 'c1', customerName: 'Nguyễn Văn A', lastMessage: 'Cây này có ship đến Quận 7 không ạ?', lastMessageAt: new Date().toISOString(), unreadCount: 1 },
    { customerId: 'c2', customerName: 'Trần Thị B', lastMessage: 'Cảm ơn shop nhé!', lastMessageAt: new Date().toISOString(), unreadCount: 0 },
  ];

  const handleSend = () => {
    if (!messageText.trim() || !selectedCustomer) return;
    const customer = mockConversations.find(c => c.customerId === selectedCustomer);
    sendMessage(selectedCustomer, customer?.customerName || 'Khách hàng', messageText);
    setMessageText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Chat</h1>
        <p className="text-muted-foreground">Nhắn tin với khách hàng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[600px]">
        {/* Conversations List */}
        <Card className="md:col-span-1">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm..." className="pl-10" />
            </div>
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {mockConversations.map((conv) => (
                  <button
                    key={conv.customerId}
                    onClick={() => {
                      setSelectedCustomer(conv.customerId);
                      markMessagesAsRead(conv.customerId);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedCustomer === conv.customerId ? 'bg-primary/10' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>{conv.customerName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{conv.customerName}</p>
                        <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-destructive text-destructive-foreground text-xs flex items-center justify-center">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2">
          <CardContent className="p-4 h-full flex flex-col">
            {selectedCustomer ? (
              <>
                <ScrollArea className="flex-1 mb-4">
                  <div className="space-y-4 p-4">
                    <div className="text-center text-sm text-muted-foreground">Bắt đầu cuộc trò chuyện</div>
                  </div>
                </ScrollArea>
                <div className="flex gap-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  />
                  <Button onClick={handleSend}>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                Chọn một cuộc trò chuyện để bắt đầu
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SellerChat;
