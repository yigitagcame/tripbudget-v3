'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Lightbulb, ChevronDown, MessageCircle, AlertCircle } from 'lucide-react';
import RecommendationCards from './RecommendationCards';
import GetMoreMessagesModal from './GetMoreMessagesModal';
import { Card } from '@/lib/chat-api';
import { useMessageCounter } from '@/contexts/MessageCounterContext';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  cards?: Card[];
  followUp?: string;
  tripContext?: {
    from: string;
    to: string;
    departDate: string;
    returnDate: string;
    passengers: number;
  };
}

interface ChatWindowProps {
  messages: Message[];
  onSendMessage: (message: string, currency?: string) => void;
  isLoading?: boolean;
  tripDetails?: {
    from: string;
    to: string;
    departDate: string;
    returnDate: string;
    passengers: number;
  };
  onAddToTripPlan?: (card: Card) => void;
  currency?: string;
  onCurrencyChange?: (currency: string) => void;
  showGetMoreMessagesModal?: boolean;
  onOpenGetMoreMessagesModal?: () => void;
  onCloseGetMoreMessagesModal?: () => void;
}

export default function ChatWindow({ 
  messages, 
  onSendMessage, 
  isLoading = false, 
  tripDetails, 
  onAddToTripPlan,
  currency = 'EUR',
  onCurrencyChange,
  showGetMoreMessagesModal = false,
  onOpenGetMoreMessagesModal,
  onCloseGetMoreMessagesModal
}: ChatWindowProps) {
  const [inputMessage, setInputMessage] = useState('');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currencyDropdownRef = useRef<HTMLDivElement>(null);
  
  const { messageCount, hasEnoughMessages } = useMessageCounter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close currency dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target as Node)) {
        setShowCurrencyDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSendMessage = () => {
    if (inputMessage.trim() && hasEnoughMessages()) {
      onSendMessage(inputMessage.trim(), currency);
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCurrencyChange = (newCurrency: string) => {
    if (onCurrencyChange) {
      onCurrencyChange(newCurrency);
    }
    setShowCurrencyDropdown(false);
  };

  const currencyOptions = [
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dollar' }
  ];

  const currentCurrency = currencyOptions.find(c => c.code === currency) || currencyOptions[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 h-full flex flex-col"
    >
      {/* Chat Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">AI Travel Assistant</h2>
              <p className="text-sm text-gray-500">Ask me anything about your trip!</p>
            </div>
          </div>
          
          {/* Currency Selector */}
          <div className="relative" ref={currencyDropdownRef}>
            <button
              onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
              className="flex items-center space-x-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">{currentCurrency.symbol}</span>
              <span className="text-sm text-gray-600">{currentCurrency.code}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            
            <AnimatePresence>
              {showCurrencyDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]"
                >
                  {currencyOptions.map((option) => (
                    <button
                      key={option.code}
                      onClick={() => handleCurrencyChange(option.code)}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 transition-colors ${
                        currency === option.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                      } ${option.code === 'EUR' ? 'rounded-t-lg' : ''} ${option.code === 'USD' ? 'rounded-b-lg' : ''}`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{option.symbol}</span>
                        <span>{option.code}</span>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {tripDetails && (tripDetails.from || tripDetails.to) && (
          <div className="mt-3 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 font-medium">
              🎯 Considering your trip: {tripDetails.from && `${tripDetails.from} → `}{tripDetails.to || 'TBD'}
              {tripDetails.passengers > 0 && ` (${tripDetails.passengers} travelers)`}
            </p>
          </div>
        )}
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] ${message.type === 'user' ? 'flex flex-col items-end' : 'flex flex-col'}`}>
                <div
                  className={`rounded-2xl p-4 ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  
                  <div className="text-xs opacity-60 mt-2">
                    {message.timestamp instanceof Date 
                      ? message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  </div>
                </div>

                {/* Recommendation Cards */}
                {message.type === 'ai' && message.cards && message.cards.length > 0 && (
                  <div className="mt-3">
                    <RecommendationCards cards={message.cards} onAddToTripPlan={onAddToTripPlan} />
                  </div>
                )}

                {/* Follow-up Message */}
                {message.type === 'ai' && message.followUp && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
                  >
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Next Step</p>
                        <p className="text-sm text-blue-700 leading-relaxed">{message.followUp}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-gray-100 text-gray-900 rounded-2xl p-4 max-w-[80%]">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                  <span className="text-sm text-gray-500">AI is thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-200">
        {/* Out of Messages Warning */}
        {!hasEnoughMessages() && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200"
          >
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-red-800 mb-1">
                  You've run out of messages!
                </h3>
                <p className="text-sm text-red-700 mb-3">
                  You have {messageCount} messages left. Share your invitation link with friends to get more messages and continue planning your perfect trip.
                </p>
                <button
                  onClick={onOpenGetMoreMessagesModal}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Get More Messages</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex space-x-3">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={hasEnoughMessages() 
                ? "Ask me about flights, hotels, activities, or anything travel-related..." 
                : "You need more messages to continue chatting..."
              }
              disabled={!hasEnoughMessages()}
              className={`w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                !hasEnoughMessages() ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''
              }`}
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || !hasEnoughMessages()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>

      {/* Get More Messages Modal */}
      <GetMoreMessagesModal
        isOpen={showGetMoreMessagesModal}
        onClose={onCloseGetMoreMessagesModal || (() => {})}
        currentMessageCount={messageCount}
      />
    </motion.div>
  );
} 