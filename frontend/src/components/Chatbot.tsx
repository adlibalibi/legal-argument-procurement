import { useState, useRef, useEffect } from 'react';
import { sendChatMessage } from '../services/api';
import { ChatMessage } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Send, Bot, User, Loader2, Scale, FileText, Sparkles } from 'lucide-react';
import { Separator } from './ui/separator';
import { ArgumentAnalysisPanel } from './ArgumentAnalysisPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ArgumentDrafter } from './ArgumentDrafter';

interface ChatbotProps {
  onCaseClick?: (caseId: string) => void;
}

export function Chatbot({ onCaseClick }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello! I'm your legal debate assistant. I can help you in several ways:

• **Analyze Arguments**: Get detailed analysis of how precedents support or contradict your position
• **Search Precedents**: Find relevant cases and propositions based on legal concepts
• **Draft Arguments**: Build stronger arguments backed by precedent analysis

Ask me about specific legal issues, or use the Argument Drafter to get started!`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await sendChatMessage(input, messages);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestedQuestions = [
    'Analyze my argument: Employees have privacy rights in workplace communications',
    'What precedents support Fourth Amendment protections in the workplace?',
    'Find cases about employer monitoring and employee privacy',
    'How can I distinguish my case from contradicting precedents?',
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="h-full flex gap-4 max-w-7xl mx-auto">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col gap-4">
        <Card className="flex-1 flex flex-col overflow-hidden border-2 border-secondary/20">
          <CardHeader className="border-b-2 border-secondary/20 bg-gradient-to-r from-primary/5 to-accent/5">
            <CardTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Scale className="h-5 w-5 text-primary-foreground" />
              </div>
              Legal Debate Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-3">
                    <div
                      className={`flex gap-3 ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent shadow-md flex items-center justify-center flex-shrink-0">
                          <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-4 shadow-sm ${
                          message.role === 'user'
                            ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground'
                            : 'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-secondary/20'
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.relatedCases && message.relatedCases.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <p className="text-xs mb-2 opacity-70">Related Cases:</p>
                            <div className="flex flex-wrap gap-1">
                              {message.relatedCases.map((caseId) => (
                                <Badge
                                  key={caseId}
                                  variant="secondary"
                                  className="text-xs cursor-pointer hover:bg-secondary/80"
                                  onClick={() => onCaseClick?.(caseId)}
                                >
                                  {caseId}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                        <p className="text-xs opacity-50 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-secondary/80 shadow-md flex items-center justify-center flex-shrink-0">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      )}
                    </div>
                    
                    {/* Show argument analysis if available */}
                    {message.argumentAnalysis && message.role === 'assistant' && (
                      <div className="ml-11 max-w-[80%]">
                        <ArgumentAnalysisPanel 
                          analysis={message.argumentAnalysis} 
                          onCaseClick={onCaseClick}
                        />
                      </div>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent shadow-md flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 border border-secondary/20 rounded-lg p-4 shadow-sm">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <Separator />

            <div className="p-4 space-y-3">
              {messages.length === 1 && (
                <div className="mb-2">
                  <p className="text-sm text-muted-foreground mb-2">
                    Try these commands:
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestedQuestions.map((question, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs h-auto py-2 px-3 whitespace-normal text-left justify-start"
                        onClick={() => handleSuggestionClick(question)}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about precedents, analyze arguments, or request legal strategies..."
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Argument Drafter Sidebar */}
      <div className="w-[400px] flex flex-col">
        <ArgumentDrafter onCaseClick={onCaseClick} />
      </div>
    </div>
  );
}
