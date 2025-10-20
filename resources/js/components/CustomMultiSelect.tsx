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
  maxTags = 3,
  placeholder = 'Selecciona opciones...',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
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
  const hiddenCount = selectedOptions.length - maxTags;

  return (
    <div ref={dropdownRef} className={`relative w-full ${className}`}>
      {/* Tags seleccionados */}
      {selectedOptions.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {selectedOptions.slice(0, maxTags).map(opt => (
            <span
              key={opt.value}
              className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full px-2 py-1"
            >
              {opt.label}
              <button
                type="button"
                onClick={(e) => handleRemove(e, opt.value)}
                className="hover:text-blue-600 dark:hover:text-blue-400 font-bold"
              >
                &times;
              </button>
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="inline-flex items-center bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full px-2 py-1">
              +{hiddenCount} más
            </span>
          )}
        </div>
      )}

      {/* Input dropdown */}
      <div className="relative">
        <input
          type="text"
          placeholder={placeholder}
          readOnly
          value=""
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        {/* Dropdown content */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg max-h-60 overflow-y-auto z-50">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-gray-500 dark:text-gray-400 text-sm">
                No hay opciones disponibles
              </div>
            ) : (
              options.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`px-3 py-2 cursor-pointer flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-neutral-700 ${
                    value.includes(opt.value) ? 'bg-blue-50 dark:bg-neutral-700' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={value.includes(opt.value)}
                    onChange={() => {}} // Controlado por el div onClick
                    className="pointer-events-none"
                  />
                  <span className="text-sm text-gray-900 dark:text-gray-100">{opt.label}</span>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
