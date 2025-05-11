
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

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          className="fixed bottom-4 right-4 w-12 h-12 rounded-full shadow-lg" 
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <MessageSquare />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md p-0 flex flex-col h-full">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Weather Assistant
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {showKeyInput ? (
            <div className="flex flex-col space-y-3">
              <p className="text-sm">
                Please enter your OpenAI API key to use the chatbot:
              </p>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  placeholder="sk-..."
                  className="flex-1 p-2 border rounded"
                />
                <Button onClick={saveApiKey}>Save</Button>
              </div>
              <p className="text-xs text-muted-foreground">
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
                    className={`chat-bubble ${
                      msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}
              
              {loading && (
                <div className="chat-bubble chat-bubble-ai flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking...
                </div>
              )}
              
              {error && (
                <div className="flex items-center gap-2 text-red-500 p-2">
                  <XCircle className="h-4 w-4" />
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
            className="border-t p-4 flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the weather..."
              disabled={loading || !weatherData.current}
            />
            <Button
              type="submit" 
              disabled={loading || !input.trim() || !weatherData.current}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default ChatBot;
