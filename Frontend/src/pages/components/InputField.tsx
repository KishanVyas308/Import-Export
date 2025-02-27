import React from 'react';

interface InputFieldProps {
  label: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  options?: string[];
  disabled?: boolean;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  options, 
  disabled = false,
  className = ""
}) => {
  return (
    <div className={`w-full min-w-[200px] my-2 ${className}`}>
      <div className="relative">
        {type === "select" ? (
          <select
            value={value}
            onChange={onChange}
            className="peer w-full bg-transparent text-slate-700 text-sm border border-slate-300 rounded-lg px-3 py-2.5 transition duration-300 ease focus:outline-none focus:border-green-500 hover:border-green-400 shadow-sm focus:shadow"
          >
            <option value="" disabled className="text-gray-800">Select an option</option>
            {options?.map((option, index) => (
              <option key={index} value={option} className="cursor-pointer">
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`peer w-full ${disabled ? 'cursor-not-allowed bg-gray-50 border-slate-200' : 'cursor-text border-slate-300'} bg-transparent placeholder:text-transparent text-slate-700 text-sm border rounded-lg px-3 py-2.5 transition duration-300 ease focus:outline-none focus:border-green-500 hover:border-green-400 shadow-sm focus:shadow`}
            placeholder=" "
          />
        )}
        <label
          className={`absolute bg-white px-1 text-slate-500 transition-all duration-300 ease-in-out transform origin-left
            ${value ? '-top-2 left-3 text-xs text-green-600' : 'top-2.5 left-3 text-sm'}
            peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-green-600 pointer-events-none`}
        >
          {label}
        </label>
      </div>
    </div>
  );
};

const SelectInputField: React.FC<InputFieldProps & { prefix?: string[] }> = ({ 
  label, 
  value, 
  onChange, 
  options = [],
  prefix = [], 
  className = ""
}) => {
  return (
    <div className={`w-full min-w-[200px] my-2 ${className}`}>
      <div className="relative">
        <div className="flex">
          <select
            className="peer min-w-[80px] h-10 bg-transparent text-slate-700 text-sm border border-slate-300 rounded-l-lg px-3 py-2 transition duration-300 ease focus:outline-none focus:border-green-500 hover:border-green-400 shadow-sm focus:shadow"
            value={prefix[0] || ""}
            onChange={(e) => {
              // Handle prefix change if needed
            }}
          >
            {prefix.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="relative w-full">
            <input
              type="text"
              value={value}
              onChange={onChange}
              className="peer w-full bg-transparent text-slate-700 text-sm border border-slate-300 border-l-0 rounded-r-lg px-3 py-2 transition duration-300 ease focus:outline-none focus:border-green-500 hover:border-green-400 shadow-sm focus:shadow"
              placeholder=" "
            />
            <label
              className={`absolute bg-white px-1 left-3 text-slate-500 transition-all duration-300 ease-in-out transform origin-left
                ${value ? '-top-2 left-3 text-xs text-green-600' : 'top-2.5 left-3 text-sm'}
                peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-green-600`}
            >
              {label}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export { SelectInputField };
export default InputField;