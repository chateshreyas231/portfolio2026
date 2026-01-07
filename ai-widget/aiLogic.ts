/**
 * AI Logic - Handles conversation flow and responses with RAG (Retrieval Augmented Generation)
 */

import { detectIntent, IntentResult } from './intentDetection';
import { retrieveRelevantInfo } from './ragSystem';

export interface ProfileData {
  name: string;
  summary: string;
  background: string;
  education: any;
  experience: any[];
  major_projects: any[];
  skills: any;
  personality: string;
  likes_dislikes: any;
  goals: string[];
  achievements: string[];
  certifications: string[];
  resume_url: string;
  calendly_or_scheduler_url: string;
  scheduler: {
    google_meet_api: string;
    teams_api: string;
  };
  location: string;
  email: string;
  phone: string;
  social: any;
  contact?: {
    email?: string;
    phone?: string;
    linkedin?: string;
    github?: string;
    location?: {
      full?: string;
    };
  };
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Get timezone-based greeting message
 */
export function getInitialGreeting(): string {
  const now = new Date();
  const hour = now.getHours();
  
  let timeGreeting = '';
  if (hour >= 5 && hour < 12) {
    timeGreeting = 'Good morning';
  } else if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (hour >= 17 && hour < 21) {
    timeGreeting = 'Good evening';
  } else {
    timeGreeting = 'Good evening'; // Late night
  }
  
  return `${timeGreeting}! 👋 I'm Mr. Shreyas Chate's AI assistant. I'm here to help you learn about Mr. Shreyas — his background, work experience, projects, and expertise in conversational AI.

I can also help you schedule a meeting with him or share his resume. What would you like to know?`;
}

/**
 * Schedule a meeting
 */
export async function scheduleMeeting(
  { date, time }: { date?: string; time?: string },
  profile: ProfileData
): Promise<string> {
  // Placeholder - Replace with actual API calls
  if (date && time) {
    // Call Google Meet API or Teams API
    // const response = await fetch(profile.scheduler.google_meet_api, {
    //   method: 'POST',
    //   body: JSON.stringify({ date, time })
    // });
    
    return `Perfect! I've scheduled your meeting with Mr. Shreyas Chate for ${date} at ${time}. A calendar invite will be sent to your email shortly. You can also use this link to manage your booking: ${profile.calendly_or_scheduler_url}`;
  }
  
  return `I'd be happy to help you schedule a meeting with Mr. Shreyas Chate! Could you please provide:\n\n1. Your preferred date (e.g., "tomorrow", "next Monday", or a specific date)\n2. Your preferred time (e.g., "2 PM", "10:30 AM")\n\nOnce you share these details, I'll set up the meeting and send you a calendar invite. You can also book directly here: ${profile.calendly_or_scheduler_url}`;
}

/**
 * Send resume link
 */
export function sendResume(profile: ProfileData): string {
  return `Sure! Here is Mr. Shreyas Chate's latest resume: ${profile.resume_url}\n\nYou can download it directly from the website. If you need any specific information from his resume, feel free to ask!`;
}

/**
 * Answer questions about Shreyas based on profile data and conversation context using RAG
 */
function answerAboutShreyas(intent: IntentResult, profile: ProfileData, conversationHistory?: Message[]): string {
  const topic = intent.data?.topic;
  
  // Get the user's query from conversation history or intent
  const userQuery = conversationHistory?.slice(-1)[0]?.content || '';
  
  // Use RAG to retrieve relevant information
  const ragResult = retrieveRelevantInfo(userQuery, profile);
  // Note: ragContext is used in callAIAPI, not here directly
  
  // Use conversation history to provide more contextual answers
  const recentContext = conversationHistory?.slice(-4) || []; // Last 4 messages for context
  
  // Check if user wants detailed information
  const userQueryLower = userQuery.toLowerCase();
  const wantsDetail = userQueryLower.includes('detail') || 
                      userQueryLower.includes('more') || 
                      userQueryLower.includes('elaborate') || 
                      userQueryLower.includes('explain') ||
                      userQueryLower.includes('tell me more') ||
                      userQueryLower.includes('in depth') ||
                      userQueryLower.includes('comprehensive') ||
                      userQueryLower.includes('full') ||
                      userQueryLower.includes('complete');
  
  if (!topic) {
    // Check conversation history for context
    const lastUserMessage = recentContext.find(m => m.role === 'user')?.content.toLowerCase() || '';
    
    // Normalize query - replace he/his/him with Shreyas
    let normalizedQuery = lastUserMessage.replace(/\b(he|his|him)\b/g, 'shreyas');
    
    // Check if user wants detailed information
    const wantsDetail = normalizedQuery.includes('detail') || 
                        normalizedQuery.includes('more') || 
                        normalizedQuery.includes('elaborate') || 
                        normalizedQuery.includes('explain') ||
                        normalizedQuery.includes('tell me more') ||
                        normalizedQuery.includes('in depth') ||
                        normalizedQuery.includes('comprehensive');
    
    // If user is asking about something specific, try to answer directly
    if (normalizedQuery.includes('tell me about') || normalizedQuery.includes('what') || normalizedQuery.includes('who') || normalizedQuery.includes('academics') || normalizedQuery.includes('academic')) {
      // Check if it's about academics/education
      if (normalizedQuery.includes('academics') || normalizedQuery.includes('academic') || normalizedQuery.includes('education') || normalizedQuery.includes('school') || normalizedQuery.includes('university') || normalizedQuery.includes('degree') || normalizedQuery.includes('gpa')) {
        return formatEducation(profile.education, !wantsDetail);
      }
      
      // Check if it's about experience/work
      if (normalizedQuery.includes('experience') || normalizedQuery.includes('work') || normalizedQuery.includes('job') || normalizedQuery.includes('company')) {
        return formatExperience(profile.experience, !wantsDetail);
      }
      
      // Check if it's about projects
      if (normalizedQuery.includes('project')) {
        return formatProjects(profile.major_projects, !wantsDetail);
      }
      
      // Check if it's about skills
      if (normalizedQuery.includes('skill') || normalizedQuery.includes('expertise') || normalizedQuery.includes('technology')) {
        return formatSkills(profile.skills, !wantsDetail);
      }
      
      // Check if it's about achievements/certifications
      if (normalizedQuery.includes('achievement') || normalizedQuery.includes('award') || normalizedQuery.includes('certification')) {
        return formatAchievements(profile, !wantsDetail);
      }
      
      // Check if it's about contact
      if (normalizedQuery.includes('contact') || normalizedQuery.includes('email') || normalizedQuery.includes('phone') || normalizedQuery.includes('reach') || normalizedQuery.includes('linkedin') || normalizedQuery.includes('github')) {
        return `Mr. Shreyas Chate's Contact Information:\n\n📧 Email: ${profile.contact?.email || profile.email}\n📞 Phone: ${profile.contact?.phone || profile.phone}\n📍 Location: ${profile.location || profile.contact?.location?.full || 'Chicago, Illinois'}\n\n🔗 LinkedIn: ${profile.contact?.linkedin || profile.social?.linkedin || 'Available on request'}\n💻 GitHub: ${profile.contact?.github || profile.social?.github || 'Available on request'}`;
      }
      
      // If RAG found good context, use it briefly
      if (ragResult.confidence > 0.2 && ragResult.context) {
        const contextPreview = ragResult.context.substring(0, 200);
        return `Based on your question:\n\n${contextPreview}...\n\nWould you like more details?`;
      }
    }
    
    // If RAG didn't find good context, provide brief general response
    if (normalizedQuery.includes('who') || normalizedQuery.includes('what does') || normalizedQuery.includes('tell me about')) {
      return `Mr. Shreyas Chate is a conversational AI engineer specializing in ServiceNow, LangChain, and building intelligent chat systems.\n\nWould you like to know more about his education, work experience, projects, skills, or achievements?`;
    }
    
    return `Mr. Shreyas Chate is a conversational AI engineer. I can tell you about his education, work experience, projects, skills, achievements, or contact information. What would you like to know?`;
  }
  
  switch (topic.toLowerCase()) {
    case 'education':
      return formatEducation(profile.education, !wantsDetail);
    
    case 'experience':
    case 'work':
      return formatExperience(profile.experience, !wantsDetail);
    
    case 'projects':
      return formatProjects(profile.major_projects, !wantsDetail);
    
    case 'skills':
      return formatSkills(profile.skills, !wantsDetail);
    
    case 'achievements':
      return formatAchievements(profile, !wantsDetail);
    
    case 'background':
      if (wantsDetail) {
        return `${profile.background}\n\n${profile.summary}`;
      }
      return `${profile.summary}\n\nWould you like more details about his background?`;
    
    case 'goals':
      if (wantsDetail) {
        return `Mr. Shreyas Chate's goals include:\n\n${profile.goals.map((goal, i) => `${i + 1}. ${goal}`).join('\n')}`;
      }
      return `Mr. Shreyas Chate has ${profile.goals?.length || 0} main goals focused on advancing conversational AI and making technology more accessible.\n\nWould you like to know the specific goals?`;
    
    case 'interests':
      if (wantsDetail) {
        return `Mr. Shreyas Chate enjoys:\n\n${profile.likes_dislikes?.likes?.map((like: string) => `• ${like}`).join('\n') || 'Building AI systems, solving technical challenges, and continuous learning.'}`;
      }
      return `Mr. Shreyas Chate is passionate about building AI systems that help people, solving complex technical challenges, and continuous learning.\n\nWould you like more details about his interests?`;
    
    case 'contact':
      return `Mr. Shreyas Chate's Contact Information:\n\n📧 Email: ${profile.contact?.email || profile.email}\n📞 Phone: ${profile.contact?.phone || profile.phone}\n📍 Location: ${profile.location || profile.contact?.location?.full || 'Chicago, Illinois'}\n\n🔗 LinkedIn: ${profile.contact?.linkedin || profile.social?.linkedin || 'Available on request'}\n💻 GitHub: ${profile.contact?.github || profile.social?.github || 'Available on request'}`;
    
    default:
      // Use RAG to find relevant info for unknown topics
      if (ragResult.confidence > 0.2 && ragResult.context) {
        const contextPreview = ragResult.context.substring(0, 200);
        return `Regarding ${topic}, here's what I can tell you about Mr. Shreyas Chate:\n\n${contextPreview}...\n\nWould you like more details?`;
      }
      return `I can tell you about Mr. Shreyas Chate's ${topic}. Would you like specific information about this topic?`;
  }
}

function formatEducation(education: any, brief: boolean = true): string {
  if (brief) {
    // Brief version - just key facts
    let response = `Mr. Shreyas Chate's Education:\n\n`;
    
    if (education.masters) {
      response += `🎓 **${education.masters.degree}**\n`;
      response += `${education.masters.school} (${education.masters.period})\n`;
      response += `GPA: ${education.masters.gpa}\n\n`;
    }
    
    if (education.bachelors) {
      response += `🎓 **${education.bachelors.degree}**\n`;
      response += `${education.bachelors.school} (${education.bachelors.period})\n`;
      response += `GPA: ${education.bachelors.gpa}`;
    }
    
    response += `\n\nWould you like more details about his coursework or specific courses?`;
    return response;
  }
  
  // Detailed version
  let response = `Mr. Shreyas Chate's Education:\n\n`;
  
  if (education.masters) {
    response += `🎓 **${education.masters.degree}**\n`;
    response += `${education.masters.school}, ${education.masters.location}\n`;
    response += `Period: ${education.masters.period}\n`;
    response += `GPA: ${education.masters.gpa}\n`;
    if (education.masters.courses && education.masters.courses.length > 0) {
      response += `\nRelevant Coursework:\n`;
      education.masters.courses.forEach((course: string) => {
        response += `• ${course}\n`;
      });
    }
    response += `\n`;
  }
  
  if (education.bachelors) {
    response += `🎓 **${education.bachelors.degree}**\n`;
    response += `${education.bachelors.school}, ${education.bachelors.location}\n`;
    response += `Period: ${education.bachelors.period}\n`;
    response += `GPA: ${education.bachelors.gpa}\n`;
    if (education.bachelors.courses && education.bachelors.courses.length > 0) {
      response += `\nRelevant Coursework:\n`;
      education.bachelors.courses.forEach((course: string) => {
        response += `• ${course}\n`;
      });
    }
  }
  
  return response;
}

function formatExperience(experience: any[], brief: boolean = true): string {
  if (brief) {
    // Brief version - just key facts
    let response = `Mr. Shreyas Chate's Work Experience:\n\n`;
    
    experience.slice(0, 3).forEach((exp, index) => {
      response += `${index + 1}. **${exp.title}** at ${exp.company}${exp.client ? ` (${exp.client})` : ''}\n`;
      response += `${exp.period}, ${exp.location}\n\n`;
    });
    
    response += `Would you like more details about any specific role or his achievements?`;
    return response;
  }
  
  // Detailed version
  let response = `Mr. Shreyas Chate's Work Experience:\n\n`;
  
  experience.forEach((exp, index) => {
    response += `${index + 1}. **${exp.title}**\n`;
    response += `${exp.company}${exp.client ? ` (${exp.client})` : ''}, ${exp.location}\n`;
    response += `Period: ${exp.period}\n`;
    response += `${exp.description}\n`;
    if (exp.key_achievements && exp.key_achievements.length > 0) {
      response += `\nKey Achievements:\n`;
      exp.key_achievements.forEach((achievement: string) => {
        response += `• ${achievement}\n`;
      });
    }
    response += `\n`;
  });
  
  return response;
}

function formatProjects(projects: any[], brief: boolean = true): string {
  if (brief) {
    // Brief version - just key facts
    let response = `Mr. Shreyas Chate's Major Projects:\n\n`;
    
    projects.slice(0, 5).forEach((project, index) => {
      response += `${index + 1}. **${project.name}**`;
      if (project.period) {
        response += ` (${project.period})`;
      }
      response += `\n${project.description.substring(0, 150)}${project.description.length > 150 ? '...' : ''}\n\n`;
    });
    
    response += `Would you like more details about any specific project?`;
    return response;
  }
  
  // Detailed version
  let response = `Mr. Shreyas Chate's Major Projects:\n\n`;
  
  projects.forEach((project, index) => {
    response += `${index + 1}. **${project.name}**`;
    if (project.period) {
      response += ` (${project.period})`;
    }
    if (project.company) {
      response += ` - ${project.company}`;
    }
    response += `\n`;
    response += `${project.description}\n`;
    if (project.highlights && project.highlights.length > 0) {
      response += `\nKey highlights:\n`;
      project.highlights.forEach((highlight: string) => {
        response += `• ${highlight}\n`;
      });
    }
    if (project.technologies && project.technologies.length > 0) {
      response += `\nTechnologies: ${project.technologies.join(', ')}\n`;
    }
    response += `\n`;
  });
  
  return response;
}

function formatSkills(skills: any, brief: boolean = true): string {
  if (brief) {
    // Brief version - just categories
    let response = `Mr. Shreyas Chate's Technical Skills:\n\n`;
    
    const categories: string[] = [];
    if (skills.ai_ml) categories.push('AI & Machine Learning');
    if (skills.frontend) categories.push('Frontend Development');
    if (skills.backend) categories.push('Backend Development');
    if (skills.cloud_devops) categories.push('Cloud & DevOps');
    
    response += categories.join(', ');
    response += `\n\nWould you like more details about specific technologies in any category?`;
    return response;
  }
  
  // Detailed version
  let response = `Mr. Shreyas Chate's Technical Skills:\n\n`;
  
  if (skills.ai_ml) {
    const aiMlSkills: string[] = [];
    if (skills.ai_ml.platforms) aiMlSkills.push(...skills.ai_ml.platforms);
    if (skills.ai_ml.frameworks) aiMlSkills.push(...skills.ai_ml.frameworks);
    if (skills.ai_ml.languages) aiMlSkills.push(...skills.ai_ml.languages);
    if (skills.ai_ml.techniques) aiMlSkills.push(...skills.ai_ml.techniques);
    if (aiMlSkills.length > 0) {
      response += `🤖 **AI & Machine Learning:**\n${aiMlSkills.join(', ')}\n\n`;
    }
  }
  
  if (skills.frontend) {
    const frontendSkills: string[] = [];
    if (skills.frontend.frameworks) frontendSkills.push(...skills.frontend.frameworks);
    if (skills.frontend.languages) frontendSkills.push(...skills.frontend.languages);
    if (skills.frontend.libraries) frontendSkills.push(...skills.frontend.libraries);
    if (frontendSkills.length > 0) {
      response += `🎨 **Frontend:**\n${frontendSkills.join(', ')}\n\n`;
    }
  }
  
  if (skills.backend) {
    const backendSkills: string[] = [];
    if (skills.backend.frameworks) backendSkills.push(...skills.backend.frameworks);
    if (skills.backend.apis) backendSkills.push(...skills.backend.apis);
    if (skills.backend.databases) backendSkills.push(...skills.backend.databases);
    if (backendSkills.length > 0) {
      response += `⚙️ **Backend:**\n${backendSkills.join(', ')}\n\n`;
    }
  }
  
  if (skills.cloud_devops) {
    const cloudSkills: string[] = [];
    if (skills.cloud_devops.cloud) cloudSkills.push(...skills.cloud_devops.cloud);
    if (skills.cloud_devops.services) cloudSkills.push(...skills.cloud_devops.services);
    if (skills.cloud_devops.devops) cloudSkills.push(...skills.cloud_devops.devops);
    if (cloudSkills.length > 0) {
      response += `☁️ **Cloud & DevOps:**\n${cloudSkills.join(', ')}\n\n`;
    }
  }
  
  return response;
}

function formatAchievements(profile: ProfileData, brief: boolean = true): string {
  if (brief) {
    // Brief version
    let response = `Mr. Shreyas Chate's Achievements:\n\n`;
    
    if (Array.isArray(profile.achievements) && profile.achievements.length > 0) {
      response += `🏆 **Awards:** ${profile.achievements.length} award(s)\n`;
    }
    
    if (Array.isArray(profile.certifications) && profile.certifications.length > 0) {
      response += `📜 **Certifications:** ${profile.certifications.length} certification(s)\n`;
    }
    
    response += `\nWould you like more details about specific awards or certifications?`;
    return response;
  }
  
  // Detailed version
  let response = `Mr. Shreyas Chate's Achievements:\n\n`;
  
  response += `🏆 **Awards:**\n`;
  if (Array.isArray(profile.achievements)) {
    profile.achievements.forEach((achievement: any) => {
      if (typeof achievement === 'string') {
        response += `• ${achievement}\n`;
      } else if (achievement.title) {
        response += `• ${achievement.title} - ${achievement.event || achievement.description || ''}\n`;
      }
    });
  }
  
  response += `\n📜 **Certifications:**\n`;
  if (Array.isArray(profile.certifications)) {
    profile.certifications.forEach((cert: any) => {
      if (typeof cert === 'string') {
        response += `• ${cert}\n`;
      } else if (cert.name) {
        response += `• ${cert.name}${cert.issuer ? ` (${cert.issuer})` : ''}\n`;
      }
    });
  }
  
  return response;
}

/**
 * Handle small talk
 */
function handleSmallTalk(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('how are you') || lowerMessage.includes('how do you do')) {
    return `I'm doing great, thanks for asking! I'm here and ready to help you learn about Shreyas. What would you like to know?`;
  }
  
