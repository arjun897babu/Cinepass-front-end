import React, { useEffect, useState } from "react";
import { IMovie } from "../../interface/Interface";

interface MultiSelectProps {
  field: string;
  defaultValues: string[];
  handleAddValue: (name: keyof IMovie, values: string) => void;
  selected: string[];
}

export const MultiSelect: React.FC<MultiSelectProps> = React.memo(({ field, defaultValues, handleAddValue, selected }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelection = (  value: string) => {
    
    setSelectedValues((prev) => {
      const isSelected = prev.includes(value);
      if (isSelected) {
        return prev.filter((item) => item !== value);
      } else {
        return [...prev, value];
      }
    });
    handleAddValue(field as keyof IMovie, value);
  };

  useEffect(() => { 
      setSelectedValues(selected); 
  }, []);
  return (
    <div className="relative">
      <div className="flex items-center">
        <input
          type="text"
          readOnly
          value={selectedValues.join(', ') || 'Choose options'}
          onClick={toggleDropdown}
          className="input input-bordered flex-1 cursor-pointer"
        />
      </div>

      {isOpen && (
        <div className="absolute bg-white border rounded shadow-lg mt-2 w-full max-h-60 overflow-auto z-50">
          <ul className="p-2">
            {defaultValues.map((value) => (
              <li key={value} className="flex capitalize items-center p-2 cursor-pointer hover:bg-gray-200">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  className="mr-2"
                  onChange={( ) => handleSelection(  value)}
                />
                {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});
