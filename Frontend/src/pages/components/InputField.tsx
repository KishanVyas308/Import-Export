import React from 'react';


interface InputFieldProps {

  label: string;

  type?: string;

  value: string;

  onChange: any;

  options?: any;
  readOnly? : boolean
}


const InputField: React.FC<InputFieldProps> = ({ label, type = "text", value, onChange, options, readOnly=false }) => {
  return (
    <div className="w-full min-w-[200px] text-[20px] my-2">
      <div className="relative">
        {type === "select" ? (
            <select
            value={value}
            onChange={onChange}
            className={`peer w-full bg-transparent placeholder:text-transparent text-slate-700 text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
            >
            <option value="" disabled className=' text-gray-800'>Options</option>
            {options?.map((option, index) => (
              <option key={index} value={option} className='cursor-pointer'>
              {option}
              </option>
            ))}
            </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            disabled={readOnly}
            className={`peer w-full  ${readOnly ? 'cursor-not-allowed border-slate-300' : 'cursor-pointer border-slate-400'}  bg-transparent placeholder:text-transparent text-slate-700 text-sm border  rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow`}
            placeholder=" " // Transparent placeholder to control the label animation
          />
        )}
        <label
          className={`absolute bg-white px-1 left-3 text-slate-400 text-sm transition-all duration-300 ease-in-out transform origin-left
            ${value ? '-top-2 left-3 text-xs text-slate-400' : 'top-2.5 left-3 text-sm text-slate-400'}
            peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-slate-400 pointer-events-none`}
        >
          {label}
        </label>
      </div>
    </div>
  );
  
};


const SelectInputField: React.FC<InputFieldProps> = ({ label, value, type = "text", onChange, options }) => {
  return (
    <div className="w-full min-w-[200px] text-[20px] my-2">
      <div className="relative">
        <div className="flex">
          <select
            className="peer w-20 h-10 bg-transparent placeholder:text-transparent text-slate-700 text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
            value={value}
            onChange={onChange}
          >
            {options?.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="relative w-full">
            <input
              type={type}
              value={value}
              onChange={onChange}
              className="peer w-full bg-transparent placeholder:text-transparent text-slate-700 text-sm border border-slate-400 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
              placeholder=" " // Transparent placeholder to control the label animation
            />
            <label
              className={`absolute bg-white px-1 left-3 text-slate-400 text-sm transition-all duration-300 ease-in-out transform origin-left
                ${value ? '-top-2 left-3 text-xs text-slate-400' : 'top-2.5 left-3 text-sm text-slate-400'}
                peer-focus:-top-2 peer-focus:left-3 peer-focus:text-xs peer-focus:text-slate-400`}
            >
              {label}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SelectInputField };

export default InputField;