  if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
    return `You're very welcome! Is there anything else I can help you with about Shreyas?`;
  }
  
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `Hello! 👋 I'm Mr. Shreyas Chate's AI assistant. I can tell you about his background, experience, projects, or help you schedule a meeting. What would you like to know?`;
  }
  
  return `Hi there! I'm here to help you learn about Mr. Shreyas Chate. You can ask me about his background, experience, projects, or schedule a meeting!`;
}

/**
 * Process user message and generate response
 */
export async function processMessage(
  userMessage: string,
  conversationHistory: Message[],
  profile: ProfileData,
  useLocalAI: boolean = false,
  sessionId?: string,
  topicHistory?: string[]
): Promise<string> {
  // Detect intent
  const intent = detectIntent(userMessage);
  
  // Handle based on intent
  switch (intent.type) {
    case 'SmallTalk':
      // Use AI API for natural small talk instead of static responses
      try {
        const ragResult = retrieveRelevantInfo(userMessage.toLowerCase(), profile);
        const aiResponse = await callAIAPI(userMessage, conversationHistory, useLocalAI, ragResult.context, sessionId, topicHistory);
        if (aiResponse && aiResponse.trim().length > 10) {
          return aiResponse;
        }
      } catch (error) {
        console.error('AI API error for small talk:', error);
      }
      // Fallback to static response only if AI fails
      return handleSmallTalk(userMessage);
    
    case 'SendResume':
      return sendResume(profile);
    
    case 'ScheduleMeeting':
      return await scheduleMeeting(
        { date: intent.data?.date, time: intent.data?.time },
        profile
      );
    
    case 'AskAboutShreyas':
      // ALWAYS use AI API first for natural, conversational responses
      const userQuery = userMessage;
      const normalizedQuery = userQuery.toLowerCase().replace(/\b(he|his|him)\b/g, 'shreyas');
      const ragResult = retrieveRelevantInfo(normalizedQuery, profile);
      
      // Build comprehensive context including full profile summary
      const fullContext = ragResult.context 
        ? `${ragResult.context}\n\nAdditional Profile Information:\n- Summary: ${profile.summary || 'N/A'}\n- Background: ${profile.background || 'N/A'}\n- Key Skills: ${JSON.stringify(profile.skills || {})}\n- Major Projects: ${JSON.stringify(profile.major_projects?.slice(0, 3) || [])}\n- Experience: ${JSON.stringify(profile.experience?.slice(0, 3) || [])}\n- Achievements: ${JSON.stringify(profile.achievements || [])}`
        : `Profile Summary: ${profile.summary || 'N/A'}\nBackground: ${profile.background || 'N/A'}\nSkills: ${JSON.stringify(profile.skills || {})}\nProjects: ${JSON.stringify(profile.major_projects?.slice(0, 5) || [])}\nExperience: ${JSON.stringify(profile.experience?.slice(0, 5) || [])}`;
      
      // Try AI API first for natural conversation
      try {
        const aiResponse = await callAIAPI(userMessage, conversationHistory, useLocalAI, fullContext, sessionId, topicHistory);
        if (aiResponse && aiResponse.trim().length > 10) {
          return aiResponse;
        }
      } catch (error) {
        console.error('AI API error:', error);
      }
      
      // Only fall back to direct answer if AI API fails
      const directAnswer = answerAboutShreyas(intent, profile, conversationHistory);
      if (directAnswer && directAnswer.trim().length > 10) {
        return directAnswer;
      }
      
      // Final fallback
      return `I'd be happy to help! Could you be more specific? For example, you can ask about Mr. Shreyas Chate's background, education, work experience, projects, skills, or schedule a meeting. What would you like to know?`;
    
    case 'Unknown':
    default:
      // ALWAYS try AI API first for natural conversation, even for unknown intents
      const normalizedQueryDefault = userMessage.toLowerCase().replace(/\b(he|his|him)\b/g, 'shreyas');
      const ragResultDefault = retrieveRelevantInfo(normalizedQueryDefault, profile);
      
      // Try AI API for all queries - let the AI handle the conversation naturally
      try {
        const aiResponse = await Promise.race([
          callAIAPI(userMessage, conversationHistory, useLocalAI, ragResultDefault.context, sessionId, topicHistory),
          new Promise<string>((_, reject) => 
            setTimeout(() => reject(new Error('Timeout')), 10000) // Increased timeout
          )
        ]);
        if (aiResponse && aiResponse.trim().length > 10) {
          return aiResponse;
        }
      } catch (error) {
        console.error('AI API error for unknown intent:', error);
      }
      
      // Fallback only if AI completely fails
      return `I'd be happy to help! Could you be more specific? For example, you can ask about Mr. Shreyas Chate's background, education, work experience, projects, skills, or schedule a meeting. What would you like to know?`;
  }
}

