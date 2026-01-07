/**
 * Intent Detection Engine
 * Detects user intent from messages
 */

export interface IntentResult {
  type: 'AskAboutShreyas' | 'ScheduleMeeting' | 'SendResume' | 'SmallTalk' | 'Unknown';
  data?: {
    date?: string;
    time?: string;
    topic?: string;
  };
  confidence: number;
}

export function detectIntent(userMessage: string): IntentResult {
  const lowerMessage = userMessage.toLowerCase().trim();
  
  // Small Talk - Check first for greetings (but only if it's clearly a greeting, not a question)
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'how are you', 'what\'s up'];
  // Only treat as small talk if it's a short greeting without question words
  const isQuestion = lowerMessage.includes('?') || 
                     lowerMessage.includes('tell me') || 
                     lowerMessage.includes('what') || 
                     lowerMessage.includes('who') || 
                     lowerMessage.includes('where') || 
                     lowerMessage.includes('when') || 
                     lowerMessage.includes('how') ||
                     lowerMessage.includes('about');
  
  if (greetings.some(g => lowerMessage.includes(g)) && lowerMessage.length < 50 && !isQuestion) {
    return {
      type: 'SmallTalk',
      confidence: 0.9
    };
  }

  // Schedule Meeting
  const scheduleKeywords = [
    'schedule', 'book', 'meeting', 'call', 'appointment', 'google meet', 
    'teams', 'zoom', 'video call', 'set up a meeting', 'arrange', 'calendar'
  ];
  const scheduleScore = scheduleKeywords.filter(kw => lowerMessage.includes(kw)).length;
  
  if (scheduleScore > 0) {
    // Extract date and time
    const dateMatch = lowerMessage.match(/(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})|(tomorrow|today|next week|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next monday|next tuesday|next wednesday|next thursday|next friday)/i);
    const timeMatch = lowerMessage.match(/(\d{1,2}:\d{2}\s*(am|pm)?)|(\d{1,2}\s*(am|pm))/i);
    
    return {
      type: 'ScheduleMeeting',
      data: {
        date: dateMatch ? dateMatch[0] : undefined,
        time: timeMatch ? timeMatch[0] : undefined
      },
      confidence: 0.85 + (scheduleScore * 0.05)
    };
  }

  // Send Resume
  const resumeKeywords = ['resume', 'cv', 'curriculum vitae', 'send me his', 'share his', 'get his resume', 'download resume'];
  const resumeScore = resumeKeywords.filter(kw => lowerMessage.includes(kw)).length;
  
  if (resumeScore > 0) {
    return {
      type: 'SendResume',
      confidence: 0.9
    };
  }

  // Ask About Shreyas - Comprehensive keyword list
  const aboutKeywords = [
    // General questions
    'who is', 'what does', 'tell me about', 'tell me', 'what is', 'who are', 'what are',
    'can you tell', 'can you share', 'i want to know', 'i would like to know', 'i need to know',
    'inform me', 'share with me', 'describe', 'explain',
    
    // Background & General
    'background', 'bio', 'biography', 'about', 'story', 'introduction', 'overview', 'summary',
    'who is shreyas', 'what is shreyas', 'who is he', 'what is he', 'what does he do',
    'what is his', 'who is his', 'what are his', 'tell me about him', 'tell me about shreyas',
    
    // Education & Academics
    'education', 'academics', 'academic', 'school', 'college', 'university', 'degree', 'degrees',
    'gpa', 'studies', 'qualification', 'qualifications', 'educated', 'graduated', 'graduation',
    'masters', 'bachelors', 'bachelor', 'master', 'phd', 'diploma', 'certificate', 'coursework',
    'courses', 'studied', 'where did he study', 'where did he go to school', 'what did he study',
    'his education', 'his academics', 'his degree', 'his degrees', 'his gpa', 'his university',
    
    // Work Experience
    'experience', 'work', 'job', 'jobs', 'company', 'companies', 'employment', 'career', 'careers',
    'worked', 'working', 'works at', 'works for', 'employed', 'employer', 'employers',
    'where does he work', 'where does he work at', 'what does he do for work', 'his work',
    'his experience', 'his job', 'his jobs', 'his career', 'his employment', 'work history',
    'employment history', 'professional experience', 'work background',
    
    // Projects
    'projects', 'project', 'built', 'developed', 'created', 'built', 'made', 'designed',
    'portfolio', 'work samples', 'showcase', 'what has he built', 'what has he created',
    'what has he developed', 'his projects', 'his work', 'his creations', 'his developments',
    
    // Skills & Technologies
    'skills', 'skill', 'expertise', 'technologies', 'technology', 'tech', 'tools', 'tool',
    'programming', 'languages', 'language', 'frameworks', 'framework', 'libraries', 'library',
    'what can he do', 'what is he good at', 'what does he know', 'what technologies',
    'his skills', 'his expertise', 'his technologies', 'his tech stack', 'what he knows',
    'proficient', 'proficiency', 'competent', 'capable',
    
    // Achievements & Certifications
    'achievements', 'achievement', 'awards', 'award', 'certifications', 'certification', 'certified',
    'recognition', 'recognitions', 'honors', 'honor', 'accomplishments', 'accomplishment',
    'what has he achieved', 'what awards', 'his achievements', 'his awards', 'his certifications',
    'his recognition', 'certificates', 'certificate',
    
    // Contact & Location
    'contact', 'email', 'phone', 'number', 'address', 'location', 'where is he', 'where does he live',
    'how to contact', 'how can i reach', 'his contact', 'his email', 'his phone', 'his location',
    'linkedin', 'github', 'social media', 'social', 'website', 'portfolio site',
    
    // Goals & Interests
    'goals', 'goal', 'aspirations', 'aspiration', 'objectives', 'objective', 'aims', 'aim',
    'interests', 'interest', 'hobbies', 'hobby', 'likes', 'like', 'passions', 'passion',
    'what are his goals', 'what are his interests', 'his goals', 'his interests', 'his hobbies',
    
    // Personality & Other
    'personality', 'character', 'traits', 'trait', 'values', 'value', 'principles', 'principle',
    'age', 'birthday', 'birth date', 'from', 'origin', 'nationality', 'where is he from',
    'years of experience', 'how long', 'how many years', 'experience level',
    
    // Pronouns (he/his/him)
    'he', 'his', 'him', 'himself'
  ];
  const aboutScore = aboutKeywords.filter(kw => lowerMessage.includes(kw)).length;
  
  if (aboutScore > 0 || lowerMessage.length > 10) {
    // Extract topic if mentioned - expanded list
    let topic: string | undefined;
    const topicKeywords = [
      { keywords: ['education', 'academics', 'academic', 'school', 'college', 'university', 'degree', 'degrees', 'gpa', 'studies', 'qualification', 'qualifications', 'educated', 'graduated', 'graduation', 'masters', 'bachelors', 'bachelor', 'master', 'coursework', 'courses', 'studied', 'where did he study', 'where did he go to school', 'what did he study'], topic: 'education' },
      { keywords: ['experience', 'work', 'job', 'jobs', 'company', 'companies', 'employment', 'career', 'careers', 'worked', 'working', 'works at', 'works for', 'employed', 'employer', 'where does he work', 'work history', 'employment history', 'professional experience'], topic: 'experience' },
      { keywords: ['projects', 'project', 'built', 'developed', 'created', 'made', 'designed', 'portfolio', 'work samples', 'showcase', 'what has he built', 'what has he created', 'what has he developed'], topic: 'projects' },
      { keywords: ['skills', 'skill', 'expertise', 'technologies', 'technology', 'tech', 'tools', 'tool', 'programming', 'languages', 'language', 'frameworks', 'framework', 'libraries', 'library', 'what can he do', 'what is he good at', 'what does he know', 'what technologies', 'tech stack', 'proficient', 'proficiency'], topic: 'skills' },
      { keywords: ['achievements', 'achievement', 'awards', 'award', 'certifications', 'certification', 'certified', 'recognition', 'recognitions', 'honors', 'honor', 'accomplishments', 'accomplishment', 'certificates', 'certificate'], topic: 'achievements' },
      { keywords: ['background', 'bio', 'biography', 'about', 'story', 'introduction', 'overview', 'summary', 'who is shreyas', 'who is he'], topic: 'background' },
      { keywords: ['goals', 'goal', 'aspirations', 'aspiration', 'objectives', 'objective', 'aims', 'aim'], topic: 'goals' },
      { keywords: ['interests', 'interest', 'hobbies', 'hobby', 'likes', 'like', 'passions', 'passion'], topic: 'interests' },
      { keywords: ['contact', 'email', 'phone', 'number', 'address', 'location', 'where is he', 'where does he live', 'how to contact', 'how can i reach', 'linkedin', 'github', 'social media', 'social', 'website'], topic: 'contact' }
    ];
    
    for (const topicGroup of topicKeywords) {
      if (topicGroup.keywords.some(keyword => lowerMessage.includes(keyword))) {
        topic = topicGroup.topic;
        break;
      }
    }

    return {
      type: 'AskAboutShreyas',
      data: { topic },
      confidence: 0.7 + (aboutScore * 0.05)
    };
  }

  // Unknown
  return {
    type: 'Unknown',
    confidence: 0.3
  };
}

