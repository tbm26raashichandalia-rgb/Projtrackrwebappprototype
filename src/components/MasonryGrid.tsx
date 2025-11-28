import { ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode;
  columns?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: number;
}

export function MasonryGrid({ 
  children, 
  columns = { mobile: 1, tablet: 3, desktop: 5 },
  gap = 20
}: MasonryGridProps) {
  return (
    <div 
      className="masonry-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns.mobile}, 1fr)`,
        gap: `${gap}px`,
        width: '100%',
      }}
    >
      <style jsx>{`
        @media (min-width: 640px) {
          .masonry-grid {
            grid-template-columns: repeat(${columns.tablet}, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .masonry-grid {
            grid-template-columns: repeat(${columns.desktop}, 1fr);
          }
        }
      `}</style>
      {children}
    </div>
  );
}

interface MasonryItemProps {
  children: ReactNode;
  className?: string;
}

export function MasonryItem({ children, className = '' }: MasonryItemProps) {
  return (
    <div className={`break-inside-avoid ${className}`}>
      {children}
    </div>
  );
}
