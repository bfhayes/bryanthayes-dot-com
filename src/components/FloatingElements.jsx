import { motion } from 'framer-motion';

const shapes = [
  // Circle
  <motion.div
    key="circle-1"
    className="absolute w-20 h-20 bg-brand-100 rounded-full opacity-30"
    style={{ top: '10%', left: '5%' }}
    animate={{
      y: [0, -30, 0],
      x: [0, 10, 0],
      scale: [1, 1.1, 1],
    }}
    transition={{
      duration: 8,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />,
  // Triangle
  <motion.div
    key="triangle-1"
    className="absolute w-0 h-0 opacity-20"
    style={{
      top: '20%',
      right: '10%',
      borderLeft: '25px solid transparent',
      borderRight: '25px solid transparent',
      borderBottom: '43px solid #CB997E'
    }}
    animate={{
      y: [0, 20, 0],
      rotate: [0, 180, 360],
    }}
    transition={{
      duration: 12,
      repeat: Infinity,
      ease: "linear"
    }}
  />,
  // Square
  <motion.div
    key="square-1"
    className="absolute w-16 h-16 bg-brand-200 opacity-25 rounded-lg"
    style={{ bottom: '25%', left: '8%' }}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 45, 0],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />,
  // Small circle
  <motion.div
    key="circle-2"
    className="absolute w-12 h-12 bg-brand-300 rounded-full opacity-40"
    style={{ bottom: '15%', right: '15%' }}
    animate={{
      y: [0, -25, 0],
      x: [0, -15, 0],
    }}
    transition={{
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />,
  // Hexagon-like shape
  <motion.div
    key="hex-1"
    className="absolute w-8 h-8 bg-brand-400 opacity-30 transform rotate-45"
    style={{ top: '60%', left: '15%' }}
    animate={{
      y: [0, 15, 0],
      rotate: [45, 225, 45],
      scale: [1, 1.2, 1],
    }}
    transition={{
      duration: 14,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />,
];

export default function FloatingElements({ 
  className = '', 
  reduced = false 
}) {
  if (reduced) {
    // Show fewer elements for performance or accessibility
    return (
      <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
        {shapes.slice(0, 2)}
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {shapes}
      {/* Additional subtle background gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-brand-50/20 via-transparent to-brand-100/10"
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}