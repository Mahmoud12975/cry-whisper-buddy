
import { useState, useEffect } from 'react';

export interface ChatMessage {
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Load sessions from localStorage
const loadSessions = (): ChatSession[] => {
  try {
    const sessions = localStorage.getItem('chatSessions');
    if (sessions) {
      // Convert string dates back to Date objects
      return JSON.parse(sessions, (key, value) => {
        if (key === 'timestamp' || key === 'createdAt' || key === 'updatedAt') {
          return new Date(value);
        }
        return value;
      });
    }
  } catch (error) {
    console.error('Error loading chat sessions', error);
  }
  return [];
};

// Save sessions to localStorage
const saveSessions = (sessions: ChatSession[]): void => {
  try {
    localStorage.setItem('chatSessions', JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving chat sessions', error);
  }
};

// Generate a unique ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Generate a title from the first user message
const generateTitle = (content: string): string => {
  // Extract the first 30 characters of the first message or use a default
  if (!content) return 'New conversation';
  return content.length > 30 ? content.substring(0, 30) + '...' : content;
};

// Hook for managing chat sessions
export const useChatStore = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Load sessions on component mount
  useEffect(() => {
    const loadedSessions = loadSessions();
    setSessions(loadedSessions);
    // Set current session to the last one or null if none exist
    if (loadedSessions.length > 0) {
      setCurrentSessionId(loadedSessions[loadedSessions.length - 1].id);
    }
  }, []);

  // Save sessions whenever they change
  useEffect(() => {
    if (sessions.length > 0) {
      saveSessions(sessions);
    }
  }, [sessions]);

  // Get current session
  const currentSession = sessions.find(session => session.id === currentSessionId) || null;
  
  // Get current messages
  const messages = currentSession?.messages || [];

  // Create a new session
  const createSession = (initialMessage?: ChatMessage): string => {
    const defaultMessage: ChatMessage = {
      content: "Hello! I'm your mommy assistant. I can help with questions about your baby, feeding, sleep, or any concerns you might have as a new mother.",
      role: "assistant",
      timestamp: new Date(),
    };
    
    const newMessages = initialMessage ? [defaultMessage, initialMessage] : [defaultMessage];
    const title = initialMessage ? generateTitle(initialMessage.content) : 'New conversation';
    
    const newSession: ChatSession = {
      id: generateId(),
      title,
      messages: newMessages,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
    return newSession.id;
  };

  // Add a message to the current session
  const addMessage = (message: ChatMessage): void => {
    if (!currentSessionId) {
      // If no current session, create one with this message
      createSession(message);
      return;
    }

    setSessions(prev => 
      prev.map(session => 
        session.id === currentSessionId 
          ? {
              ...session,
              messages: [...session.messages, message],
              updatedAt: new Date(),
              // Update title if this is the first user message
              title: session.messages.length === 1 && message.role === 'user' 
                ? generateTitle(message.content) 
                : session.title
            }
          : session
      )
    );
  };

  // Switch to another session
  const switchSession = (sessionId: string): void => {
    if (sessions.some(session => session.id === sessionId)) {
      setCurrentSessionId(sessionId);
    }
  };

  // Delete a session
  const deleteSession = (sessionId: string): void => {
    const newSessions = sessions.filter(session => session.id !== sessionId);
    setSessions(newSessions);
    
    // If we deleted the current session, switch to the most recent one
    if (sessionId === currentSessionId && newSessions.length > 0) {
      setCurrentSessionId(newSessions[newSessions.length - 1].id);
    } else if (newSessions.length === 0) {
      setCurrentSessionId(null);
    }
  };

  // Clear all sessions
  const clearSessions = (): void => {
    setSessions([]);
    setCurrentSessionId(null);
    localStorage.removeItem('chatSessions');
  };

  return {
    sessions,
    currentSessionId,
    currentSession,
    messages,
    createSession,
    addMessage,
    switchSession,
    deleteSession,
    clearSessions
  };
};
