import React, { useState, useEffect, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CollapsibleSectionProps {
  title: string;
  defaultExpanded?: boolean;
  storageKey?: string;
  children: React.ReactNode;
  className?: string;
  onToggle?: (expanded: boolean) => void;
  showHint?: boolean;
  hintText?: string;
  hintStorageKey?: string;
}

export function CollapsibleSection({
  title,
  defaultExpanded = false,
  storageKey,
  children,
  className,
  onToggle,
  showHint = false,
  hintText,
  hintStorageKey,
}: CollapsibleSectionProps) {
  const contentId = useId();
  const [expanded, setExpanded] = useState(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return defaultExpanded;
  });

  const [showHintState, setShowHintState] = useState(() => {
    if (showHint && hintStorageKey) {
      const saved = localStorage.getItem(hintStorageKey);
      return saved !== 'false';
    }
    return false;
  });

  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, String(expanded));
    }
    onToggle?.(expanded);
  }, [expanded, storageKey, onToggle]);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
    if (showHintState && hintStorageKey) {
      localStorage.setItem(hintStorageKey, 'false');
      setShowHintState(false);
    }
  };

  return (
    <div className={cn('disclosure', className)}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={expanded}
        aria-controls={contentId}
        data-state={expanded ? 'expanded' : 'collapsed'}
        className={cn(
          'disclosure-trigger flex min-h-14 w-full items-center justify-between gap-3 text-left text-sm font-medium text-foreground transition-colors focus:outline-none',
          expanded ? 'text-foreground' : 'text-secondary'
        )}
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'h-4 w-4 transition-transform duration-200 ease-out',
            expanded ? 'rotate-180' : 'rotate-0'
          )}
        />
      </button>
      {showHint && showHintState && hintText && (
        <div className="surface-inline p-2 text-xs text-secondary">
          {hintText}
        </div>
      )}
      <div
        className={cn(
          'disclosure-content',
          expanded ? 'opacity-100' : 'opacity-0'
        )}
        id={contentId}
        hidden={!expanded}
        aria-hidden={!expanded}
      >
        <div className="space-y-5">{children}</div>
      </div>
    </div>
  );
}
