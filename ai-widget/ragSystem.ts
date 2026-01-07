/**
 * RAG (Retrieval Augmented Generation) System for Shreyas Chate's AI Assistant
 * This system retrieves relevant information from the profile based on user queries
 */

import type { ProfileData } from './aiLogic';

export interface RAGResult {
  relevantInfo: string[];
  context: string;
  confidence: number;
}

/**
 * Extract keywords from user query for better matching
 */
function extractKeywords(query: string): string[] {
  const lowerQuery = query.toLowerCase();
  const keywords: string[] = [];
  
  // Common question words
  const questionWords = ['what', 'when', 'where', 'who', 'why', 'how', 'which', 'tell', 'about', 'his', 'he', 'him'];
  const stopWords = ['is', 'are', 'was', 'were', 'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'];
  
  // Extract meaningful words
  const words = lowerQuery.split(/\s+/).filter(word => 
    word.length > 2 && 
    !stopWords.includes(word) &&
    !questionWords.includes(word)
  );
  
  keywords.push(...words);
  
  // Add context-aware keywords
  if (lowerQuery.includes('shreyas') || lowerQuery.includes('he') || lowerQuery.includes('his') || lowerQuery.includes('him')) {
    keywords.push('shreyas');
  }
  
  return keywords;
}

/**
 * Calculate relevance score between query and text
 */
function calculateRelevance(query: string, text: string): number {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  const keywords = extractKeywords(query);
  
  let score = 0;
  
  // Exact phrase match (highest score)
  if (textLower.includes(queryLower)) {
    score += 10;
  }
  
  // Keyword matches
  keywords.forEach(keyword => {
    const regex = new RegExp(keyword, 'gi');
    const matches = textLower.match(regex);
    if (matches) {
      score += matches.length * 2;
    }
  });
  
  // Context-specific boosts
  if (queryLower.includes('education') || queryLower.includes('academic') || queryLower.includes('degree') || queryLower.includes('gpa') || queryLower.includes('university') || queryLower.includes('school')) {
    if (textLower.includes('education') || textLower.includes('degree') || textLower.includes('gpa') || textLower.includes('university') || textLower.includes('school') || textLower.includes('masters') || textLower.includes('bachelors')) {
      score += 5;
    }
  }
  
  if (queryLower.includes('experience') || queryLower.includes('work') || queryLower.includes('job') || queryLower.includes('company') || queryLower.includes('role')) {
    if (textLower.includes('experience') || textLower.includes('work') || textLower.includes('company') || textLower.includes('engineer') || textLower.includes('developer')) {
      score += 5;
    }
  }
  
  if (queryLower.includes('project') || queryLower.includes('work') || queryLower.includes('built')) {
    if (textLower.includes('project') || textLower.includes('built') || textLower.includes('developed')) {
      score += 5;
    }
  }
  
  if (queryLower.includes('skill') || queryLower.includes('technology') || queryLower.includes('tech') || queryLower.includes('expertise')) {
    if (textLower.includes('skill') || textLower.includes('technology') || textLower.includes('tech')) {
      score += 5;
    }
  }
  
  if (queryLower.includes('certification') || queryLower.includes('certificate') || queryLower.includes('certified')) {
    if (textLower.includes('certification') || textLower.includes('certified')) {
      score += 5;
    }
  }
  
  if (queryLower.includes('award') || queryLower.includes('achievement') || queryLower.includes('recognition') || queryLower.includes('winner')) {
    if (textLower.includes('award') || textLower.includes('achievement') || textLower.includes('winner')) {
      score += 5;
    }
  }
  
  if (queryLower.includes('contact') || queryLower.includes('email') || queryLower.includes('phone') || queryLower.includes('reach') || queryLower.includes('linkedin') || queryLower.includes('github')) {
    if (textLower.includes('contact') || textLower.includes('email') || textLower.includes('phone') || textLower.includes('linkedin') || textLower.includes('github')) {
      score += 5;
    }
  }
  
  return score;
}

