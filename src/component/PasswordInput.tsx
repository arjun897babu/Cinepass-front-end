import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

interface PasswordInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  inputError?: string;
  responseError?: string;
  theater?: boolean

}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder = 'Enter your password',
  inputError,
  responseError,
  theater

}) => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={`p-2 mt-1 text-white rounded-md w-full relative ${!theater ? "" : "flex justify-center items-center text-center gap-4"}`}>
      <label className={`${theater ? 'w-24 text-left' : ''}`} htmlFor={name}>{label}</label>
      <div className={`${theater?"w-full":"mt-3"} relative `}>
        <input
          className="p-2 text-black rounded-md w-full focus:outline"
          type={passwordVisible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
          onClick={togglePasswordVisibility}
        >
          {passwordVisible ? <AiOutlineEyeInvisible size={24} /> : <AiOutlineEye size={24} />}
        </button>
        {inputError && <span className={`text-red-600 capitalize absolute  font-mono text-sm left-0 -bottom-5 `}>{inputError}</span>}
      {responseError && <span className={`text-red-600 capitalize absolute  font-mono text-sm left-0 -bottom-5`}>{responseError}</span>}
      </div>
      
    </div>
  );
};


