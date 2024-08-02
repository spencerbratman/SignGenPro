import React, { useState, useRef, useEffect } from 'react';
import { CompactPicker } from 'react-color';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  showHex?: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, showHex = false }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
        onClick={() => setShowPicker(!showPicker)}
        style={{ backgroundColor: color }}
      >
        {showHex && (
          <span className="ml-2 text-sm">{color}</span>
        )}
      </button>
      {showPicker && (
        <div className="absolute z-10 mt-2">
          <CompactPicker
            color={color}
            onChange={(color) => {
              onChange(color.hex);
              setShowPicker(false);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;