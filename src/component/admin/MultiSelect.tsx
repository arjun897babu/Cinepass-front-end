import { useState } from "react";
import { IMovie } from "../../interface/Interface";

interface MultiSelectProps {
  field: string
  defaultValues: string[];
  handleAddValue: (name: keyof IMovie, value: string) => void;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({ field, defaultValues, handleAddValue }) => {

  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const toggleDropdown = () => setIsOpen(!isOpen);


  const handleSelection = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((item) => item !== value)
      : [...selectedValues, value];

    setSelectedValues(newSelectedValues);
    handleAddValue(field as keyof IMovie, value);
  };
  
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
              <li key={value} className="flex capitalize items-center p-2 cursor-pointer hover:bg-gray-200  ">
                <input
                  type="checkbox"
                  checked={selectedValues.includes(value)}
                  onChange={() => handleSelection(value)}
                  className="mr-2"
                />
                {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
