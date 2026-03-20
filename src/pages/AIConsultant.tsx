import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Send, Bot, User, Sparkles, Leaf, Sun, Droplets, ThermometerSun } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import bgGuide from "@/assets/bg-guide.jpg";
import { callLLM } from "@/lib/llm-service";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
}

const suggestedQuestions = [
  "Cây nào phù hợp cho phòng ít ánh sáng?",
  "Làm sao để cây Monstera phát triển tốt?",
  "Cây nào lọc không khí tốt nhất?",
  "Tôi nên tưới cây bao lâu một lần?",
];

const AIConsultant = () => {
  const sessionIdRef = useRef<string>(`session_${Date.now()}`);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Xin chào! Tôi là trợ lý AI của Greenie. Tôi có thể giúp bạn chọn cây phù hợp, tư vấn cách chăm sóc, và giải đáp mọi thắc mắc về cây cảnh. Bạn cần hỗ trợ gì hôm nay?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input.trim();
    setInput("");
    setIsTyping(true);

    try {
      // Call Gemini AI through Flask backend
      const aiResponse = await callLLM(
        currentInput,
        sessionIdRef.current,
        { temperature: 0.7, maxTokens: 1000 }
      );

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling chatbot:", error);
      
      // Fallback error message
      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ hotline **0901 234 567** để được hỗ trợ trực tiếp.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <PageLayout
      showHero
      heroImage={bgGuide}
      heroTitle="Tư Vấn AI"
      heroSubtitle="Trợ lý thông minh giúp bạn chọn và chăm sóc cây"
    >
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <div className="glass-card overflow-hidden">
              {/* Chat Header */}
              <div className="bg-primary/10 p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-foreground font-medium">Greenie AI</h3>
                  <p className="text-sm text-primary flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Đang hoạt động
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-[400px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.role === "user" ? "bg-secondary" : "bg-primary"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4 text-secondary-foreground" />
                      ) : (
                        <Bot className="w-4 h-4 text-primary-foreground" />
                      )}
                    </div>
                    <div
                      className={`max-w-[80%] p-4 rounded-2xl ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-br-sm"
                          : "bg-card text-foreground rounded-bl-sm"
                      }`}
                    >
                      <p className="whitespace-pre-line text-sm">{message.content}</p>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="bg-card p-4 rounded-2xl rounded-bl-sm">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                        <span
                          className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        />
                        <span
                          className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Nhập câu hỏi của bạn..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    className="flex-1 bg-card border border-border rounded-full px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                    className="p-3 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>

                {/* Suggested Questions */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestedQuestion(question)}
                      className="px-3 py-1.5 bg-card border border-border rounded-full text-xs text-foreground/80 hover:bg-muted transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Features */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-display text-lg text-foreground">AI có thể giúp</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <Leaf className="w-4 h-4 text-primary mt-0.5" />
                  <span>Đề xuất cây phù hợp với không gian</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <Droplets className="w-4 h-4 text-primary mt-0.5" />
                  <span>Hướng dẫn tưới nước đúng cách</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <Sun className="w-4 h-4 text-primary mt-0.5" />
                  <span>Tư vấn ánh sáng và vị trí đặt</span>
                </li>
                <li className="flex items-start gap-3 text-sm text-foreground/80">
                  <ThermometerSun className="w-4 h-4 text-primary mt-0.5" />
                  <span>Xử lý sâu bệnh và vấn đề thường gặp</span>
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="glass-card p-6">
              <h3 className="text-display text-lg text-foreground mb-4">Mẹo sử dụng AI</h3>
              <ul className="space-y-2 text-sm text-foreground/80">
                <li>• Mô tả chi tiết không gian của bạn</li>
                <li>• Cho biết mức độ kinh nghiệm chăm sóc cây</li>
                <li>• Hỏi về vấn đề cụ thể bạn gặp phải</li>
                <li>• Yêu cầu hướng dẫn từng bước</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AIConsultant;
