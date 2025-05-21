import React, { useState, useRef, useEffect } from 'react';

interface DynamicDropdownProps {
  selectedPath: string[];
  setSelectedPath: (path: string[]) => void;
  schema: any;
}

const ArrowIcon = ({ open }: { open: boolean }) => (
  <svg
    className={`w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 transition-transform duration-200 ${
      open ? 'rotate-180' : ''
    }`}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const CustomDropdown = ({
  value,
  options,
  onChange,
  placeholder = 'Select...',
}: {
  value: string;
  options: string[];
  onChange: (v: string) => void;
  placeholder?: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div
      ref={ref}
      className="relative animate-fade-in mb-2 transition-all duration-300">
      <button
        type="button"
        className={`mt-2 block w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg shadow-md bg-white text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-blue-400 hover:shadow-lg appearance-none flex items-center justify-between ${
          open ? 'ring-2 ring-blue-400' : ''
        }`}
        onClick={() => setOpen((o) => !o)}
        tabIndex={0}>
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>{value || placeholder}</span>
        <ArrowIcon open={open} />
      </button>
      {open && (
        <ul className="absolute z-10 left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-auto transition-all animate-fade-in">
          {options.length === 0 && <li className="px-4 py-2 text-gray-400 select-none">No options</li>}
          {options.map((opt) => (
            <li
              key={opt}
              className={`px-4 py-2 cursor-pointer transition-colors rounded-md ${
                opt === value ? 'bg-blue-100 text-blue-700 font-semibold' : 'hover:bg-blue-50'
              } `}
              onClick={() => {
                onChange(opt);
                setOpen(false);
              }}>
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const DynamicDropdown = ({ selectedPath, setSelectedPath, schema }: DynamicDropdownProps) => {
  const handleDropdownChange = (value: string, level: number) => {
    const newPath = selectedPath.slice(0, level);
    newPath[level] = value;
    setSelectedPath(newPath);
  };

  const renderDropdowns = () => {
    let data: any = schema;
    const dropdowns = [];

    dropdowns.push(
      <CustomDropdown
        key="initial"
        value={selectedPath[0] || ''}
        options={Object.keys(data)}
        onChange={(v) => handleDropdownChange(v, 0)}
      />,
    );

    selectedPath.forEach((currentValue, index) => {
      data = data[currentValue] || {};
      const options = Object.keys(data);
      if (options.length > 0) {
        dropdowns.push(
          <CustomDropdown
            key={index + 1}
            value={selectedPath[index + 1] || ''}
            options={options}
            onChange={(v) => handleDropdownChange(v, index + 1)}
          />,
        );
      }
    });
    return dropdowns;
  };

  return (
    <div className="mt-4 w-full">
      <label className="block text-lg font-bold text-blue-700 mb-2 tracking-wide drop-shadow w-full">Sections</label>
      <div className="space-y-1 w-full">{renderDropdowns()}</div>
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </div>
  );
};

export default DynamicDropdown;
