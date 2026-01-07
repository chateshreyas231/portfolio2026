/**
 * AI Widget - Main Component
 * Floating AI Assistant Widget for Shreyas Chate's Portfolio
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Loader2, MessageSquare, MessageSquareOff } from 'lucide-react';
import { processMessage, getInitialGreeting } from './aiLogic';
import type { ProfileData, Message } from './aiLogic';
import Orb from '@/components/Orb';
import AIRobot from '@/components/AIRobot';
import './aiWidget.css';

export default function AIWidget() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [continuousListening, setContinuousListening] = useState(false); // Start with listening off, user clicks orb to start
  const [showTranscript, setShowTranscript] = useState(false); // Show/hide transcript
  const [, setIsConversationActive] = useState(false); // Track if conversation has started
  const [sessionId, setSessionId] = useState<string>(''); // Session ID for conversation tracking
  const [micPermissionError, setMicPermissionError] = useState<string | null>(null); // Track mic permission errors
  const [showPopupMessage, setShowPopupMessage] = useState(false); // Show popup message every 2 minutes
  const [topicHistory, setTopicHistory] = useState<string[]>([]); // Track topics discussed for progressive disclosure
  const conversationStartTimeRef = useRef<Date | null>(null);
  const hasSavedConversationRef = useRef(false);
  const messagesForSaveRef = useRef<Message[]>([]);
  const sessionTimeoutRef = useRef<NodeJS.Timeout | null>(null); // 10-minute session timeout
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Idle timeout refs
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const helpPromptTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const popupMessageIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const popupMessageTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set mounted state on client side only
  useEffect(() => {
    setMounted(true);
  }, []);

  // Define stopListening early so it can be used in useEffects
  const stopListening = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    
    // Stop and release media stream
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
  }, []);

  // Load profile data from Firebase API
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    // Try Firebase first, fallback to JSON
    fetch('/api/profile')
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        return res.json();
      })
      .then(data => {
        if (data && !data.error) {
          setProfileData(data);
        } else {
          // Fallback to JSON file
          fetch('/ai-widget/shreyas_profile.json')
            .then(async (res) => {
              if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
              }
              const contentType = res.headers.get('content-type');
              if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Response is not JSON');
              }
              return res.json();
            })
            .then(jsonData => setProfileData(jsonData))
            .catch(err => {
              console.error('Failed to load profile from JSON fallback:', err);
            });
        }
      })
      .catch(err => {
        console.error('Failed to load profile from Firebase:', err);
        // Fallback to JSON file
        fetch('/ai-widget/shreyas_profile.json')
          .then(async (res) => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            const contentType = res.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              throw new Error('Response is not JSON');
            }
            return res.json();
          })
          .then(data => setProfileData(data))
          .catch(err => {
            console.error('Failed to load profile from JSON fallback:', err);
          });
      });
  }, []);

  // Show greeting when panel opens (always show greeting, don't auto-start listening or speaking)
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    if (isOpen && messages.length === 0 && profileData) {
      // Generate session ID for this conversation (client-side only)
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionId(newSessionId);
      conversationStartTimeRef.current = new Date();
      hasSavedConversationRef.current = false; // Reset save flag for new conversation
      setTopicHistory([]); // Reset topic history for new session
      
      // Set 10-minute session timeout
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
      sessionTimeoutRef.current = setTimeout(() => {
        if (isOpen) {
          // Save conversation before closing
          saveConversationAndClose();
        }
      }, 10 * 60 * 1000); // 10 minutes
      
      const greeting = getInitialGreeting();
      const greetingMessage: Message = {
        role: 'assistant',
        content: greeting
      };
      setMessages([greetingMessage]);
      setIsConversationActive(true);
      
      // Auto-start listening when widget opens (after greeting is shown)
      setTimeout(() => {
        if (isOpen && !isListening && !isSpeaking && profileData) {
          setContinuousListening(true);
          // Request microphone permission and start listening
          navigator.mediaDevices.getUserMedia({ audio: true })
            .then(() => {
              // Permission granted, start listening
              setTimeout(() => {
                if (isOpen && !isListening && !isSpeaking) {
                  startListening().catch(err => {
                    // If auto-start fails, user can manually click orb
                  });
                }
              }, 500);
            })
            .catch(() => {
              // Permission denied or error - user can manually click orb
              // Don't show error, just silently fail
            });
        }
      }, 1500); // Wait 1.5 seconds after opening to start listening
      
      // Start idle timeout - if no questions after 1 minute, ask if they need help
      helpPromptTimeoutRef.current = setTimeout(() => {
        if (isOpen && messages.length === 1 && !isListening && !isSpeaking && !continuousListening) {
          const helpMessage: Message = {
            role: 'assistant',
            content: 'Is there anything I can help you with? Feel free to ask me about Mr. Shreyas Chate, or you can click the orb in the center to start a voice conversation.'
          };
          setMessages(prev => [...prev, helpMessage]);
          
          // After another minute, say goodbye and close
          idleTimeoutRef.current = setTimeout(() => {
            if (isOpen && messages.length === 2 && !isListening && !isSpeaking && !continuousListening) {
              const goodbyeMessage: Message = {
                role: 'assistant',
                content: 'Thank you for visiting! Feel free to come back anytime if you have questions about Mr. Shreyas Chate. Have a great day! 👋'
              };
              setMessages(prev => [...prev, goodbyeMessage]);
              setTimeout(() => {
                setIsOpen(false);
              }, 2000);
            }
          }, 60000); // 1 minute after help prompt
        }
      }, 60000); // 1 minute after greeting
    }
    
    return () => {
      if (helpPromptTimeoutRef.current) {
        clearTimeout(helpPromptTimeoutRef.current);
      }
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
      }
    };
  }, [isOpen, profileData, continuousListening, messages.length, isListening, isSpeaking]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Start continuous listening when user clicks orb (only if not already listening)
  // Note: This is now handled directly in handleOrbClick for better control
  // Keeping this as a backup but it should not trigger if handleOrbClick works correctly

  // Update messages ref when messages change (for saving)
  useEffect(() => {
    messagesForSaveRef.current = messages;
  }, [messages]);

  // Save conversation when chat closes
  useEffect(() => {
    if (!isOpen && sessionId && messagesForSaveRef.current.length > 0 && conversationStartTimeRef.current && !hasSavedConversationRef.current) {
      // Mark as saved to prevent duplicate saves
      hasSavedConversationRef.current = true;
      
      // Save conversation and transcript to Firebase
      const endTime = new Date();
      const messagesToSave = messagesForSaveRef.current;
      
      // Save to Firebase (non-blocking) - only on client side
      if (typeof window !== 'undefined') {
        fetch('/api/conversations/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            messages: messagesToSave.map(msg => ({
              role: msg.role,
              content: msg.content,
              timestamp: new Date().toISOString(),
            })),
            startedAt: conversationStartTimeRef.current.toISOString(),
            endedAt: endTime.toISOString(),
            userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            metadata: {
              topics: topicHistory,
            },
          }),
        })
          .then(async (res) => {
            if (!res.ok) {
              const errorText = await res.text().catch(() => 'Unknown error');
              throw new Error(`Failed to save conversation: ${errorText}`);
            }
            const contentType = res.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              return res.json();
            }
            return null;
          })
          .catch(err => console.error('Failed to save conversation:', err));
      }
    }
  }, [isOpen, sessionId, topicHistory]);

  // Stop all conversation activity when chat closes (cleanup)
  useEffect(() => {
    if (!isOpen) {
      // Stop all listening and audio playback
      stopListening();
      
      // Stop any ongoing speech
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      
      // Clear all conversation state
      setIsListening(false);
      setIsSpeaking(false);
      setIsLoading(false);
      setInputText('');
      setContinuousListening(false);
      setIsConversationActive(false);
      
      // Clear messages and session
      setMessages([]);
      setSessionId('');
      setTopicHistory([]);
      conversationStartTimeRef.current = null;
      hasSavedConversationRef.current = false;
      messagesForSaveRef.current = [];
      
      // Clear session timeout
      if (sessionTimeoutRef.current) {
        clearTimeout(sessionTimeoutRef.current);
        sessionTimeoutRef.current = null;
      }
    }
  }, [isOpen, stopListening]);

  // Reset idle timeouts when user sends a message
  useEffect(() => {
    if (messages.length > 1) {
      // Clear existing timeouts
      if (helpPromptTimeoutRef.current) {
        clearTimeout(helpPromptTimeoutRef.current);
      }
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    }
  }, [messages.length]);

  // Popup message every 2 minutes
  useEffect(() => {
    // Only show popup if chat is not open
    if (isOpen) {
      setShowPopupMessage(false);
      return;
    }

    // Set up interval to show popup every 2 minutes (120000ms)
    popupMessageIntervalRef.current = setInterval(() => {
      // Only show if chat is still closed
      if (!isOpen) {
        setShowPopupMessage(true);
        
        // Auto-hide after 5 seconds
        popupMessageTimeoutRef.current = setTimeout(() => {
          setShowPopupMessage(false);
        }, 5000);
      }
    }, 120000); // 2 minutes

    return () => {
      if (popupMessageIntervalRef.current) {
        clearInterval(popupMessageIntervalRef.current);
      }
      if (popupMessageTimeoutRef.current) {
        clearTimeout(popupMessageTimeoutRef.current);
      }
    };
  }, [isOpen]);

  // Hide popup when chat opens
  useEffect(() => {
    if (isOpen && showPopupMessage) {
      setShowPopupMessage(false);
      if (popupMessageTimeoutRef.current) {
        clearTimeout(popupMessageTimeoutRef.current);
      }
    }
  }, [isOpen, showPopupMessage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      if (popupMessageIntervalRef.current) {
        clearInterval(popupMessageIntervalRef.current);
      }
      if (popupMessageTimeoutRef.current) {
        clearTimeout(popupMessageTimeoutRef.current);
      }
    };
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '48px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputText]);

  const speakText = async (text: string) => {
    // Don't speak if chat is not open
    if (!isOpen) {
      return;
    }

    // Stop any ongoing speech
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
      setIsSpeaking(false);
    }

    try {
      setIsSpeaking(true);

      // Clean text for better speech (remove markdown, extra newlines, convert to natural speech)
      const cleanText = text
        .replace(/\*\*/g, '') // Remove bold markers
        .replace(/\*/g, '') // Remove italic markers
        .replace(/#{1,6}\s/g, '') // Remove markdown headers
        .replace(/\n{3,}/g, '. ') // Convert multiple newlines to pauses
        .replace(/\n/g, '. ') // Convert single newlines to pauses
        .replace(/\.\s+\./g, '.') // Remove double periods
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();

      // Limit text length to 4096 characters (OpenAI limit)
      const truncatedText = cleanText.substring(0, 4096);

      // Call OpenAI Speech API
      const response = await fetch('/api/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: truncatedText,
          voice: 'alloy', // You can change to: ash, ballad, coral, echo, fable, onyx, nova, sage, shimmer, verse
          speed: 1.0, // Range: 0.25 to 4.0
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Speech synthesis failed: ${errorText}`);
      }

      // Get audio as blob directly
      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);

      // Create and play audio
      const audio = new Audio(audioUrl);
      audioPlayerRef.current = audio;

      // Stop listening when AI starts speaking (only if chat is open)
      if (isOpen && isListening && mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        setIsListening(false);
      }

        audio.onended = () => {
        // Check if chat is still open before continuing
        if (!isOpen) {
          setIsSpeaking(false);
          URL.revokeObjectURL(audioUrl);
          audioPlayerRef.current = null;
          return;
        }
        
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioPlayerRef.current = null;
        
        // Auto-start listening after AI finishes speaking (if continuous mode is on and chat is open)
        if (continuousListening && isOpen && !isLoading) {
          setTimeout(() => {
            // Double-check chat is still open before restarting
            if (isOpen && !isListening && !isSpeaking && !isLoading) {
              startListening();
            }
          }, 800); // Small delay after speech ends to allow user to respond
        }
      };

      audio.onerror = (error) => {
        console.error('Audio playback error:', error);
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
        audioPlayerRef.current = null;
        
        // Auto-start listening even if audio fails (only if chat is open)
        if (continuousListening && isOpen && !isLoading) {
          setTimeout(() => {
            // Double-check chat is still open before restarting
            if (isOpen && !isListening && !isSpeaking && !isLoading) {
              startListening();
            }
          }, 800);
        }
      };

      await audio.play();
    } catch (error) {
      console.error('Speech synthesis error:', error);
      setIsSpeaking(false);
    }
  };

    const startListening = async () => {
      // Don't start if chat is not open/visible
      if (!isOpen) {
        return;
      }
    
    // Don't start if already listening, speaking, or loading
    if (isListening || isSpeaking || isLoading) {
      return;
    }

    try {
      // Clear any previous permission errors
      setMicPermissionError(null);
      
      // Check permissions first (if supported)
      if (navigator.permissions && navigator.permissions.query) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          console.log('🎤 Microphone permission status:', permissionStatus.state);
          
          // If explicitly denied, don't even try
          if (permissionStatus.state === 'denied') {
            throw new Error('NotAllowedError');
          }
          
          // If prompt, we'll try to request it (getUserMedia will show prompt)
          // If granted, we're good to go
        } catch (permError: any) {
          // Permissions API might not be supported or query failed
          // This is okay - we'll try getUserMedia anyway which will show the prompt
          console.log('Permissions API check failed or not supported, will try getUserMedia:', permError.message);
        }
      }
      
      // Request microphone access (reuse existing stream if available)
      let stream = mediaStreamRef.current;
      
      // Check if existing stream is still active
      if (stream) {
        const audioTracks = stream.getAudioTracks();
        const hasActiveTrack = audioTracks.some(track => track.readyState === 'live');
        
        if (!hasActiveTrack) {
          // Stream exists but tracks are not active, get new stream
          stream.getTracks().forEach(track => track.stop());
          stream = null;
          mediaStreamRef.current = null;
        }
      }
      
      // Get new stream if needed
      if (!stream) {
        console.log('🎤 Requesting microphone access...');
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            audio: {
              echoCancellation: true,
              noiseSuppression: true,
              autoGainControl: true
            }
          });
          console.log('✅ Microphone access granted, stream created');
          // Clear any permission errors since we successfully got access
          setMicPermissionError(null);
          // Remove any permission error messages from chat
          setMessages(prev => prev.filter(msg => !msg.content.includes('Microphone permission denied')));
          mediaStreamRef.current = stream;
        } catch (getUserMediaError: any) {
          console.error('❌ getUserMedia failed:', getUserMediaError);
          throw getUserMediaError; // Re-throw to be caught by outer catch
        }
      }
      
      // Verify stream has active audio tracks
      const audioTracks = stream.getAudioTracks();
      if (audioTracks.length === 0 || !audioTracks.some(track => track.readyState === 'live')) {
        throw new Error('No active audio tracks available');
      }
      
      console.log('✅ Audio tracks active:', audioTracks.map(t => ({ id: t.id, label: t.label, enabled: t.enabled, readyState: t.readyState })));
      
      // Initialize MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log('🛑 MediaRecorder stopped, chunks:', audioChunksRef.current.length);
        
        // Don't stop the stream - keep it for continuous listening
        // Only stop if we're closing the chat or user explicitly stops
        if (!isOpen) {
          setIsListening(false);
          audioChunksRef.current = [];
          return;
        }

        if (audioChunksRef.current.length === 0) {
          console.log('⚠️ No audio chunks recorded');
          setIsListening(false);
          // Restart listening if in continuous mode and chat is open
          if (continuousListening && isOpen && !isSpeaking && !isLoading) {
            setTimeout(() => {
              // Double-check chat is still open before restarting
              if (isOpen && !isListening && !isSpeaking && !isLoading) {
                startListening();
              }
            }, 500);
          }
          return;
        }

        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        // Send to transcription API
        try {
          const formData = new FormData();
          formData.append('file', audioBlob, 'recording.webm');

          const response = await fetch('/api/audio/transcribe', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Transcription failed');
          }

          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            throw new Error('Response is not JSON');
          }

          const data = await response.json();
          const transcript = data.text;
          
          console.log('📝 Transcript received:', transcript);

          if (transcript && transcript.trim()) {
            console.log('✅ Valid transcript, processing message...');
            // Only process if chat is still open
            if (isOpen) {
              setInputText(transcript);
              // Process the message - this will handle the response and restart listening
              handleSendMessage(transcript);
            } else {
              // If chat closed, just restart listening
              if (continuousListening && isOpen && !isSpeaking && !isLoading) {
                setTimeout(() => {
                  if (isOpen && !isListening && !isSpeaking && !isLoading) {
                    startListening();
                  }
                }, 1000);
              }
            }
          } else {
            // No speech detected, restart listening if in continuous mode and chat is open
            if (continuousListening && isOpen && !isSpeaking && !isLoading) {
              setTimeout(() => {
                // Double-check chat is still open before restarting
                if (isOpen && !isListening && !isSpeaking && !isLoading) {
                  startListening();
                }
              }, 1000);
            }
          }
        } catch (error) {
          console.error('Transcription error:', error);
          // Restart listening on error if in continuous mode and chat is open
          if (continuousListening && isOpen && !isSpeaking && !isLoading) {
            setTimeout(() => {
              // Double-check chat is still open before restarting
              if (isOpen && !isListening && !isSpeaking && !isLoading) {
                startListening();
              }
            }, 1000);
          }
        } finally {
          setIsListening(false);
          audioChunksRef.current = [];
        }
      };

      mediaRecorder.onerror = (event: any) => {
        console.error('MediaRecorder error:', event);
        setIsListening(false);
        // Restart listening on error if in continuous mode and chat is open
        if (continuousListening && isOpen && !isSpeaking && !isLoading) {
          setTimeout(() => {
            // Double-check chat is still open before restarting
            if (isOpen && !isListening && !isSpeaking && !isLoading) {
              startListening();
            }
          }, 1000);
        }
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms for better responsiveness
      setIsListening(true);
      console.log('✅ Listening started, MediaRecorder state:', mediaRecorder.state);

      // Auto-stop after 10 seconds of silence (for continuous mode, it will restart)
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          console.log('⏱️ Auto-stopping after 10 seconds');
          mediaRecorderRef.current.stop();
        }
      }, 10000);

    } catch (error: any) {
      console.error('❌ Error accessing microphone:', error);
      setIsListening(false);
      setContinuousListening(false); // Stop continuous listening on error
      
      // Stop any existing stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
      
      let errorMessage = 'Failed to access microphone. ';
      let showRetryButton = false;
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Microphone permission denied. Please:\n1. Click the lock icon (🔒) in your browser address bar\n2. Find "Microphone" and set it to "Allow"\n3. Click the orb again to retry';
        setMicPermissionError(errorMessage);
        showRetryButton = true;
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'No microphone found. Please connect a microphone and try again.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Microphone is being used by another application. Please close other apps using the microphone and try again.';
      } else {
        errorMessage += `Error: ${error.message || error.name}. Please check your browser settings and try again.`;
      }
      
      // Only show error message if it's not already shown (avoid duplicates)
      if (!micPermissionError || micPermissionError !== errorMessage) {
        const errorMsg: Message = {
          role: 'assistant',
          content: `⚠️ ${errorMessage}${showRetryButton ? '\n\nClick the orb again after granting permission.' : ''}`
        };
        setMessages(prev => {
          // Check if this error is already in messages
          const lastMessage = prev[prev.length - 1];
          if (lastMessage?.role === 'assistant' && lastMessage.content.includes('Microphone permission')) {
            return prev; // Don't add duplicate
          }
          return [...prev, errorMsg];
        });
      }
    }
  };

    const handleSendMessage = async (text?: string) => {
    // Don't process messages if chat is not open
    if (!isOpen) {
      return;
    }
    
    // Clear idle timeouts when user sends a message
    if (helpPromptTimeoutRef.current) {
      clearTimeout(helpPromptTimeoutRef.current);
    }
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }

    const messageText = text || inputText.trim();
    if (!messageText || isLoading) return;

    if (!profileData) {
      const errorMsg: Message = {
        role: 'assistant',
        content: 'Profile data is still loading. Please wait a moment and try again.'
      };
      setMessages(prev => [...prev, errorMsg]);
      return;
    }

    const userMessage: Message = {
      role: 'user',
      content: messageText
    };

    // Update messages state first
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      // Extract topics from conversation for progressive disclosure
      const topics = extractTopicsFromConversation(updatedMessages);
      setTopicHistory(topics);
      
      // Pass updated messages (including the new user message) for proper context
      const response = await processMessage(
        messageText,
        updatedMessages, // Use updated messages with the new user message
        profileData,
        false, // Set to true to use Ollama
        sessionId,
        topics
      );
      
      // Ensure we have a valid response
      if (!response || response.trim().length === 0) {
        throw new Error('Empty response from AI');
      }
      
      const assistantMessage: Message = {
        role: 'assistant',
        content: response
      };

      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak the response automatically
      // Small delay to ensure message is rendered
      setTimeout(() => {
        if (isOpen) {
          speakText(response);
        }
      }, 100);
      
      // Continuous listening will restart automatically after AI finishes speaking
      // (handled in speakText's audio.onended callback)
    } catch (error) {
      console.error('Error processing message:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Could you please try again?'
      };
      setMessages(prev => [...prev, errorMessage]);
      
      // Restart listening after error if in continuous mode and chat is open
      if (continuousListening && isOpen && !isSpeaking && !isLoading) {
        setTimeout(() => {
          // Double-check chat is still open before restarting
          if (isOpen && !isListening && !isSpeaking && !isLoading) {
            startListening();
          }
        }, 1000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Extract topics from conversation for progressive disclosure
  const extractTopicsFromConversation = (messages: Message[]): string[] => {
    const topics: string[] = [];
    const topicKeywords: { [key: string]: string[] } = {
      'education': ['education', 'degree', 'university', 'school', 'gpa', 'academic', 'masters', 'bachelors'],
      'experience': ['experience', 'work', 'job', 'company', 'role', 'position', 'career'],
      'projects': ['project', 'built', 'developed', 'created', 'application', 'system'],
      'skills': ['skill', 'technology', 'tech', 'expertise', 'proficient', 'language', 'framework'],
      'achievements': ['achievement', 'award', 'certification', 'recognition', 'winner'],
      'contact': ['contact', 'email', 'phone', 'reach', 'linkedin', 'github', 'connect'],
      'background': ['background', 'about', 'who', 'introduction', 'summary'],
    };

    messages.forEach(msg => {
      if (msg.role === 'user') {
        const lowerContent = msg.content.toLowerCase();
        Object.entries(topicKeywords).forEach(([topic, keywords]) => {
          if (keywords.some(keyword => lowerContent.includes(keyword)) && !topics.includes(topic)) {
            topics.push(topic);
          }
        });
      }
    });

    return topics;
  };

  // Save conversation and close session
  const saveConversationAndClose = async () => {
    if (!sessionId || messagesForSaveRef.current.length === 0 || !conversationStartTimeRef.current || hasSavedConversationRef.current) {
      setIsOpen(false);
      return;
    }

    hasSavedConversationRef.current = true;
    const endTime = new Date();

    try {
      await fetch('/api/conversations/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          messages: messagesForSaveRef.current.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: new Date().toISOString(),
          })),
          startedAt: conversationStartTimeRef.current.toISOString(),
          endedAt: endTime.toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
          metadata: {
            topics: topicHistory,
          },
        }),
      });
    } catch (err) {
      console.error('Failed to save conversation:', err);
    }

    // Show closing message
    const closingMessage: Message = {
      role: 'assistant',
      content: 'Our conversation session has ended. Feel free to start a new conversation anytime! 👋'
    };
    setMessages(prev => [...prev, closingMessage]);
    
    setTimeout(() => {
      setIsOpen(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle orb click - start/stop listening
  const handleOrbClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('Orb clicked!', { isOpen, continuousListening, isListening, isSpeaking });
    
    if (!isOpen) {
      console.log('Chat not open, returning');
      return;
    }
    
    if (!continuousListening && !isListening && !isSpeaking) {
      console.log('🎤 Starting listening...');
      // Clear any previous permission errors when user tries again
      setMicPermissionError(null);
      
      // Start listening and conversation
      setContinuousListening(true);
      setIsConversationActive(true);
      
      // Clear idle timeouts when user starts conversation
      if (helpPromptTimeoutRef.current) {
        clearTimeout(helpPromptTimeoutRef.current);
      }
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
      
      // Start listening immediately
      setTimeout(() => {
        if (isOpen && !isListening && !isSpeaking) {
          startListening();
        }
      }, 100);
      
      // If this is the first interaction, speak the greeting
      if (messages.length === 1) {
        const greeting = messages[0]?.content || getInitialGreeting();
        setTimeout(() => {
          if (isOpen) {
            speakText(greeting);
          }
        }, 500);
      }
    } else if (continuousListening) {
      console.log('Stopping listening...');
      // Stop listening
      setContinuousListening(false);
      stopListening();
    }
  };

  // Don't render until mounted to prevent hydration errors
  if (!mounted) {
    return null;
  }

  return (
    <div className="ai-widget-container">
      {/* Floating 3D Robot Button */}
      <motion.div
        onClick={() => setIsOpen(true)}
        className="ai-widget-spline-button"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.3 }}
        aria-label="Open AI Assistant"
        role="button"
        tabIndex={0}
        style={{
          border: 'none',
          outline: 'none',
          boxShadow: 'none',
          padding: 0,
          margin: 0,
          background: 'transparent',
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <AIRobot onClick={() => setIsOpen(true)} />
      </motion.div>

      {/* Popup Message - Appears every 2 minutes */}
      <AnimatePresence>
        {showPopupMessage && !isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="ai-widget-popup-message"
            onClick={() => {
              setShowPopupMessage(false);
              setIsOpen(true);
            }}
            onMouseEnter={() => {
              // Pause auto-hide on hover
              if (popupMessageTimeoutRef.current) {
                clearTimeout(popupMessageTimeoutRef.current);
              }
            }}
            onMouseLeave={() => {
              // Resume auto-hide after hover
              popupMessageTimeoutRef.current = setTimeout(() => {
                setShowPopupMessage(false);
              }, 3000);
            }}
          >
            <div className="ai-widget-popup-content">
              <Bot size={20} style={{ marginRight: '0.5rem', flexShrink: 0 }} />
              <div>
                <div className="ai-widget-popup-title">Talk to me! 👋</div>
                <div className="ai-widget-popup-text">
                  I&apos;m here to help! Click me if you have any questions about Shreyas.
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPopupMessage(false);
                }}
                className="ai-widget-popup-close"
                aria-label="Close popup"
              >
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - No blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="ai-widget-backdrop"
              style={{ 
                backdropFilter: 'none',
                WebkitBackdropFilter: 'none',
              }}
            />

            {/* Panel - Pop-up instead of slide */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="ai-widget-panel-popup"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Orb Background with Clickable Center */}
              <div className="ai-widget-orb-background">
                <Orb
                  hoverIntensity={0.5}
                  rotateOnHover={true}
                  hue={0}
                  forceHoverState={false}
                />
                {/* Clickable Orb Center */}
                <div 
                  className="ai-widget-orb-clickable"
                  onClick={handleOrbClick}
                  onMouseDown={(e) => e.stopPropagation()}
                  onTouchStart={(e) => e.stopPropagation()}
                  title={continuousListening ? "Click to stop listening" : "Click to start conversation"}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOrbClick(e as any);
                    }
                  }}
                >
                  <div className={`ai-widget-orb-indicator ${continuousListening ? 'listening' : 'idle'}`}>
                    {continuousListening ? (
                      <div className="ai-widget-orb-pulse" />
                    ) : (
                      <Bot size={32} style={{ color: 'white', opacity: 0.8 }} />
                    )}
                  </div>
                </div>
              </div>

              {/* Header */}
              <div className="ai-widget-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div className="ai-widget-header-info">
                    <h3>Shreyas&apos; AI Assistant</h3>
                    <p>Ask anything about Shreyas</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="ai-widget-close-btn"
                    aria-label="Close chat"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Messages - Hidden when AI is active and transcript is off */}
              <AnimatePresence>
                {showTranscript && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="ai-widget-messages"
                  >
                      {messages.map((message, index) => {
                        // Check if this is a permission error message
                        const isPermissionError = message.content.includes('Microphone permission');
                        const isLastMessage = index === messages.length - 1;
                        
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`ai-widget-message ${message.role}`}
                          >
                            <div className={`ai-widget-message-bubble ${isPermissionError ? 'ai-widget-error-message' : ''}`}>
                              {message.content.split('\n').map((line, lineIndex) => (
                                <div key={lineIndex}>
                                  {line}
                                  {lineIndex < message.content.split('\n').length - 1 && <br />}
                                </div>
                              ))}
                              {isPermissionError && isLastMessage && (
                                <button
                                  onClick={() => {
                                    setMicPermissionError(null);
                                    setContinuousListening(false);
                                    setTimeout(() => {
                                      handleOrbClick({ preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent);
                                    }, 100);
                                  }}
                                  className="ai-widget-retry-button"
                                  style={{
                                    marginTop: '12px',
                                    padding: '8px 16px',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    borderRadius: '8px',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  🔄 Retry After Granting Permission
                                </button>
                              )}
                          {message.role === 'assistant' && 
                           isSpeaking && 
                           index === messages.length - 1 && (
                            <div className="ai-widget-typing">
                              <div className="ai-widget-typing-dot" />
                              <div className="ai-widget-typing-dot" />
                              <div className="ai-widget-typing-dot" />
                            </div>
                            )}
                            </div>
                          </motion.div>
                        );
                      })}
                    {isLoading && (
                      <div className="ai-widget-message assistant">
                        <div className="ai-widget-loading">
                          <Loader2 size={16} className="ai-widget-spinner" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </motion.div>
                )}
              </AnimatePresence>


              {/* Input Area - Bottom Section */}
              <div className="ai-widget-input-area">
                {/* Transcript Toggle Button */}
                <div className="ai-widget-transcript-toggle">
                  <button
                    onClick={() => setShowTranscript(!showTranscript)}
                    className="ai-widget-transcript-btn"
                    title={showTranscript ? 'Hide transcript' : 'Show transcript'}
                    aria-label={showTranscript ? 'Hide transcript' : 'Show transcript'}
                  >
                    {showTranscript ? (
                      <>
                        <MessageSquareOff size={18} />
                        <span>Hide Transcript</span>
                      </>
                    ) : (
                      <>
                        <MessageSquare size={18} />
                        <span>Show Transcript</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Input Container */}
                <div className="ai-widget-input-container">
                  <textarea
                    ref={textareaRef}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="ai-widget-textarea"
                    rows={1}
                  />
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim() || isLoading}
                    className="ai-widget-send-btn"
                    aria-label="Send message"
                    title="Send message"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

