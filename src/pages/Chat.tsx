import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, MessageCircle, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import NavBar from "@/components/NavBar";
import ChatHistory from "@/components/ChatHistory";
import { useChatStore, ChatMessage } from "@/stores/chatStore";

const GEMINI_API_KEY = "AIzaSyDLVpZU80CE4XURZNcUBCbblO0d4uh0JQ4";

const Chat = () => {
  const { 
    messages, 
    sessions, 
    currentSessionId, 
    createSession, 
    addMessage, 
    switchSession, 
    deleteSession 
  } = useChatStore();
  
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // If there's no current session, create one
  useEffect(() => {
    if (messages.length === 0 && !currentSessionId) {
      createSession();
    }
  }, [messages.length, currentSessionId, createSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      content: inputMessage,
      role: "user",
      timestamp: new Date(),
    };

    addMessage(userMessage as ChatMessage);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch(https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}, {
        "method": "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a compassionate AI assistant named Mommy Helper, specialized in supporting new mothers with their babies. Please avoid using any special characters or symbols in your responses. If you need to emphasize text, use clear language instead of formatting. Keep your responses clear, friendly, and easy to read.
Please respond in the same language as: ${inputMessage}`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();

      if (data.candidates && data.candidates[0]?.content?.parts && data.candidates[0].content.parts[0]?.text) {
        let assistantContent = data.candidates[0].content.parts[0].text;
        // Replace *text* with <b>text</b>
        assistantContent = assistantContent.replace(/\\(.?)\\*/g, "<b>$1</b>");
        // Remove standalone * and :
        assistantContent = assistantContent.replace(/\*|:/g, "");

        const assistantMessage = {
          content: assistantContent,
          role: "assistant",
          timestamp: new Date(),
        };
        addMessage(assistantMessage as ChatMessage);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching from Gemini API:", error);
      toast.error("Sorry, I couldn't process your request. Please try again.");

      const errorMessage = {
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        role: "assistant",
        timestamp: new Date(),
      };
      addMessage(errorMessage as ChatMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewChat = () => {
    createSession();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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

        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleNewChat}
            className="flex gap-1"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
          
          <ChatHistory 
            sessions={sessions}
            currentSessionId={currentSessionId}
            onSelectSession={switchSession}
            onDeleteSession={deleteSession}
            onNewChat={handleNewChat}
          />
        </div>

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
                  className={mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}}
                >
                  <div
                    className={flex max-w-[80%] rounded-lg px-4 py-2 ${message.role === "user" ? "bg-baby-purple text-white" : "bg-muted"}}
                  >
                    <div className="mr-2 mt-1">
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: message.content }}></div>
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
<div className="h-2 w-2 rounded-full bg-baby-purple animate-bounce delay-100" />
                      <div className="h-2 w-2 rounded-full bg-baby-purple animate-bounce delay-200" />
                      <div className="h-2 w-2 rounded-full bg-baby-purple animate-bounce delay-300" />
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
