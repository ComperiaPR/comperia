import React, { useEffect, useRef, useState } from 'react';

export interface Option {
  label: string;
  value: string | number;
}

interface CustomMultiSelectProps {
  options: Option[];
  value: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  maxTags?: number;
  placeholder?: string;
  className?: string;
}

export const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({
  options,
  value,
  onChange,
  maxTags = 2,
  placeholder = 'Selecciona opciones...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionValue: string | number) => {
    if (value.includes(optionValue)) {
      onChange(value.filter(v => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
  };

  const handleRemove = (e: React.MouseEvent, optionValue: string | number) => {
    e.stopPropagation();
    onChange(value.filter(v => v !== optionValue));
  };

  const selectedOptions = options.filter(opt => value.includes(opt.value));
  const hiddenCount = Math.max(0, selectedOptions.length - maxTags);

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="relative min-h-[38px] w-full px-2 py-1.5 pr-8 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-neutral-800 cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-colors"
      >
        {selectedOptions.length > 0 ? (
          <div className="flex items-center gap-1 pr-1 overflow-hidden">
            {selectedOptions.slice(0, maxTags).map(opt => (
              <span
                key={opt.value}
                className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-medium rounded px-2 py-0.5 whitespace-nowrap flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="truncate max-w-[100px]">{opt.label}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemove(e, opt.value)}
                  className="ml-0.5 hover:text-blue-600 dark:hover:text-blue-400 font-bold leading-none flex-shrink-0"
                  aria-label={`Remover ${opt.label}`}
                >
                  ×
                </button>
              </span>
            ))}
            {hiddenCount > 0 && (
              <span className="text-xs text-gray-600 dark:text-gray-400 font-medium px-1 whitespace-nowrap flex-shrink-0">
                +{hiddenCount} más
              </span>
            )}
          </div>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400 block leading-6 truncate pr-1">
            {placeholder}
          </span>
        )}
        
        <div className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center pointer-events-none">
          <svg
            className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
        
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {options.length === 0 ? (
            <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
              No hay opciones disponibles
            </div>
          ) : (
            options.map(opt => {
              const isSelected = value.includes(opt.value);
              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`px-3 py-2 cursor-pointer flex items-center gap-2 text-sm transition-colors ${
                    isSelected 
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100' 
                      : 'text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-neutral-700'
                  }`}
                >
                  <div className={`w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected 
                      ? 'bg-blue-600 border-blue-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className="truncate">{opt.label}</span>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};