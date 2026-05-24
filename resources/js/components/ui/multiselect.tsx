import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, X } from 'lucide-react';

type Option = { id: number; name: string };

type MultiSelectProps = {
  label: string;
  options: Option[];
  values: number[];
  onChange: (values: number[]) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
  maxTagsVisible?: number;
};

export default function MultiSelect({
  label,
  options,
  values,
  onChange,
  error,
  placeholder = 'Seleccione una o más opciones',
  disabled = false,
  maxTagsVisible = 2,
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOptions = useMemo(() => {
    const set = new Set(values);
    return options.filter((o) => set.has(o.id));
  }, [options, values]);

  const visibleTags = useMemo(() => selectedOptions.slice(0, Math.max(0, maxTagsVisible)), [selectedOptions, maxTagsVisible]);
  const hiddenCount = Math.max(0, selectedOptions.length - visibleTags.length);

  const toggleValue = (id: number) => {
    if (disabled) return;
    if (values.includes(id)) {
      onChange(values.filter((v) => v !== id));
    } else {
      onChange([...values, id]);
    }
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) onChange([]);
  };

  return (
    <div className="flex flex-col gap-1 w-full" ref={wrapperRef}>
      {label ? <label className="text-slate-700 text-sm font-medium">{label}</label> : null}
      <div
        role="button"
        tabIndex={0}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            e.preventDefault();
            setOpen((v) => !v);
          }
          if (e.key === 'Escape') setOpen(false);
        }}
        className={`relative w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-2 flex-wrap pr-8 w-full">
          {selectedOptions.length === 0 ? (
            <span className="text-slate-500">{placeholder}</span>
          ) : (
            <>
              {visibleTags.map((opt) => (
                <span
                  key={opt.id}
                  className="bg-slate-100 text-slate-900 rounded-full px-2 py-0.5 text-xs flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {opt.name}
                  <button
                    type="button"
                    aria-label={`Quitar ${opt.name}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValue(opt.id);
                    }}
                    className="hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </span>
              ))}
              {hiddenCount > 0 && (
                <span className="bg-slate-50 text-slate-700 rounded-full px-2 py-0.5 text-xs">
                  +{hiddenCount} más
                </span>
              )}
            </>
          )}
          <button
            type="button"
            onClick={clearAll}
            disabled={disabled}
            className={`ml-auto text-slate-600 text-xs underline hover:text-slate-900 ${
              disabled ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Limpiar
          </button>
        </div>
        <ChevronDown
          className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 transition-transform duration-200 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        />

        {open && (
          <div
            role="listbox"
            aria-multiselectable
            className="absolute left-0 right-0 mt-2 max-h-60 overflow-auto rounded-md bg-white border border-slate-200 shadow-md z-20"
          >
            <ul className="py-1">
              {options.length === 0 && (
                <li className="px-3 py-2 text-slate-500 text-sm">Sin opciones</li>
              )}
              {options.map((opt) => {
                const checked = values.includes(opt.id);
                return (
                  <li
                    key={opt.id}
                    className={`px-3 py-2 text-sm text-slate-900 hover:bg-slate-50 flex items-center gap-3 ${
                      checked ? 'bg-slate-50' : ''
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleValue(opt.id);
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleValue(opt.id)}
                      className="accent-violet-600"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{opt.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
      {error && <span className="text-red-500 text-sm">{error}</span>}
    </div>
  );
}
