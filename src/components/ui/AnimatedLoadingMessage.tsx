// components/AnimatedLoadingMessage.tsx
import { useState, useEffect, useRef } from 'react';

const ORDERED_MESSAGES = [
  "Analyzing your content",
  "Evaluating brand alignment",
  "Checking tone and voice",
  "Assessing messaging clarity",
  "Measuring audience fit"
];

const RANDOM_MESSAGES = [
  "Calibrating brand metrics",
  "Processing language patterns",
  "Running this by a friend",
  "Assuring ducks are in a row",
  "Dotting some i's",
  "Crossing a few t's",
  "Sprinkling marketing pixie dust",
  "Divining marketing wisdom",
  "Decoding content DNA",
  "Consulting the magic conch shell",
  "Channeling brand energy",
];

const DOTS_ANIMATION_INTERVAL = 400; // 0.4 seconds per dot

// Utility function to shuffle an array (Fisher-Yates Shuffle)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const AnimatedLoadingMessage = () => {
  const [currentMessage, setCurrentMessage] = useState(ORDERED_MESSAGES[0]);
  const [dots, setDots] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isOrdered, setIsOrdered] = useState(true);
  
  // For random messages
  const [shuffledRandomMessages, setShuffledRandomMessages] = useState<string[]>([]);
  const [randomIndex, setRandomIndex] = useState(0);
  
  // Ref to store timeout IDs for cleanup
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dotsIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize shuffled random messages
  useEffect(() => {
    setShuffledRandomMessages(shuffleArray(RANDOM_MESSAGES));
  }, []);

  // Handle dots animation
  useEffect(() => {
    dotsIntervalRef.current = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return '';
        return prev + '.';
      });
    }, DOTS_ANIMATION_INTERVAL);

    return () => {
      if (dotsIntervalRef.current) clearInterval(dotsIntervalRef.current);
    };
  }, []);

  // Handle message cycling
  useEffect(() => {
    // Determine the duration for the current message
    const MESSAGE_DURATION = 2500 + Math.random() * 1000; // 2.5 to 3.5 seconds

    timeoutRef.current = setTimeout(() => {
      if (isOrdered) {
        // During ordered phase
        if (messageIndex < ORDERED_MESSAGES.length - 1) {
          setMessageIndex(prev => prev + 1);
          setCurrentMessage(ORDERED_MESSAGES[messageIndex + 1]);
        } else {
          // Switch to random phase
          setIsOrdered(false);
          setShuffledRandomMessages(shuffleArray(RANDOM_MESSAGES));
          setRandomIndex(0);
          setCurrentMessage(shuffledRandomMessages[0]);
        }
      } else {
        // During random phase
        if (randomIndex < shuffledRandomMessages.length - 1) {
          setRandomIndex(prev => prev + 1);
          setCurrentMessage(shuffledRandomMessages[randomIndex + 1]);
        } else {
          // Reshuffle and start over
          const newShuffled = shuffleArray(RANDOM_MESSAGES);
          setShuffledRandomMessages(newShuffled);
          setRandomIndex(0);
          setCurrentMessage(newShuffled[0]);
        }
      }
    }, 2500 + Math.random() * 1000); // 2.5 to 3.5 seconds

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [messageIndex, isOrdered, randomIndex, shuffledRandomMessages]);

  return (
    <span className="inline-flex min-w-[240px]">
      {currentMessage}{dots}
    </span>
  );
};