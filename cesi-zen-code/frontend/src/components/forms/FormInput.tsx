import React from 'react';

interface FormInputProps {
  label: string;
  type?: string;
  id: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  helpText?: string;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  type = 'text',
  id,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  placeholder,
  className = '',
  helpText
}) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder={placeholder}
        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      />
      {helpText && (
        <p className="text-xs text-foreground/70">{helpText}</p>
      )}
    </div>
  );
};

export default FormInput; 