/**
 * Retrieve relevant information from profile using RAG
 */
// Cache for RAG results to speed up repeated queries
const ragCache = new Map<string, RAGResult>();
const CACHE_MAX_SIZE = 50;

export function retrieveRelevantInfo(query: string, profile: ProfileData): RAGResult {
  // Check cache first for speed
  const cacheKey = query.toLowerCase().trim();
  if (ragCache.has(cacheKey)) {
    return ragCache.get(cacheKey)!;
  }
  const relevantInfo: Array<{ text: string; score: number; source: string }> = [];
  
  // Normalize query - replace he/his/him with Shreyas
  let normalizedQuery = query.toLowerCase();
  normalizedQuery = normalizedQuery.replace(/\b(he|his|him)\b/g, 'shreyas');
  
  // Search in different sections
  const sections = [
    { text: profile.summary || '', source: 'summary', weight: 3 },
    { text: profile.background || '', source: 'background', weight: 3 },
    { text: JSON.stringify(profile.education || {}), source: 'education', weight: 2 },
    { text: JSON.stringify(profile.experience || []), source: 'experience', weight: 2 },
    { text: JSON.stringify(profile.major_projects || []), source: 'projects', weight: 2 },
    { text: JSON.stringify(profile.skills || {}), source: 'skills', weight: 2 },
    { text: JSON.stringify(profile.certifications || []), source: 'certifications', weight: 2 },
    { text: JSON.stringify(profile.achievements || []), source: 'achievements', weight: 2 },
    { text: JSON.stringify(profile.contact || {}), source: 'contact', weight: 1 },
    { text: profile.personality || '', source: 'personality', weight: 1 },
    { text: JSON.stringify(profile.goals || []), source: 'goals', weight: 1 },
  ];
  
  sections.forEach(section => {
    const score = calculateRelevance(normalizedQuery, section.text) * section.weight;
    if (score > 0) {
      relevantInfo.push({
        text: section.text,
        score,
        source: section.source
      });
    }
  });
  
  // Sort by relevance score
  relevantInfo.sort((a, b) => b.score - a.score);
  
  // Get top 3 most relevant pieces (reduced from 5 for speed)
  const topRelevant = relevantInfo.slice(0, 3);
  
  // Build context string (limit each piece to 200 chars for speed)
  const contextParts: string[] = [];
  topRelevant.forEach(item => {
    if (item.text && item.text.trim().length > 0) {
      const truncated = item.text.length > 200 ? item.text.substring(0, 200) + '...' : item.text;
      contextParts.push(truncated);
    }
  });
  
  const context = contextParts.join('\n\n').substring(0, 500); // Limit total context to 500 chars
  
  // Calculate confidence (0-1)
  const maxScore = topRelevant.length > 0 ? topRelevant[0].score : 0;
  const confidence = Math.min(maxScore / 20, 1); // Normalize to 0-1
  
  const result: RAGResult = {
    relevantInfo: topRelevant.map(item => item.text),
    context,
    confidence
  };
  
  // Cache result (with size limit)
  if (ragCache.size >= CACHE_MAX_SIZE) {
    const firstKey = ragCache.keys().next().value;
    if (firstKey !== undefined) {
      ragCache.delete(firstKey);
    }
  }
  ragCache.set(cacheKey, result);
  
  return result;
}

/**
 * Format retrieved information for AI consumption
 */
export function formatRAGContext(ragResult: RAGResult, query: string): string {
  if (ragResult.relevantInfo.length === 0) {
    return `No specific information found for the query: "${query}". Please use general knowledge about Mr. Shreyas Chate from the profile.`;
  }
  
  return `Relevant information about Mr. Shreyas Chate for the query "${query}":\n\n${ragResult.context}\n\nUse this information to provide a specific, accurate answer. Always refer to him as "Mr. Shreyas" or "Mr. Shreyas Chate".`;
}

