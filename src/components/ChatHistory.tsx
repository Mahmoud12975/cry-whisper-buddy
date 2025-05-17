
import { useState } from "react";
import { ChatSession } from "@/stores/chatStore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { History, Folder, MessageCircle, Save, Archive } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatHistoryProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
  onNewChat: () => void;
}

const ChatHistory = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onDeleteSession,
  onNewChat
}: ChatHistoryProps) => {
  const [open, setOpen] = useState(false);

  const formatDate = (date: Date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  // Get the first few characters of the conversation to show as preview
  const getPreview = (session: ChatSession): string => {
    const userMessages = session.messages.filter(m => m.role === 'user');
    if (userMessages.length === 0) return "No messages yet";
    
    const firstUserMessage = userMessages[0].content;
    return firstUserMessage.length > 40 
      ? `${firstUserMessage.substring(0, 40)}...` 
      : firstUserMessage;
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => setOpen(true)}
        className="flex gap-1"
      >
        <History className="h-4 w-4" />
        <span className="hidden sm:inline">History</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Folder className="h-5 w-5" />
              Chat History
            </DialogTitle>
          </DialogHeader>

          <div className="mb-4">
            <Button 
              onClick={() => {
                onNewChat();
                setOpen(false);
              }}
              className="w-full"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Start New Chat
            </Button>
          </div>

          <ScrollArea className="h-[350px] pr-4">
            {sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No previous conversations
              </div>
            ) : (
              <div className="space-y-2">
                {sessions.map((session) => (
                  <div 
                    key={session.id}
                    className={`p-3 rounded-md cursor-pointer border transition-colors ${
                      currentSessionId === session.id 
                        ? "border-baby-purple bg-baby-purple/10" 
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div 
                        className="flex-1"
                        onClick={() => {
                          onSelectSession(session.id);
                          setOpen(false);
                        }}
                      >
                        <h3 className="font-medium text-sm truncate">{session.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {getPreview(session)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(session.updatedAt)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {session.messages.length} messages
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteSession(session.id)}
                        className="h-8 w-8 p-0"
                        aria-label="Delete conversation"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatHistory;
