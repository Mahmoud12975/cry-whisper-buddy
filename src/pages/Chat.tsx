import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import NavBar from "@/components/NavBar";

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

const GEMINI_API_KEY = "AIzaSyDLVpZU80CE4XURZNcUBCbblO0d4uh0JQ4";

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      content: "Hello! I'm your mommy assistant. I can help with questions about your baby, feeding, sleep, or any concerns you might have as a new mother.",
      role: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "You are a helpful assistant specialized in helping new mothers with their babies. Use emojis, be friendly and supportive. Respond to the following: " + inputMessage
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
        const assistantMessage: Message = {
          content: data.candidates[0].content.parts[0].text,
          role: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      toast.error("Sorry, I couldn't process your request. Please try again.");

      const errorMessage: Message = {
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-baby-blue-light/30 to-baby-purple-light/30">
      <NavBar currentPage="chat" />

      <div className="container mx-auto px-4 py-8 pt-20 max-w-4xl">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MessageCircle className="h-8 w-8 text-baby-purple" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-baby-blue to-baby-purple">
              Mommy Assistant
            </h1>
          </div>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your trusted companion for all your questions as a new mother.
            Ask me anything about baby care, feeding, sleep, or your well-being.
          </p>
        </header>

        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle>Chat with Mommy Assistant</CardTitle>
            <CardDescription>
              Get personalized advice and support for your journey as a new mother
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] overflow-y-auto mb-4 p-4 rounded-md bg-background">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user" ? "bg-baby-purple text-white" : "bg-muted"}`}
                  >
                    <div className="mr-2 mt-1">
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="flex max-w-[80%] rounded-lg px-4 py-2 bg-muted">
                    <div className="mr-2 mt-1">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="flex space-x-1 items-center">
                      <div className="h-2 w-2 rounded-full bg-baby-purple animate-bounce" style={{ animationDelay: "0.1s" }} />
                      <div className="h-2 w-2 rounded-full bg-baby-purple animate-bounce" style={{ animationDelay: "0.2s" }} />
                      <div className="h-2 w-2 rounded-full bg-baby-purple animate-bounce" style={{ animationDelay: "0.3s" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <Separator className="my-4" />

            <div className="flex gap-2">
              <Textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your question here..."
                className="flex-1 resize-none"
                disabled={isLoading}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim() || isLoading}
                className="h-auto"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          <p>
            The Mommy Assistant provides general information and is not a substitute for
            professional medical advice. Always consult with healthcare providers for
            medical concerns about you or your baby.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;
