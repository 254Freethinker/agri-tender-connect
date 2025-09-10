import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Send, Bot, User, Globe } from 'lucide-react';

interface Message {
  id: string;
  sender_type: 'user' | 'assistant';
  message_text: string;
  created_at: string;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'sw', name: 'Swahili' },
  { code: 'ki', name: 'Kikuyu' },
  { code: 'luo', name: 'Luo' },
  { code: 'kln', name: 'Kalenjin' },
  { code: 'kam', name: 'Kamba' },
  { code: 'mas', name: 'Maasai' },
  { code: 'mer', name: 'Meru' },
];

export default function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeConversation();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create or get existing conversation
      const { data: conversation, error } = await supabase
        .from('chat_conversations')
        .insert({
          user_id: user.id,
          title: 'Agricultural Assistant Chat',
          language: selectedLanguage
        })
        .select()
        .single();

      if (error) throw error;

      setConversationId(conversation.id);
      
      // Add welcome message
      const welcomeMessage = getWelcomeMessage(selectedLanguage);
      await addMessage('assistant', welcomeMessage);
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  const getWelcomeMessage = (lang: string) => {
    const messages = {
      en: "Hello! I'm your agricultural assistant. I can help you with farming advice, market prices, weather information, and agricultural best practices. How can I assist you today?",
      sw: "Hujambo! Mimi ni msaidizi wako wa kilimo. Naweza kukusaidia na ushauri wa kilimo, bei za sokoni, habari za hali ya hewa, na mbinu bora za kilimo. Ninawezaje kukusaidia leo?",
      ki: "Wĩ mwega! Nĩ niĩ mũteithĩrĩri waku wa ũrĩmi. No ngũteithie na kĩrĩra kĩa ũrĩmi, thogora wa makũngũ, ũhoro wa rĩrĩa, na mĩthiĩre njega ya ũrĩmi. Ndaakũteithia atĩa ũmũthĩ?",
      luo: "Misawa! An jakonyi mari mar pur. Anyalo konyi gi puonj mag pur, nengo mag ohala, weche mag yweya, kod yore mabeyo mag pur. Ere kaka anyalo konyi kawuono?",
      kln: "Chamge! Ane motondet en puratet. Amoi yae ak yosinik chebo puratet, neo eng saptet, gaa chebo yweek, ak yosinik mabeek chebo puratet. Amache chemi inyun?",
      kam: "Wĩ wakwa! Nĩ niĩ mũteithi waku wa ũimi. No ngũteitie na ũthimbu wa ũimi, mĩthemba ya mĩandei, ũhoro wa kĩa na mĩthiĩre njega ya ũimi. Ndaakũteitia atĩa ũmũnthi?",
      mas: "Supa! Ana oltungani le enkulisho. Atamutishori kitok inkishon le enkulisho, inkishon le osokoni, inkishon le enkutoto, o inkishon nabaik le enkulisho. Kea atoishoro tenebo?",
      mer: "Uga wega! Nii mutheethi waku wa uurimi. Notheethe na kiria kia uurimi, thogora wa miuga ya mubaga, uhoro wa riua, na miiko minyega ya uurimi. Ndagutheetha oria umuntha?"
    };
    return messages[lang as keyof typeof messages] || messages.en;
  };

  const addMessage = async (senderType: 'user' | 'assistant', text: string) => {
    if (!conversationId) return;

    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          conversation_id: conversationId,
          sender_type: senderType,
          message_text: text
        })
        .select()
        .single();

      if (error) throw error;

      setMessages(prev => [...prev, data as Message]);
    } catch (error) {
      console.error('Error adding message:', error);
    }
  };

  const getAIResponse = async (userMessage: string): Promise<string> => {
    // Simple agricultural knowledge base responses
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('market')) {
      return "I can help you with market prices! Currently, the average prices in Kenyan markets are: Maize (KES 45-55 per kg), Beans (KES 80-120 per kg), Potatoes (KES 25-35 per kg). Prices vary by region and season. Would you like specific information about any particular crop or market?";
    }
    
    if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('season')) {
      return "Weather is crucial for farming success! Currently we're in the short rains season (October-December). For the best results, consider planting drought-resistant varieties and ensure proper water management. Would you like specific weather advice for your region?";
    }
    
    if (lowerMessage.includes('pest') || lowerMessage.includes('disease') || lowerMessage.includes('insect')) {
      return "Pest and disease management is vital for crop health. Common issues include fall armyworm in maize, potato blight, and aphids. Integrated Pest Management (IPM) combining biological, cultural, and chemical controls works best. What specific pest or crop issue are you facing?";
    }
    
    if (lowerMessage.includes('fertilizer') || lowerMessage.includes('nutrient') || lowerMessage.includes('soil')) {
      return "Soil health is the foundation of good farming! I recommend soil testing to determine nutrient needs. Common fertilizers in Kenya include DAP for phosphorus, CAN for nitrogen, and NPK for balanced nutrition. Organic matter like compost also improves soil structure. What type of soil or crop are you working with?";
    }
    
    if (lowerMessage.includes('seed') || lowerMessage.includes('variety') || lowerMessage.includes('plant')) {
      return "Choosing the right seeds is crucial! Look for certified seeds from KEPHIS-approved dealers. Consider factors like maturity period, disease resistance, and climate adaptation. Popular improved varieties include hybrid maize, improved beans, and certified potato seeds. What crop are you planning to grow?";
    }
    
    return "Thank you for your question! I'm here to help with agricultural advice, market information, weather guidance, pest management, soil health, and seed selection. Could you please be more specific about what agricultural topic you'd like assistance with?";
  };

  const translateText = async (text: string, targetLang: string): Promise<string> => {
    if (targetLang === 'en') return text;
    
    // Simple translation mapping for common agricultural terms
    const translations: { [key: string]: { [key: string]: string } } = {
      sw: {
        "Thank you": "Asante",
        "farming": "kilimo",
        "market": "soko",
        "weather": "hali ya hewa",
        "price": "bei",
        "crop": "mazao",
        "soil": "udongo",
        "water": "maji",
        "seed": "mbegu"
      }
    };
    
    // For now, return English response with a note about translation
    return `${text}\n\n[Translation to ${languages.find(l => l.code === targetLang)?.name} coming soon!]`;
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    try {
      // Add user message
      await addMessage('user', userMessage);

      // Get AI response
      const aiResponse = await getAIResponse(userMessage);
      
      // Translate if needed
      const translatedResponse = await translateText(aiResponse, selectedLanguage);
      
      // Add AI response
      await addMessage('assistant', translatedResponse);
    } catch (error) {
      console.error('Error processing message:', error);
      toast({
        title: 'Error',
        description: 'Failed to process your message. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] max-w-4xl mx-auto p-4">
      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              Agricultural Assistant
            </CardTitle>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.sender_type === 'user' ? 'flex-row-reverse' : ''
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.sender_type === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}>
                    {message.sender_type === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`max-w-[70%] rounded-lg p-3 ${
                    message.sender_type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-muted'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.message_text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {new Date(message.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about farming, prices, weather, or agricultural advice..."
                disabled={loading}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={loading || !inputMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}