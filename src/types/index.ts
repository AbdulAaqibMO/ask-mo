export interface FAQItem {
  question: string;
  answer: string;
  actionSuggestion?: string;
}

export interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  hasAction?: boolean;
  actionTaken?: boolean;
  actionSuggestion?: string;
}
