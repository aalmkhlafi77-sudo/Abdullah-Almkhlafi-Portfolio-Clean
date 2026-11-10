import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

interface MotionLeftProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  immediate?: boolean;
}

export const MotionLeft: React.FC<MotionLeftProps> = ({
  children,
  delay = 0,
  duration = 0.55,
  distance = -40,
  className = '',
  immediate = false,
  ...props
}) => {
  const initial = { opacity: 0, x: distance };
  const animateState = { opacity: 1, x: 0 };
  const transition = {
    duration,
    delay,
    ease: [0.22, 1, 0.36, 1], // Smooth cubic-bezier spring-like ease out
  };

  if (immediate) {
    return (
      <motion.div
        initial={initial}
        animate={animateState}
        transition={transition}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={initial}
      whileInView={animateState}
      viewport={{ once: true, margin: '-40px' }}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MotionStaggerContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}> = ({ children, className = '', staggerDelay = 0.08 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerDelay,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const MotionStaggerItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}> = ({ children, className = '', distance = -40, duration = 0.55 }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, x: distance },
        show: { 
          opacity: 1, 
          x: 0,
          transition: {
            duration,
            ease: [0.22, 1, 0.36, 1],
          }
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

