
import { useState, useRef, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChatMessage, sendChatMessage } from "@/lib/apiOpenAI";
import { WeatherData } from "@/lib/apiWeather";
import { MessageSquare, Send, Loader2, XCircle } from "lucide-react";

interface ChatBotProps {
  weatherData: WeatherData;
}

const ChatBot = ({ weatherData }: ChatBotProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "system",
      content: "You are a helpful weather assistant. You provide advice based on current weather conditions.",
    },
    {
      role: "assistant",
      content: "Hello! I'm your weather assistant. Ask me anything about the current weather or forecast.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openAIKey, setOpenAIKey] = useState<string>(
    localStorage.getItem("openai_api_key") || ""
  );
  const [showKeyInput, setShowKeyInput] = useState<boolean>(!openAIKey);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!input.trim() || loading) return;
    
    if (!openAIKey) {
      setShowKeyInput(true);
      return;
    }
    
    if (!weatherData.current) {
      setError("Please search for a location first to get weather context.");
      return;
    }

    // Add user message to chat
    const userMessage: ChatMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    
    setInput("");
    setLoading(true);
    setError(null);

    try {
      // Send to API
      const response = await sendChatMessage(
        [...messages, userMessage],
        weatherData,
        openAIKey
      );
      
      if (response.error) {
        setError(response.error);
      } else {
        setMessages((prev) => [...prev, response.message]);
      }
    } catch (error) {
      console.error("Error in chat:", error);
      setError("Failed to get a response. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  
  const saveApiKey = () => {
    localStorage.setItem("openai_api_key", openAIKey);
    setShowKeyInput(false);
  };

  const chatBubbleClasses = {
    user: "chat-bubble chat-bubble--user",
    assistant: "chat-bubble chat-bubble--ai"
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed--bottom-right button button--icon" 
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare className="icon" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sheet w-full sm\:max-w-md p-0 flex flex--column h-full">
        <SheetHeader className="chat__header">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="icon icon--sm" />
            Weather Assistant
          </SheetTitle>
        </SheetHeader>
        
        <div className="chat__messages">
          {showKeyInput ? (
            <div className="flex flex--column space-y-3">
              <p className="text-sm">
                Please enter your OpenAI API key to use the chatbot:
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  placeholder="sk-..."
                  className="input flex-1 p-2 border rounded"
                />
                <Button onClick={saveApiKey} className="button">Save</Button>
              </div>
              <p className="text-muted text-xs">
                Your API key will be stored in your browser's local storage.
              </p>
            </div>
          ) : (
            <>
              {messages
                .filter((msg) => msg.role !== "system")
                .map((msg, index) => (
                  <div
                    key={index}
                    className={chatBubbleClasses[msg.role as keyof typeof chatBubbleClasses]}
                  >
                    {msg.content}
                  </div>
                ))}
              
              {loading && (
                <div className="chat-bubble chat-bubble--ai flex items-center gap-2">
                  <Loader2 className="icon icon--sm animate-spin" />
                  Thinking...
                </div>
              )}
              
              {error && (
                <div className="flex items-center gap-2 text-red-500 p-2">
                  <XCircle className="icon icon--sm" />
                  {error}
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        
        {!showKeyInput && (
          <form
            onSubmit={handleSend}
            className="chat__input"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the weather..."
              disabled={loading || !weatherData.current}
              className="input"
            />
            <Button
              type="submit" 
              disabled={loading || !input.trim() || !weatherData.current}
              className="button"
            >
              {loading ? (
                <Loader2 className="icon icon--sm animate-spin" />
              ) : (
                <Send className="icon icon--sm" />
              )}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ChatBot;