/**
 * Call AI API (Groq, Ollama, or OpenAI) with RAG context
 */
async function callAIAPI(
  userMessage: string,
  conversationHistory: Message[],
  useLocalAI: boolean,
  ragContext?: string,
  sessionId?: string,
  topicHistory?: string[]
): Promise<string> {
  try {
    // Keep more history for better context (increased from 2 to 10)
    const recentHistory = conversationHistory.slice(-10);
    
    // Increase RAG context for better responses - allow more context for detailed answers
    const limitedRagContext = ragContext ? ragContext.substring(0, 3000) : undefined;
    
    // Add timeout for faster failure
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for better reliability
    
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify({
        userMessage,
        history: recentHistory, // Full conversation history for context
        useLocalAI,
        ragContext: limitedRagContext,
        sessionId: sessionId,
        topicHistory: topicHistory || []
      }),
    });
    
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.error('AI API request failed:', response.status, errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.reply || data.response || '';
    
    if (!reply || reply.trim().length === 0) {
      throw new Error('Empty response from AI API');
    }
    
    return reply;
  } catch (error: any) {
    // Log error for debugging
    console.error('callAIAPI error:', error);
    
    // Return empty to trigger fallback
    if (error.name === 'AbortError' || error.message === 'Timeout') {
      return '';
    }
    return '';
  }
}

