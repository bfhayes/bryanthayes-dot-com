import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

export default function ScrollAnimation({ 
  children, 
  animation = 'fade-in-up',
  delay = 0,
  threshold = 0.1,
  triggerOnce = true,
  className = ''
}) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const { ref, inView } = useInView({
    threshold,
    triggerOnce: false, // Always monitor for changes
  });

  useEffect(() => {
    if (inView && !hasAnimated) {
      setTimeout(() => {
        setHasAnimated(true);
      }, delay * 1000);
    } else if (!inView && !triggerOnce) {
      setHasAnimated(false);
    }
  }, [inView, delay, triggerOnce, hasAnimated]);

  const animationClass = hasAnimated ? `animate-${animation}` : 'opacity-0';
  
  return (
    <div 
      ref={ref} 
      className={`${animationClass} ${className}`}
      style={{ animationFillMode: 'both' }}
    >
      {children}
    </div>
  );
}