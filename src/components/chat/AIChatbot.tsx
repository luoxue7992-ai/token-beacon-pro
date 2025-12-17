import { useState, useRef, useEffect } from "react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot, User, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const quickReplies = [
  "什么是稳定币收益产品？",
  "如何选择合适的产品？",
  "开户需要哪些资料？",
  "年化收益是如何计算的？",
];

export const AIChatbot = () => {
  const { isChatOpen, toggleChat } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "您好！我是 StableFi 智能助手，很高兴为您服务。您可以问我关于稳定币投资产品、开户流程、费用结构等任何问题。",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: content.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const responses: Record<string, string> = {
      "什么是稳定币收益产品？": "稳定币收益产品是一种将稳定币存入特定协议或平台，获取固定或浮动收益的投资方式。这些产品通常通过借贷、质押或其他 DeFi 策略来产生收益，风险相对较低，适合希望获得稳定回报的机构投资者。",
      "如何选择合适的产品？": "选择稳定币产品时，建议考虑以下因素：\n\n1. **年化收益率** - 对比不同产品的收益\n2. **费用结构** - 包括管理费、申购和赎回费\n3. **流动性** - 资金进出的便利程度\n4. **安全性** - 平台背景和审计情况\n5. **合规要求** - 是否满足您机构的合规需求",
      "开户需要哪些资料？": "机构开户通常需要以下资料：\n\n• 公司注册证明\n• 股东/董事身份证明\n• 公司章程\n• 银行开户证明\n• 合格投资者声明\n• 授权代表委托书\n\n具体要求可能因产品而异，建议在开户助手中查看详细清单。",
      "年化收益是如何计算的？": "年化收益率（APY）是将当前收益率按照复利计算推算到一年的预期收益。计算公式为：\n\nAPY = (1 + 日收益率)^365 - 1\n\n需要注意的是，显示的年化收益通常是基于近期数据计算的，实际收益可能会随市场条件变化。",
    };

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: responses[content] || "感谢您的提问！我会尽力为您解答。如果您有关于具体产品的问题，可以直接在产品详情页查看，或联系我们的专属顾问获取更详细的信息。",
    };

    setMessages((prev) => [...prev, aiResponse]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Chat Button */}
      <Button
        onClick={toggleChat}
        className={cn(
          "fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg z-50 transition-all",
          isChatOpen && "scale-0 opacity-0"
        )}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>

      {/* Chat Window */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-96 h-[600px] glass-card flex flex-col z-50 transition-all duration-300 overflow-hidden",
          isChatOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold">StableFi 助手</h3>
              <p className="text-xs text-muted-foreground">在线 · 随时为您服务</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleChat}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  message.role === "assistant"
                    ? "bg-gradient-to-br from-primary to-secondary"
                    : "bg-muted"
                )}
              >
                {message.role === "assistant" ? (
                  <Bot className="w-4 h-4 text-primary-foreground" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-sm whitespace-pre-wrap",
                  message.role === "assistant"
                    ? "bg-muted rounded-tl-sm"
                    : "bg-primary text-primary-foreground rounded-tr-sm"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Replies */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">快捷问题</p>
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleSend(reply)}
                  className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="输入您的问题..."
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};
