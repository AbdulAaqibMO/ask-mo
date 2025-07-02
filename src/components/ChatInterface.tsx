'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, 
  MicOff, 
  Send, 
  Volume2, 
  VolumeX, 
  Car,
  MessageCircle 
} from 'lucide-react';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { findBestMatch } from '@/utils/faqMatcher';
import { Message } from '@/types';

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m AskMO, your voice-activated vehicle assistant. I can help you understand and operate your vehicle adaptations. Try asking me about hand controls, steering aids, or any other adaptations you have questions about.',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    transcript,
    isListening,
    hasSupport: hasSpeechSupport,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const { speak, cancel: cancelSpeech, hasSupport: hasTTSSupport } = useTextToSpeech();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (transcript && !isListening) {
      setInputValue(transcript);
      resetTranscript();
    }
  }, [transcript, isListening, resetTranscript]);

  const getAIResponse = (userMessage: string): { content: string; hasAction: boolean; actionSuggestion?: string } => {
    const response = findBestMatch(userMessage);
    return {
      content: response.answer,
      hasAction: !!response.actionSuggestion,
      actionSuggestion: response.actionSuggestion
    };
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const { content: responseContent, hasAction, actionSuggestion } = getAIResponse(content);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        hasAction,
        actionSuggestion
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);

      // Speak the response if speech is enabled
      if (speechEnabled && hasTTSSupport) {
        speak(responseContent);
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleSpeech = () => {
    setSpeechEnabled(!speechEnabled);
    if (speechEnabled) {
      cancelSpeech();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto bg-background">
      {/* Header */}
      <Card className="rounded-none border-b">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-full">
                <Car className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">AskMO</CardTitle>
                <p className="text-sm text-muted-foreground">Voice-Activated Vehicle Assistant</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {hasTTSSupport && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSpeech}
                  className="flex items-center space-x-1"
                >
                  {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  <span className="hidden sm:inline">
                    {speechEnabled ? 'Speech On' : 'Speech Off'}
                  </span>
                </Button>
              )}
              {hasSpeechSupport && (
                <Badge variant={isListening ? "default" : "secondary"}>
                  {isListening ? 'Listening...' : 'Voice Ready'}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  {message.type === 'user' ? (
                    'U'
                  ) : (
                    <Car className="w-4 h-4" />
                  )}
                </AvatarFallback>
              </Avatar>
              <Card className={`max-w-[70%] ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted'
              }`}>
                <CardContent className="p-3">
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                    {message.hasAction && !message.actionTaken && (
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            // When user clicks "Help me do this", show the action suggestion
                            const actionMessage: Message = {
                              id: Date.now().toString(),
                              type: 'assistant',
                              content: message.actionSuggestion || 'No specific action available.',
                              timestamp: new Date(),
                            };
                            setMessages(prev => [...prev, actionMessage]);
                            
                            // Mark the original message as handled
                            setMessages(prev => 
                              prev.map(m => 
                                m.id === message.id 
                                  ? { ...m, actionTaken: true }
                                  : m
                              )
                            );
                          }}
                        >
                          Help me do this
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-xs"
                          onClick={() => {
                            setMessages(prev => 
                              prev.map(m => 
                                m.id === message.id 
                                  ? { ...m, actionTaken: true }
                                  : m
                              )
                            );
                          }}
                        >
                          No thanks
                        </Button>
                      </div>
                    )}
                    {message.actionTaken && message.hasAction && (
                      <Badge variant="outline" className="text-xs">
                        Action handled
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex items-start space-x-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback>
                  <Car className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-muted">
                <CardContent className="p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-current rounded-full animate-pulse [animation-delay:0.4s]" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <Card className="rounded-none border-t">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            {hasSpeechSupport && (
              <Button
                variant={isListening ? "default" : "outline"}
                size="icon"
                onClick={toggleListening}
                className="shrink-0"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
            )}
            
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isListening 
                  ? "Listening... Speak now or type your question"
                  : "Ask about your vehicle adaptations..."
              }
              className="flex-1"
              disabled={isTyping}
            />
            
            <Button
              onClick={() => handleSendMessage(inputValue)}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="shrink-0"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {!hasSpeechSupport && (
            <p className="text-xs text-muted-foreground mt-2">
              Voice recognition is not supported in this browser. Please type your questions.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
