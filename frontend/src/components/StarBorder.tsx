'use client';

import React from 'react';

type StarBorderProps<T extends React.ElementType> = React.ComponentPropsWithoutRef<T> & {
  as?: T;
  className?: string;
  children?: React.ReactNode;
  color?: string;
  speed?: React.CSSProperties['animationDuration'];
  thickness?: number;
};

export default function StarBorder<T extends React.ElementType = 'button'>({
  as,
  className = '',
  color = 'white',
  speed = '6s',
  thickness = 1,
  children,
  ...rest
}: StarBorderProps<T>) {
  const Component = as || 'button';
  
  return (
    <Component
      className={`star-border-container ${className}`}
      {...(rest as React.ComponentPropsWithoutRef<T>)}
      style={{
        ...(rest as { style?: React.CSSProperties }).style
      }}
    >
      <div
        className="border-gradient-bottom"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animationDuration: speed
        }}
      />
      <div
        className="border-gradient-top"
        style={{
          background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
          animationDuration: speed
        }}
      />
      <div className="inner-content">{children}</div>
    </Component>
  );
}

