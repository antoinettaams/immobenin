"use client";
import React from 'react';
import { motion } from 'framer-motion';
import type { MotionProps } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

type MotionButtonProps = Omit<ButtonProps, keyof MotionProps> & MotionProps;

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  className = '', 
  fullWidth = false,
  isLoading = false,
  loadingText = 'Chargement...',
  disabled,
  type = 'button',
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-full font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-brand text-white hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30 focus:ring-brand active:scale-[0.98]",
    secondary: "bg-gray-900 text-white hover:bg-gray-800 hover:shadow-lg focus:ring-gray-900 active:scale-[0.98]",
    outline: "border-2 border-gray-200 text-gray-900 hover:border-brand hover:text-brand bg-transparent focus:ring-gray-200 active:scale-[0.98]",
    ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200 active:scale-[0.98]"
  } as const;

  const sizes = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-6 py-3 text-base min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[52px]"
  } as const;

  const widthClass = fullWidth ? "w-full" : "";
  const isDisabled = disabled || isLoading;

  // Extraire les props de motion pour éviter les conflits
  const motionProps: MotionProps = {
    whileHover: !isDisabled ? { scale: 1.02 } : undefined,
    whileTap: !isDisabled ? { scale: 0.98 } : undefined,
    initial: { opacity: 1 },
    animate: { opacity: isLoading ? 0.8 : 1 }
  };

  // Filtrer les props qui ne devraient pas être passés au motion.button
  const { 
    onAnimationStart, 
    onAnimationEnd, 
    onDragStart, 
    onDragEnd, 
    onDrag, 
    ...buttonProps 
  } = props as MotionButtonProps;

  return ( 
    <motion.button
      {...motionProps}
      type={type}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      aria-busy={isLoading}
      {...buttonProps}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="sr-only">{loadingText}</span>
          <span aria-hidden="true">{loadingText}</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};