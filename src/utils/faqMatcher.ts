import { FAQItem } from '@/types';
import faqData from '@/data/faq.json';

interface MatchResult {
  answer: string;
  actionSuggestion?: string;
}

export function findBestMatch(query: string): MatchResult {
  const normalizedQuery = query.toLowerCase();
  
  // Try exact matches first
  const exactMatch = faqData.find(item => 
    item.question.toLowerCase() === normalizedQuery
  );
  if (exactMatch) return {
    answer: exactMatch.answer,
    actionSuggestion: exactMatch.actionSuggestion
  };

  // Calculate similarity scores based on keyword matching
  const scores = faqData.map(item => {
    const questionScore = calculateSimilarity(item.question.toLowerCase(), normalizedQuery);
    const answerScore = calculateSimilarity(item.answer.toLowerCase(), normalizedQuery);
    return {
      item,
      score: Math.max(questionScore, answerScore)
    };
  });

  // Sort by score and get the best match
  const bestMatch = scores.sort((a, b) => b.score - a.score)[0];

  // If the best match has a reasonable similarity score, return its answer
  if (bestMatch.score > 0.3) {
    return {
      answer: bestMatch.item.answer,
      actionSuggestion: bestMatch.item.actionSuggestion
    };
  }

  // Default response for no good matches
  return {
    answer: "I'm sorry, I couldn't find a specific answer to your question. Could you please rephrase it or ask something more specific about vehicle adaptations?"
  };
}

function calculateSimilarity(text: string, query: string): number {
  const words1 = text.toLowerCase().split(/\W+/);
  const words2 = query.toLowerCase().split(/\W+/);
  
  const commonWords = words1.filter(word => 
    words2.includes(word) && word.length > 2
  );
  
  return commonWords.length / Math.max(words1.length, words2.length);
}
